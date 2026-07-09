// ===========================================
// Embed Code Page
// ===========================================
// Shows the generated embed script tag with a copy button.
// Also explains how to add it to a website.
// ===========================================

import { getSession } from "@/lib/session";
import dbConnect from "@/lib/db";
import ChatbotSettings from "@/models/ChatbotSettings";
import EmbedCodeClient from "./EmbedCodeClient";
import { redirect } from "next/navigation";

export default async function EmbedPage() {
  const session = await getSession();
  if (!session) {
    redirect("/api/auth/login");
  }

  await dbConnect();

  const chatbots = await ChatbotSettings.find(
    { organizationId: session.organizationId },
    { chatbotName: 1, businessName: 1, _id: 1 }
  ).lean();

  const plainChatbots = JSON.parse(JSON.stringify(chatbots));
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <EmbedCodeClient
      chatbots={plainChatbots}
      organizationId={session.organizationId}
      appUrl={appUrl}
    />
  );
}
