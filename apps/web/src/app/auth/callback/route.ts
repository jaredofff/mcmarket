import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const getSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { anonKey, url };
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  const supabaseConfig = getSupabaseConfig();

  if (code && supabaseConfig) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      supabaseConfig.url,
      supabaseConfig.anonKey,
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
              // Ignore - setAll can fail during rendering/response redirection
            }
          },
        },
      }
    );
    
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && user) {
      // Sync with the backend database
      const discordId = user.identities?.find(i => i.provider === 'discord')?.id 
        || user.user_metadata?.provider_id 
        || user.user_metadata?.sub 
        || '';
      const name = user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.username || 'discord-user';
      const email = user.email || null;
      const image = user.user_metadata?.avatar_url || null;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (apiUrl) {
        try {
          await fetch(`${apiUrl.replace(/\/$/, '')}/auth/upsert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              discordId,
              name,
              email,
              image,
            }),
          });
        } catch (e) {
          console.error('Error upserting user in OAuth callback:', e);
        }
      }

      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return NextResponse.redirect(new URL('/auth/auth-code-error', request.url));
}
