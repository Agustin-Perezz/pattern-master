import type { Challenge } from "@/domain/entities/challenge.entity";

export interface GetChallengeBySlugRepository {
  findBySlug(slug: string): Promise<Challenge | null>;
}
