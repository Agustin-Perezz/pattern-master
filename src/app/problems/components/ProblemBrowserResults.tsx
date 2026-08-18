"use client";

import type { ChallengeProps } from "@/domain/entities/challenge.entity";

import { useProblemFilter } from "../hooks/useProblemFilter";
import { ProblemBrowserControls } from "./ProblemBrowserControls";
import { ProblemResultsGrid } from "./ProblemResultsGrid";

type ProblemBrowserResultsProps = {
  initialChallenges: ChallengeProps[];
};

export function ProblemBrowserResults({
  initialChallenges,
}: ProblemBrowserResultsProps) {
  const { filter, setFilter, query, setQuery, visible } =
    useProblemFilter(initialChallenges);

  return (
    <>
      <ProblemBrowserControls
        filter={filter}
        query={query}
        onFilterChange={setFilter}
        onQueryChange={setQuery}
      />
      <ProblemResultsGrid problems={visible} filter={filter} />
    </>
  );
}
