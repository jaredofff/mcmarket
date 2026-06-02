import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { canAccessAdmin, canAccessCreator, getRoleFromMetadata } from './lib/roles';

const getSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { anonKey, url };
};

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const isOnDashboard = request.nextUrl.pathname.startsWith('/dashboard');
  const isOnAdmin = request.nextUrl.pathname.startsWith('/admin');
  const isOnCreator = request.nextUrl.pathname.startsWith('/creator');
  const isOnProtectedRoute = isOnDashboard || isOnAdmin || isOnCreator;

  const supabaseConfig = getSupabaseConfig();

  if (!supabaseConfig) {
    if (isOnProtectedRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/auth';
      redirectUrl.searchParams.set('next', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  }

  const supabase = createServerClient(
    supabaseConfig.url,
    supabaseConfig.anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession();

  if (isOnProtectedRoute) {
    if (!session) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/auth';
      redirectUrl.searchParams.set('next', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  const role = getRoleFromMetadata(session?.user.app_metadata, session?.user.user_metadata);

  if (isOnAdmin && !canAccessAdmin(role)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    redirectUrl.searchParams.set('forbidden', 'admin');
    return NextResponse.redirect(redirectUrl);
  }

  if (isOnCreator && !canAccessCreator(role)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    redirectUrl.searchParams.set('forbidden', 'creator');
    return NextResponse.redirect(redirectUrl);
  }

  // If already logged in and going to auth page, redirect to dashboard
  if (request.nextUrl.pathname.startsWith('/auth') && session) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/creator/:path*',
    '/auth',
  ],
};
