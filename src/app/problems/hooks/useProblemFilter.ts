import * as React from "react";

import { CATEGORIES, PROBLEMS, type Problem } from "@/lib/mock/problems";

export const FILTERS = ["All", ...CATEGORIES] as const;

export type Filter = (typeof FILTERS)[number];

export function useProblemFilter() {
  const [filter, setFilter] = React.useState<Filter>("All");
  const [query, setQuery] = React.useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const visible = PROBLEMS.filter((problem: Problem) => {
    const matchesCategory = filter === "All" || problem.category === filter;
    const matchesQuery =
      normalizedQuery === "" ||
      problem.title.toLowerCase().includes(normalizedQuery) ||
      problem.summary.toLowerCase().includes(normalizedQuery) ||
      problem.challenge.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });

  return { filter, setFilter, query, setQuery, visible };
}
