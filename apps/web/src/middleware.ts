import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Middleware is running on edge runtime and cannot use NextAuth
  // Auth validation is handled client-side on protected routes
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
