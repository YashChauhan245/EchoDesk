import { getSession } from "@/lib/session";
import { Eye, Info, HelpCircle } from "lucide-react";

export default async function PreviewPage() {
  const session = await getSession();
  if (!session) return null;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0f0f15] dark:text-white mb-2">
          Live Preview Workspace
        </h1>
        <p className="text-sm text-[#5f6368] dark:text-[#94a3b8]">
          Interact and test your chatbot within a simulated sandbox environment.
        </p>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3.5 px-4 py-3.5 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.06] max-w-4xl relative overflow-hidden">
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
      <div className="glass-card overflow-hidden max-w-4xl border border-black/[0.05] dark:border-white/[0.06] shadow-sm relative">
        {/* Browser chrome bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.04] dark:border-white/[0.06] bg-neutral-50/50 dark:bg-[#0c0c14]/50">
          <div className="flex gap-1.5 flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          
          <div className="flex-1 mx-4 max-w-md">
            <div className="bg-white dark:bg-[#08080d] border border-black/[0.05] dark:border-white/[0.06] rounded-md py-1 px-3 text-[10px] text-[#5f6368] dark:text-[#94a3b8] font-mono text-center truncate">
              {appUrl.replace(/^https?:\/\//, "")}/sandbox/test.html?orgId={session.organizationId}
            </div>
          </div>

          <div className="w-14 flex-shrink-0" />
        </div>

        {/* Iframe content container */}
        <div className="bg-white dark:bg-[#0c0c14] relative">
          <iframe
            src={`${appUrl}/test.html?orgId=${session.organizationId}`}
            className="w-full h-[660px]"
            title="Chatbot Sandbox Frame"
          />
        </div>
      </div>
    </div>
  );
}
