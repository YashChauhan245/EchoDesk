// ===========================================
// Logout API Route
// ===========================================
// GET /api/auth/logout
//
// Destroys the session cookie and redirects to the home page.
// ===========================================

import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/session';

export async function GET() {
  await destroySession();
  return NextResponse.redirect(
    new URL('/', process.env.NEXT_PUBLIC_APP_URL!)
  );
}
