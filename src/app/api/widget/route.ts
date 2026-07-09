// ===========================================
// Widget Config API Route
// ===========================================
// GET /api/widget?orgId=xxx
//
// Public endpoint that returns the widget configuration
// (color, welcome message, business name) for the chatbot.js script.
// Called when the widget first loads on a customer's website.
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ChatbotSettings from '@/models/ChatbotSettings';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  try {
    const orgId = request.nextUrl.searchParams.get('orgId');

    if (!orgId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    await dbConnect();

    // Check if orgId query param is a 24-character hex Mongoose ObjectId (chatbotId)
    // or a legacy organizationId
    let query = {};
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(orgId);

    if (isValidObjectId) {
      query = { _id: orgId };
    } else {
      query = { organizationId: orgId };
    }

    const settings = await ChatbotSettings.findOne(
      query,
      { businessName: 1, widgetColor: 1, welcomeMessage: 1 } // Project only needed fields
    ).lean();

    if (!settings) {
      return NextResponse.json(
        { error: 'Chatbot not configured' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        businessName: settings.businessName,
        widgetColor: settings.widgetColor,
        welcomeMessage: settings.welcomeMessage,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('GET /api/widget error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch widget config' },
      { status: 500, headers: corsHeaders }
    );
  }
}
