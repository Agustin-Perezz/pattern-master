"use client";

import { useProblemFilter } from "../hooks/useProblemFilter";
import { ProblemBrowserControls } from "./ProblemBrowserControls";
import { ProblemResultsGrid } from "./ProblemResultsGrid";

export function ProblemBrowserResults() {
  const { filter, setFilter, query, setQuery, visible } = useProblemFilter();

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
