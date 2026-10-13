export const GPT_4O_MINI_MODEL_ID = "gpt-4o-mini";

export const TOKENS_PER_MILLION = 1_000_000;

export const GPT_4O_MINI_INPUT_USD_PER_MILLION_TOKENS = 0.15;
export const GPT_4O_MINI_OUTPUT_USD_PER_MILLION_TOKENS = 0.6;

export type ModelPricing = {
  inputUsdPerMillionTokens: number;
  outputUsdPerMillionTokens: number;
};

export type TokenUsage = {
  model: string;
  inputTokens: number;
  outputTokens: number;
};

export const MODEL_PRICING: Readonly<Record<string, ModelPricing>> = {
  [GPT_4O_MINI_MODEL_ID]: {
    inputUsdPerMillionTokens: GPT_4O_MINI_INPUT_USD_PER_MILLION_TOKENS,
    outputUsdPerMillionTokens: GPT_4O_MINI_OUTPUT_USD_PER_MILLION_TOKENS,
  },
};

export function computeCostUsd(usage: TokenUsage): number {
  const pricing = MODEL_PRICING[usage.model];

  if (!pricing) {
    throw new Error(`No pricing configured for model "${usage.model}"`);
  }

  const inputCost =
    (usage.inputTokens / TOKENS_PER_MILLION) * pricing.inputUsdPerMillionTokens;
  const outputCost =
    (usage.outputTokens / TOKENS_PER_MILLION) *
    pricing.outputUsdPerMillionTokens;

  return inputCost + outputCost;
}
