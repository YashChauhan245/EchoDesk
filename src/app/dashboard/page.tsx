// ===========================================
// Dashboard Home Page
// ===========================================
// Overview page showing chatbot status, quick stats,
// and quick action cards.
// ===========================================

import { getSession } from "@/lib/session";
import dbConnect from "@/lib/db";
import ChatbotSettings from "@/models/ChatbotSettings";
import Conversation from "@/models/Conversation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  await dbConnect();

  // Fetch chatbot settings and conversation count for this org
  const settings = await ChatbotSettings.findOne({
    organizationId: session.organizationId,
  }).lean();

  const conversationCount = await Conversation.countDocuments({
    organizationId: session.organizationId,
  });

  const isConfigured = !!settings;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
          Welcome back, {session.name?.split(" ")[0] || "there"} 👋
        </h1>
        <p className="text-[var(--text-secondary)]">
          Here&apos;s an overview of your AI chatbot.
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Chatbot Status */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[var(--text-muted)]">
              Chatbot Status
            </span>
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                isConfigured ? "bg-green-500" : "bg-amber-500"
              }`}
            />
          </div>
          <p className="text-xl font-bold text-[var(--text-primary)]">
            {isConfigured ? "Active" : "Not Configured"}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {isConfigured
              ? `Configured for ${settings.businessName}`
              : "Set up your chatbot to get started"}
          </p>
        </div>

        {/* Conversations */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[var(--text-muted)]">
              Total Conversations
            </span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <p className="text-xl font-bold text-[var(--text-primary)]">
            {conversationCount}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Visitor conversations handled by AI
          </p>
        </div>

        {/* Organization ID */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[var(--text-muted)]">
              Organization ID
            </span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <p className="text-sm font-mono text-[var(--primary-light)] break-all">
            {session.organizationId}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Your unique tenant identifier
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Configure Chatbot */}
          <Link
            href="/dashboard/settings"
            className="glass-card p-6 flex items-start gap-4 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#818cf8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-1">
                {isConfigured ? "Update Settings" : "Configure Chatbot"}
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {isConfigured
                  ? "Edit your business details, knowledge base, and widget appearance."
                  : "Set up your business name, knowledge base, and chatbot personality."}
              </p>
            </div>
          </Link>

          {/* Get Embed Code */}
          <Link
            href="/dashboard/embed"
            className="glass-card p-6 flex items-start gap-4 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-1">
                Get Embed Code
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Copy your embed script to add the AI chatbot to any website.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
