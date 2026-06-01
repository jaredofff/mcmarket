import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const getSupabaseServerClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore - setAll can fail when called in a Server Component render
          }
        },
      },
    }
  );
};

export const getCurrentSession = async () => {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

export const getCurrentUser = async () => {
  const session = await getCurrentSession();
  return session?.user ?? null;
};
