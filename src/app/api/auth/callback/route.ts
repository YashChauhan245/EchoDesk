// ===========================================
// Auth Callback API Route
// ===========================================
// GET /api/auth/callback
//
// Scalekit redirects here after successful authentication.
// We exchange the authorization code for user info + tokens,
// create/update the user in MongoDB, and create a session.
//
// This is where the "magic" happens for multi-tenancy:
// The auth result contains the user's organizationId (oid),
// which we store and use to scope ALL subsequent data access.
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import getScalekitClient from '@/lib/scalekit';
import { createSession } from '@/lib/session';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  let origin = process.env.NEXT_PUBLIC_APP_URL || '';
  try {
    origin = new URL(request.url).origin;
  } catch (e) {
    console.error('Failed to parse request URL origin:', e);
  }
  const cleanOrigin = origin.endsWith('/') ? origin.slice(0, -1) : (origin || 'http://localhost:3000');

  // Handle authentication errors from Scalekit
  if (error) {
    console.error('Auth callback error:', error, errorDescription);
    const redirectUrl = new URL('/login', cleanOrigin);
    redirectUrl.searchParams.set('error', error);
    if (errorDescription) {
      redirectUrl.searchParams.set('details', errorDescription);
    }
    return NextResponse.redirect(redirectUrl);
  }

  if (!code) {
    const redirectUrl = new URL('/login', cleanOrigin);
    redirectUrl.searchParams.set('error', 'no_code');
    redirectUrl.searchParams.set('details', 'No authorization code received from authentication provider');
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const redirectUri = `${cleanOrigin}/api/auth/callback`;

    const scalekitClient = getScalekitClient();

    // Exchange the authorization code for user profile + tokens
    const authResult = await scalekitClient.authenticateWithCode(code, redirectUri);

    const { user } = authResult;

    if (!user || !user.id) {
      throw new Error('No user data returned from Scalekit');
    }

    // Connect to MongoDB
    await dbConnect();

    // The idToken contains the organization ID (oid claim)
    // We need to decode it to get the org ID
    // The user object from Scalekit contains basic profile info
    // For the org ID, we decode the idToken
    let organizationId = 'default_org';

    if (authResult.idToken) {
      try {
        // Decode the JWT payload (base64) without verification
        // (we trust it since it came directly from Scalekit)
        const payload = JSON.parse(
          Buffer.from(authResult.idToken.split('.')[1], 'base64').toString()
        );
        if (payload.oid) {
          organizationId = payload.oid;
        }
      } catch {
        console.warn('Could not decode idToken for org ID');
      }
    }

    // Upsert user in MongoDB (create if new, update if existing)
    await User.findOneAndUpdate(
      { scalekitUserId: user.id },
      {
        scalekitUserId: user.id,
        organizationId,
        email: user.email || '',
        name: user.name || user.email || 'User',
      },
      { upsert: true, new: true }
    );

    // Create our session (JWT cookie)
    await createSession({
      userId: user.id,
      organizationId,
      email: user.email || '',
      name: user.name || user.email || 'User',
    });

    // Redirect to dashboard
    return NextResponse.redirect(
      new URL('/dashboard', cleanOrigin)
    );
  } catch (err: any) {
    console.error('Auth callback processing error:', err);
    const redirectUrl = new URL('/login', cleanOrigin);
    redirectUrl.searchParams.set('error', 'callback_failed');
    redirectUrl.searchParams.set('details', err?.message || 'Failed to complete authentication exchange');
    return NextResponse.redirect(redirectUrl);
  }
}
