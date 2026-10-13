import { describe, expect, it } from "vitest";
import { dataset } from "./dataset";
import {
  CASES_PER_PROBLEM,
  CHALLENGE_SLUGS,
  datasetSchema,
  PROBLEM_KEYS,
  QUALITY_LEVELS,
  TOTAL_DATASET_CASES,
} from "./dataset.schema";

describe("eval dataset", () => {
  it("validates against the dataset schema", () => {
    expect(datasetSchema.safeParse(dataset).success).toBe(true);
  });

  it("contains exactly 36 cases", () => {
    expect(dataset).toHaveLength(TOTAL_DATASET_CASES);
  });

  it("contains exactly 6 cases per problem", () => {
    for (const problem of PROBLEM_KEYS) {
      const cases = dataset.filter((entry) => entry.problem === problem);
      expect(cases).toHaveLength(CASES_PER_PROBLEM);
    }
  });

  it("covers every challenge slug", () => {
    const slugs = new Set(dataset.map((entry) => entry.challengeSlug));
    for (const slug of CHALLENGE_SLUGS) {
      expect(slugs.has(slug)).toBe(true);
    }
  });

  it("covers every quality level once per problem", () => {
    for (const problem of PROBLEM_KEYS) {
      const levels = dataset
        .filter((entry) => entry.problem === problem)
        .map((entry) => entry.qualityLevel)
        .sort();
      expect(levels).toEqual([...QUALITY_LEVELS].sort());
    }
  });

  it("has unique case ids", () => {
    const ids = new Set(dataset.map((entry) => entry.id));
    expect(ids.size).toBe(dataset.length);
  });

  it("has ordered score ranges", () => {
    for (const entry of dataset) {
      const [min, max] = entry.expectedScoreRange;
      expect(min).toBeLessThanOrEqual(max);
    }
  });
});
