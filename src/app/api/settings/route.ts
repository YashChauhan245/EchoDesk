// ===========================================
// Settings API Route
// ===========================================
// GET  /api/settings — Fetch all chatbots configured for the organization
// POST /api/settings — Create or update a specific chatbot
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import dbConnect from '@/lib/db';
import ChatbotSettings from '@/models/ChatbotSettings';
import Subscription from '@/models/Subscription';

// ---- GET: Fetch all chatbots ----
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Fetch all chatbots for this organization
    const chatbots = await ChatbotSettings.find({
      organizationId: session.organizationId,
    }).lean();

    // Fetch subscription details to check limits on client
    const subscription = await Subscription.findOne({
      organizationId: session.organizationId,
    }).lean();

    return NextResponse.json({ chatbots: chatbots || [], subscription: subscription || null });
  } catch (error) {
    console.error('GET /api/settings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chatbot settings' },
      { status: 500 }
    );
  }
}

// ---- POST: Create or update a chatbot ----
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      chatbotId,
      chatbotName,
      businessName,
      email,
      knowledgeBase,
      widgetColor,
      welcomeMessage,
    } = body;

    // Validation
    if (!chatbotName || !chatbotName.trim()) {
      return NextResponse.json(
        { error: 'Chatbot name is required' },
        { status: 400 }
      );
    }

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
    
    let settings;

    if (chatbotId) {
      // ---- UPDATE EXISTING CHATBOT ----
      settings = await ChatbotSettings.findOneAndUpdate(
        { _id: chatbotId, organizationId: session.organizationId },
        {
          chatbotName: chatbotName.trim(),
          businessName: businessName.trim(),
          email: email.trim(),
          knowledgeBase: knowledgeBase.trim(),
          widgetColor: widgetColor || '#6366f1',
          welcomeMessage: welcomeMessage || 'Hi there! 👋 How can I help you today?',
        },
        { new: true, runValidators: true }
      );

      if (!settings) {
        return NextResponse.json(
          { error: 'Chatbot not found' },
          { status: 404 }
        );
      }
    } else {
      // ---- CREATE NEW CHATBOT ----
      // Check active subscription limits
      let subscription = await Subscription.findOne({
        organizationId: session.organizationId,
      });

      if (!subscription) {
        subscription = await Subscription.create({
          organizationId: session.organizationId,
          plan: 'FREE',
          status: 'active',
          limits: {
            maxChatbots: 1,
            maxWebsites: 1,
            maxMessages: 500,
          },
          usage: {
            messagesUsed: 0,
            chatbotsCreated: 0,
          },
        });
      }

      // Count currently created chatbots
      const chatbotsCount = await ChatbotSettings.countDocuments({
        organizationId: session.organizationId,
      });

      if (chatbotsCount >= subscription.limits.maxChatbots) {
        return NextResponse.json(
          { error: `Chatbot creation limit reached (${subscription.limits.maxChatbots} maximum). Please upgrade your plan.` },
          { status: 403 }
        );
      }

      // Create new settings document
      settings = await ChatbotSettings.create({
        organizationId: session.organizationId,
        chatbotName: chatbotName.trim(),
        businessName: businessName.trim(),
        email: email.trim(),
        knowledgeBase: knowledgeBase.trim(),
        widgetColor: widgetColor || '#6366f1',
        welcomeMessage: welcomeMessage || 'Hi there! 👋 How can I help you today?',
      });

      // Update subscription usage counter
      subscription.usage.chatbotsCreated = chatbotsCount + 1;
      await subscription.save();
    }

    return NextResponse.json({ settings, message: 'Settings saved successfully' });
  } catch (error) {
    console.error('POST /api/settings error:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
