// ===========================================
// Inbox Page (Server Component)
// ===========================================
// Renders the Live Inbox dashboard page.
// Fetches initial conversation data server-side
// for fast first load, then hands off to the client.
// ===========================================

import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import Conversation from '@/models/Conversation';
import InboxClient from './InboxClient';

export const metadata = {
  title: 'Live Inbox — EchoDesk',
  description: 'Browse and review all visitor chat conversations',
};

export default async function InboxPage() {
  const session = await getSession();
  if (!session) {
    redirect('/api/auth/login');
  }

  await dbConnect();

  // Fetch the first page of conversations server-side
  const conversations = await Conversation.find({
    organizationId: session.organizationId,
  })
    .sort({ updatedAt: -1 })
    .limit(20)
    .select({ sessionId: 1, messages: 1, createdAt: 1, updatedAt: 1 })
    .lean();

  const total = await Conversation.countDocuments({
    organizationId: session.organizationId,
  });

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

  // Serialize for the client
  const items = conversations.map((conv) => {
    const messages = conv.messages || [];
    const firstUserMsg = messages.find((m: { role: string; content: string; timestamp?: Date }) => m.role === 'user');
    const lastMsg = messages[messages.length - 1];
    const isFlagged = messages.some((m: { role: string; content: string }) => {
      if (m.role !== 'assistant') return false;
      const lower = m.content.toLowerCase();
      return FALLBACK_PHRASES.some((phrase) => lower.includes(phrase));
    });

    return {
      _id: String(conv._id),
      sessionId: conv.sessionId,
      messageCount: messages.length,
      isFlagged,
      preview: firstUserMsg?.content
        ? firstUserMsg.content.slice(0, 120)
        : 'No messages yet',
      lastMessage: lastMsg
        ? {
            role: lastMsg.role,
            content: lastMsg.content.slice(0, 80),
            timestamp: lastMsg.timestamp
              ? new Date(lastMsg.timestamp).toISOString()
              : null,
          }
        : null,
      createdAt: conv.createdAt
        ? new Date(conv.createdAt as unknown as string).toISOString()
        : null,
      updatedAt: conv.updatedAt
        ? new Date(conv.updatedAt as unknown as string).toISOString()
        : null,
    };
  });


  return (
    <InboxClient
      initialConversations={items}
      totalConversations={total}
    />
  );
}
