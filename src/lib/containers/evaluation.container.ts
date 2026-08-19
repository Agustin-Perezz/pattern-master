import { EvaluateSubmissionUseCase } from "@/application/use-cases/evaluate-submission/evaluate-submission.use-case";
import { OpenaiEvaluateSubmissionRepository } from "@/infrastructure/ai/openai/openai-evaluate-submission.repository";

export function createEvaluationContainer() {
  const repository = new OpenaiEvaluateSubmissionRepository();
  return { evaluate: new EvaluateSubmissionUseCase(repository) };
}
