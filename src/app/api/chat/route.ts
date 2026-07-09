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
import fs from 'fs';
import path from 'path';
import dbConnect from '@/lib/db';
import ChatbotSettings from '@/models/ChatbotSettings';
import Conversation from '@/models/Conversation';
import Subscription from '@/models/Subscription';

// ---- Local Rule-based Knowledge Matcher Fallback ----
// This ensures the chatbot ALWAYS works and replies using the configured facts,
// even if the Gemini API key is rate-limited, quota-exhausted, or blocked.
function localKnowledgeMatcher(message: string, knowledgeBase: string, email: string): string {
  const query = message.toLowerCase().trim();
  const queryWords = query.split(/\s+/).filter(w => w.length > 3);
  
  if (!knowledgeBase || !knowledgeBase.trim()) {
    return `I don't have that information. Please contact us directly at ${email} for further assistance.`;
  }

  const lines = knowledgeBase
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  // 1. Check for Q&A pairs (FAQs)
  const faqs: Array<{ q: string; a: string }> = [];
  let currentQ = '';
  let currentA = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.toLowerCase().startsWith('q:') || line.toLowerCase().startsWith('question:')) {
      if (currentQ && currentA) {
        faqs.push({ q: currentQ, a: currentA });
      }
      currentQ = line.replace(/^(q|question):\s*/i, '').trim();
      currentA = '';
    } else if (line.toLowerCase().startsWith('a:') || line.toLowerCase().startsWith('answer:')) {
      currentA = line.replace(/^(a|answer):\s*/i, '').trim();
    } else if (currentQ && !currentA) {
      currentQ += ' ' + line;
    } else if (currentQ && currentA) {
      currentA += '\n' + line;
    }
  }
  if (currentQ && currentA) {
    faqs.push({ q: currentQ, a: currentA });
  }

  // Find best matching FAQ
  let bestFaqMatch = null;
  let maxFaqScore = 0;

  for (const faq of faqs) {
    let score = 0;
    const qLower = faq.q.toLowerCase();
    
    if (qLower.includes(query) || query.includes(qLower)) {
      score += 10;
    }
    
    for (const word of queryWords) {
      if (qLower.includes(word)) {
        score += 2;
      }
    }
    
    if (score > maxFaqScore && score > 0) {
      maxFaqScore = score;
      bestFaqMatch = faq;
    }
  }

  if (bestFaqMatch && maxFaqScore >= 2) {
    return bestFaqMatch.a;
  }

  // 2. Check for sentence-level or paragraph-level matches
  const paragraphs = knowledgeBase
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 15);

  let bestParaMatch = '';
  let maxParaScore = 0;

  for (const para of paragraphs) {
    let score = 0;
    const paraLower = para.toLowerCase();

    if (paraLower.includes(query) || query.includes(paraLower)) {
      score += 5;
    }

    for (const word of queryWords) {
      if (paraLower.includes(word)) {
        score += 1;
      }
    }

    if (score > maxParaScore && score > 0) {
      maxParaScore = score;
      bestParaMatch = para;
    }
  }

  if (bestParaMatch && maxParaScore >= 2) {
    // Return the matched paragraph/sentence
    return bestParaMatch;
  }

  // 3. Fallback suggestion email
  return `I don't have that information in my knowledge base. Please contact us directly at ${email} for further assistance.`;
}

function getGeminiApiKey(): string {
  let key = process.env.GEMINI_API_KEY;
  if (key && key.trim() !== '') {
    return key;
  }
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/^GEMINI_API_KEY\s*=\s*(.+)$/m);
      if (match && match[1]) {
        let parsedKey = match[1].trim();
        if ((parsedKey.startsWith('"') && parsedKey.endsWith('"')) || (parsedKey.startsWith("'") && parsedKey.endsWith("'"))) {
          parsedKey = parsedKey.slice(1, -1);
        }
        return parsedKey;
      }
    }
  } catch (err) {
    console.error("Failed to read .env file directly:", err);
  }
  return '';
}

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

    // Check if the organizationId parameter is a 24-character hex Mongoose ObjectId (chatbotId)
    // or a legacy organizationId
    let query = {};
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(organizationId);

    if (isValidObjectId) {
      query = { _id: organizationId };
    } else {
      query = { organizationId };
    }

    // --- Fetch business configuration ---
    const settings = await ChatbotSettings.findOne(query).lean();

    if (!settings) {
      return NextResponse.json(
        { error: 'Chatbot not configured for this organization' },
        { status: 404, headers: corsHeaders }
      );
    }

    const actualOrgId = settings.organizationId;

    // --- Subscription Limit Check ---
    let subscription = await Subscription.findOne({ organizationId: actualOrgId });
    if (!subscription) {
      subscription = await Subscription.create({
        organizationId: actualOrgId,
        plan: 'FREE',
        status: 'active',
        limits: {
          maxChatbots: 1,
          maxWebsites: 1,
          maxMessages: 500,
        },
        usage: {
          messagesUsed: 0,
          chatbotsCreated: 1,
        },
      });
    }

    if (subscription.usage.messagesUsed >= subscription.limits.maxMessages) {
      return NextResponse.json(
        { response: "Monthly AI message limit reached. Upgrade your plan." },
        { headers: corsHeaders }
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
    const apiKey = getGeminiApiKey();
    const ai = new GoogleGenAI({ apiKey });

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

    let aiResponse = '';

    if (response && response.text) {
      aiResponse = response.text;
    } else {
      console.warn('All Gemini models in fallback chain failed. Activating local matcher fallback.');
      aiResponse = localKnowledgeMatcher(message, settings.knowledgeBase, settings.email);
    }

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

    // Increment message usage
    await Subscription.updateOne(
      { organizationId: actualOrgId },
      { $inc: { 'usage.messagesUsed': 1 } }
    );

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
