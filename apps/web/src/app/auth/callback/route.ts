import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
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

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
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

      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return NextResponse.redirect(new URL('/auth/auth-code-error', request.url));
}
