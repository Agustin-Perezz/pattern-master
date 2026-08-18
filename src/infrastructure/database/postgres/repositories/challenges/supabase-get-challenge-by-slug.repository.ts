import type { SupabaseClient } from "@supabase/supabase-js";
import type { GetChallengeBySlugRepository } from "@/application/use-cases/challenges/get-challenge-by-slug/get-challenge-by-slug.repository.interface";
import type { Challenge } from "@/domain/entities/challenge.entity";
import type { Database } from "../../database.types";
import { challengeMapper } from "../../mappers/challenge.mapper";

export class SupabaseGetChallengeBySlugRepository
  implements GetChallengeBySlugRepository
{
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findBySlug(slug: string): Promise<Challenge | null> {
    const { data, error } = await this.supabase
      .from("challenges")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || data === null) {
      return null;
    }

    return challengeMapper.toDomain(data);
  }
}
