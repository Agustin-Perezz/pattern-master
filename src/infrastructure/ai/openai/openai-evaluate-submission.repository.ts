import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import type { EvaluateSubmissionRepository } from "@/application/use-cases/evaluate-submission/evaluate-submission.repository.interface";
import type { Evaluation } from "@/domain/entities/evaluation.schema";
import { evaluationSchema } from "@/domain/entities/evaluation.schema";
import { getOpenAiApiKey } from "@/lib/shared/infrastructure/env";

const OPENAI_MODEL = "gpt-4o-mini";

export class OpenaiEvaluateSubmissionRepository
  implements EvaluateSubmissionRepository
{
  async evaluate(
    code: string,
    challengeSlug: string,
    targetPattern: string,
  ): Promise<Evaluation> {
    const openai = createOpenAI({ apiKey: getOpenAiApiKey() });
    const result = await generateObject({
      model: openai(OPENAI_MODEL),
      schema: evaluationSchema,
      prompt: `You are a code reviewer specializing in design patterns and clean architecture. Evaluate the following TypeScript code for the "${challengeSlug}" challenge. The target pattern is "${targetPattern}". Return a score from 0 to 100, whether the pattern was correctly applied, a short praise, critical feedback, and any clean architecture violations.\n\nCode:\n${code}`,
    });

    return result.object;
  }
}
