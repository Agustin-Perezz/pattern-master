import type { ChallengeProps } from "@/domain/entities/challenge.entity";

import type { Filter } from "../hooks/useProblemFilter";
import { ProblemCard } from "./ProblemCard";

type ProblemResultsGridProps = {
  problems: ChallengeProps[];
  filter: Filter;
};

export function ProblemResultsGrid({
  problems,
  filter,
}: ProblemResultsGridProps) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-hairline pb-[8px]">
        <span className="font-mono text-[14px] text-mute">
          {problems.length} problem{problems.length === 1 ? "" : "s"}
        </span>
        <span className="font-mono text-[14px] text-stone">{filter}</span>
      </div>
      {problems.length > 0 ? (
        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
          {problems.map((problem) => (
            <ProblemCard key={problem.slug} problem={problem} />
          ))}
        </div>
      ) : (
        <p className="py-[40px] text-center font-mono text-[14px] text-mute">
          {"// no problems match your filters"}
        </p>
      )}
    </>
  );
}
