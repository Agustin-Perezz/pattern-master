import { Loader2 } from "lucide-react";

import type { ChallengeProps } from "@/domain/entities/challenge.entity";
import type { Evaluation } from "@/domain/entities/evaluation.schema";

import { CodeBlock } from "./CodeBlock";
import { FeedbackCard } from "./FeedbackCard";
import { ScoreDial } from "./ScoreDial";

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

type EvaluationResultProps = {
  problem: ChallengeProps;
  evaluation: Evaluation;
};

function EvaluationResult({ problem, evaluation }: EvaluationResultProps) {
  const note = `${problem.challenge} detected in your submission.`;
  return (
    <div className="flex flex-col gap-[24px]">
      <ScoreDial score={evaluation.score} note={note} />
      <EvaluationFeedback evaluation={evaluation} />
    </div>
  );
}

function EvaluationFeedback({ evaluation }: { evaluation: Evaluation }) {
  return (
    <div className="flex flex-col gap-[12px]">
      <FeedbackCard variant="success" title="Praise">
        {evaluation.praise ?? "No praise provided."}
      </FeedbackCard>
      <FeedbackCard variant="warning" title="Critical Feedback">
        {evaluation.criticalFeedback ?? "No critical feedback provided."}
        {evaluation.criticalFeedbackExample && (
          <CodeBlock code={evaluation.criticalFeedbackExample} />
        )}
      </FeedbackCard>
      {evaluation.cleanArchitectureViolations.map((violation) => (
        <FeedbackCard key={violation} variant="warning" title="Violation">
          {violation}
        </FeedbackCard>
      ))}
    </div>
  );
}
