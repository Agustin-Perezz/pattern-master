import { describe, expect, it } from "vitest";
import type { PromptfooOutput, PromptfooRow } from "./postprocess";
import { buildPromptfooReport, renderPromptfooReport } from "./postprocess";

const PASSING_METRICS = { in_range: 1, schema_valid: 1 };

const ERROR_ROW: Partial<PromptfooRow> = {
  response: { output: null },
  gradingResult: null,
  namedScores: {},
  error: "No output",
};

type CaseVars = {
  caseId: string;
  challengeSlug: string;
  expectedMin: number;
  expectedMax: number;
};

const PAYMENT_CLEAN: CaseVars = {
  caseId: "payment-clean",
  challengeSlug: "refactor-the-payment-processor",
  expectedMin: 85,
  expectedMax: 100,
};

const NOTIFICATION_CLEAN: CaseVars = {
  caseId: "notification-clean",
  challengeSlug: "tame-the-notification-service",
  expectedMin: 85,
  expectedMax: 100,
};

function evaluation(score: number): string {
  return JSON.stringify({
    score,
    patternApplied: true,
    praise: "Good use of the pattern.",
    criticalFeedback: null,
    criticalFeedbackExample: null,
    cleanArchitectureViolations: [],
  });
}

// Synthetic promptfoo-shaped row: repeated runs of one case share `vars` and
// carry an incrementing `testIdx`, exactly as promptfoo emits them.
function makeRow(
  vars: CaseVars,
  testIdx: number,
  overrides: Partial<PromptfooRow> = {},
): PromptfooRow {
  return {
    prompt: { raw: "v1", label: "v1" },
    latencyMs: 1000 + testIdx,
    cost: 0.0001,
    testIdx,
    vars: { ...vars },
    response: { output: evaluation(90), cost: 0.0001 },
    namedScores: { ...PASSING_METRICS },
    gradingResult: { componentResults: [] },
    ...overrides,
  };
}

function outputOf(rows: PromptfooRow[]): PromptfooOutput {
  return { results: { results: rows } };
}

describe("buildPromptfooReport", () => {
  it("groups multiple cases and repeats per prompt version", () => {
    const report = buildPromptfooReport(
      outputOf([
        makeRow(PAYMENT_CLEAN, 0),
        makeRow(PAYMENT_CLEAN, 1, { response: { output: evaluation(92) } }),
        makeRow(NOTIFICATION_CLEAN, 2, {
          response: { output: evaluation(88) },
        }),
        makeRow(PAYMENT_CLEAN, 3, { prompt: { raw: "v2", label: "v2" } }),
      ]),
    );

    expect(report.promptVersions).toEqual(["v1", "v2"]);
    expect(report.versions).toHaveLength(2);

    const v1 = report.versions[0];
    const clean = v1.caseRuns.find(
      (run) => run.caseId === PAYMENT_CLEAN.caseId,
    );

    expect(v1.caseRuns).toHaveLength(2);
    expect(clean?.scores).toEqual([90, 92]);
    expect(clean?.problem).toBe("payment");
    expect(v1.overall.caseCount).toBe(2);
    expect(v1.overall.accuracy).toBe(1);
    expect(v1.overall.schemaValidRate).toBe(1);
  });

  it("counts error rows as schema-invalid and out of range", () => {
    const report = buildPromptfooReport(
      outputOf([
        makeRow(PAYMENT_CLEAN, 0),
        makeRow(PAYMENT_CLEAN, 1, ERROR_ROW),
        makeRow(NOTIFICATION_CLEAN, 2, ERROR_ROW),
        makeRow(NOTIFICATION_CLEAN, 3, ERROR_ROW),
      ]),
    );

    const v1 = report.versions[0];
    const payment = v1.caseRuns.find(
      (run) => run.caseId === PAYMENT_CLEAN.caseId,
    );
    const notification = v1.caseRuns.find(
      (run) => run.caseId === NOTIFICATION_CLEAN.caseId,
    );

    expect(payment?.scores).toEqual([90, null]);
    expect(payment?.schemaValidity).toEqual([true, false]);
    expect(notification?.scores).toEqual([null, null]);
    expect(notification?.schemaValidity).toEqual([false, false]);
    // notification-clean has no schema-valid run, so it counts as out of range.
    expect(v1.overall.accuracy).toBeCloseTo(0.5, 10);
    expect(v1.overall.schemaValidRate).toBeCloseTo(0.25, 10);
  });

  it("uses the schema_valid assertion metric emitted by promptfoo", () => {
    const report = buildPromptfooReport(
      outputOf([
        makeRow(PAYMENT_CLEAN, 0, {
          namedScores: { in_range: 0, schema_valid: 0 },
        }),
      ]),
    );

    expect(report.versions[0].caseRuns[0].schemaValidity).toEqual([false]);
  });

  it("falls back to gradingResult componentResults without namedScores", () => {
    const report = buildPromptfooReport(
      outputOf([
        makeRow(PAYMENT_CLEAN, 0, {
          namedScores: undefined,
          gradingResult: {
            componentResults: [
              { assertion: { metric: "schema_valid" }, pass: true },
            ],
          },
        }),
      ]),
    );

    expect(report.versions[0].caseRuns[0].schemaValidity).toEqual([true]);
  });

  it("falls back to vars for problem and range when the case is unknown", () => {
    const report = buildPromptfooReport(
      outputOf([
        makeRow(
          {
            caseId: "mystery-case",
            challengeSlug: "some-challenge",
            expectedMin: 40,
            expectedMax: 60,
          },
          0,
        ),
      ]),
    );

    const caseRuns = report.versions[0].caseRuns[0];
    expect(caseRuns.problem).toBe("unknown");
    expect(caseRuns.challengeSlug).toBe("some-challenge");
    expect(caseRuns.expectedScoreRange).toEqual([40, 60]);
  });

  it("reads a plain-string prompt reference", () => {
    const report = buildPromptfooReport(
      outputOf([makeRow(PAYMENT_CLEAN, 0, { prompt: "v1" })]),
    );

    expect(report.promptVersions).toEqual(["v1"]);
  });

  it("returns an empty report for a missing results block", () => {
    expect(buildPromptfooReport({}).versions).toEqual([]);
  });
});

describe("renderPromptfooReport", () => {
  it("prints the comparison table, per-problem breakdown and spread cases", () => {
    const report = buildPromptfooReport(
      outputOf([
        makeRow(PAYMENT_CLEAN, 0, { response: { output: evaluation(90) } }),
        makeRow(PAYMENT_CLEAN, 1, { response: { output: evaluation(95) } }),
        makeRow(PAYMENT_CLEAN, 2, {
          prompt: { raw: "v2", label: "v2" },
          response: { output: evaluation(10) },
        }),
      ]),
    );

    const rendered = renderPromptfooReport(report);
    expect(rendered).toContain("Accuracy (in range)");
    expect(rendered).toContain("Cost per eval (USD)");
    expect(rendered).toContain("Per-problem breakdown — v1");
    expect(rendered).toContain("Spread > 10 points");
  });
});
