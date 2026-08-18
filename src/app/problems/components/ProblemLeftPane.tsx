import type { ChallengeProps } from "@/domain/entities/challenge.entity";

import { ProblemDescription } from "./ProblemDescription";
import { ProblemEvaluation } from "./ProblemEvaluation";
import { ProblemTabs } from "./ProblemTabs";

type ProblemLeftPaneProps = {
  problem: ChallengeProps;
};

export function ProblemLeftPane({ problem }: ProblemLeftPaneProps) {
  return (
    <ProblemTabs
      description={<ProblemDescription problem={problem} />}
      evaluation={<ProblemEvaluation problem={problem} />}
    />
  );
}
