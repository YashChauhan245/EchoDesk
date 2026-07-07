// ===========================================
// Settings API Route
// ===========================================
// GET  /api/settings — Fetch chatbot settings for the authenticated org
// POST /api/settings — Create or update chatbot settings (upsert)
//
// Both routes verify the session and scope data access to the
// user's organization. This is how multi-tenant isolation works:
// the organizationId from the session token gates every query.
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import dbConnect from '@/lib/db';
import ChatbotSettings from '@/models/ChatbotSettings';

// ---- GET: Fetch settings ----
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const settings = await ChatbotSettings.findOne({
      organizationId: session.organizationId,
    }).lean();

    return NextResponse.json({ settings: settings || null });
  } catch (error) {
    console.error('GET /api/settings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// ---- POST: Create or update settings ----
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { businessName, email, knowledgeBase, widgetColor, welcomeMessage } =
      body;

    // Validation
    if (!businessName || !businessName.trim()) {
      return NextResponse.json(
        { error: 'Business name is required' },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!knowledgeBase || !knowledgeBase.trim()) {
      return NextResponse.json(
        { error: 'Knowledge base is required' },
        { status: 400 }
      );
    }

    if (knowledgeBase.length > 50000) {
      return NextResponse.json(
        { error: 'Knowledge base cannot exceed 50,000 characters' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Upsert: create if doesn't exist, update if it does
    const settings = await ChatbotSettings.findOneAndUpdate(
      { organizationId: session.organizationId },
      {
        organizationId: session.organizationId,
        businessName: businessName.trim(),
        email: email.trim(),
        knowledgeBase: knowledgeBase.trim(),
        widgetColor: widgetColor || '#6366f1',
        welcomeMessage:
          welcomeMessage || 'Hi there! 👋 How can I help you today?',
      },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({ settings, message: 'Settings saved successfully' });
  } catch (error) {
    console.error('POST /api/settings error:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
