import { describe, expect, it } from "vitest";
import {
  CHALLENGE_DESCRIPTION_MAX_LENGTH,
  CHALLENGE_SLUG_MAX_LENGTH,
  CHALLENGE_TITLE_MAX_LENGTH,
  Challenge,
} from "./challenge.entity";
import { Difficulty } from "./difficulty.enum";
import { InvalidChallengeError } from "./errors";

const validInput = {
  slug: "refactor-the-payment-processor",
  title: "Refactor the Payment Processor",
  category: "Behavioral",
  difficulty: Difficulty.Medium,
  summary: "Replace a switch with the Strategy Pattern.",
  challenge: "The Strategy Pattern",
  description: "Refactor using the Strategy Pattern.",
  descriptionCode: "Checkout",
  starterFile: "checkout.ts",
  starterCode: "class Checkout {}",
  editorFile: "checkout.ts",
  editorCode: "class Checkout {}",
};

describe("Challenge", () => {
  it("creates a Challenge from valid props", () => {
    const challenge = Challenge.create(validInput);

    expect(challenge.slug).toBe(validInput.slug);
    expect(challenge.title).toBe(validInput.title);
    expect(challenge.category).toBe(validInput.category);
    expect(challenge.difficulty).toBe(Difficulty.Medium);
    expect(challenge.summary).toBe(validInput.summary);
    expect(challenge.challenge).toBe(validInput.challenge);
    expect(challenge.description).toBe(validInput.description);
    expect(challenge.descriptionCode).toBe(validInput.descriptionCode);
    expect(challenge.starterFile).toBe(validInput.starterFile);
    expect(challenge.starterCode).toBe(validInput.starterCode);
    expect(challenge.editorFile).toBe(validInput.editorFile);
    expect(challenge.editorCode).toBe(validInput.editorCode);
  });

  it("creates a Challenge without optional descriptionCode", () => {
    const { descriptionCode: _descriptionCode, ...withoutOptional } =
      validInput;
    const challenge = Challenge.create(withoutOptional);

    expect(challenge.descriptionCode).toBeUndefined();
  });

  it("throws InvalidChallengeError when slug is empty", () => {
    expect(() => Challenge.create({ ...validInput, slug: "" })).toThrow(
      InvalidChallengeError,
    );
  });

  it("throws InvalidChallengeError when slug exceeds max length", () => {
    expect(() =>
      Challenge.create({
        ...validInput,
        slug: "a".repeat(CHALLENGE_SLUG_MAX_LENGTH + 1),
      }),
    ).toThrow(InvalidChallengeError);
  });

  it("throws InvalidChallengeError when title is empty", () => {
    expect(() => Challenge.create({ ...validInput, title: "" })).toThrow(
      InvalidChallengeError,
    );
  });

  it("throws InvalidChallengeError when title exceeds max length", () => {
    expect(() =>
      Challenge.create({
        ...validInput,
        title: "a".repeat(CHALLENGE_TITLE_MAX_LENGTH + 1),
      }),
    ).toThrow(InvalidChallengeError);
  });

  it("throws InvalidChallengeError when difficulty is invalid", () => {
    expect(() =>
      Challenge.create({
        ...validInput,
        difficulty: "Impossible" as unknown as Difficulty,
      }),
    ).toThrow(InvalidChallengeError);
  });

  it("throws InvalidChallengeError when description is empty", () => {
    expect(() => Challenge.create({ ...validInput, description: "" })).toThrow(
      InvalidChallengeError,
    );
  });

  it("throws InvalidChallengeError when description exceeds max length", () => {
    expect(() =>
      Challenge.create({
        ...validInput,
        description: "a".repeat(CHALLENGE_DESCRIPTION_MAX_LENGTH + 1),
      }),
    ).toThrow(InvalidChallengeError);
  });

  it("throws InvalidChallengeError when starterCode is empty", () => {
    expect(() => Challenge.create({ ...validInput, starterCode: "" })).toThrow(
      InvalidChallengeError,
    );
  });

  it("returns a copy of props via toObject", () => {
    const challenge = Challenge.create(validInput);
    const object = challenge.toObject();

    expect(object).toMatchObject(validInput);
    expect(challenge.toObject()).not.toBe(object);
  });
});
