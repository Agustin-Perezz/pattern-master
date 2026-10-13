import { z } from "zod";

export const QUALITY_LEVELS = [
  "clean",
  "partial",
  "unchanged",
  "wrong-pattern",
  "edge-empty",
  "edge-injection",
] as const;

export type QualityLevel = (typeof QUALITY_LEVELS)[number];

export const qualityLevelSchema = z.enum(QUALITY_LEVELS);

export const SCORE_MIN = 0;
export const SCORE_MAX = 100;

export const scoreRangeSchema = z.tuple([
  z.number().int().min(SCORE_MIN).max(SCORE_MAX),
  z.number().int().min(SCORE_MIN).max(SCORE_MAX),
]);

export const datasetCaseSchema = z.object({
  id: z.string().min(1),
  problem: z.string().min(1),
  challengeSlug: z.string().min(1),
  targetPattern: z.string().min(1),
  qualityLevel: qualityLevelSchema,
  code: z.string(),
  expectedScoreRange: scoreRangeSchema,
  expectedFeedbackTags: z.array(z.string().min(1)),
  notes: z.string().min(1),
});

export type DatasetCase = z.infer<typeof datasetCaseSchema>;

export const datasetSchema = z.array(datasetCaseSchema);

export type Dataset = z.infer<typeof datasetSchema>;

export const CHALLENGE_SLUGS = [
  "refactor-the-payment-processor",
  "tame-the-notification-service",
  "build-a-widget-factory",
  "one-config-to-rule-them-all",
  "wrap-the-legacy-api",
  "decorate-your-coffee",
] as const;

export const PROBLEM_KEYS = [
  "payment",
  "notification",
  "widget",
  "config",
  "gateway",
  "coffee",
] as const;

export const CASES_PER_PROBLEM = 6;
export const TOTAL_DATASET_CASES = 36;
