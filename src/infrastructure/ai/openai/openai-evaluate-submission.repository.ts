import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import type { EvaluateSubmissionRepository } from "@/application/use-cases/evaluate-submission/evaluate-submission.repository.interface";
import type { Evaluation } from "@/domain/entities/evaluation.schema";
import { evaluationSchema } from "@/domain/entities/evaluation.schema";
import { getOpenAiApiKey } from "@/lib/shared/infrastructure/env";

const OPENAI_MODEL = "gpt-4o-mini";

const SYSTEM_PROMPT = `You are a code reviewer specializing in design patterns and clean architecture. You evaluate refactored TypeScript code from a practice exercise.`;

function buildEvaluationPrompt(
  code: string,
  challengeSlug: string,
  targetPattern: string,
): string {
  return `Evaluate the following TypeScript code for the "${challengeSlug}" challenge. The target pattern is "${targetPattern}".

Evaluate the code against these criteria:
1. Pattern correctness: Does the code correctly implement the ${targetPattern} pattern? Check the structure, roles, and relationships between the participants that the pattern defines.
2. Pattern completeness: Are all required participants of the ${targetPattern} pattern present and correctly related?
3. Clean architecture: Are there real violations of SOLID principles or clean architecture that are NOT inherent to the pattern itself?

Rules:
- Placeholder logic (console.log, stub methods) in a practice exercise is NOT a violation. Do not flag it.
- A factory or selection mechanism that couples a type discriminator to concrete implementations is NOT a violation when the pattern requires it. This is the pattern doing its job.
- Only flag clean architecture violations that exist OUTSIDE the pattern structure or that the pattern itself does not justify.
- If the code correctly implements the pattern and has no real violations, return an empty array for cleanArchitectureViolations. Do not invent violations to fill the slot.

Return a score from 0 to 100, whether the pattern was correctly applied, a short praise, critical feedback, and any clean architecture violations.

For criticalFeedback, include a focused code example in criticalFeedbackExample that shows how to improve the code. Show only the relevant snippet, not a full rewrite. If there is no critical feedback, set criticalFeedbackExample to null.

Code:
${code}`;
}

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
      system: SYSTEM_PROMPT,
      prompt: buildEvaluationPrompt(code, challengeSlug, targetPattern),
    });

    return result.object;
  }
}
