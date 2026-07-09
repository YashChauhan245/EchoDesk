// ===========================================
// Live Preview Workspace Server Component Page
// ===========================================
// Queries chatbots from MongoDB and renders the PreviewClient.
// ===========================================

import { getSession } from "@/lib/session";
import dbConnect from "@/lib/db";
import ChatbotSettings from "@/models/ChatbotSettings";
import PreviewClient from "./PreviewClient";
import { redirect } from "next/navigation";

export default async function PreviewPage() {
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
    <PreviewClient
      chatbots={plainChatbots}
      organizationId={session.organizationId}
      appUrl={appUrl}
    />
  );
}
