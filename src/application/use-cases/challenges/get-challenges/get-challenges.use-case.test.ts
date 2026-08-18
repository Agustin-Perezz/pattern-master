import { describe, expect, it, vi } from "vitest";
import { Challenge } from "@/domain/entities/challenge.entity";
import { Difficulty } from "@/domain/entities/difficulty.enum";
import type { GetChallengesRepository } from "./get-challenges.repository.interface";
import { GetChallengesUseCase } from "./get-challenges.use-case";

function makeChallenge(overrides: Partial<Challenge> = {}): Challenge {
  return Challenge.create({
    slug: overrides.slug ?? "singleton-pattern",
    title: overrides.title ?? "Singleton Pattern",
    category: overrides.category ?? "Creational",
    difficulty: overrides.difficulty ?? Difficulty.Easy,
    summary: overrides.summary ?? "Ensure a class has only one instance.",
    challenge:
      overrides.challenge ??
      "Implement a Singleton that lazy-loads its unique instance.",
    description:
      overrides.description ??
      "Create a thread-safe Singleton with a private constructor.",
    starterFile: overrides.starterFile ?? "index.ts",
    starterCode: overrides.starterCode ?? "export class Singleton {}",
    editorFile: overrides.editorFile ?? "index.ts",
    editorCode: overrides.editorCode ?? "export class Singleton {}",
  });
}

describe("GetChallengesUseCase", () => {
  it("returns the challenges provided by the repository", async () => {
    const challenges = [
      makeChallenge(),
      makeChallenge({ slug: "factory-pattern", title: "Factory Pattern" }),
    ];
    const repository: GetChallengesRepository = {
      findAll: vi.fn().mockResolvedValue(challenges),
    };
    const useCase = new GetChallengesUseCase(repository);

    const result = await useCase.execute();

    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ challenges });
  });

  it("returns an empty list when the repository has no challenges", async () => {
    const repository: GetChallengesRepository = {
      findAll: vi.fn().mockResolvedValue([]),
    };
    const useCase = new GetChallengesUseCase(repository);

    const result = await useCase.execute();

    expect(result).toEqual({ challenges: [] });
  });

  it("accepts a valid limit and still returns all repository challenges", async () => {
    const challenges = [
      makeChallenge(),
      makeChallenge({ slug: "factory-pattern" }),
      makeChallenge({ slug: "observer-pattern" }),
    ];
    const repository: GetChallengesRepository = {
      findAll: vi.fn().mockResolvedValue(challenges),
    };
    const useCase = new GetChallengesUseCase(repository);

    const result = await useCase.execute({ limit: 2 });

    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ challenges });
  });

  it("throws when the limit is not a positive integer", async () => {
    const repository: GetChallengesRepository = {
      findAll: vi.fn(),
    };
    const useCase = new GetChallengesUseCase(repository);

    await expect(useCase.execute({ limit: 0 })).rejects.toThrow();
    expect(repository.findAll).not.toHaveBeenCalled();
  });
});
