import type { SupabaseClient } from "@supabase/supabase-js";
import type { GetChallengesRepository } from "@/application/use-cases/challenges/get-challenges/get-challenges.repository.interface";
import type { Challenge } from "@/domain/entities/challenge.entity";
import type { Database } from "../../database.types";
import { challengeMapper } from "../../mappers/challenge.mapper";

export class SupabaseGetChallengesRepository
  implements GetChallengesRepository
{
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findAll(): Promise<Challenge[]> {
    const { data, error } = await this.supabase
      .from("challenges")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch challenges: ${error.message}`);
    }

    return (data ?? []).map((row) => challengeMapper.toDomain(row));
  }
}
