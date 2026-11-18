"use client";

import { PageHeading } from "@/app/dashboard/DashboardUI";

import { useState } from "react";
import { Copy, Check, Terminal, Info, Bot } from "lucide-react";

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
    chatbots.length > 0 ? chatbots[0]._id : organizationId,
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
    <div className="space-y-8 max-w-none relative">
      {/* Header */}
      <PageHeading
        eyebrow="Installation"
        title="One script. Right where you need it."
        description="Add your agent to your website with a single script."
      />

      {/* Chatbot Selector */}
      {chatbots.length > 1 && (
        <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6 sm:p-7 max-w-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-[var(--dash-accent)]" />
            <div>
              <label className="block font-medium text-[var(--dash-text)] mb-0.5 text-[13px]">
                Select Chatbot Widget
              </label>
              <p className="text-[11px] text-[var(--dash-muted)]">
                Get the distinct embed script for a specific application target
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

      {chatbots.length === 0 && (
        <div className="p-4 bg-[var(--dash-selected)] border border-[var(--dash-border)] text-[var(--dash-accent)] rounded-lg text-xs max-w-none flex items-center gap-3">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>
            You haven't configured any chatbots yet. Go to settings to create
            one first, or copy the legacy script below.
          </span>
        </div>
      )}

      {/* Embed Code Card */}
      <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6 sm:p-7 max-w-none relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[var(--dash-panel)] border border-[var(--dash-border)] flex items-center justify-center text-[var(--dash-text)]">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-medium text-[var(--dash-text)] text-[15px]">
                Your Embed Script
              </h2>
              <p className="text-[11px] text-[var(--dash-muted)]">
                Copy the script element block to your site
              </p>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium transition-all cursor-pointer w-full sm:w-auto ${
              copied
                ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/10"
                : "inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[var(--dash-border)] bg-[var(--dash-panel)] px-3.5 py-2 text-[13px] font-medium text-[var(--dash-text)] transition-colors hover:bg-[var(--dash-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            } `}
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
        <div className="overflow-x-auto rounded-md border border-[var(--dash-border)] bg-[var(--dash-input)] p-5 select-all">
          <pre className="text-xs font-mono leading-relaxed text-[var(--dash-text)]">
            <code>
              <span className="text-[var(--dash-muted)]">
                &lt;!-- EchoDesk AI Chatbot Embed --&gt;
              </span>
              {"\n"}
              <span className="text-[var(--dash-text)] font-medium">
                &lt;script
              </span>
              {"\n"}
              {"  "}
              <span className="text-[#4b5563] text-[var(--dash-muted)]">
                src
              </span>
              =
              <span className="text-emerald-700 dark:text-emerald-400">
                "{appUrl}/chatbot.js"
              </span>
              {"\n"}
              {"  "}
              <span className="text-[#4b5563] text-[var(--dash-muted)]">
                data-org-id
              </span>
              =
              <span className="text-emerald-700 dark:text-emerald-400">
                "{selectedBotId}"
              </span>
              {"\n"}
              <span className="text-[var(--dash-text)] font-medium">
                &gt;&lt;/script&gt;
              </span>
            </code>
          </pre>
        </div>
      </div>

      {/* Installation Milestones */}
      <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6 sm:p-7 max-w-none relative">
        <h2 className="font-medium text-[var(--dash-text)] mb-6 flex items-center gap-2.5 text-[15px]">
          <div className="w-7 h-7 rounded-lg bg-[var(--dash-panel)] border border-[var(--dash-border)] flex items-center justify-center text-[var(--dash-text)]">
            <Info className="w-4 h-4" />
          </div>
          How to Deploy
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[var(--dash-panel)] border border-[var(--dash-border)] flex items-center justify-center text-xs font-medium text-[var(--dash-text)]">
                1
              </span>
              <h4 className="text-xs font-medium text-[var(--dash-text)] uppercase tracking-wider">
                Copy code
              </h4>
            </div>
            <p className="text-xs text-[var(--dash-muted)] leading-relaxed">
              Retrieve your unique script elements by selecting your chatbot and
              clicking the{" "}
              <span className="text-[var(--dash-text)] font-medium">
                Copy Snippet
              </span>{" "}
              button above.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[var(--dash-panel)] border border-[var(--dash-border)] flex items-center justify-center text-xs font-medium text-[var(--dash-text)]">
                2
              </span>
              <h4 className="text-xs font-medium text-[var(--dash-text)] uppercase tracking-wider">
                Paste in HTML
              </h4>
            </div>
            <p className="text-xs text-[var(--dash-muted)] leading-relaxed">
              Inject the code block before the closing{" "}
              <code className="text-[var(--dash-text)] font-mono">
                &lt;/body&gt;
              </code>{" "}
              tag on any target page layout.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[var(--dash-panel)] border border-[var(--dash-border)] flex items-center justify-center text-xs font-medium text-[var(--dash-text)]">
                3
              </span>
              <h4 className="text-xs font-medium text-[var(--dash-text)] uppercase tracking-wider">
                Instant Chat
              </h4>
            </div>
            <p className="text-xs text-[var(--dash-muted)] leading-relaxed">
              A floating support bubble widget appears dynamically. Updates to
              configurations apply instantly without code changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
