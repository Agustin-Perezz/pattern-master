"use client";

import * as React from "react";
import type { Evaluation } from "@/domain/entities/evaluation.schema";

const EVALUATE_ENDPOINT = "/api/evaluate";
const JSON_CONTENT_TYPE = "application/json";
const UNEXPECTED_ERROR = "Unexpected error";

const UNAUTHORIZED_MESSAGE = "You must be signed in to submit code for review.";
const BAD_REQUEST_MESSAGE = "The submitted code or challenge data is invalid.";
const BAD_GATEWAY_MESSAGE =
  "The AI evaluation service is unavailable. Please try again.";
const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again.";

const ERROR_STATUS_MESSAGES: Readonly<Record<number, string>> = {
  401: UNAUTHORIZED_MESSAGE,
  400: BAD_REQUEST_MESSAGE,
  502: BAD_GATEWAY_MESSAGE,
};

function statusMessage(status: number): string {
  return ERROR_STATUS_MESSAGES[status] ?? GENERIC_ERROR_MESSAGE;
}

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
        throw new Error(statusMessage(res.status));
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
