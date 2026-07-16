// ===========================================
// Logout API Route
// ===========================================
// GET /api/auth/logout
//
// Destroys the session cookie and redirects to the home page.
// ===========================================

import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/session';

export async function GET(request: Request) {
  await destroySession();
  let origin = process.env.NEXT_PUBLIC_APP_URL || '';
  try {
    origin = new URL(request.url).origin;
  } catch (e) {
    console.error('Failed to parse request URL origin:', e);
  }
  const cleanOrigin = origin.endsWith('/') ? origin.slice(0, -1) : (origin || 'http://localhost:3000');

  return NextResponse.redirect(
    new URL('/', cleanOrigin)
  );
}
