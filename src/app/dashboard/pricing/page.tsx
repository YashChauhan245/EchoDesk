import { getSession } from "@/lib/session";
import dbConnect from "@/lib/db";
import Subscription from "@/models/Subscription";
import PricingClient from "./PricingClient";
import { redirect } from "next/navigation";

export default async function PricingPage() {
  const session = await getSession();
  if (!session) {
    redirect("/api/auth/login");
  }

  await dbConnect();

  // Find organization's subscription
  let subscription = await Subscription.findOne({
    organizationId: session.organizationId,
  }).lean();

  if (!subscription) {
    // If no subscription is present in DB, mock a default FREE one
    subscription = {
      organizationId: session.organizationId,
      plan: "FREE",
      status: "active",
      limits: {
        maxChatbots: 1,
        maxWebsites: 1,
        maxMessages: 500,
      },
      usage: {
        messagesUsed: 0,
        chatbotsCreated: 0,
      },
    } as any;
  }

  // Convert Mongoose/MongoDB data types (like _id, Dates, etc.) to plain types
  const plainSubscription = JSON.parse(JSON.stringify(subscription));

  return <PricingClient subscription={plainSubscription} userEmail={session.email || ""} userName={session.name || ""} />;
}
