import { describe, expect, it } from "vitest";
import { computeCostUsd, GPT_4O_MINI_MODEL_ID } from "./pricing";

describe("computeCostUsd", () => {
  it("computes gpt-4o-mini input cost", () => {
    const cost = computeCostUsd({
      model: GPT_4O_MINI_MODEL_ID,
      inputTokens: 1_000_000,
      outputTokens: 0,
    });

    expect(cost).toBeCloseTo(0.15, 10);
  });

  it("computes gpt-4o-mini output cost", () => {
    const cost = computeCostUsd({
      model: GPT_4O_MINI_MODEL_ID,
      inputTokens: 0,
      outputTokens: 1_000_000,
    });

    expect(cost).toBeCloseTo(0.6, 10);
  });

  it("sums input and output cost", () => {
    const cost = computeCostUsd({
      model: GPT_4O_MINI_MODEL_ID,
      inputTokens: 2_000_000,
      outputTokens: 1_000_000,
    });

    expect(cost).toBeCloseTo(0.9, 10);
  });

  it("returns 0 for zero tokens", () => {
    const cost = computeCostUsd({
      model: GPT_4O_MINI_MODEL_ID,
      inputTokens: 0,
      outputTokens: 0,
    });

    expect(cost).toBe(0);
  });

  it("throws for an unknown model", () => {
    expect(() =>
      computeCostUsd({
        model: "unknown-model",
        inputTokens: 100,
        outputTokens: 100,
      }),
    ).toThrow(/No pricing configured/);
  });
});
