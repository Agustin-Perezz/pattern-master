import { evaluationSchema } from "@/domain/entities/evaluation.schema";
import { inRange } from "./metrics";

export const RANGE_METRIC = "in_range";
export const SCHEMA_METRIC = "schema_valid";

export const EXPECTED_MIN_VAR = "expectedMin";
export const EXPECTED_MAX_VAR = "expectedMax";

export const PASS_SCORE = 1;
export const FAIL_SCORE = 0;

export type AssertionResult = {
  pass: boolean;
  score: number;
  reason: string;
};

export type AssertionContext = {
  vars?: Record<string, unknown>;
};

function parseJson(output: unknown): unknown | null {
  if (typeof output !== "string" || output.trim().length === 0) {
    return null;
  }

  try {
    return JSON.parse(output);
  } catch {
    return null;
  }
}

function readFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readScore(value: unknown): number | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  return readFiniteNumber((value as { score?: unknown }).score);
}

export function rangeAssertion(
  output: unknown,
  context: AssertionContext,
): AssertionResult {
  const score = readScore(parseJson(output));
  const min = readFiniteNumber(context.vars?.[EXPECTED_MIN_VAR]);
  const max = readFiniteNumber(context.vars?.[EXPECTED_MAX_VAR]);

  if (score === null) {
    return {
      pass: false,
      score: FAIL_SCORE,
      reason: "Output does not contain a numeric score",
    };
  }

  if (min === null || max === null) {
    return {
      pass: false,
      score: FAIL_SCORE,
      reason: "Expected score range is missing from the test vars",
    };
  }

  const pass = inRange(score, [min, max]);

  return {
    pass,
    score: pass ? PASS_SCORE : FAIL_SCORE,
    reason: `Score ${score} is ${pass ? "within" : "outside"} [${min}, ${max}]`,
  };
}

export function schemaAssertion(
  output: unknown,
  _context: AssertionContext,
): AssertionResult {
  const parsed = parseJson(output);

  if (parsed === null) {
    return {
      pass: false,
      score: FAIL_SCORE,
      reason: "Output is not valid JSON",
    };
  }

  const result = evaluationSchema.safeParse(parsed);

  if (result.success) {
    return {
      pass: true,
      score: PASS_SCORE,
      reason: "Output matches the evaluation schema",
    };
  }

  const reason = result.error.issues
    .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
    .join("; ");

  return { pass: false, score: FAIL_SCORE, reason };
}
