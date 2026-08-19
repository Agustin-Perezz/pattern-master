import type { ChallengeProps } from "@/domain/entities/challenge.entity";
import type { Evaluation } from "@/domain/entities/evaluation.schema";

import { ProblemDescription } from "./ProblemDescription";
import { ProblemEvaluation } from "./ProblemEvaluation";
import { ProblemTabs } from "./ProblemTabs";

type ProblemLeftPaneProps = {
  problem: ChallengeProps;
  evaluation: Evaluation | null;
  error: string | null;
};

export function ProblemLeftPane({
  problem,
  evaluation,
  error,
}: ProblemLeftPaneProps) {
  return (
    <ProblemTabs
      description={<ProblemDescription problem={problem} />}
      evaluation={
        <ProblemEvaluation
          problem={problem}
          evaluation={evaluation}
          error={error}
        />
      }
    />
  );
}
