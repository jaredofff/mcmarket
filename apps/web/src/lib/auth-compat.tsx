'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from './auth-supabase-client';
import type { Session } from '@supabase/supabase-js';
import { DEFAULT_ROLE, getRoleFromMetadata, normalizeRole, type AppRole } from './roles';

export interface CustomSession {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
    discordId?: string;
    role?: AppRole;
  } | null;
  expires: string;
}

type AuthContextType = {
  data: CustomSession | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
};

const AuthContext = createContext<AuthContextType>({
  data: null,
  status: 'loading',
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<CustomSession | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStatus('unauthenticated');
      return;
    }

    // Map supabase session to our NextAuth-like session
    const mapSession = async (supabaseSession: Session | null): Promise<CustomSession | null> => {
      if (!supabaseSession || !supabaseSession.user) return null;
      
      const user = supabaseSession.user;
      
      // Extract Discord ID
      const discordId = user.identities?.find(i => i.provider === 'discord')?.id 
        || user.user_metadata?.provider_id 
        || user.user_metadata?.sub 
        || '';

      let role = getRoleFromMetadata(user.app_metadata, user.user_metadata);

      if (role === DEFAULT_ROLE && process.env.NEXT_PUBLIC_API_URL) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const res = await fetch(`${apiUrl.replace(/\/$/, '')}/auth/upsert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              discordId: discordId,
              name: user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.username || 'discord-user',
              email: user.email || null,
              image: user.user_metadata?.avatar_url || null,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            role = normalizeRole(data?.role);
          }
        } catch (e) {
          console.error('Error fetching role from backend API:', e);
        }
      }

      return {
        user: {
          id: user.id,
          email: user.email ?? null,
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.username || 'Usuario',
          image: user.user_metadata?.avatar_url || null,
          discordId,
          role,
        },
        expires: supabaseSession.expires_at ? new Date(supabaseSession.expires_at * 1000).toISOString() : '',
      };
    };

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const mapped = await mapSession(session);
      setSession(mapped);
      setStatus(mapped ? 'authenticated' : 'unauthenticated');
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        const mapped = await mapSession(session);
        setSession(mapped);
        setStatus('authenticated');
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setStatus('unauthenticated');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ data: session, status }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSession() {
  return useContext(AuthContext);
}

export const signIn = async (provider: 'discord', options?: { callbackUrl?: string }) => {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    console.error('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    return;
  }

  const next = options?.callbackUrl || '/dashboard';
  
  // Format the redirect URL back to the callback route
  const origin = window.location.origin;
  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
  
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo,
    },
  });
  
  if (error) {
    console.error('Sign in error:', error);
  }
};

export const signOut = async (options?: { callbackUrl?: string; redirectTo?: string }) => {
  const supabase = getSupabaseBrowserClient();
  const redirectUrl = options?.callbackUrl || options?.redirectTo || '/';

  if (!supabase) {
    window.location.href = redirectUrl;
    return;
  }

  await supabase.auth.signOut();
  window.location.href = redirectUrl;
};
