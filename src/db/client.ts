import { createClient } from "@supabase/supabase-js";

export const getDb = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;

  if (!url || !key) {
    throw new Error("SUPABASE_URL and/or SUPABASE_KEY missing");
  }

  return createClient(url, key);
};
