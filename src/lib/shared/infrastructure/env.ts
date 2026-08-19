const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!url) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL — set it in your .env file",
  );
}

if (!publishableKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY — set it in your .env file",
  );
}

if (!openaiApiKey) {
  throw new Error("Missing OPENAI_API_KEY — set it in your .env file");
}

export const supabaseUrl = url;
export const supabasePublishableKey = publishableKey;
export const OPENAI_API_KEY = openaiApiKey;
