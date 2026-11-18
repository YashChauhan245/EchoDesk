import { getSession } from "@/lib/session";
import dbConnect from "@/lib/db";
import ChatbotSettings from "@/models/ChatbotSettings";
import Conversation from "@/models/Conversation";
import Subscription from "@/models/Subscription";
import Overview from "@/app/dashboard/Overview";
import type { IMessage } from "@/types";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  await dbConnect();

  // These reads are independent, so wait for them together.
  const organizationFilter = { organizationId: session.organizationId };
  const [settings, conversationCount, savedSubscription, chatbotsCreated, recent] =
    await Promise.all([
      ChatbotSettings.findOne(organizationFilter).lean(),
      Conversation.countDocuments(organizationFilter),
      Subscription.findOne(organizationFilter).lean(),
      ChatbotSettings.countDocuments(organizationFilter),
      Conversation.find(organizationFilter)
        .sort({ updatedAt: -1 })
        .limit(3)
        .select({ sessionId: 1, messages: 1, updatedAt: 1 })
        .lean(),
    ]);

  let subscription = savedSubscription;

  if (!subscription) {
    subscription = {
      plan: "FREE",
      status: "active",
      limits: {
        maxChatbots: 1,
        maxWebsites: 1,
        maxMessages: 500,
      },
      usage: {
        messagesUsed: 0,
        chatbotsCreated: chatbotsCreated,
      },
    };
  } else if (subscription.usage?.chatbotsCreated !== chatbotsCreated) {
    // Sync the cache in subscription document
    await Subscription.updateOne(
      { organizationId: session.organizationId },
      { $set: { "usage.chatbotsCreated": chatbotsCreated } },
    );
    subscription.usage.chatbotsCreated = chatbotsCreated;
  }

  const fallbackPhrases = [
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
  const recentConversations = recent.map((conversation) => {
    const messages = (conversation.messages || []) as IMessage[];
    return {
      sessionId: String(conversation.sessionId),
      preview:
        messages
          .find((message) => message.role === "user")
          ?.content.slice(0, 120) || "No messages yet",
      flagged: messages.some(
        (message) =>
          message.role === "assistant" &&
          fallbackPhrases.some((phrase) =>
            message.content.toLowerCase().includes(phrase),
          ),
      ),
      date: conversation.updatedAt
        ? new Date(conversation.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "",
    };
  });

  return (
    <Overview
      organizationId={session.organizationId}
      conversationCount={conversationCount}
      agent={
        settings
          ? {
              name: settings.chatbotName || "Support assistant",
              businessName: settings.businessName || "",
              hasKnowledge: !!settings.knowledgeBase?.trim(),
            }
          : null
      }
      subscription={{
        plan: subscription.plan,
        status: subscription.status,
        limits: {
          maxMessages: subscription.limits.maxMessages,
          maxChatbots: subscription.limits.maxChatbots,
        },
        usage: {
          messagesUsed: subscription.usage.messagesUsed,
          chatbotsCreated,
        },
      }}
      recentConversations={recentConversations}
    />
  );
}
