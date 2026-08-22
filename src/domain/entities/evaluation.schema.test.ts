import { describe, expect, it } from "vitest";
import { evaluationSchema } from "./evaluation.schema";
import {
  SUBMISSION_SCORE_MAX,
  SUBMISSION_SCORE_MIN,
} from "./submission.entity";

const validData = {
  score: 80,
  patternApplied: true,
  praise: "Good structure",
  criticalFeedback: "Tight coupling",
  criticalFeedbackExample: "class PaymentContext { ... }",
  cleanArchitectureViolations: ["domain imports infra"],
};

describe("evaluationSchema", () => {
  it("validates valid evaluation data", () => {
    const result = evaluationSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it("rejects missing cleanArchitectureViolations", () => {
    const { cleanArchitectureViolations: _violations, ...without } = validData;
    const result = evaluationSchema.safeParse(without);

    expect(result.success).toBe(false);
  });

  it("accepts null praise, criticalFeedback, and criticalFeedbackExample", () => {
    const result = evaluationSchema.safeParse({
      ...validData,
      praise: null,
      criticalFeedback: null,
      criticalFeedbackExample: null,
    });

    expect(result.success).toBe(true);
  });

  it(`rejects score below ${SUBMISSION_SCORE_MIN}`, () => {
    const result = evaluationSchema.safeParse({
      ...validData,
      score: SUBMISSION_SCORE_MIN - 1,
    });

    expect(result.success).toBe(false);
  });

  it(`rejects score above ${SUBMISSION_SCORE_MAX}`, () => {
    const result = evaluationSchema.safeParse({
      ...validData,
      score: SUBMISSION_SCORE_MAX + 1,
    });

    expect(result.success).toBe(false);
  });

  it("rejects non-integer score", () => {
    const result = evaluationSchema.safeParse({ ...validData, score: 80.5 });

    expect(result.success).toBe(false);
  });

  it("rejects missing patternApplied", () => {
    const { patternApplied: _patternApplied, ...without } = validData;
    const result = evaluationSchema.safeParse(without);

    expect(result.success).toBe(false);
  });

  it("rejects missing praise", () => {
    const { praise: _praise, ...without } = validData;
    const result = evaluationSchema.safeParse(without);

    expect(result.success).toBe(false);
  });

  it("rejects non-array cleanArchitectureViolations", () => {
    const result = evaluationSchema.safeParse({
      ...validData,
      cleanArchitectureViolations: "domain imports infra",
    });

    expect(result.success).toBe(false);
  });
});
