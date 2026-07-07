// ===========================================
// Session Management
// ===========================================
// Manages user sessions using signed JWT cookies.
//
// Flow:
// 1. User authenticates via Scalekit → we get user info + tokens
// 2. We create our OWN JWT containing userId, orgId, email, name
// 3. Store this JWT in an HttpOnly, Secure cookie
// 4. On each request, verify the cookie JWT to get session data
//
// Why our own JWT instead of Scalekit's access token directly?
// - Scalekit access tokens expire in 5 minutes (short-lived by design)
// - We'd need refresh token logic on every page load
// - Our session JWT gives us a simpler, longer-lived session
// - We still validate the user exists in our DB on sensitive operations
// ===========================================

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import type { SessionPayload } from '@/types';

const SESSION_SECRET = process.env.SESSION_SECRET!;
const COOKIE_NAME = 'echodesk_session';
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

// SESSION_SECRET is validated at runtime, not at import time,
// to avoid build errors when env vars aren't set during `next build`.

/**
 * Create a session by setting a signed JWT cookie.
 * Called after successful Scalekit authentication.
 */
export async function createSession(payload: SessionPayload): Promise<void> {
  const token = jwt.sign(payload, SESSION_SECRET, {
    expiresIn: SESSION_MAX_AGE,
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

/**
 * Get the current session from the cookie.
 * Returns the session payload if valid, null otherwise.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const payload = jwt.verify(sessionCookie.value, SESSION_SECRET) as SessionPayload;
    return payload;
  } catch {
    return null; // Token expired or invalid
  }
}

/**
 * Destroy the session by clearing the cookie.
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
