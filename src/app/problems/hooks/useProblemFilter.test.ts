import { describe, expect, it } from "vitest";

import type { ChallengeProps } from "@/domain/entities/challenge.entity";
import { Difficulty } from "@/domain/entities/difficulty.enum";

import { filterChallenges } from "./useProblemFilter";

const mockChallenges: ChallengeProps[] = [
  {
    slug: "refactor-the-payment-processor",
    title: "Refactor the Payment Processor",
    category: "Behavioral",
    difficulty: Difficulty.Medium,
    summary: "Replace a giant switch statement with the Strategy Pattern.",
    challenge: "The Strategy Pattern",
    description: "Description here",
    descriptionCode: "Checkout",
    starterFile: "checkout.ts",
    starterCode: "class Checkout {}",
    editorFile: "checkout.ts",
    editorCode: "interface IPaymentStrategy {}",
  },
  {
    slug: "tame-the-notification-service",
    title: "Tame the Notification Service",
    category: "Behavioral",
    difficulty: Difficulty.Easy,
    summary: "Let subscribers react to events using the Observer Pattern.",
    challenge: "The Observer Pattern",
    description: "Description here",
    descriptionCode: "OrderService",
    starterFile: "order-service.ts",
    starterCode: "class OrderService {}",
    editorFile: "order-service.ts",
    editorCode: "interface Observer {}",
  },
  {
    slug: "build-a-widget-factory",
    title: "Build a Widget Factory",
    category: "Creational",
    difficulty: Difficulty.Medium,
    summary: "Centralize object creation behind a Factory.",
    challenge: "The Factory Pattern",
    description: "Description here",
    descriptionCode: "Button",
    starterFile: "widgets.ts",
    starterCode: "function render() {}",
    editorFile: "widgets.ts",
    editorCode: "interface Button {}",
  },
];

describe("filterChallenges", () => {
  it("shows all challenges with All filter and empty query", () => {
    const result = filterChallenges(mockChallenges, "All", "");
    expect(result).toHaveLength(3);
  });

  it("filters by category", () => {
    const result = filterChallenges(mockChallenges, "Creational", "");
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("build-a-widget-factory");
  });

  it("filters by search query on title", () => {
    const result = filterChallenges(mockChallenges, "All", "payment");
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("refactor-the-payment-processor");
  });

  it("filters by search query on summary", () => {
    const result = filterChallenges(mockChallenges, "All", "observer");
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("tame-the-notification-service");
  });

  it("combines category filter and search query", () => {
    const result = filterChallenges(mockChallenges, "Behavioral", "payment");
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("refactor-the-payment-processor");
  });

  it("returns empty when no match", () => {
    const result = filterChallenges(mockChallenges, "All", "nonexistent");
    expect(result).toHaveLength(0);
  });
});
