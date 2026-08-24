"use server";

import { redirect } from "next/navigation";
import { createAuthContainer } from "@/lib/containers/auth.container";
import { createChallengeContainer } from "@/lib/containers/challenge.container";
import { createSupabasePublicClient } from "@/lib/shared/infrastructure/supabase.public";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";

export async function getChallenges() {
  const supabase = createSupabasePublicClient();
  const container = createChallengeContainer(supabase);
  const { challenges } = await container.list.execute();
  return challenges.map((challenge) => challenge.toObject());
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  const { signOut } = createAuthContainer(supabase);
  await signOut.execute();
  redirect("/");
}
