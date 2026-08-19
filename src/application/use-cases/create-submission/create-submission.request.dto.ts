import { z } from "zod";
import {
  SUBMISSION_SCORE_MAX,
  SUBMISSION_SCORE_MIN,
  SUBMISSION_SUBMITTED_CODE_MIN_LENGTH,
} from "@/domain/entities/submission.entity";
import { feedbackSchema } from "@/domain/entities/submission.schema";

export const createSubmissionRequestDto = z.object({
  userId: z.string().uuid(),
  challengeSlug: z.string().min(1),
  submittedCode: z.string().min(SUBMISSION_SUBMITTED_CODE_MIN_LENGTH),
  score: z.number().int().min(SUBMISSION_SCORE_MIN).max(SUBMISSION_SCORE_MAX),
  patternApplied: z.boolean(),
  feedback: feedbackSchema,
});

export type CreateSubmissionRequestDto = z.infer<
  typeof createSubmissionRequestDto
>;
