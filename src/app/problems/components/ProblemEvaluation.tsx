import type { ChallengeProps } from "@/domain/entities/challenge.entity";
import type { Evaluation } from "@/domain/entities/evaluation.schema";

import { FeedbackCard } from "./FeedbackCard";
import { ScoreDial } from "./ScoreDial";

type ProblemEvaluationProps = {
  problem: ChallengeProps;
  evaluation: Evaluation | null;
  error: string | null;
};

export function ProblemEvaluation({
  problem,
  evaluation,
  error,
}: ProblemEvaluationProps) {
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
      </FeedbackCard>
      {evaluation.cleanArchitectureViolations.map((violation) => (
        <FeedbackCard key={violation} variant="warning" title="Violation">
          {violation}
        </FeedbackCard>
      ))}
    </div>
  );
}
