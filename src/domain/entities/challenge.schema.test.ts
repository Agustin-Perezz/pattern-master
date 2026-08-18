import { describe, expect, it } from "vitest";
import {
  CHALLENGE_DESCRIPTION_MAX_LENGTH,
  CHALLENGE_SLUG_MAX_LENGTH,
} from "./challenge.entity";
import { challengeSchema } from "./challenge.schema";
import { Difficulty } from "./difficulty.enum";

const validData = {
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

describe("challengeSchema", () => {
  it("validates valid challenge data", () => {
    const result = challengeSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it("validates valid challenge data without optional descriptionCode", () => {
    const { descriptionCode: _descriptionCode, ...withoutOptional } = validData;
    const result = challengeSchema.safeParse(withoutOptional);

    expect(result.success).toBe(true);
  });

  it("rejects empty slug", () => {
    const result = challengeSchema.safeParse({ ...validData, slug: "" });

    expect(result.success).toBe(false);
  });

  it("rejects slug exceeding max length", () => {
    const result = challengeSchema.safeParse({
      ...validData,
      slug: "a".repeat(CHALLENGE_SLUG_MAX_LENGTH + 1),
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid difficulty", () => {
    const result = challengeSchema.safeParse({
      ...validData,
      difficulty: "Impossible",
    });

    expect(result.success).toBe(false);
  });

  it("rejects empty description", () => {
    const result = challengeSchema.safeParse({ ...validData, description: "" });

    expect(result.success).toBe(false);
  });

  it("rejects description exceeding max length", () => {
    const result = challengeSchema.safeParse({
      ...validData,
      description: "a".repeat(CHALLENGE_DESCRIPTION_MAX_LENGTH + 1),
    });

    expect(result.success).toBe(false);
  });

  it("rejects empty starterCode", () => {
    const result = challengeSchema.safeParse({
      ...validData,
      starterCode: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects missing required field", () => {
    const { title: _title, ...withoutTitle } = validData;
    const result = challengeSchema.safeParse(withoutTitle);

    expect(result.success).toBe(false);
  });
});
