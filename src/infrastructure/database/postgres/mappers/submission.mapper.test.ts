import { describe, expect, it } from "vitest";
import { Submission } from "@/domain/entities/submission.entity";
import type { SubmissionRow } from "../entities/submission.entity";
import { submissionMapper } from "./submission.mapper";

const row: SubmissionRow = {
  id: "11111111-1111-1111-1111-111111111111",
  user_id: "a2222222-2222-2222-8222-222222222222",
  challenge_slug: "singleton-pattern",
  submitted_code: "export class Singleton {}",
  score: 85,
  pattern_applied: true,
  feedback_json: {
    praise: "Good structure",
    criticalFeedback: "Add a private constructor",
    criticalFeedbackExample: null,
    cleanArchitectureViolations: [],
  },
  created_at: "2026-01-01T00:00:00.000Z",
};

describe("submissionMapper", () => {
  it("maps a persistence row to a domain Submission", () => {
    const submission = submissionMapper.toDomain(row);

    expect(submission.id).toBe(row.id);
    expect(submission.userId).toBe(row.user_id);
    expect(submission.challengeSlug).toBe(row.challenge_slug);
    expect(submission.submittedCode).toBe(row.submitted_code);
    expect(submission.score).toBe(row.score);
    expect(submission.patternApplied).toBe(row.pattern_applied);
    expect(submission.feedback).toEqual(row.feedback_json);
    expect(submission.createdAt).toBe(row.created_at);
  });

  it("maps a domain Submission back to a persistence insert", () => {
    const submission = submissionMapper.toDomain(row);

    expect(submissionMapper.toPersistence(submission)).toEqual({
      id: row.id,
      user_id: row.user_id,
      challenge_slug: row.challenge_slug,
      submitted_code: row.submitted_code,
      score: row.score,
      pattern_applied: row.pattern_applied,
      feedback_json: row.feedback_json,
    });
  });

  it("round-trips a Submission through persistence without loss", () => {
    const submission = submissionMapper.toDomain(row);
    const inserted = submissionMapper.toPersistence(submission);

    const restored = submissionMapper.toDomain({
      id: inserted.id ?? row.id,
      user_id: inserted.user_id,
      challenge_slug: inserted.challenge_slug,
      submitted_code: inserted.submitted_code,
      score: inserted.score,
      pattern_applied: inserted.pattern_applied,
      feedback_json: inserted.feedback_json,
      created_at: row.created_at,
    });

    expect(restored.toObject()).toEqual(submission.toObject());
  });

  it("maps a patternApplied false row without coercion", () => {
    const failed = submissionMapper.toDomain({
      ...row,
      pattern_applied: false,
    });

    expect(failed.patternApplied).toBe(false);
    expect(failed).toBeInstanceOf(Submission);
  });
});
