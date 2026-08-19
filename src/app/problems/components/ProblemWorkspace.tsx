"use client";

import * as React from "react";

import type { ChallengeProps } from "@/domain/entities/challenge.entity";
import { useEvaluateSubmission } from "../hooks/useEvaluateSubmission";
import { CodeEditor } from "./CodeEditor";
import { ProblemLeftPane } from "./ProblemLeftPane";

const DESCRIPTION_TAB = "description";
const EVALUATION_TAB = "evaluation";

type ProblemWorkspaceProps = {
  problem: ChallengeProps;
};

export function ProblemWorkspace({ problem }: ProblemWorkspaceProps) {
  const { evaluation, error, isSubmitting, submit } = useEvaluateSubmission();
  const [tab, setTab] = React.useState(DESCRIPTION_TAB);

  const handleSubmit = (code: string) => {
    setTab(EVALUATION_TAB);
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
        isSubmitting={isSubmitting}
        tab={tab}
        onTabChange={setTab}
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
