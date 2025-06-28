import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for auth token in cookies (this is what we set in our API service)
  const authToken = request.cookies.get('auth-token')?.value;
  
  // Also check Authorization header as fallback
  const authHeader = request.headers.get('authorization')?.replace('Bearer ', '');

  const hasValidToken = authToken || authHeader;

  // Protected routes - require authentication
  if (request.nextUrl.pathname.startsWith('/dashboard') ||
      request.nextUrl.pathname.startsWith('/transactions') ||
      request.nextUrl.pathname.startsWith('/categories') ||
      request.nextUrl.pathname.startsWith('/credit-cards') ||
      request.nextUrl.pathname.startsWith('/analytics') ||
      request.nextUrl.pathname.startsWith('/settings')) {
    if (!hasValidToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Redirect authenticated users from auth pages to dashboard
  if (hasValidToken && (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup')
  )) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // For the home page, let it handle authentication client-side
  // This allows the home page to show login form or redirect to dashboard
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