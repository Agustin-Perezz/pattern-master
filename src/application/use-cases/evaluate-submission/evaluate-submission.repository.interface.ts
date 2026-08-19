import type { Evaluation } from "@/domain/entities/evaluation.schema";

export interface EvaluateSubmissionRepository {
  evaluate(
    code: string,
    challengeSlug: string,
    targetPattern: string,
  ): Promise<Evaluation>;
}
