import { z } from "zod";
import {
  CHALLENGE_CATEGORY_MAX_LENGTH,
  CHALLENGE_CHALLENGE_MAX_LENGTH,
  CHALLENGE_CODE_MAX_LENGTH,
  CHALLENGE_CODE_MIN_LENGTH,
  CHALLENGE_DESCRIPTION_CODE_MAX_LENGTH,
  CHALLENGE_DESCRIPTION_MAX_LENGTH,
  CHALLENGE_FILE_NAME_MAX_LENGTH,
  CHALLENGE_SLUG_MAX_LENGTH,
  CHALLENGE_SLUG_MIN_LENGTH,
  CHALLENGE_SUMMARY_MAX_LENGTH,
  CHALLENGE_TITLE_MAX_LENGTH,
} from "./challenge.entity";
import { Difficulty } from "./difficulty.enum";

export const challengeSlugSchema = z
  .string()
  .min(CHALLENGE_SLUG_MIN_LENGTH)
  .max(CHALLENGE_SLUG_MAX_LENGTH);
export const challengeTitleSchema = z
  .string()
  .min(1)
  .max(CHALLENGE_TITLE_MAX_LENGTH);
export const challengeCategorySchema = z
  .string()
  .min(1)
  .max(CHALLENGE_CATEGORY_MAX_LENGTH);
export const challengeDifficultySchema = z.enum(Difficulty);
export const challengeSummarySchema = z
  .string()
  .min(1)
  .max(CHALLENGE_SUMMARY_MAX_LENGTH);
export const challengeNameSchema = z
  .string()
  .min(1)
  .max(CHALLENGE_CHALLENGE_MAX_LENGTH);
export const challengeDescriptionSchema = z
  .string()
  .min(1)
  .max(CHALLENGE_DESCRIPTION_MAX_LENGTH);
export const challengeDescriptionCodeSchema = z
  .string()
  .max(CHALLENGE_DESCRIPTION_CODE_MAX_LENGTH)
  .optional();
export const challengeFileNameSchema = z
  .string()
  .min(1)
  .max(CHALLENGE_FILE_NAME_MAX_LENGTH);
export const challengeCodeSchema = z
  .string()
  .min(CHALLENGE_CODE_MIN_LENGTH)
  .max(CHALLENGE_CODE_MAX_LENGTH);

export const challengeSchema = z.object({
  slug: challengeSlugSchema,
  title: challengeTitleSchema,
  category: challengeCategorySchema,
  difficulty: challengeDifficultySchema,
  summary: challengeSummarySchema,
  challenge: challengeNameSchema,
  description: challengeDescriptionSchema,
  descriptionCode: challengeDescriptionCodeSchema,
  starterFile: challengeFileNameSchema,
  starterCode: challengeCodeSchema,
  editorFile: challengeFileNameSchema,
  editorCode: challengeCodeSchema,
});

export type ChallengeSchema = z.infer<typeof challengeSchema>;
