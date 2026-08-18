import { describe, expect, it } from "vitest";
import { InvalidSubmissionError } from "./errors";
import {
  SUBMISSION_SCORE_MAX,
  SUBMISSION_SCORE_MIN,
  Submission,
} from "./submission.entity";

const validInput = {
  id: "00000000-0000-4000-8000-000000000001",
  userId: "00000000-0000-4000-8000-000000000002",
  challengeSlug: "refactor-the-payment-processor",
  submittedCode: "class Checkout {}",
  score: 80,
  patternApplied: true,
  feedback: {
    praise: "Good structure",
    criticalFeedback: "Tight coupling",
    cleanArchitectureViolations: ["domain imports infra"],
  },
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("Submission", () => {
  it("creates a Submission from valid props", () => {
    const submission = Submission.create(validInput);

    expect(submission.id).toBe(validInput.id);
    expect(submission.userId).toBe(validInput.userId);
    expect(submission.challengeSlug).toBe(validInput.challengeSlug);
    expect(submission.submittedCode).toBe(validInput.submittedCode);
    expect(submission.score).toBe(validInput.score);
    expect(submission.patternApplied).toBe(validInput.patternApplied);
    expect(submission.feedback).toEqual(validInput.feedback);
    expect(submission.createdAt).toBe(validInput.createdAt);
  });

  it("generates an id and createdAt when omitted", () => {
    const { id: _id, createdAt: _createdAt, ...withoutGenerated } = validInput;
    const submission = Submission.create(withoutGenerated);

    expect(submission.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
    expect(submission.createdAt).not.toBe("");
  });

  it(`throws InvalidSubmissionError when score below ${SUBMISSION_SCORE_MIN}`, () => {
    expect(() =>
      Submission.create({ ...validInput, score: SUBMISSION_SCORE_MIN - 1 }),
    ).toThrow(InvalidSubmissionError);
  });

  it(`throws InvalidSubmissionError when score above ${SUBMISSION_SCORE_MAX}`, () => {
    expect(() =>
      Submission.create({ ...validInput, score: SUBMISSION_SCORE_MAX + 1 }),
    ).toThrow(InvalidSubmissionError);
  });

  it("accepts score at the minimum boundary", () => {
    const submission = Submission.create({
      ...validInput,
      score: SUBMISSION_SCORE_MIN,
    });
    expect(submission.score).toBe(SUBMISSION_SCORE_MIN);
  });

  it("accepts score at the maximum boundary", () => {
    const submission = Submission.create({
      ...validInput,
      score: SUBMISSION_SCORE_MAX,
    });
    expect(submission.score).toBe(SUBMISSION_SCORE_MAX);
  });

  it("throws InvalidSubmissionError when submittedCode is empty", () => {
    expect(() =>
      Submission.create({ ...validInput, submittedCode: "" }),
    ).toThrow(InvalidSubmissionError);
  });

  it("returns a copy of props via toObject", () => {
    const submission = Submission.create(validInput);
    const object = submission.toObject();

    expect(object).toMatchObject(validInput);
    expect(submission.toObject()).not.toBe(object);
  });
});
