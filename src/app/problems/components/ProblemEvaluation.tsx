import { Loader2 } from "lucide-react";

import type { ChallengeProps } from "@/domain/entities/challenge.entity";
import type { Evaluation } from "@/domain/entities/evaluation.schema";
import { EvaluationResult } from "./EvaluationResult";
import { FeedbackCard } from "./FeedbackCard";

type ProblemEvaluationProps = {
  problem: ChallengeProps;
  evaluation: Evaluation | null;
  error: string | null;
  isSubmitting: boolean;
};

export function ProblemEvaluation({
  problem,
  evaluation,
  error,
  isSubmitting,
}: ProblemEvaluationProps) {
  if (isSubmitting) {
    return (
      <FeedbackCard variant="neutral" title="Evaluating your submission">
        <div className="flex items-center gap-[12px]">
          <Loader2 className="size-[16px] animate-spin" aria-hidden />
          <span>The AI is analyzing your code…</span>
        </div>
      </FeedbackCard>
    );
  }

  if (error) {
    return (
      <FeedbackCard variant="warning" title="Evaluation Failed">
        {error}
      </FeedbackCard>
    );
  }

  if (!evaluation) {
    return (
      <FeedbackCard variant="neutral" title="No Submission Yet">
        Submit your code to see the evaluation.
      </FeedbackCard>
    );
  }

  return <EvaluationResult problem={problem} evaluation={evaluation} />;
}
