import { z } from "zod";
import {
  SUBMISSION_SCORE_MAX,
  SUBMISSION_SCORE_MIN,
} from "./submission.entity";

export const evaluationSchema = z.object({
  score: z.number().int().min(SUBMISSION_SCORE_MIN).max(SUBMISSION_SCORE_MAX),
  patternApplied: z.boolean(),
  praise: z.string().nullable(),
  criticalFeedback: z.string().nullable(),
  criticalFeedbackExample: z.string().nullable(),
  cleanArchitectureViolations: z.array(z.string()),
});

export type Evaluation = z.infer<typeof evaluationSchema>;
