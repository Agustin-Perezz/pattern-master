"use server";

import { createChallengeContainer } from "@/lib/containers/challenge.container";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";

export async function getChallenges() {
  const supabase = await createSupabaseServerClient();
  const container = createChallengeContainer(supabase);
  const { challenges } = await container.list.execute();
  return challenges.map((challenge) => challenge.toObject());
}
