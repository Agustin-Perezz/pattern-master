import type { SupabaseClient } from "@supabase/supabase-js";
import type { GetChallengeBySlugRepository } from "@/application/use-cases/challenges/get-challenge-by-slug/get-challenge-by-slug.repository.interface";
import type { Challenge } from "@/domain/entities/challenge.entity";
import type { Database } from "../../database.types";
import { challengeMapper } from "../../mappers/challenge.mapper";

const CHALLENGES_TABLE = "challenges";
const SLUG_COLUMN = "slug";

export class SupabaseGetChallengeBySlugRepository
  implements GetChallengeBySlugRepository
{
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findBySlug(slug: string): Promise<Challenge | null> {
    const { data, error } = await this.supabase
      .from(CHALLENGES_TABLE)
      .select("*")
      .eq(SLUG_COLUMN, slug)
      .single();

    if (error || data === null) {
      return null;
    }

    return challengeMapper.toDomain(data);
  }
}
