import type { Problem } from "@/lib/mock/problems";

import { ProblemDescription } from "./ProblemDescription";
import { ProblemEvaluation } from "./ProblemEvaluation";
import { ProblemTabs } from "./ProblemTabs";

type ProblemLeftPaneProps = {
  problem: Problem;
};

export function ProblemLeftPane({ problem }: ProblemLeftPaneProps) {
  return (
    <ProblemTabs
      description={<ProblemDescription problem={problem} />}
      evaluation={<ProblemEvaluation problem={problem} />}
    />
  );
}
