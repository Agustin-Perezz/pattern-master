import { ChallengeNotFoundError } from "@/domain/entities/errors";
import type { GetChallengeBySlugRepository } from "./get-challenge-by-slug.repository.interface";
import type { GetChallengeBySlugRequestDto } from "./get-challenge-by-slug.request.dto";
import { getChallengeBySlugRequestDto } from "./get-challenge-by-slug.request.dto";
import type { GetChallengeBySlugResponseDto } from "./get-challenge-by-slug.response.dto";

export class GetChallengeBySlugUseCase {
  constructor(private readonly repository: GetChallengeBySlugRepository) {}

  async execute(
    request: GetChallengeBySlugRequestDto,
  ): Promise<GetChallengeBySlugResponseDto> {
    getChallengeBySlugRequestDto.parse(request);
    const challenge = await this.repository.findBySlug(request.slug);

    if (challenge === null) {
      throw new ChallengeNotFoundError(request.slug);
    }

    return { challenge };
  }
}
