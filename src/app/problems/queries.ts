import { cacheLife } from "next/cache";

import { createChallengeContainer } from "@/lib/containers/challenge.container";
import { createSupabasePublicClient } from "@/lib/shared/infrastructure/supabase.public";

export async function getChallenges() {
  "use cache";
  cacheLife("hours");

  const supabase = createSupabasePublicClient();
  const container = createChallengeContainer(supabase);

  try {
    const { challenges } = await container.list.execute();
    return challenges.map((challenge) => challenge.toObject());
  } catch (error) {
    console.error("Failed to fetch challenges:", error);
    return [];
  }
}
