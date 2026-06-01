import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  const isOnDashboard = request.nextUrl.pathname.startsWith('/dashboard');
  const isOnAdmin = request.nextUrl.pathname.startsWith('/admin');

  if (isOnDashboard || isOnAdmin) {
    if (!session) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/auth';
      redirectUrl.searchParams.set('next', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
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
    '/auth',
  ],
};
