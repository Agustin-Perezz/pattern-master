import { ChallengeNotFoundError } from "@/domain/entities/errors";
import { createChallengeContainer } from "@/lib/containers/challenge.container";
import { createSupabasePublicClient } from "@/lib/shared/infrastructure/supabase.public";

export async function getChallengeBySlug(slug: string) {
  const supabase = createSupabasePublicClient();
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
