import { z } from "zod";

export const EVALUATE_SUBMISSION_CODE_MIN_LENGTH = 1;

export const evaluateSubmissionRequestDto = z.object({
  code: z.string().min(EVALUATE_SUBMISSION_CODE_MIN_LENGTH),
  challengeSlug: z.string().min(EVALUATE_SUBMISSION_CODE_MIN_LENGTH),
  targetPattern: z.string().min(EVALUATE_SUBMISSION_CODE_MIN_LENGTH),
});

export type EvaluateSubmissionRequestDto = z.infer<
  typeof evaluateSubmissionRequestDto
>;
