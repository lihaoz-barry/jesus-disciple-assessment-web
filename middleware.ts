import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Get all cookies and check for auth tokens
  const cookies = req.cookies.getAll();
  const authCookies = cookies.filter(cookie =>
    cookie.name.includes('auth-token') ||
    cookie.name.includes('sb-') ||
    cookie.name.includes('supabase')
  );

  const isAuthenticated = authCookies.length > 0;

  // Protect dashboard and assessment routes
  if (req.nextUrl.pathname.startsWith('/dashboard') ||
      req.nextUrl.pathname.startsWith('/assessment') ||
      req.nextUrl.pathname.startsWith('/profile')) {
    if (!isAuthenticated) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/assessment/:path*', '/login', '/register'],
};
