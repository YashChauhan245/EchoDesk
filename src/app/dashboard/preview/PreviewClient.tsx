"use client";

import { useState } from "react";
import { Eye, Info, Bot } from "lucide-react";

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
    chatbots.length > 0 ? chatbots[0]._id : organizationId
  );

  return (
    <div className="animate-fade-in space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0f0f15] dark:text-white mb-2">
          Live Preview Workspace
        </h1>
        <p className="text-sm text-[#5f6368] dark:text-[#94a3b8]">
          Interact and test your chatbot within a simulated sandbox environment.
        </p>
      </div>

      {/* Chatbot Selector */}
      {chatbots.length > 1 && (
        <div className="glass-card p-5 border border-black/[0.05] dark:border-white/[0.06] bg-white dark:bg-[#0c0c14] shadow-sm max-w-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-[#6366f1]" />
            <div>
              <label className="block text-xs font-semibold text-[#0f0f15] dark:text-white mb-0.5">
                Active Preview Chatbot
              </label>
              <p className="text-[10px] text-[#5f6368] dark:text-[#94a3b8]">
                Swap active chatbots to test their distinct knowledge and widgets
              </p>
            </div>
          </div>
          <div>
            <select
              value={selectedBotId}
              onChange={(e) => setSelectedBotId(e.target.value)}
              className="border border-black/[0.08] dark:border-white/[0.08] text-xs font-semibold rounded-lg px-3 py-2 outline-none focus:border-[#6366f1] transition-colors cursor-pointer"
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
      <div className="flex items-start gap-3.5 px-4 py-3.5 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.06] max-w-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-black dark:bg-white" />
        <Info className="w-5 h-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-0.5">Interaction Guidelines</h4>
          <p className="text-xs text-[#5f6368] dark:text-[#94a3b8] leading-relaxed">
            The chatbot trigger bubble is located in the bottom-right corner of the sandbox browser window. Verify that you have filled your <span className="text-neutral-900 dark:text-white font-semibold">Chatbot Settings</span> to customize chatbot personality, greeting, and context.
          </p>
        </div>
      </div>

      {/* Preview iframe */}
      <div className="glass-card overflow-hidden max-w-3xl border border-black/[0.05] dark:border-white/[0.06] shadow-sm relative">
        {/* Browser chrome bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.04] dark:border-white/[0.06] bg-neutral-50/50 dark:bg-[#0c0c14]/50">
          <div className="flex gap-1.5 flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          
          <div className="flex-1 mx-4 max-w-md">
            <div className="bg-white dark:bg-[#08080d] border border-black/[0.05] dark:border-white/[0.06] rounded-md py-1 px-3 text-[10px] text-[#5f6368] dark:text-[#94a3b8] font-mono text-center truncate">
              {appUrl.replace(/^https?:\/\//, "")}/test?orgId={selectedBotId}
            </div>
          </div>

          <div className="w-14 flex-shrink-0" />
        </div>

        {/* Iframe container */}
        <div className="bg-white dark:bg-[#0c0c14] relative">
          <iframe
            key={selectedBotId} // Forces reload of iframe when selected chatbot changes
            src={`${appUrl}/test?orgId=${selectedBotId}`}
            className="w-full h-[600px] border-0"
            title="Chatbot Sandbox Frame"
          />
        </div>
      </div>
    </div>
  );
}
