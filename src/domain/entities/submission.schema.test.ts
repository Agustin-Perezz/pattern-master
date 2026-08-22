import { describe, expect, it } from "vitest";
import {
  SUBMISSION_SCORE_MAX,
  SUBMISSION_SCORE_MIN,
} from "./submission.entity";
import { feedbackSchema, submissionSchema } from "./submission.schema";

const validData = {
  id: "00000000-0000-4000-8000-000000000001",
  userId: "00000000-0000-4000-8000-000000000002",
  challengeSlug: "refactor-the-payment-processor",
  submittedCode: "class Checkout {}",
  score: 80,
  patternApplied: true,
  feedback: {
    praise: "Good structure",
    criticalFeedback: "Tight coupling",
    criticalFeedbackExample: null,
    cleanArchitectureViolations: ["domain imports infra"],
  },
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("submissionSchema", () => {
  it("validates valid submission data", () => {
    const result = submissionSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it("rejects invalid uuid for userId", () => {
    const result = submissionSchema.safeParse({
      ...validData,
      userId: "not-a-uuid",
    });

    expect(result.success).toBe(false);
  });

  it("rejects empty challengeSlug", () => {
    const result = submissionSchema.safeParse({
      ...validData,
      challengeSlug: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects empty submittedCode", () => {
    const result = submissionSchema.safeParse({
      ...validData,
      submittedCode: "",
    });

    expect(result.success).toBe(false);
  });

  it(`rejects score below ${SUBMISSION_SCORE_MIN}`, () => {
    const result = submissionSchema.safeParse({
      ...validData,
      score: SUBMISSION_SCORE_MIN - 1,
    });

    expect(result.success).toBe(false);
  });

  it(`rejects score above ${SUBMISSION_SCORE_MAX}`, () => {
    const result = submissionSchema.safeParse({
      ...validData,
      score: SUBMISSION_SCORE_MAX + 1,
    });

    expect(result.success).toBe(false);
  });

  it("rejects non-integer score", () => {
    const result = submissionSchema.safeParse({ ...validData, score: 80.5 });

    expect(result.success).toBe(false);
  });

  it("rejects missing patternApplied", () => {
    const { patternApplied: _patternApplied, ...without } = validData;
    const result = submissionSchema.safeParse(without);

    expect(result.success).toBe(false);
  });
});

describe("feedbackSchema", () => {
  it("validates valid feedback", () => {
    const result = feedbackSchema.safeParse(validData.feedback);

    expect(result.success).toBe(true);
  });

  it("accepts null praise and criticalFeedback", () => {
    const result = feedbackSchema.safeParse({
      praise: null,
      criticalFeedback: null,
      criticalFeedbackExample: null,
      cleanArchitectureViolations: [],
    });

    expect(result.success).toBe(true);
  });

  it("rejects missing cleanArchitectureViolations", () => {
    const result = feedbackSchema.safeParse({
      praise: "Good",
      criticalFeedback: null,
      criticalFeedbackExample: null,
    });

    expect(result.success).toBe(false);
  });
});
