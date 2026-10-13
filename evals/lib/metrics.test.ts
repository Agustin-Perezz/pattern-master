import { describe, expect, it } from "vitest";
import type { CaseRuns } from "./metrics";
import {
  aggregateByProblem,
  averageStdDev,
  avgCost,
  findAmbiguousCases,
  inRange,
  inRangeRate,
  mae,
  mean,
  percentile,
  schemaValidRate,
  spread,
  stdDev,
  summarizeCaseRuns,
} from "./metrics";

function makeCaseRuns(overrides: Partial<CaseRuns> = {}): CaseRuns {
  return {
    caseId: "case-1",
    problem: "payment",
    challengeSlug: "refactor-the-payment-processor",
    expectedScoreRange: [85, 100],
    scores: [90, 92],
    schemaValidity: [true, true],
    latenciesMs: [1000, 1100],
    costsUsd: [0.0001, 0.0002],
    ...overrides,
  };
}

describe("mean", () => {
  it("averages values", () => {
    expect(mean([1, 2, 3])).toBe(2);
  });

  it("returns 0 for an empty list", () => {
    expect(mean([])).toBe(0);
  });
});

describe("stdDev", () => {
  it("computes the population standard deviation", () => {
    expect(stdDev([2, 4, 4, 4, 5, 5, 7, 9])).toBe(2);
  });

  it("returns 0 for a single value", () => {
    expect(stdDev([42])).toBe(0);
  });

  it("returns 0 for an empty list", () => {
    expect(stdDev([])).toBe(0);
  });
});

describe("spread", () => {
  it("returns max minus min", () => {
    expect(spread([3, 9, 1])).toBe(8);
  });

  it("returns 0 for an empty list", () => {
    expect(spread([])).toBe(0);
  });
});

describe("percentile", () => {
  it("interpolates the median", () => {
    expect(percentile([1, 2, 3, 4], 0.5)).toBeCloseTo(2.5, 10);
  });

  it("interpolates p95", () => {
    expect(percentile([10, 20, 30, 40], 0.95)).toBeCloseTo(38.5, 10);
  });

  it("returns the value for a single-element list", () => {
    expect(percentile([7], 0.95)).toBe(7);
  });
});

describe("inRange", () => {
  it("treats bounds as inclusive", () => {
    expect(inRange(85, [85, 100])).toBe(true);
    expect(inRange(100, [85, 100])).toBe(true);
  });

  it("rejects values outside the range", () => {
    expect(inRange(84, [85, 100])).toBe(false);
    expect(inRange(101, [85, 100])).toBe(false);
  });
});

describe("inRangeRate", () => {
  it("returns the fraction of values inside the range", () => {
    expect(inRangeRate([90, 95, 50], [85, 100])).toBeCloseTo(2 / 3, 10);
  });

  it("returns 0 for an empty list", () => {
    expect(inRangeRate([], [85, 100])).toBe(0);
  });
});

describe("mae", () => {
  it("averages distance from the nearest bound", () => {
    expect(mae([80, 105, 90], [85, 100])).toBeCloseTo(10 / 3, 10);
  });

  it("returns 0 when every value is inside the range", () => {
    expect(mae([90, 95], [85, 100])).toBe(0);
  });
});

describe("schemaValidRate", () => {
  it("returns the fraction of valid flags", () => {
    expect(schemaValidRate([true, false, true])).toBeCloseTo(2 / 3, 10);
  });

  it("returns 0 for an empty list", () => {
    expect(schemaValidRate([])).toBe(0);
  });
});

describe("avgCost", () => {
  it("averages costs", () => {
    expect(avgCost([0.1, 0.3])).toBeCloseTo(0.2, 10);
  });
});

describe("averageStdDev", () => {
  it("averages the std dev of each group", () => {
    expect(
      averageStdDev([
        [1, 1],
        [1, 3],
      ]),
    ).toBeCloseTo(0.5, 10);
  });

  it("returns 0 for no groups", () => {
    expect(averageStdDev([])).toBe(0);
  });
});

describe("summarizeCaseRuns", () => {
  it("computes accuracy, MAE, std dev, schema rate, p95 and cost", () => {
    const metrics = summarizeCaseRuns([
      makeCaseRuns({
        caseId: "clean",
        scores: [90, 92],
      }),
      makeCaseRuns({
        caseId: "unchanged",
        scores: [10, 20],
        expectedScoreRange: [0, 30],
      }),
    ]);

    expect(metrics.caseCount).toBe(2);
    expect(metrics.accuracy).toBe(1);
    expect(metrics.mae).toBe(0);
    expect(metrics.averageStdDev).toBeCloseTo(3, 10);
    expect(metrics.schemaValidRate).toBe(1);
  });

  it("counts a case with no valid score as out of range", () => {
    const metrics = summarizeCaseRuns([
      makeCaseRuns({ caseId: "clean", scores: [90, 92] }),
      makeCaseRuns({
        caseId: "schema-failure",
        scores: [null, null],
        schemaValidity: [false, false],
      }),
    ]);

    expect(metrics.accuracy).toBeCloseTo(0.5, 10);
    expect(metrics.schemaValidRate).toBeCloseTo(0.5, 10);
  });

  it("returns empty metrics for no cases", () => {
    expect(summarizeCaseRuns([])).toEqual({
      caseCount: 0,
      accuracy: 0,
      mae: 0,
      averageStdDev: 0,
      schemaValidRate: 0,
      p95LatencyMs: 0,
      avgCostUsd: 0,
    });
  });

  it("computes p95 latency across all runs", () => {
    const metrics = summarizeCaseRuns([
      makeCaseRuns({ caseId: "a", latenciesMs: [10, 20, 30, 40] }),
    ]);

    expect(metrics.p95LatencyMs).toBeCloseTo(38.5, 10);
  });
});

describe("aggregateByProblem", () => {
  it("groups cases by problem and sorts by name", () => {
    const aggregates = aggregateByProblem([
      makeCaseRuns({ caseId: "w1", problem: "widget" }),
      makeCaseRuns({ caseId: "p1", problem: "payment", scores: [10, 20] }),
      makeCaseRuns({
        caseId: "p2",
        problem: "payment",
        expectedScoreRange: [0, 30],
        scores: [10, 20],
      }),
    ]);

    expect(aggregates.map((aggregate) => aggregate.problem)).toEqual([
      "payment",
      "widget",
    ]);
    expect(aggregates[0].metrics.caseCount).toBe(2);
    expect(aggregates[0].metrics.accuracy).toBeCloseTo(0.5, 10);
    expect(aggregates[1].metrics.caseCount).toBe(1);
  });
});

describe("findAmbiguousCases", () => {
  it("flags cases whose spread exceeds the threshold", () => {
    const ambiguous = findAmbiguousCases([
      makeCaseRuns({ caseId: "stable", scores: [90, 92] }),
      makeCaseRuns({ caseId: "noisy", scores: [50, 80] }),
    ]);

    expect(ambiguous).toEqual([
      { caseId: "noisy", problem: "payment", spread: 30 },
    ]);
  });

  it("returns an empty list when every case is stable", () => {
    expect(
      findAmbiguousCases([
        makeCaseRuns({ caseId: "stable", scores: [90, 90] }),
      ]),
    ).toEqual([]);
  });
});
