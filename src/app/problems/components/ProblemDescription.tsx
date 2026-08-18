import { Badge } from "@/components/opencode/badge";
import type { Problem } from "@/lib/mock/problems";

import { CodeBlock } from "./CodeBlock";

const PROBLEM_TAG = "[ problem ]";

type ProblemDescriptionProps = {
  problem: Problem;
};

export function ProblemDescription({ problem }: ProblemDescriptionProps) {
  const [before, after] = problem.description.split("{code}");

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex flex-wrap items-center gap-[8px]">
        <Badge variant="label">{PROBLEM_TAG}</Badge>
        <Badge variant="label">{problem.category}</Badge>
        <Badge variant="warning">{problem.difficulty}</Badge>
      </div>
      <h1 className="font-mono text-[24px] font-bold leading-[1.3] text-ink">
        {problem.title}
      </h1>
      <p className="font-mono text-[16px] leading-[1.6] text-body">
        {before}
        {problem.descriptionCode ? (
          <code className="rounded-sm bg-surface-card px-[4px] text-ink">
            {problem.descriptionCode}
          </code>
        ) : null}
        {after}
      </p>
      <div className="flex flex-col gap-[8px]">
        <span className="font-mono text-[14px] text-mute">
          {"&gt;"} Bad starter code
        </span>
        <CodeBlock code={problem.starterCode} caption={problem.starterFile} />
      </div>
    </div>
  );
}
