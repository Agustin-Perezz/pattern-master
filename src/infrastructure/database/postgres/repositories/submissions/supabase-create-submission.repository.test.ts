import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import { CreateSubmissionUseCase } from "@/application/use-cases/create-submission/create-submission.use-case";
import type { Database } from "@/infrastructure/database/postgres/database.types";
import type { SubmissionRow } from "../../entities/submission.entity";
import { submissionMapper } from "../../mappers/submission.mapper";
import { SupabaseCreateSubmissionRepository } from "./supabase-create-submission.repository";

const submissionRow: SubmissionRow = {
  id: "11111111-1111-1111-1111-111111111111",
  user_id: "a2222222-2222-2222-8222-222222222222",
  challenge_slug: "singleton-pattern",
  submitted_code: "export class Singleton {}",
  score: 85,
  pattern_applied: true,
  feedback_json: {
    praise: "Good structure",
    criticalFeedback: "Add a private constructor",
    cleanArchitectureViolations: [],
  },
  created_at: "2026-01-01T00:00:00.000Z",
};

function createMockSupabase(
  row: SubmissionRow | null,
  error: Error | null = null,
) {
  const single = vi.fn().mockResolvedValue({
    data: row,
    error: row ? null : error,
  });

  return {
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single,
        }),
      }),
    }),
  } as unknown as SupabaseClient<Database>;
}

describe("SupabaseCreateSubmissionRepository with use case", () => {
  it("creates a submission and returns the mapped domain entity", async () => {
    const supabase = createMockSupabase(submissionRow);
    const repository = new SupabaseCreateSubmissionRepository(supabase);
    const useCase = new CreateSubmissionUseCase(repository);

    const result = await useCase.execute({
      userId: submissionRow.user_id,
      challengeSlug: submissionRow.challenge_slug,
      submittedCode: submissionRow.submitted_code,
      score: submissionRow.score,
      patternApplied: submissionRow.pattern_applied,
      feedback: {
        praise: "Good structure",
        criticalFeedback: "Add a private constructor",
        cleanArchitectureViolations: [],
      },
    });

    expect(supabase.from).toHaveBeenCalledWith("submissions");
    const fromValue = (supabase.from as unknown as ReturnType<typeof vi.fn>)
      .mock.results[0].value;
    expect(fromValue.insert).toHaveBeenCalledTimes(1);
    const insertedPayload = fromValue.insert.mock.calls[0][0];
    expect(insertedPayload).toMatchObject({
      user_id: submissionRow.user_id,
      challenge_slug: submissionRow.challenge_slug,
      submitted_code: submissionRow.submitted_code,
      score: submissionRow.score,
      pattern_applied: submissionRow.pattern_applied,
      feedback_json: submissionRow.feedback_json,
    });
    expect(typeof insertedPayload.id).toBe("string");
    expect(result.submission.id).toBe(submissionRow.id);
    expect(result.submission.score).toBe(85);
    expect(result.submission.patternApplied).toBe(true);
    expect(result.submission.toObject()).toEqual(
      submissionMapper.toDomain(submissionRow).toObject(),
    );
  });

  it("throws when Supabase returns an error", async () => {
    const supabase = createMockSupabase(
      null,
      new Error("Constraint violation"),
    );
    const repository = new SupabaseCreateSubmissionRepository(supabase);

    await expect(
      repository.create(submissionMapper.toDomain(submissionRow)),
    ).rejects.toThrow("Failed to create submission: Constraint violation");
  });
});
