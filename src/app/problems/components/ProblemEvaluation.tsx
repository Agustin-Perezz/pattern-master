import type { Problem } from "@/lib/mock/problems";

import { FeedbackCard } from "./FeedbackCard";
import { ScoreDial } from "./ScoreDial";

const SCORE_VALUE = 85;

type ProblemEvaluationProps = {
  problem: Problem;
};

export function ProblemEvaluation({ problem }: ProblemEvaluationProps) {
  return (
    <div className="flex flex-col gap-[24px]">
      <ScoreDial
        score={SCORE_VALUE}
        note={`${problem.challenge} detected in your submission.`}
      />
      <div className="flex flex-col gap-[12px]">
        <FeedbackCard variant="success" title="Praise">
          Excellent job extracting the responsibilities into their own types and
          coding against an interface rather than concrete classes.
        </FeedbackCard>
        <FeedbackCard variant="warning" title="Critical Feedback">
          Consider injecting the dependency through the constructor instead of
          instantiating it inline &mdash; the current version is still tightly
          coupled.
        </FeedbackCard>
      </div>
    </div>
  );
}
