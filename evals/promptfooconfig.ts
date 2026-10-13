import { PROMPT_VERSIONS } from "@/infrastructure/ai/openai/prompts/evaluator-prompts";
import {
  RANGE_METRIC,
  rangeAssertion,
  SCHEMA_METRIC,
  schemaAssertion,
} from "./lib/assertions";
import { dataset } from "./lib/dataset";

/**
 * The prompt axis is the list of registered prompt-version ids. The provider
 * receives the rendered prompt string and resolves the real PromptVersion
 * module, so the prompts themselves stay in `src/` as the single source of
 * truth.
 */
export const PROMPT_IDS: string[] = Object.keys(PROMPT_VERSIONS);

export const PROVIDER_PATH = "file://provider.ts";

export const CASE_ID_VAR = "caseId";
export const CODE_VAR = "code";
export const CHALLENGE_SLUG_VAR = "challengeSlug";
export const TARGET_PATTERN_VAR = "targetPattern";
export const EXPECTED_MIN_VAR = "expectedMin";
export const EXPECTED_MAX_VAR = "expectedMax";

export default {
  prompts: PROMPT_IDS,
  providers: [PROVIDER_PATH],
  tests: dataset.map((entry) => ({
    description: entry.id,
    vars: {
      [CODE_VAR]: entry.code,
      [CHALLENGE_SLUG_VAR]: entry.challengeSlug,
      [TARGET_PATTERN_VAR]: entry.targetPattern,
      [EXPECTED_MIN_VAR]: entry.expectedScoreRange[0],
      [EXPECTED_MAX_VAR]: entry.expectedScoreRange[1],
      [CASE_ID_VAR]: entry.id,
    },
    assert: [
      { type: "javascript", value: rangeAssertion, metric: RANGE_METRIC },
      { type: "javascript", value: schemaAssertion, metric: SCHEMA_METRIC },
    ],
  })),
};
