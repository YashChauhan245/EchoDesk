// ===========================================
// Chat API Route
// ===========================================
// POST /api/chat
//
// This is the PUBLIC endpoint called by the embeddable chatbot.js
// script from ANY website. No session authentication required —
// instead, it uses the organizationId to identify the business.
//
// Request Flow:
// 1. chatbot.js sends { organizationId, message, sessionId }
// 2. We look up ChatbotSettings for that org
// 3. We load the last 20 messages for conversation context
// 4. We build a system prompt with the business's knowledge base
// 5. We send the prompt + conversation history to Gemini AI
// 6. We save both the user message and AI response
// 7. We return the AI response to chatbot.js
//
// CORS headers are set to allow requests from ANY origin,
// since the script could be embedded on any website.
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import dbConnect from '@/lib/db';
import ChatbotSettings from '@/models/ChatbotSettings';
import Conversation from '@/models/Conversation';

// Initialize Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// CORS headers for cross-origin requests from embedded scripts
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationId, message, sessionId } = body;

    // --- Validation ---
    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Generate a session ID if not provided (first message in a conversation)
    const chatSessionId =
      sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    await dbConnect();

    // --- Fetch business configuration ---
    const settings = await ChatbotSettings.findOne({ organizationId }).lean();

    if (!settings) {
      return NextResponse.json(
        { error: 'Chatbot not configured for this organization' },
        { status: 404, headers: corsHeaders }
      );
    }

    // --- Load conversation history for context ---
    let conversation = await Conversation.findOne({
      organizationId,
      sessionId: chatSessionId,
    });

    // Get the last 20 messages for context (to stay within token limits)
    const recentMessages = conversation
      ? conversation.messages.slice(-20)
      : [];

    // --- Build the AI prompt ---
    const systemPrompt = `You are a customer support assistant for ${settings.businessName}.

Business Knowledge:
${settings.knowledgeBase}

Instructions:
- Answer ONLY based on the provided business knowledge above.
- Be helpful, professional, friendly, and concise.
- If the user asks something not covered in the knowledge base, politely say you don't have that information and suggest contacting ${settings.email} for further assistance.
- Do NOT make up information that is not in the knowledge base.
- Keep responses under 300 words unless the user asks for detailed information.
- Use markdown formatting when helpful (bold, lists, etc).`;

    // Build conversation history for Gemini
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    // Add conversation history
    for (const msg of recentMessages) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      });
    }

    // Add the new user message
    contents.push({
      role: 'user',
      parts: [{ text: message.trim() }],
    });

    // --- Call Gemini AI with Fallback Chain ---
    const models = [
      'gemini-2.0-flash',
      'gemini-2.5-flash',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-2.0-flash-exp'
    ];
    let response = null;
    let lastError = null;

    for (const model of models) {
      try {
        console.log(`Attempting chat generation using model: ${model}`);
        response = await ai.models.generateContent({
          model: model,
          contents: contents,
          config: {
            systemInstruction: systemPrompt,
            maxOutputTokens: 1024,
            temperature: 0.7,
          },
        });
        if (response && response.text) {
          console.log(`Generation succeeded with model: ${model}`);
          break;
        }
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.warn(`Model ${model} failed:`, errMsg);
        lastError = err instanceof Error ? err : new Error(errMsg);
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error("All Gemini models in fallback chain failed to respond");
    }

    const aiResponse = response.text;

    // --- Save conversation ---
    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        organizationId,
        sessionId: chatSessionId,
        messages: [
          { role: 'user', content: message.trim(), timestamp: new Date() },
          { role: 'assistant', content: aiResponse, timestamp: new Date() },
        ],
      });
    } else {
      // Append to existing conversation
      conversation.messages.push(
        { role: 'user', content: message.trim(), timestamp: new Date() },
        { role: 'assistant', content: aiResponse, timestamp: new Date() }
      );
      await conversation.save();
    }

    return NextResponse.json(
      {
        response: aiResponse,
        sessionId: chatSessionId,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('POST /api/chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500, headers: corsHeaders }
    );
  }
}
