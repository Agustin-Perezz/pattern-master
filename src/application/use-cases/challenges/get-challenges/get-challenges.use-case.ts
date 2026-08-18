import type { GetChallengesRepository } from "./get-challenges.repository.interface";
import type { GetChallengesRequestDto } from "./get-challenges.request.dto";
import { getChallengesRequestDto } from "./get-challenges.request.dto";
import type { GetChallengesResponseDto } from "./get-challenges.response.dto";

export class GetChallengesUseCase {
  constructor(private readonly repository: GetChallengesRepository) {}

  async execute(
    request: GetChallengesRequestDto = {},
  ): Promise<GetChallengesResponseDto> {
    getChallengesRequestDto.parse(request);
    const challenges = await this.repository.findAll();
    return { challenges };
  }
}
