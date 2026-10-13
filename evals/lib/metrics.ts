export type ScoreRange = readonly [number, number];

export type AggregateMetrics = {
  caseCount: number;
  accuracy: number;
  mae: number;
  averageStdDev: number;
  schemaValidRate: number;
  p95LatencyMs: number;
  avgCostUsd: number;
};

export type CaseRuns = {
  caseId: string;
  problem: string;
  challengeSlug: string;
  expectedScoreRange: ScoreRange;
  scores: readonly (number | null)[];
  schemaValidity: readonly boolean[];
  latenciesMs: readonly number[];
  costsUsd: readonly number[];
};

export type ProblemAggregate = {
  problem: string;
  metrics: AggregateMetrics;
};

export type AmbiguousCase = {
  caseId: string;
  problem: string;
  spread: number;
};

export const P95_PERCENTILE = 0.95;
export const AMBIGUOUS_SPREAD_THRESHOLD = 10;

const EMPTY_METRICS: AggregateMetrics = {
  caseCount: 0,
  accuracy: 0,
  mae: 0,
  averageStdDev: 0,
  schemaValidRate: 0,
  p95LatencyMs: 0,
  avgCostUsd: 0,
};

export function mean(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }

  let sum = 0;
  for (const value of values) {
    sum += value;
  }

  return sum / values.length;
}

export function stdDev(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const average = mean(values);
  let sumSquaredDeviations = 0;
  for (const value of values) {
    sumSquaredDeviations += (value - average) ** 2;
  }

  return Math.sqrt(sumSquaredDeviations / values.length);
}

export function spread(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return Math.max(...values) - Math.min(...values);
}

export function percentile(
  values: readonly number[],
  fraction: number,
): number {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((a, b) => a - b);

  if (sorted.length === 1) {
    return sorted[0];
  }

  const rank = fraction * (sorted.length - 1);
  const lowerIndex = Math.floor(rank);
  const upperIndex = Math.ceil(rank);

  if (lowerIndex === upperIndex) {
    return sorted[lowerIndex];
  }

  const weight = rank - lowerIndex;
  return sorted[lowerIndex] * (1 - weight) + sorted[upperIndex] * weight;
}

export function inRange(value: number, range: ScoreRange): boolean {
  return value >= range[0] && value <= range[1];
}

export function inRangeRate(
  values: readonly number[],
  range: ScoreRange,
): number {
  if (values.length === 0) {
    return 0;
  }

  let count = 0;
  for (const value of values) {
    if (inRange(value, range)) {
      count += 1;
    }
  }

  return count / values.length;
}

export function mae(values: readonly number[], range: ScoreRange): number {
  if (values.length === 0) {
    return 0;
  }

  let totalDistance = 0;
  for (const value of values) {
    if (value < range[0]) {
      totalDistance += range[0] - value;
    } else if (value > range[1]) {
      totalDistance += value - range[1];
    }
  }

  return totalDistance / values.length;
}

export function schemaValidRate(flags: readonly boolean[]): number {
  if (flags.length === 0) {
    return 0;
  }

  let count = 0;
  for (const flag of flags) {
    if (flag) {
      count += 1;
    }
  }

  return count / flags.length;
}

export function avgCost(costs: readonly number[]): number {
  return mean(costs);
}

export function averageStdDev(groups: readonly (readonly number[])[]): number {
  if (groups.length === 0) {
    return 0;
  }

  let total = 0;
  for (const group of groups) {
    total += stdDev(group);
  }

  return total / groups.length;
}

function validScores(scores: readonly (number | null)[]): number[] {
  const result: number[] = [];
  for (const score of scores) {
    if (score !== null) {
      result.push(score);
    }
  }

  return result;
}

function collectAll<T>(groups: readonly (readonly T[])[]): T[] {
  const result: T[] = [];
  for (const group of groups) {
    for (const item of group) {
      result.push(item);
    }
  }

  return result;
}

export function summarizeCaseRuns(
  cases: readonly CaseRuns[],
): AggregateMetrics {
  if (cases.length === 0) {
    return EMPTY_METRICS;
  }

  const perCaseScoreGroups: number[][] = [];
  const perCaseLatencyGroups: number[][] = [];
  const perCaseCostGroups: number[][] = [];
  const perCaseSchemaGroups: boolean[][] = [];
  let casesInRange = 0;
  let maeTotal = 0;
  let maeCaseCount = 0;

  for (const caseRuns of cases) {
    const scores = validScores(caseRuns.scores);

    if (scores.length > 0) {
      if (inRange(mean(scores), caseRuns.expectedScoreRange)) {
        casesInRange += 1;
      }
      maeTotal += mae(scores, caseRuns.expectedScoreRange);
      maeCaseCount += 1;
      perCaseScoreGroups.push(scores);
    }

    perCaseLatencyGroups.push([...caseRuns.latenciesMs]);
    perCaseCostGroups.push([...caseRuns.costsUsd]);
    perCaseSchemaGroups.push([...caseRuns.schemaValidity]);
  }

  return {
    caseCount: cases.length,
    accuracy: casesInRange / cases.length,
    mae: maeCaseCount > 0 ? maeTotal / maeCaseCount : 0,
    averageStdDev: averageStdDev(perCaseScoreGroups),
    schemaValidRate: schemaValidRate(collectAll(perCaseSchemaGroups)),
    p95LatencyMs: percentile(collectAll(perCaseLatencyGroups), P95_PERCENTILE),
    avgCostUsd: avgCost(collectAll(perCaseCostGroups)),
  };
}

export function aggregateByProblem(
  cases: readonly CaseRuns[],
): ProblemAggregate[] {
  const grouped = new Map<string, CaseRuns[]>();

  for (const caseRuns of cases) {
    const existing = grouped.get(caseRuns.problem);
    if (existing) {
      existing.push(caseRuns);
    } else {
      grouped.set(caseRuns.problem, [caseRuns]);
    }
  }

  const aggregates: ProblemAggregate[] = [];
  for (const [problem, problemCases] of grouped) {
    aggregates.push({ problem, metrics: summarizeCaseRuns(problemCases) });
  }

  return aggregates.sort((a, b) => a.problem.localeCompare(b.problem));
}

export function findAmbiguousCases(
  cases: readonly CaseRuns[],
): AmbiguousCase[] {
  const ambiguous: AmbiguousCase[] = [];

  for (const caseRuns of cases) {
    const caseSpread = spread(validScores(caseRuns.scores));
    if (caseSpread > AMBIGUOUS_SPREAD_THRESHOLD) {
      ambiguous.push({
        caseId: caseRuns.caseId,
        problem: caseRuns.problem,
        spread: caseSpread,
      });
    }
  }

  return ambiguous.sort((a, b) => b.spread - a.spread);
}
