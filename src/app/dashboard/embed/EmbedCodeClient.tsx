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
  Info
} from "lucide-react";

interface EmbedCodeClientProps {
  organizationId: string;
  appUrl: string;
}

export default function EmbedCodeClient({
  organizationId,
  appUrl,
}: EmbedCodeClientProps) {
  const [copied, setCopied] = useState(false);

  const embedCode = `<script
  src="${appUrl}/chatbot.js"
  data-org-id="${organizationId}"
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
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          Embed Code
        </h1>
        <p className="text-sm text-[#94a3b8]">
          Add your AI customer support chatbot widget to any website with a single script tag.
        </p>
      </div>

      {/* Embed Code Card */}
      <div className="glass-card p-6 border border-white/[0.04] max-w-3xl relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c084fc]/15 to-transparent" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#c084fc]/10 border border-[#c084fc]/20 flex items-center justify-center text-[#c084fc]">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Your Embed Script</h2>
              <p className="text-[10px] text-[#475569]">Copy the script element block to your site</p>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              copied
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-md shadow-emerald-500/5"
                : "bg-white/[0.02] text-[#94a3b8] border border-white/[0.04] hover:bg-white/[0.05] hover:text-white"
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
          <pre className="text-xs font-mono leading-relaxed text-[#c084fc]">
            <code>
              <span className="text-[#475569]">&lt;!-- EchoDesk AI Chatbot Embed --&gt;</span>{"\n"}
              <span className="text-[#a5b4fc]">&lt;script</span>{"\n"}
              {"  "}<span className="text-[#c084fc]">src</span>=<span className="text-emerald-400">"{appUrl}/chatbot.js"</span>{"\n"}
              {"  "}<span className="text-[#c084fc]">data-org-id</span>=<span className="text-emerald-400">"{organizationId}"</span>{"\n"}
              <span className="text-[#a5b4fc]">&gt;&lt;/script&gt;</span>
            </code>
          </pre>
        </div>
      </div>

      {/* Installation Milestones */}
      <div className="glass-card p-6 border border-white/[0.04] max-w-3xl relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#6366f1]/15 to-transparent" />
        <h2 className="text-sm font-semibold text-white mb-6 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center text-[#6366f1]">
            <Info className="w-4 h-4" />
          </div>
          How to Deploy
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#c084fc]/10 border border-[#c084fc]/20 flex items-center justify-center text-xs font-bold text-[#c084fc]">
                1
              </span>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Copy code</h4>
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Retrieve your unique script elements by clicking the <span className="text-white">Copy Snippet</span> button above.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center text-xs font-bold text-[#6366f1]">
                2
              </span>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Paste in HTML</h4>
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Inject the code block before the closing <code className="text-[#c084fc] font-mono">&lt;/body&gt;</code> tag on any target page layout.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400">
                3
              </span>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Instant Chat</h4>
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              A floating support bubble widget appears dynamically. Updates to configurations apply instantly without code changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
