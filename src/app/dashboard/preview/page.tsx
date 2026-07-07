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
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          Live Preview Workspace
        </h1>
        <p className="text-sm text-[#94a3b8]">
          Interact and test your chatbot within a simulated sandbox environment.
        </p>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3.5 px-4 py-3.5 rounded-xl bg-[#6366f1]/5 border border-[#6366f1]/10 max-w-4xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#c084fc] to-[#6366f1]" />
        <Info className="w-5 h-5 text-[#c084fc] flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-0.5">Interaction Guidelines</h4>
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            The chatbot trigger bubble is located in the bottom-right corner of the sandbox browser window. Verify that you have filled your <span className="text-white">Chatbot Settings</span> to customize chatbot personality, greeting, and context.
          </p>
        </div>
      </div>

      {/* Preview iframe */}
      <div className="glass-card overflow-hidden max-w-4xl border border-white/[0.04] shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c084fc]/10 to-transparent" />
        
        {/* Browser chrome bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04] bg-[#0c0c14]">
          <div className="flex gap-1.5 flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          
          <div className="flex-1 mx-4 max-w-md">
            <div className="bg-[#030307] border border-white/[0.03] rounded-md py-1 px-3 text-[10px] text-[#475569] font-mono text-center truncate">
              {appUrl.replace(/^https?:\/\//, "")}/sandbox/test.html?orgId={session.organizationId}
            </div>
          </div>

          <div className="w-14 flex-shrink-0" />
        </div>

        {/* Iframe content container */}
        <div className="bg-white relative">
          <iframe
            src={`${appUrl}/test.html?orgId=${session.organizationId}`}
            className="w-full h-[580px]"
            title="Chatbot Sandbox Frame"
          />
        </div>
      </div>
    </div>
  );
}
