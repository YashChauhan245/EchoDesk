// ===========================================
// Login API Route
// ===========================================
// GET /api/auth/login
//
// Generates a Scalekit authorization URL and redirects the user
// to Scalekit's hosted login/signup page.
//
// Flow:
// 1. User clicks "Login" button on our site
// 2. Browser hits GET /api/auth/login
// 3. We generate an authorization URL via Scalekit SDK
// 4. We redirect the browser to Scalekit's hosted login page
// 5. User authenticates (signup or login)
// 6. Scalekit redirects back to /api/auth/callback with a code
// ===========================================

import { NextResponse } from 'next/server';
import getScalekitClient from '@/lib/scalekit';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider') || undefined;
    const loginHint = searchParams.get('login_hint') || undefined;

    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`;

    // Generate the authorization URL with required scopes
    // - openid: Required for OIDC
    // - profile: User's name
    // - email: User's email
    // - offline_access: Get refresh tokens for persistent sessions
    const scalekitClient = getScalekitClient();
    const authorizationUrl = scalekitClient.getAuthorizationUrl(redirectUri, {
      scopes: ['openid', 'profile', 'email', 'offline_access'],
      provider,
      loginHint: loginHint || undefined,
    });

    return NextResponse.redirect(authorizationUrl);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.redirect(
      new URL('/?error=auth_failed', process.env.NEXT_PUBLIC_APP_URL!)
    );
  }
}
