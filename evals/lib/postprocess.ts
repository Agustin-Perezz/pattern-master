import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { dataset } from "./dataset";
import type { DatasetCase } from "./dataset.schema";
import type {
  AggregateMetrics,
  AmbiguousCase,
  CaseRuns,
  ProblemAggregate,
  ScoreRange,
} from "./metrics";
import {
  aggregateByProblem,
  findAmbiguousCases,
  summarizeCaseRuns,
} from "./metrics";

export const DEFAULT_INPUT_PATH = "evals/results/latest.json";

const CASE_ID_VAR = "caseId";
const CHALLENGE_SLUG_VAR = "challengeSlug";
const EXPECTED_MIN_VAR = "expectedMin";
const EXPECTED_MAX_VAR = "expectedMax";
const SCHEMA_VALID_METRIC = "schema_valid";

const UNKNOWN_PREFIX = "unknown";
const UNKNOWN_CASE_ID = `${UNKNOWN_PREFIX}-case`;
const UNKNOWN_PROBLEM = UNKNOWN_PREFIX;
const UNKNOWN_CHALLENGE = UNKNOWN_PREFIX;

const DEFAULT_SCORE_RANGE: ScoreRange = [0, 100];

export type PromptfooRow = {
  prompt?: string | { raw?: string; label?: string };
  latencyMs?: number;
  cost?: number;
  testIdx?: number;
  vars?: Record<string, unknown>;
  response?: { output?: unknown; cost?: number };
  namedScores?: Record<string, number>;
  gradingResult?: {
    componentResults?: { pass?: boolean; assertion?: { metric?: string } }[];
  } | null;
  error?: string;
};

export type PromptfooOutput = {
  results?: { results?: PromptfooRow[] };
};

export type VersionReport = {
  version: string;
  overall: AggregateMetrics;
  byProblem: ProblemAggregate[];
  ambiguousCases: AmbiguousCase[];
  caseRuns: CaseRuns[];
};

export type PromptfooReport = {
  promptVersions: string[];
  versions: VersionReport[];
};

function readString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function readFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function resolvePromptVersion(row: PromptfooRow): string {
  const prompt = row.prompt;

  if (typeof prompt === "string") {
    return prompt;
  }

  return prompt?.label ?? prompt?.raw ?? UNKNOWN_PREFIX;
}

function parseScore(output: unknown): number | null {
  if (typeof output !== "string" || output.trim().length === 0) {
    return null;
  }

  try {
    const parsed = JSON.parse(output) as { score?: unknown };
    return readFiniteNumber(parsed.score);
  } catch {
    return null;
  }
}

function schemaAssertionPassed(row: PromptfooRow): boolean {
  const named = row.namedScores?.[SCHEMA_VALID_METRIC];

  if (typeof named === "number") {
    return named > 0;
  }

  return (row.gradingResult?.componentResults ?? []).some(
    (component) =>
      component.assertion?.metric === SCHEMA_VALID_METRIC &&
      component.pass === true,
  );
}

function resolveCostUsd(row: PromptfooRow): number {
  return (
    readFiniteNumber(row.cost) ?? readFiniteNumber(row.response?.cost) ?? 0
  );
}

function toCaseRuns(
  caseId: string,
  rows: readonly PromptfooRow[],
  datasetCase: DatasetCase | undefined,
): CaseRuns {
  const vars = rows[0]?.vars ?? {};
  const expectedMin = readFiniteNumber(vars[EXPECTED_MIN_VAR]);
  const expectedMax = readFiniteNumber(vars[EXPECTED_MAX_VAR]);
  const expectedScoreRange: ScoreRange =
    datasetCase?.expectedScoreRange ??
    (expectedMin !== null && expectedMax !== null
      ? [expectedMin, expectedMax]
      : DEFAULT_SCORE_RANGE);

  return {
    caseId,
    problem: datasetCase?.problem ?? UNKNOWN_PROBLEM,
    challengeSlug:
      datasetCase?.challengeSlug ??
      readString(vars[CHALLENGE_SLUG_VAR]) ??
      UNKNOWN_CHALLENGE,
    expectedScoreRange,
    scores: rows.map((row) => parseScore(row.response?.output)),
    schemaValidity: rows.map(schemaAssertionPassed),
    latenciesMs: rows.map((row) => readFiniteNumber(row.latencyMs) ?? 0),
    costsUsd: rows.map(resolveCostUsd),
  };
}

export function buildPromptfooReport(output: PromptfooOutput): PromptfooReport {
  const rows = output.results?.results ?? [];
  const datasetById = new Map(
    dataset.map((entry) => [entry.id, entry] as const),
  );

  const byVersion = new Map<string, Map<string, PromptfooRow[]>>();

  for (const row of rows) {
    const version = resolvePromptVersion(row);
    const caseId = readString(row.vars?.[CASE_ID_VAR]) ?? UNKNOWN_CASE_ID;

    let cases = byVersion.get(version);
    if (!cases) {
      cases = new Map<string, PromptfooRow[]>();
      byVersion.set(version, cases);
    }

    const caseRows = cases.get(caseId);
    if (caseRows) {
      caseRows.push(row);
    } else {
      cases.set(caseId, [row]);
    }
  }

  const versions: VersionReport[] = [...byVersion.entries()].map(
    ([version, cases]) => {
      const caseRuns = [...cases.entries()].map(([caseId, caseRows]) =>
        toCaseRuns(caseId, caseRows, datasetById.get(caseId)),
      );

      return {
        version,
        overall: summarizeCaseRuns(caseRuns),
        byProblem: aggregateByProblem(caseRuns),
        ambiguousCases: findAmbiguousCases(caseRuns),
        caseRuns,
      };
    },
  );

  return { promptVersions: [...byVersion.keys()], versions };
}

export const TABLE_HEADERS = [
  "Prompt",
  "Accuracy (in range)",
  "MAE (points)",
  "Avg std dev (points)",
  "Schema valid",
  "p95 latency (ms)",
  "Cost per eval (USD)",
] as const;

export const PROBLEM_TABLE_HEADERS = [
  "Problem",
  "Cases",
  ...TABLE_HEADERS.slice(1),
] as const;

const PERCENT = 100;
const PERCENT_DECIMALS = 1;
const POINTS_DECIMALS = 1;
const LATENCY_DECIMALS = 0;
const COST_DECIMALS = 6;
const COLUMN_SEPARATOR = " | ";
const HEADER_SEPARATOR = "-+-";
const HEADER_FILLER = "-";
const LINE_SEPARATOR = "\n";
const NONE_LABEL = "none";
const INDENT = "  ";
const SPREAD_HEADING = "Spread > 10 points (spread over repeats)";

function formatNumber(value: number, decimals: number): string {
  return value.toFixed(decimals);
}

function formatPercent(value: number): string {
  return `${formatNumber(value * PERCENT, PERCENT_DECIMALS)}%`;
}

function metricsCells(metrics: AggregateMetrics): string[] {
  return [
    formatPercent(metrics.accuracy),
    formatNumber(metrics.mae, POINTS_DECIMALS),
    formatNumber(metrics.averageStdDev, POINTS_DECIMALS),
    formatPercent(metrics.schemaValidRate),
    formatNumber(metrics.p95LatencyMs, LATENCY_DECIMALS),
    formatNumber(metrics.avgCostUsd, COST_DECIMALS),
  ];
}

function renderTable(
  headers: readonly string[],
  rows: readonly (readonly string[])[],
): string {
  const widths = headers.map((header, columnIndex) =>
    Math.max(header.length, ...rows.map((row) => row[columnIndex].length)),
  );

  const renderRow = (cells: readonly string[]): string =>
    cells
      .map((cell, columnIndex) => cell.padEnd(widths[columnIndex]))
      .join(COLUMN_SEPARATOR)
      .trimEnd();

  const separatorLine = widths
    .map((width) => HEADER_FILLER.repeat(width))
    .join(HEADER_SEPARATOR);

  return [renderRow(headers), separatorLine, ...rows.map(renderRow)].join(
    LINE_SEPARATOR,
  );
}

function renderSpreadCases(version: VersionReport): string[] {
  const lines = [`${INDENT}${version.version}:`];

  if (version.ambiguousCases.length === 0) {
    lines.push(`${INDENT}${INDENT}${NONE_LABEL}`);
    return lines;
  }

  for (const ambiguousCase of version.ambiguousCases) {
    lines.push(
      `${INDENT}${INDENT}${ambiguousCase.caseId} (${ambiguousCase.problem}) spread ${formatNumber(
        ambiguousCase.spread,
        POINTS_DECIMALS,
      )}`,
    );
  }

  return lines;
}

export function renderPromptfooReport(report: PromptfooReport): string {
  const sections: string[] = ["Prompt evaluation report (promptfoo)", ""];

  sections.push(
    renderTable(
      TABLE_HEADERS,
      report.versions.map((version) => [
        version.version,
        ...metricsCells(version.overall),
      ]),
    ),
  );

  for (const version of report.versions) {
    sections.push("", `Per-problem breakdown — ${version.version}`);
    sections.push(
      renderTable(
        PROBLEM_TABLE_HEADERS,
        version.byProblem.map((aggregate) => [
          aggregate.problem,
          String(aggregate.metrics.caseCount),
          ...metricsCells(aggregate.metrics),
        ]),
      ),
    );
  }

  sections.push("", SPREAD_HEADING);
  for (const version of report.versions) {
    sections.push(...renderSpreadCases(version));
  }

  return sections.join(LINE_SEPARATOR);
}

function readInputPath(argv: readonly string[]): string {
  const arg = argv[2];
  return arg !== undefined && arg.length > 0 ? arg : DEFAULT_INPUT_PATH;
}

function run(): void {
  const inputPath = readInputPath(process.argv);
  const raw = readFileSync(inputPath, "utf8");
  const output = JSON.parse(raw) as PromptfooOutput;
  console.log(renderPromptfooReport(buildPromptfooReport(output)));
}

function isCliEntry(): boolean {
  const entry = process.argv[1];
  return entry !== undefined && import.meta.url === pathToFileURL(entry).href;
}

if (isCliEntry()) {
  run();
}
