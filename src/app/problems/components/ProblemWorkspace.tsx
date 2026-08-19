"use client";

import type { ChallengeProps } from "@/domain/entities/challenge.entity";
import { useEvaluateSubmission } from "../hooks/useEvaluateSubmission";
import { CodeEditor } from "./CodeEditor";
import { ProblemLeftPane } from "./ProblemLeftPane";

type ProblemWorkspaceProps = {
  problem: ChallengeProps;
};

export function ProblemWorkspace({ problem }: ProblemWorkspaceProps) {
  const { evaluation, error, isSubmitting, submit } = useEvaluateSubmission();

  const handleSubmit = (code: string) => {
    void submit({
      code,
      challengeSlug: problem.slug,
      targetPattern: problem.challenge,
    });
  };

  return (
    <>
      <ProblemLeftPane
        problem={problem}
        evaluation={evaluation}
        error={error}
      />
      <CodeEditor
        problem={problem}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
      />
    </>
  );
}
