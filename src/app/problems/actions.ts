"use server";

import { redirect } from "next/navigation";
import { createAuthContainer } from "@/lib/containers/auth.container";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  const { signOut } = createAuthContainer(supabase);
  await signOut.execute();
  redirect("/");
}
