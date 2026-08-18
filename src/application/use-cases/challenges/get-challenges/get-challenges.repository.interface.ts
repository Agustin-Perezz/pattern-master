import type { Challenge } from "@/domain/entities/challenge.entity";

export interface GetChallengesRepository {
  findAll(): Promise<Challenge[]>;
}
