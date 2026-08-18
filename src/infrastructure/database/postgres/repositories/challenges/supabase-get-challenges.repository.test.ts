import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import { GetChallengesUseCase } from "@/application/use-cases/challenges/get-challenges/get-challenges.use-case";
import { Challenge } from "@/domain/entities/challenge.entity";
import { Difficulty } from "@/domain/entities/difficulty.enum";
import type { Database } from "@/infrastructure/database/postgres/database.types";
import type { ChallengeRow } from "../../entities/challenge.entity";
import { challengeMapper } from "../../mappers/challenge.mapper";
import { SupabaseGetChallengesRepository } from "./supabase-get-challenges.repository";

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

function createMockSupabase(rows: ChallengeRow[], error: Error | null = null) {
  const order = vi.fn().mockReturnThis();
  const select = vi.fn().mockReturnValue({
    order,
    limit: vi.fn().mockReturnThis(),
  });

  if (error) {
    select.mockReturnValue({
      order,
      limit: vi.fn().mockReturnThis(),
    });
    order.mockResolvedValue({ data: null, error });
  } else {
    order.mockResolvedValue({ data: rows, error: null });
  }

  return {
    from: vi.fn().mockReturnValue({
      select,
    }),
  } as unknown as SupabaseClient<Database>;
}

describe("SupabaseGetChallengesRepository with use case", () => {
  it("returns all challenges mapped to domain entities", async () => {
    const supabase = createMockSupabase([challengeRow]);
    const repository = new SupabaseGetChallengesRepository(supabase);
    const useCase = new GetChallengesUseCase(repository);

    const result = await useCase.execute();

    expect(supabase.from).toHaveBeenCalledWith("challenges");
    expect(result.challenges).toHaveLength(1);
    expect(result.challenges[0]).toBeInstanceOf(Challenge);
    expect(result.challenges[0].slug).toBe("singleton-pattern");
    expect(result.challenges[0].difficulty).toBe(Difficulty.Easy);
    expect(result.challenges[0].toObject()).toEqual(
      challengeMapper.toDomain(challengeRow).toObject(),
    );
  });

  it("returns an empty list when no challenges are stored", async () => {
    const supabase = createMockSupabase([]);
    const repository = new SupabaseGetChallengesRepository(supabase);
    const useCase = new GetChallengesUseCase(repository);

    const result = await useCase.execute();

    expect(result.challenges).toEqual([]);
  });

  it("throws when Supabase returns an error", async () => {
    const supabase = createMockSupabase([], new Error("Connection lost"));
    const repository = new SupabaseGetChallengesRepository(supabase);

    await expect(repository.findAll()).rejects.toThrow(
      "Failed to fetch challenges: Connection lost",
    );
  });
});
