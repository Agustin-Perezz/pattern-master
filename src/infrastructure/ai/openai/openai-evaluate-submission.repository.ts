import { createOpenAI } from "@ai-sdk/openai";
import { generateObject, NoObjectGeneratedError } from "ai";
import type { EvaluateSubmissionRepository } from "@/application/use-cases/evaluate-submission/evaluate-submission.repository.interface";
import type { Evaluation } from "@/domain/entities/evaluation.schema";
import { evaluationSchema } from "@/domain/entities/evaluation.schema";
import { getOpenAiApiKey } from "@/lib/shared/infrastructure/env";
import type { EvaluateWithTelemetryResult } from "./evaluation-telemetry";
import { EvaluationSchemaError } from "./evaluation-telemetry";
import {
  DEFAULT_PROMPT_VERSION_ID,
  getPromptVersion,
} from "./prompts/evaluator-prompts";
import type { PromptVersion } from "./prompts/prompt-version";

export const OPENAI_EVALUATOR_MODEL = "gpt-4o-mini";

export class OpenaiEvaluateSubmissionRepository
  implements EvaluateSubmissionRepository
{
  constructor(
    private readonly promptVersion: PromptVersion = getPromptVersion(
      DEFAULT_PROMPT_VERSION_ID,
    ),
  ) {}

  async evaluate(
    code: string,
    challengeSlug: string,
    targetPattern: string,
  ): Promise<Evaluation> {
    const { evaluation } = await this.evaluateWithTelemetry(
      code,
      challengeSlug,
      targetPattern,
    );

    if (!evaluation) {
      throw new EvaluationSchemaError(
        "The model did not return a schema-valid evaluation",
      );
    }

    return evaluation;
  }

  async evaluateWithTelemetry(
    code: string,
    challengeSlug: string,
    targetPattern: string,
  ): Promise<EvaluateWithTelemetryResult> {
    const openai = createOpenAI({ apiKey: getOpenAiApiKey() });
    const startedAt = performance.now();

    try {
      const result = await generateObject({
        model: openai(OPENAI_EVALUATOR_MODEL),
        schema: evaluationSchema,
        system: this.promptVersion.system,
        prompt: this.promptVersion.buildPrompt(
          code,
          challengeSlug,
          targetPattern,
        ),
      });

      const latencyMs = performance.now() - startedAt;
      const parsed = evaluationSchema.safeParse(result.object);

      if (!parsed.success) {
        return {
          evaluation: null,
          telemetry: {
            latencyMs,
            inputTokens: result.usage.inputTokens ?? 0,
            outputTokens: result.usage.outputTokens ?? 0,
            model: OPENAI_EVALUATOR_MODEL,
            schemaValid: false,
          },
        };
      }

      return {
        evaluation: parsed.data,
        telemetry: {
          latencyMs,
          inputTokens: result.usage.inputTokens ?? 0,
          outputTokens: result.usage.outputTokens ?? 0,
          model: OPENAI_EVALUATOR_MODEL,
          schemaValid: true,
        },
      };
    } catch (error) {
      if (error instanceof NoObjectGeneratedError) {
        return {
          evaluation: null,
          telemetry: {
            latencyMs: performance.now() - startedAt,
            inputTokens: error.usage?.inputTokens ?? 0,
            outputTokens: error.usage?.outputTokens ?? 0,
            model: OPENAI_EVALUATOR_MODEL,
            schemaValid: false,
          },
        };
      }

      throw error;
    }
  }
}
