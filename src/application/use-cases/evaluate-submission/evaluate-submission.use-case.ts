import type { EvaluateSubmissionRepository } from "./evaluate-submission.repository.interface";
import type { EvaluateSubmissionRequestDto } from "./evaluate-submission.request.dto";
import { evaluateSubmissionRequestDto } from "./evaluate-submission.request.dto";
import type { EvaluateSubmissionResponseDto } from "./evaluate-submission.response.dto";

export class EvaluateSubmissionUseCase {
  constructor(private readonly repository: EvaluateSubmissionRepository) {}

  async execute(
    request: EvaluateSubmissionRequestDto,
  ): Promise<EvaluateSubmissionResponseDto> {
    const parsed = evaluateSubmissionRequestDto.parse(request);
    const evaluation = await this.repository.evaluate(
      parsed.code,
      parsed.challengeSlug,
      parsed.targetPattern,
    );
    return { evaluation };
  }
}
