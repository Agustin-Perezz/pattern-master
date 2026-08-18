import { describe, expect, it } from "vitest";
import { Difficulty } from "@/domain/entities/difficulty.enum";
import type { ChallengeRow } from "../entities/challenge.entity";
import { challengeMapper } from "./challenge.mapper";

const row: ChallengeRow = {
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

describe("challengeMapper", () => {
  it("maps a persistence row to a domain Challenge", () => {
    const challenge = challengeMapper.toDomain(row);

    expect(challenge.slug).toBe(row.slug);
    expect(challenge.title).toBe(row.title);
    expect(challenge.category).toBe(row.category);
    expect(challenge.difficulty).toBe(Difficulty.Easy);
    expect(challenge.summary).toBe(row.summary);
    expect(challenge.challenge).toBe(row.challenge);
    expect(challenge.description).toBe(row.description);
    expect(challenge.descriptionCode).toBe(row.description_code);
    expect(challenge.starterFile).toBe(row.starter_file);
    expect(challenge.starterCode).toBe(row.starter_code);
    expect(challenge.editorFile).toBe(row.editor_file);
    expect(challenge.editorCode).toBe(row.editor_code);
  });

  it("maps a domain Challenge back to a persistence insert", () => {
    const challenge = challengeMapper.toDomain(row);

    expect(challengeMapper.toPersistence(challenge)).toEqual({
      slug: row.slug,
      title: row.title,
      category: row.category,
      difficulty: Difficulty.Easy,
      summary: row.summary,
      challenge: row.challenge,
      description: row.description,
      description_code: row.description_code,
      starter_file: row.starter_file,
      starter_code: row.starter_code,
      editor_file: row.editor_file,
      editor_code: row.editor_code,
    });
  });

  it("round-trips a Challenge through persistence without loss", () => {
    const challenge = challengeMapper.toDomain(row);
    const inserted = challengeMapper.toPersistence(challenge);

    const restored = challengeMapper.toDomain({
      slug: inserted.slug,
      title: inserted.title,
      category: inserted.category,
      difficulty: inserted.difficulty,
      summary: inserted.summary,
      challenge: inserted.challenge,
      description: inserted.description,
      description_code: inserted.description_code ?? null,
      starter_file: inserted.starter_file,
      starter_code: inserted.starter_code,
      editor_file: inserted.editor_file,
      editor_code: inserted.editor_code,
      created_at: row.created_at,
    });

    expect(restored.toObject()).toEqual(challenge.toObject());
  });

  it("maps each difficulty enum value without using any coercion", () => {
    const medium = challengeMapper.toDomain({ ...row, difficulty: "Medium" });
    const hard = challengeMapper.toDomain({ ...row, difficulty: "Hard" });

    expect(medium.difficulty).toBe(Difficulty.Medium);
    expect(hard.difficulty).toBe(Difficulty.Hard);
  });
});
