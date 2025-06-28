import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');

  // Protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard') ||
      request.nextUrl.pathname.startsWith('/transactions') ||
      request.nextUrl.pathname.startsWith('/categories') ||
      request.nextUrl.pathname.startsWith('/credit-cards') ||
      request.nextUrl.pathname.startsWith('/analytics') ||
      request.nextUrl.pathname.startsWith('/settings')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect authenticated users from auth pages
  if (token && (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup')
  )) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/transactions/:path*',
    '/categories/:path*',
    '/credit-cards/:path*',
    '/analytics/:path*',
    '/settings/:path*',
    '/login',
    '/signup',
  ],
}; 