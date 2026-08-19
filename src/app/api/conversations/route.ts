// ===========================================
// Conversations List API Route
// ===========================================
// GET /api/conversations
//
// Returns a paginated list of conversation sessions for the
// authenticated organization. Each item includes a message
// preview (first user message), message count, timestamps,
// and a isFlagged indicator for low-confidence/fallback responses.
//
// Query Params:
//   page    (default: 1)
//   limit   (default: 20)
//   search  (optional - filters by sessionId or message content)
//   flagged (optional - "true" to return only flagged sessions)
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import dbConnect from '@/lib/db';
import Conversation from '@/models/Conversation';

// Phrases that indicate the bot fell back to a low-confidence / no-knowledge response
const FALLBACK_PHRASES = [
  "i don't have that information",
  "don't have that information in my knowledge base",
  "contact us directly",
  "please contact",
  "i'm not sure",
  "i cannot help with that",
  "i don't know",
  "not covered in",
  "outside my knowledge",
  "unable to assist",
];

function isFlaggedConversation(messages: { role: string; content: string }[]): boolean {
  return messages.some((m) => {
    if (m.role !== 'assistant') return false;
    const lower = m.content.toLowerCase();
    return FALLBACK_PHRASES.some((phrase) => lower.includes(phrase));
  });
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const search = searchParams.get('search')?.trim() || '';
    const onlyFlagged = searchParams.get('flagged') === 'true';
    const skip = (page - 1) * limit;

    await dbConnect();

    // Build the base filter for this org
    const baseFilter: Record<string, unknown> = {
      organizationId: session.organizationId,
    };

    // If a search term is provided, filter by sessionId or message content
    if (search) {
      baseFilter.$or = [
        { sessionId: { $regex: search, $options: 'i' } },
        { 'messages.content': { $regex: search, $options: 'i' } },
      ];
    }

    // Flagged filter: match conversations where any assistant message contains a fallback phrase
    if (onlyFlagged) {
      const phraseConditions = FALLBACK_PHRASES.map((phrase) => ({
        messages: {
          $elemMatch: {
            role: 'assistant',
            content: { $regex: phrase, $options: 'i' },
          },
        },
      }));

      if (baseFilter.$or) {
        // Combine with existing $or via $and
        baseFilter.$and = [
          { $or: baseFilter.$or },
          { $or: phraseConditions },
        ];
        delete baseFilter.$or;
      } else {
        baseFilter.$or = phraseConditions;
      }
    }

    const [conversations, total] = await Promise.all([
      Conversation.find(baseFilter)
        .sort({ updatedAt: -1 }) // Most recently active first
        .skip(skip)
        .limit(limit)
        .select({ sessionId: 1, messages: 1, createdAt: 1, updatedAt: 1 })
        .lean(),
      Conversation.countDocuments(baseFilter),
    ]);

    // Shape each conversation for the list view
    const items = conversations.map((conv) => {
      const messages = conv.messages || [];
      // Find the first message from the user for the preview
      const firstUserMsg = messages.find((m: { role: string; content: string; timestamp?: Date }) => m.role === 'user');
      const lastMsg = messages[messages.length - 1];
      const flagged = isFlaggedConversation(messages as { role: string; content: string }[]);

      return {
        _id: conv._id,
        sessionId: conv.sessionId,
        messageCount: messages.length,
        isFlagged: flagged,
        preview: firstUserMsg?.content
          ? firstUserMsg.content.slice(0, 120)
          : 'No messages yet',
        lastMessage: lastMsg
          ? {
              role: lastMsg.role,
              content: lastMsg.content.slice(0, 80),
              timestamp: lastMsg.timestamp,
            }
          : null,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
      };
    });

    return NextResponse.json({
      conversations: items,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('GET /api/conversations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}
