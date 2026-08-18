import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import { GetChallengeBySlugUseCase } from "@/application/use-cases/challenges/get-challenge-by-slug/get-challenge-by-slug.use-case";
import { ChallengeNotFoundError } from "@/domain/entities/errors";
import type { Database } from "@/infrastructure/database/postgres/database.types";
import type { ChallengeRow } from "../../entities/challenge.entity";
import { challengeMapper } from "../../mappers/challenge.mapper";
import { SupabaseGetChallengeBySlugRepository } from "./supabase-get-challenge-by-slug.repository";

const challengeRow: ChallengeRow = {
  slug: "singleton-pattern",
  title: "Singleton Pattern",
  category: "Creational",
  difficulty: "Easy",
  summary: "Ensure a class has only one instance.",
  challenge: "Implement a Singleton that lazy-loads its unique instance.",
  description: "Create a thread-safe Singleton with a private constructor.",
  description_code: "export class Singleton {}",
  starter_file: "index.ts",
  starter_code: "export class Singleton {}",
  editor_file: "index.ts",
  editor_code: "export class Singleton {}",
  created_at: "2026-01-01T00:00:00.000Z",
};

function createMockSupabase(
  row: ChallengeRow | null,
  error: Error | null = null,
) {
  const single = vi.fn().mockResolvedValue({ data: row, error });
  const eq = vi.fn().mockReturnValue({ single });
  const select = vi.fn().mockReturnValue({ eq });

  return {
    from: vi.fn().mockReturnValue({
      select,
    }),
  } as unknown as SupabaseClient<Database>;
}

describe("SupabaseGetChallengeBySlugRepository with use case", () => {
  it("returns the challenge mapped to a domain entity", async () => {
    const supabase = createMockSupabase(challengeRow);
    const repository = new SupabaseGetChallengeBySlugRepository(supabase);
    const useCase = new GetChallengeBySlugUseCase(repository);

    const result = await useCase.execute({ slug: "singleton-pattern" });

    expect(supabase.from).toHaveBeenCalledWith("challenges");
    expect(result.challenge.toObject()).toEqual(
      challengeMapper.toDomain(challengeRow).toObject(),
    );
  });

  it("throws ChallengeNotFoundError when the slug does not exist", async () => {
    const supabase = createMockSupabase(null, {
      message: "JSON object requested, multiple (or no) rows returned",
      code: "PGRST116",
      details: "",
      hint: "",
    } as unknown as Error);
    const repository = new SupabaseGetChallengeBySlugRepository(supabase);
    const useCase = new GetChallengeBySlugUseCase(repository);

    await expect(
      useCase.execute({ slug: "missing-pattern" }),
    ).rejects.toBeInstanceOf(ChallengeNotFoundError);
  });

  it("passes the exact slug to the Supabase query", async () => {
    const supabase = createMockSupabase(challengeRow);
    const repository = new SupabaseGetChallengeBySlugRepository(supabase);

    await repository.findBySlug("strategy-pattern");

    const selectBuilder = supabase.from("challenges").select as ReturnType<
      typeof vi.fn
    >;
    const eqBuilder = selectBuilder.mock.results[0].value.eq as ReturnType<
      typeof vi.fn
    >;
    expect(eqBuilder).toHaveBeenCalledWith("slug", "strategy-pattern");
  });
});
