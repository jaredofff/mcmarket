import { createBrowserClient } from '@supabase/auth-helpers-nextjs';

export const isSupabaseConfigured = () => {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

const getSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { anonKey, url };
};

export const getSupabaseBrowserClient = () => {
  const config = getSupabaseConfig();
  if (!config) {
    return null;
  }

  return createBrowserClient(
    config.url,
    config.anonKey
  );
};
