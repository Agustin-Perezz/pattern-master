import type { Challenge } from "@/domain/entities/challenge.entity";

export type GetChallengesResponseDto = {
  challenges: Challenge[];
};
