import type { Challenge } from "@/domain/entities/challenge.entity";

export type GetChallengeBySlugResponseDto = {
  challenge: Challenge;
};
