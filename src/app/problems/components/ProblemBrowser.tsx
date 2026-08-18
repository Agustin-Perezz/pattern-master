"use client";

import { Search } from "lucide-react";
import * as React from "react";

import { Input } from "@/components/opencode/input";
import { CATEGORIES, PROBLEMS, type Problem } from "@/lib/mock/problems";
import { cn } from "@/lib/utils";

import { ProblemCard } from "./ProblemCard";

const FILTERS = ["All", ...CATEGORIES] as const;

type Filter = (typeof FILTERS)[number];

type FilterButtonProps = {
  filter: Filter;
  active: boolean;
  onClick: () => void;
};

function FilterButton({ filter, active, onClick }: FilterButtonProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "rounded-sm border px-[14px] py-[6px] font-mono text-[14px] transition-colors",
        active
          ? "border-transparent bg-ink text-canvas"
          : "border-hairline-strong bg-transparent text-mute hover:text-ink",
      )}
    >
      {filter}
    </button>
  );
}

function useProblemFilter() {
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

  return {
    filter,
    setFilter,
    query,
    setQuery,
    visible,
  };
}

export function ProblemBrowser() {
  const { filter, setFilter, query, setQuery, visible } = useProblemFilter();

  return (
    <div className="mx-auto flex w-full max-w-[960px] flex-col gap-[32px] px-[16px] py-[40px] md:px-[24px] md:py-[56px]">
      <header className="flex flex-col gap-[12px]">
        <span className="font-mono text-[14px] text-mute">
          {"// design pattern katas"}
        </span>
        <h1 className="font-mono text-[32px] font-bold leading-[1.2] text-ink md:text-[40px]">
          Pick a problem.
        </h1>
        <p className="max-w-[560px] font-mono text-[16px] leading-[1.6] text-body">
          Refactor real-world code into clean, extensible designs. Each kata
          drops you into an editor with a failing starter and an AI reviewer.
        </p>
      </header>

      <div className="flex flex-col gap-[16px]">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-[12px] top-1/2 size-[16px] -translate-y-1/2 text-mute"
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search problems..."
            aria-label="Search problems"
            className="pl-[36px]"
          />
        </div>

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
              onClick={() => setFilter(f)}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-hairline pb-[8px]">
        <span className="font-mono text-[14px] text-mute">
          {visible.length} problem{visible.length === 1 ? "" : "s"}
        </span>
        <span className="font-mono text-[14px] text-stone">{filter}</span>
      </div>

      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
          {visible.map((problem: Problem) => (
            <ProblemCard key={problem.slug} problem={problem} />
          ))}
        </div>
      ) : (
        <p className="py-[40px] text-center font-mono text-[14px] text-mute">
          {"// no problems match your filters"}
        </p>
      )}
    </div>
  );
}
