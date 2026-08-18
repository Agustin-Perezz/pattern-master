import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/infrastructure/database/postgres/database.types";
import { supabaseUrl } from "./env";

const SERVICE_ROLE_KEY: string = (() => {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY — set it in your .env file",
    );
  }
  return key;
})();

export function createSupabaseServiceRoleClient() {
  return createClient<Database>(supabaseUrl, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}
