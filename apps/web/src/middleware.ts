import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Solo proteger rutas /admin
  if (pathname.startsWith('/admin')) {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const userRole = (session.user.role ?? 'USER').toString().toUpperCase();
    if (userRole !== 'ADMIN' && userRole !== 'CEO') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
