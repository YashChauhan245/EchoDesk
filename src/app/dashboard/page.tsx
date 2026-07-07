import { getSession } from "@/lib/session";
import dbConnect from "@/lib/db";
import ChatbotSettings from "@/models/ChatbotSettings";
import Conversation from "@/models/Conversation";
import Link from "next/link";
import { 
  Bot, 
  MessageSquare, 
  Key, 
  Settings, 
  Code, 
  ChevronRight,
  TrendingUp,
  Activity,
  ArrowUpRight
} from "lucide-react";

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
    <div className="animate-fade-in space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#c084fc]/20 bg-[#c084fc]/5 mb-3">
          <Activity className="w-3 h-3 text-[#c084fc]" />
          <span className="text-[10px] text-[#c084fc] font-semibold uppercase tracking-wider">System Operational</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          Welcome back, {session.name?.split(" ")[0] || "there"} 👋
        </h1>
        <p className="text-sm text-[#94a3b8]">
          Here is a high-level overview of your automated customer support workspace.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Chatbot Status */}
        <div className="glass-card p-6 relative group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#c084fc]/20 to-transparent" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#475569]">
              Chatbot Status
            </span>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                {isConfigured && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isConfigured ? "bg-emerald-500" : "bg-amber-500"}`}></span>
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isConfigured ? "text-emerald-400" : "text-amber-400"}`}>
                {isConfigured ? "Active" : "Pending"}
              </span>
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-white mb-2">
            {isConfigured ? "Configured" : "Not Set Up"}
          </p>
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            {isConfigured
              ? `Running under context "${settings.businessName}"`
              : "Complete configuration to launch your Gemini-powered agent"}
          </p>
        </div>

        {/* Conversations */}
        <div className="glass-card p-6 relative group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#6366f1]/20 to-transparent" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#475569]">
              Total Interactions
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#6366f1]/10 flex items-center justify-center text-[#6366f1]">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-white mb-2">
            {conversationCount}
          </p>
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            Total unique user sessions handled and audited by the Gemini LLM
          </p>
        </div>

        {/* Tenant/Organization ID */}
        <div className="glass-card p-6 relative group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#475569]">
              Organization ID
            </span>
            <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center text-[#94a3b8]">
              <Key className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs font-mono text-[#c084fc] break-all select-all font-semibold p-2 bg-white/[0.02] border border-white/[0.04] rounded-md mb-2">
            {session.organizationId}
          </p>
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            Secure multi-tenant environment identifier
          </p>
        </div>

      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#475569] mb-4">
          Support Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Configure Chatbot */}
          <Link
            href="/dashboard/settings"
            className="glass-card p-6 flex items-start gap-4 group cursor-pointer border border-white/[0.04] relative"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c084fc]/15 to-transparent" />
            <div className="w-10 h-10 rounded-xl bg-[#c084fc]/10 border border-[#c084fc]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
              <Settings className="w-5 h-5 text-[#c084fc]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white mb-1">
                  {isConfigured ? "Update Agent Identity" : "Initialize Agent Details"}
                </h3>
                <ArrowUpRight className="w-4 h-4 text-[#475569] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                {isConfigured
                  ? "Update your business profile context, AI instructions prompt, system parameters, and styling options."
                  : "Train your chatbot, enter initial FAQ knowledge bases, and personalize bot styling."}
              </p>
            </div>
          </Link>

          {/* Get Embed Code */}
          <Link
            href="/dashboard/embed"
            className="glass-card p-6 flex items-start gap-4 group cursor-pointer border border-white/[0.04] relative"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/[0.15] to-transparent" />
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
              <Code className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white mb-1">
                  Retrieve Script Snippet
                </h3>
                <ArrowUpRight className="w-4 h-4 text-[#475569] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Copy the single script element block required to inject the responsive AI chatbot bubble onto any platform.
              </p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
