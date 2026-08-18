import { describe, expect, it, vi } from "vitest";
import { Challenge } from "@/domain/entities/challenge.entity";
import { Difficulty } from "@/domain/entities/difficulty.enum";
import { ChallengeNotFoundError } from "@/domain/entities/errors";
import type { GetChallengeBySlugRepository } from "./get-challenge-by-slug.repository.interface";
import { GetChallengeBySlugUseCase } from "./get-challenge-by-slug.use-case";

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

describe("GetChallengeBySlugUseCase", () => {
  it("returns the challenge found by the repository", async () => {
    const challenge = makeChallenge();
    const repository: GetChallengeBySlugRepository = {
      findBySlug: vi.fn().mockResolvedValue(challenge),
    };
    const useCase = new GetChallengeBySlugUseCase(repository);

    const result = await useCase.execute({ slug: "singleton-pattern" });

    expect(repository.findBySlug).toHaveBeenCalledWith("singleton-pattern");
    expect(result).toEqual({ challenge });
  });

  it("throws ChallengeNotFoundError when the slug does not exist", async () => {
    const repository: GetChallengeBySlugRepository = {
      findBySlug: vi.fn().mockResolvedValue(null),
    };
    const useCase = new GetChallengeBySlugUseCase(repository);

    await expect(
      useCase.execute({ slug: "missing-pattern" }),
    ).rejects.toBeInstanceOf(ChallengeNotFoundError);
    expect(repository.findBySlug).toHaveBeenCalledWith("missing-pattern");
  });

  it("throws when the slug is empty", async () => {
    const repository: GetChallengeBySlugRepository = {
      findBySlug: vi.fn(),
    };
    const useCase = new GetChallengeBySlugUseCase(repository);

    await expect(useCase.execute({ slug: "" })).rejects.toThrow();
    expect(repository.findBySlug).not.toHaveBeenCalled();
  });
});
