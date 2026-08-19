import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import type { Database } from "@/infrastructure/database/postgres/database.types";
import { createSubmissionContainer } from "./submission.container";

const submissionRow = {
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

const mockSupabase = {
  from: vi.fn().mockReturnValue({
    insert: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: submissionRow, error: null }),
      }),
    }),
  }),
} as unknown as SupabaseClient<Database>;

describe("submission.container", () => {
  it("wires the create use case", () => {
    const container = createSubmissionContainer(mockSupabase);

    expect(container.create).toBeDefined();
  });

  it("executes the create use case end-to-end", async () => {
    const createSupabase = {
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: submissionRow,
              error: null,
            }),
          }),
        }),
      }),
    } as unknown as SupabaseClient<Database>;

    const container = createSubmissionContainer(createSupabase);

    const result = await container.create.execute({
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

    expect(createSupabase.from).toHaveBeenCalledWith("submissions");
    expect(result.submission.id).toBe(submissionRow.id);
    expect(result.submission.score).toBe(85);
  });
});
