import type { SupabaseClient } from "@supabase/supabase-js";
import { GetChallengeBySlugUseCase } from "@/application/use-cases/challenges/get-challenge-by-slug/get-challenge-by-slug.use-case";
import { GetChallengesUseCase } from "@/application/use-cases/challenges/get-challenges/get-challenges.use-case";
import type { Database } from "@/infrastructure/database/postgres/database.types";
import { SupabaseGetChallengeBySlugRepository } from "@/infrastructure/database/postgres/repositories/challenges/supabase-get-challenge-by-slug.repository";
import { SupabaseGetChallengesRepository } from "@/infrastructure/database/postgres/repositories/challenges/supabase-get-challenges.repository";

export type ChallengeContainer = {
  list: GetChallengesUseCase;
  detail: GetChallengeBySlugUseCase;
};

export function createChallengeContainer(
  supabase: SupabaseClient<Database>,
): ChallengeContainer {
  const listRepository = new SupabaseGetChallengesRepository(supabase);
  const detailRepository = new SupabaseGetChallengeBySlugRepository(supabase);

  return {
    list: new GetChallengesUseCase(listRepository),
    detail: new GetChallengeBySlugUseCase(detailRepository),
  };
}
