// ===========================================
// Embed Code Client Component
// ===========================================
// Client component for copy-to-clipboard functionality
// ===========================================

"use client";

import { useState } from "react";

interface EmbedCodeClientProps {
  organizationId: string;
  appUrl: string;
}

export default function EmbedCodeClient({
  organizationId,
  appUrl,
}: EmbedCodeClientProps) {
  const [copied, setCopied] = useState(false);

  const embedCode = `<script\n  src="${appUrl}/chatbot.js"\n  data-org-id="${organizationId}">\n</script>`;

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
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
          Embed Code
        </h1>
        <p className="text-[var(--text-secondary)]">
          Add your AI chatbot to any website with a single script tag.
        </p>
      </div>

      {/* Embed Code Card */}
      <div className="glass-card p-6 !transform-none !shadow-none max-w-2xl mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--primary-light)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            Your Embed Script
          </h2>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              copied
                ? "bg-green-500/10 text-green-400 border border-green-500/30"
                : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--border-light)] hover:text-[var(--text-primary)]"
            }`}
          >
            {copied ? (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy Code
              </>
            )}
          </button>
        </div>

        <div className="code-block">
          <pre className="text-sm whitespace-pre-wrap break-all">
            <code>
              <span className="text-purple-400">&lt;script</span>
              {"\n  "}
              <span className="text-blue-400">src</span>
              <span className="text-[var(--text-muted)]">=</span>
              <span className="text-green-400">
                &quot;{appUrl}/chatbot.js&quot;
              </span>
              {"\n  "}
              <span className="text-blue-400">data-org-id</span>
              <span className="text-[var(--text-muted)]">=</span>
              <span className="text-green-400">
                &quot;{organizationId}&quot;
              </span>
              <span className="text-purple-400">&gt;&lt;/script&gt;</span>
            </code>
          </pre>
        </div>
      </div>

      {/* Instructions */}
      <div className="glass-card p-6 !transform-none !shadow-none max-w-2xl">
        <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4">
          How to Install
        </h2>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-[var(--primary-light)]">
                1
              </span>
            </div>
            <div>
              <p className="text-sm text-[var(--text-primary)] font-medium">
                Copy the script tag above
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Click the &quot;Copy Code&quot; button to copy it to your clipboard.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-[var(--primary-light)]">
                2
              </span>
            </div>
            <div>
              <p className="text-sm text-[var(--text-primary)] font-medium">
                Paste it into your website&apos;s HTML
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Add the script before the closing{" "}
                <code className="text-purple-400">&lt;/body&gt;</code> tag on
                any page where you want the chatbot.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-[var(--primary-light)]">
                3
              </span>
            </div>
            <div>
              <p className="text-sm text-[var(--text-primary)] font-medium">
                That&apos;s it — your chatbot is live!
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                A floating chat button will appear on the page. Visitors can
                click it to start chatting with your AI assistant.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
