import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !/^https?:\/\//i.test(url) || !key) {
    throw new Error(
      "Supabase environment variables are missing or invalid."
    );
  }

  return createClient(url, key);
}