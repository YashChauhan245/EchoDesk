"use client";

import { PageHeading } from "@/app/dashboard/DashboardUI";

import { useState } from "react";
import { Info, Bot } from "lucide-react";

interface ChatbotOption {
  _id: string;
  chatbotName?: string;
  businessName?: string;
}

interface PreviewClientProps {
  chatbots: ChatbotOption[];
  organizationId: string;
  appUrl: string;
}

export default function PreviewClient({
  chatbots,
  organizationId,
  appUrl,
}: PreviewClientProps) {
  const [selectedBotId, setSelectedBotId] = useState(
    chatbots.length > 0 ? chatbots[0]._id : organizationId,
  );

  return (
    <div className="space-y-8 max-w-none">
      {/* Header */}
      <PageHeading
        eyebrow="Playground"
        title="Confidence before you go live."
        description="Try your agent’s greeting and answers in a live widget."
      />

      {/* Chatbot Selector */}
      {chatbots.length > 1 && (
        <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] p-4 sm:p-5 max-w-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-[var(--dash-accent)]" />
            <div>
              <label className="block font-medium text-[var(--dash-text)] mb-0.5 text-[13px]">
                Active Preview Chatbot
              </label>
              <p className="text-[11px] text-[var(--dash-muted)]">
                Swap active chatbots to test their distinct knowledge and
                widgets
              </p>
            </div>
          </div>
          <div>
            <select
              aria-label="Select chatbot"
              value={selectedBotId}
              onChange={(e) => setSelectedBotId(e.target.value)}
              className="min-h-10 border border-[var(--dash-border)] text-base sm:text-[13px] font-medium rounded-md px-3 py-2 outline-none focus:border-[var(--dash-accent)] transition-colors cursor-pointer"
              style={{
                color: "var(--text-primary)",
                backgroundColor: "var(--bg-secondary)",
              }}
            >
              {chatbots.map((bot) => (
                <option
                  key={bot._id}
                  value={bot._id}
                  style={{
                    color: "var(--text-primary)",
                    backgroundColor: "var(--bg-card)",
                  }}
                >
                  {bot.chatbotName || bot.businessName || "Default Chatbot"}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="flex items-start gap-3 sm:gap-3.5 px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg bg-[var(--dash-panel)] border border-[var(--dash-border)] max-w-none relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--dash-panel)]" />
        <Info className="w-5 h-5 text-[var(--dash-text)] flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-medium text-[var(--dash-text)] uppercase tracking-wider mb-0.5">
            Interaction Guidelines
          </h4>
          <p className="text-xs text-[var(--dash-muted)] leading-relaxed">
            The chatbot trigger bubble is located in the bottom-right corner of
            the sandbox browser window. Verify that you have filled your{" "}
            <span className="text-[var(--dash-text)] font-medium">
              Chatbot Settings
            </span>{" "}
            to customize chatbot personality, greeting, and context.
          </p>
        </div>
      </div>

      {/* Preview iframe */}
      <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] overflow-hidden max-w-none relative">
        {/* Browser chrome bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--dash-border)] bg-[var(--dash-panel)]">
          <div className="flex gap-1.5 flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>

          <div className="flex-1 mx-4 max-w-md">
            <div className="bg-[var(--dash-panel)] dark:bg-[#08080d] border border-[var(--dash-border)] rounded-md py-1 px-3 text-[11px] text-[var(--dash-muted)] font-mono text-center truncate">
              {appUrl.replace(/^https?:\/\//, "")}/test?orgId={selectedBotId}
            </div>
          </div>

          <div className="w-14 flex-shrink-0" />
        </div>

        {/* Iframe container */}
        <div className="bg-[var(--dash-panel)] relative">
          <iframe
            key={selectedBotId}
            src={`${appUrl}/test?orgId=${selectedBotId}`}
            className="w-full h-[400px] sm:h-[500px] md:h-[600px] border-0"
            title="Chatbot Sandbox Frame"
          />
        </div>
      </div>
    </div>
  );
}
