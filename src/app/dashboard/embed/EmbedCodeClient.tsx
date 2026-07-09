"use client";

import { useState } from "react";
import { 
  Code, 
  Copy, 
  Check, 
  Terminal, 
  FileCode, 
  Sparkles,
  ArrowRight,
  Info,
  Bot
} from "lucide-react";

interface ChatbotOption {
  _id: string;
  chatbotName?: string;
  businessName?: string;
}

interface EmbedCodeClientProps {
  chatbots: ChatbotOption[];
  organizationId: string;
  appUrl: string;
}

export default function EmbedCodeClient({
  chatbots,
  organizationId,
  appUrl,
}: EmbedCodeClientProps) {
  const [selectedBotId, setSelectedBotId] = useState(
    chatbots.length > 0 ? chatbots[0]._id : organizationId
  );
  const [copied, setCopied] = useState(false);

  const embedCode = `<script
  src="${appUrl}/chatbot.js"
  data-org-id="${selectedBotId}"
></script>`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = embedCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }

  return (
    <div className="animate-fade-in space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0f0f15] dark:text-white mb-2">
          Embed Code
        </h1>
        <p className="text-sm text-[#5f6368] dark:text-[#94a3b8]">
          Add your AI customer support chatbot widget to any website with a single script tag.
        </p>
      </div>

      {/* Chatbot Selector */}
      {chatbots.length > 1 && (
        <div className="glass-card p-5 border border-black/[0.05] dark:border-white/[0.06] bg-white dark:bg-[#0c0c14] shadow-sm max-w-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-[#6366f1]" />
            <div>
              <label className="block text-xs font-semibold text-[#0f0f15] dark:text-white mb-0.5">
                Select Chatbot Widget
              </label>
              <p className="text-[10px] text-[#5f6368] dark:text-[#94a3b8]">
                Get the distinct embed script for a specific application target
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

      {chatbots.length === 0 && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl text-xs max-w-3xl flex items-center gap-3">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>You haven't configured any chatbots yet. Go to settings to create one first, or copy the legacy script below.</span>
        </div>
      )}

      {/* Embed Code Card */}
      <div className="glass-card p-6 border border-black/[0.05] dark:border-white/[0.06] bg-white dark:bg-[#0c0c14] shadow-sm max-w-3xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-neutral-50 dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.06] flex items-center justify-center text-black dark:text-white">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#0f0f15] dark:text-white">Your Embed Script</h2>
              <p className="text-[10px] text-[#5f6368] dark:text-[#94a3b8]">Copy the script element block to your site</p>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
              copied
                ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30"
                : "bg-white dark:bg-[#0c0c14] text-[#5f6368] dark:text-[#94a3b8] border border-black/[0.08] dark:border-white/[0.08] hover:bg-neutral-50 dark:hover:bg-white/[0.02] hover:text-black dark:hover:text-white"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Snippet
              </>
            )}
          </button>
        </div>

        {/* Code display block */}
        <div className="code-block relative group select-all">
          <pre className="text-xs font-mono leading-relaxed text-neutral-800 dark:text-neutral-200">
            <code>
              <span className="text-[#94a3b8] dark:text-[#5f6368]">&lt;!-- EchoDesk AI Chatbot Embed --&gt;</span>{"\n"}
              <span className="text-neutral-900 dark:text-white font-semibold">&lt;script</span>{"\n"}
              {"  "}<span className="text-[#4b5563] dark:text-[#94a3b8]">src</span>=<span className="text-emerald-700 dark:text-emerald-400">"{appUrl}/chatbot.js"</span>{"\n"}
              {"  "}<span className="text-[#4b5563] dark:text-[#94a3b8]">data-org-id</span>=<span className="text-emerald-700 dark:text-emerald-400">"{selectedBotId}"</span>{"\n"}
              <span className="text-neutral-900 dark:text-white font-semibold">&gt;&lt;/script&gt;</span>
            </code>
          </pre>
        </div>
      </div>

      {/* Installation Milestones */}
      <div className="glass-card p-6 border border-black/[0.05] dark:border-white/[0.06] bg-white dark:bg-[#0c0c14] shadow-sm max-w-3xl relative">
        <h2 className="text-sm font-semibold text-[#0f0f15] dark:text-white mb-6 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-neutral-50 dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.06] flex items-center justify-center text-black dark:text-white">
            <Info className="w-4 h-4" />
          </div>
          How to Deploy
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-black dark:bg-white flex items-center justify-center text-xs font-bold text-white dark:text-black">
                1
              </span>
              <h4 className="text-xs font-semibold text-[#0f0f15] dark:text-white uppercase tracking-wider">Copy code</h4>
            </div>
            <p className="text-xs text-[#5f6368] dark:text-[#94a3b8] leading-relaxed">
              Retrieve your unique script elements by selecting your chatbot and clicking the <span className="text-[#0f0f15] dark:text-white font-semibold">Copy Snippet</span> button above.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-black dark:bg-white flex items-center justify-center text-xs font-bold text-white dark:text-black">
                2
              </span>
              <h4 className="text-xs font-semibold text-[#0f0f15] dark:text-white uppercase tracking-wider">Paste in HTML</h4>
            </div>
            <p className="text-xs text-[#5f6368] dark:text-[#94a3b8] leading-relaxed">
              Inject the code block before the closing <code className="text-[#0f0f15] dark:text-white font-mono">&lt;/body&gt;</code> tag on any target page layout.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-black dark:bg-white flex items-center justify-center text-xs font-bold text-white dark:text-black">
                3
              </span>
              <h4 className="text-xs font-semibold text-[#0f0f15] dark:text-white uppercase tracking-wider">Instant Chat</h4>
            </div>
            <p className="text-xs text-[#5f6368] dark:text-[#94a3b8] leading-relaxed">
              A floating support bubble widget appears dynamically. Updates to configurations apply instantly without code changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
