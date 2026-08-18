import { z } from "zod";
import {
  SUBMISSION_SCORE_MAX,
  SUBMISSION_SCORE_MIN,
  SUBMISSION_SUBMITTED_CODE_MIN_LENGTH,
} from "./submission.entity";

export const feedbackSchema = z.object({
  praise: z.string().nullable(),
  criticalFeedback: z.string().nullable(),
  cleanArchitectureViolations: z.array(z.string()),
});

export type FeedbackSchema = z.infer<typeof feedbackSchema>;

export const submissionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  challengeSlug: z.string().min(1),
  submittedCode: z.string().min(SUBMISSION_SUBMITTED_CODE_MIN_LENGTH),
  score: z.number().int().min(SUBMISSION_SCORE_MIN).max(SUBMISSION_SCORE_MAX),
  patternApplied: z.boolean(),
  feedback: feedbackSchema,
  createdAt: z.string(),
});

export type SubmissionSchema = z.infer<typeof submissionSchema>;
