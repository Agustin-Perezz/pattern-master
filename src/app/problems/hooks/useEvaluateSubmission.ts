"use client";

import * as React from "react";
import type { Evaluation } from "@/domain/entities/evaluation.schema";

const EVALUATE_ENDPOINT = "/api/evaluate";
const JSON_CONTENT_TYPE = "application/json";
const UNEXPECTED_ERROR = "Unexpected error";
const REQUEST_FAILED_PREFIX = "Request failed";

export type EvaluateSubmissionInput = {
  code: string;
  challengeSlug: string;
  targetPattern: string;
};

type UseEvaluateSubmissionResult = {
  evaluation: Evaluation | null;
  error: string | null;
  isSubmitting: boolean;
  submit: (input: EvaluateSubmissionInput) => Promise<void>;
};

type ErrorResponse = { error?: string };

export function useEvaluateSubmission(): UseEvaluateSubmissionResult {
  const [evaluation, setEvaluation] = React.useState<Evaluation | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const submit = React.useCallback(async (input: EvaluateSubmissionInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(EVALUATE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": JSON_CONTENT_TYPE },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as ErrorResponse;
        throw new Error(
          body.error ?? `${REQUEST_FAILED_PREFIX} (${res.status})`,
        );
      }

      setEvaluation((await res.json()) as Evaluation);
    } catch (e) {
      setError(e instanceof Error ? e.message : UNEXPECTED_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { evaluation, error, isSubmitting, submit };
}
