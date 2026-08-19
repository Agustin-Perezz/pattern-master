import { Submission } from "@/domain/entities/submission.entity";
import type { CreateSubmissionRepository } from "./create-submission.repository.interface";
import type { CreateSubmissionRequestDto } from "./create-submission.request.dto";
import { createSubmissionRequestDto } from "./create-submission.request.dto";
import type { CreateSubmissionResponseDto } from "./create-submission.response.dto";

export class CreateSubmissionUseCase {
  constructor(private readonly repository: CreateSubmissionRepository) {}

  async execute(
    request: CreateSubmissionRequestDto,
  ): Promise<CreateSubmissionResponseDto> {
    const parsed = createSubmissionRequestDto.parse(request);
    const submission = Submission.create(parsed);
    const saved = await this.repository.create(submission);
    return { submission: saved };
  }
}
