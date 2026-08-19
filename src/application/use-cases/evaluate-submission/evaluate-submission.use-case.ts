import type { Evaluation } from "@/domain/entities/evaluation.schema";
import type { EvaluateSubmissionRepository } from "./evaluate-submission.repository.interface";
import type { EvaluateSubmissionRequestDto } from "./evaluate-submission.request.dto";
import { evaluateSubmissionRequestDto } from "./evaluate-submission.request.dto";
import type { EvaluateSubmissionResponseDto } from "./evaluate-submission.response.dto";

export class EvaluateSubmissionUseCase {
  constructor(private readonly repository: EvaluateSubmissionRepository) {}

  async execute(
    request: EvaluateSubmissionRequestDto,
  ): Promise<EvaluateSubmissionResponseDto> {
    evaluateSubmissionRequestDto.parse(request);
    const evaluation: Evaluation = await this.repository.evaluate(
      request.code,
      request.challengeSlug,
      request.targetPattern,
    );

    return { evaluation };
  }
}
