import { FILTERS, type Filter } from "../hooks/useProblemFilter";
import { FilterButton } from "./FilterButton";
import { ProblemSearchInput } from "./ProblemSearchInput";

type ProblemBrowserControlsProps = {
  filter: Filter;
  query: string;
  onFilterChange: (filter: Filter) => void;
  onQueryChange: (query: string) => void;
};

export function ProblemBrowserControls({
  filter,
  query,
  onFilterChange,
  onQueryChange,
}: ProblemBrowserControlsProps) {
  return (
    <div className="flex flex-col gap-[16px]">
      <ProblemSearchInput value={query} onChange={onQueryChange} />
      <div
        className="flex flex-wrap gap-[8px]"
        role="tablist"
        aria-label="Filter by category"
      >
        {FILTERS.map((f) => (
          <FilterButton
            key={f}
            filter={f}
            active={f === filter}
            onClick={() => onFilterChange(f)}
          />
        ))}
      </div>
    </div>
  );
}
