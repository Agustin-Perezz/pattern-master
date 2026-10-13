import { EvaluateSubmissionUseCase } from "@/application/use-cases/evaluate-submission/evaluate-submission.use-case";
import { OpenaiEvaluateSubmissionRepository } from "@/infrastructure/ai/openai/openai-evaluate-submission.repository";
import {
  DEFAULT_PROMPT_VERSION_ID,
  getPromptVersion,
} from "@/infrastructure/ai/openai/prompts/evaluator-prompts";

export function createEvaluationContainer() {
  const repository = new OpenaiEvaluateSubmissionRepository(
    getPromptVersion(DEFAULT_PROMPT_VERSION_ID),
  );
  return { evaluate: new EvaluateSubmissionUseCase(repository) };
}
