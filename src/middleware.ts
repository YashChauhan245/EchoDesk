// ===========================================
// Next.js Middleware — Route Protection
// ===========================================
// This middleware runs BEFORE every page render.
// It intercepts requests to protected routes (/dashboard/*)
// and checks for a valid session cookie.
//
// If no valid session → redirect to /login
// Public routes (landing, login, APIs, chatbot assets) pass through.
//
// NOTE: Middleware runs in the Edge Runtime, so we can't use
// the full jsonwebtoken library here. Instead, we just check
// if the cookie EXISTS. The actual JWT verification happens
// in the API routes/server components where we have full Node.js.
// ===========================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/api/auth',
  '/api/chat',
  '/api/widget',
  '/chatbot.js',
  '/test',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );

  if (isPublic) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get('echodesk_session');

  if (!sessionCookie?.value) {
    // No session → redirect directly to local custom login page
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Cookie exists → allow through (JWT verified in server components)
  return NextResponse.next();
}

export const config = {
  // Run middleware on all routes except static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
