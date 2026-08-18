"use server";

import { ChallengeNotFoundError } from "@/domain/entities/errors";
import { createChallengeContainer } from "@/lib/containers/challenge.container";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";

export async function getChallengeBySlug(slug: string) {
  const supabase = await createSupabaseServerClient();
  const container = createChallengeContainer(supabase);

  try {
    const { challenge } = await container.detail.execute({ slug });
    return { found: true as const, challenge: challenge.toObject() };
  } catch (error) {
    if (error instanceof ChallengeNotFoundError) {
      return { found: false as const, challenge: null };
    }

    throw error;
  }
}
