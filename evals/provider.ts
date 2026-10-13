import { OpenaiEvaluateSubmissionRepository } from "@/infrastructure/ai/openai/openai-evaluate-submission.repository";
import {
  DEFAULT_PROMPT_VERSION_ID,
  getPromptVersion,
} from "@/infrastructure/ai/openai/prompts/evaluator-prompts";
import { computeCostUsd } from "./lib/pricing";

export const PROVIDER_ID = "pattern-master-evaluator";

export const CODE_VAR = "code";
export const CHALLENGE_SLUG_VAR = "challengeSlug";
export const TARGET_PATTERN_VAR = "targetPattern";

export type ProviderVars = Record<string, unknown>;

export type ProviderCallContext = {
  vars?: ProviderVars;
};

export type ProviderTokenUsage = {
  total: number;
  prompt: number;
  completion: number;
};

export type ProviderResponse = {
  output: string | null;
  tokenUsage: ProviderTokenUsage;
  cost: number;
  latencyMs: number;
  error?: string;
};

export type ApiProvider = {
  id(): string;
  callApi(
    prompt: string,
    context: ProviderCallContext,
  ): Promise<ProviderResponse>;
};

export const ZERO_TOKEN_USAGE: ProviderTokenUsage = {
  total: 0,
  prompt: 0,
  completion: 0,
};

export const ZERO_COST_USD = 0;

export function resolvePromptVersionId(prompt: string): string {
  const trimmed = typeof prompt === "string" ? prompt.trim() : "";
  return trimmed.length > 0 ? trimmed : DEFAULT_PROMPT_VERSION_ID;
}

export function requireNonEmptyVar(vars: ProviderVars, key: string): string {
  const value = vars[key];

  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Missing required test var "${key}"`);
  }

  return value;
}

export function readStringVar(vars: ProviderVars, key: string): string {
  const value = vars[key];

  if (typeof value !== "string") {
    throw new Error(`Missing required test var "${key}"`);
  }

  return value;
}

export default class EvaluatorProvider implements ApiProvider {
  id(): string {
    return PROVIDER_ID;
  }

  async callApi(
    prompt: string,
    context: ProviderCallContext,
  ): Promise<ProviderResponse> {
    const startedAt = performance.now();

    try {
      const versionId = resolvePromptVersionId(prompt);
      const repository = new OpenaiEvaluateSubmissionRepository(
        getPromptVersion(versionId),
      );

      const vars = context.vars ?? {};
      const { evaluation, telemetry } = await repository.evaluateWithTelemetry(
        // Empty `code` is intentional: the dataset ships `edge-empty` cases and
        // the evaluator is called directly, bypassing the request DTO's
        // min-length guard, so we measure the model's behavior on empty input.
        readStringVar(vars, CODE_VAR),
        requireNonEmptyVar(vars, CHALLENGE_SLUG_VAR),
        requireNonEmptyVar(vars, TARGET_PATTERN_VAR),
      );

      return {
        output: evaluation ? JSON.stringify(evaluation) : null,
        tokenUsage: {
          total: telemetry.inputTokens + telemetry.outputTokens,
          prompt: telemetry.inputTokens,
          completion: telemetry.outputTokens,
        },
        cost: computeCostUsd({
          model: telemetry.model,
          inputTokens: telemetry.inputTokens,
          outputTokens: telemetry.outputTokens,
        }),
        latencyMs: telemetry.latencyMs,
      };
    } catch (error) {
      return {
        output: null,
        tokenUsage: ZERO_TOKEN_USAGE,
        cost: ZERO_COST_USD,
        latencyMs: performance.now() - startedAt,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
