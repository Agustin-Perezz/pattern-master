import * as React from "react";

import type { ChallengeProps } from "@/domain/entities/challenge.entity";

export const FILTERS = [
  "All",
  "Behavioral",
  "Creational",
  "Structural",
] as const;

export type Filter = (typeof FILTERS)[number];

const ALL_FILTER: Filter = "All";

export function filterChallenges(
  challenges: ChallengeProps[],
  filter: Filter,
  query: string,
): ChallengeProps[] {
  const normalizedQuery = query.trim().toLowerCase();
  return challenges.filter((challenge: ChallengeProps) => {
    const matchesCategory =
      filter === ALL_FILTER || challenge.category === filter;
    const matchesQuery =
      normalizedQuery === "" ||
      challenge.title.toLowerCase().includes(normalizedQuery) ||
      challenge.summary.toLowerCase().includes(normalizedQuery) ||
      challenge.challenge.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
}

export function useProblemFilter(initialChallenges: ChallengeProps[]) {
  const [filter, setFilter] = React.useState<Filter>(ALL_FILTER);
  const [query, setQuery] = React.useState("");

  const visible = filterChallenges(initialChallenges, filter, query);

  return { filter, setFilter, query, setQuery, visible };
}
