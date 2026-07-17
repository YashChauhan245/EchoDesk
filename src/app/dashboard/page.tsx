import { getSession } from "@/lib/session";
import dbConnect from "@/lib/db";
import ChatbotSettings from "@/models/ChatbotSettings";
import Conversation from "@/models/Conversation";
import Subscription from "@/models/Subscription";
import Link from "next/link";
import Counter from "@/components/Counter";
import { 
  Bot, 
  MessageSquare, 
  Key, 
  Settings, 
  Code, 
  ChevronRight,
  TrendingUp,
  Activity,
  ArrowUpRight,
  CreditCard
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

  // Fetch or mock subscription details
  let subscription = await Subscription.findOne({
    organizationId: session.organizationId,
  }).lean() as any;

  const chatbotsCreated = await ChatbotSettings.countDocuments({
    organizationId: session.organizationId,
  });

  if (!subscription) {
    subscription = {
      plan: "FREE",
      status: "active",
      limits: {
        maxChatbots: 1,
        maxWebsites: 1,
        maxMessages: 500,
      },
      usage: {
        messagesUsed: 0,
        chatbotsCreated: chatbotsCreated,
      },
    } as any;
  } else if (subscription.usage?.chatbotsCreated !== chatbotsCreated) {
    // Sync the cache in subscription document
    await Subscription.updateOne(
      { organizationId: session.organizationId },
      { $set: { "usage.chatbotsCreated": chatbotsCreated } }
    );
    subscription.usage.chatbotsCreated = chatbotsCreated;
  }

  const isConfigured = !!settings;

  return (
    <div className="animate-fade-in space-y-12 relative">
      {/* Soft header radial glow backdrop */}
      <div className="absolute top-0 left-0 right-0 h-[220px] bg-gradient-to-b from-[#6366f1]/[0.02] dark:from-[#6366f1]/[0.04] to-transparent pointer-events-none -z-10 blur-xl" />

      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-black/[0.03] dark:border-white/[0.06] bg-black/[0.01] dark:bg-white/[0.015] mb-1">
          <Activity className="w-3.5 h-3.5 text-black dark:text-white" />
          <span className="text-[10px] text-[#0f0f15] dark:text-white font-bold uppercase tracking-widest">System Operational</span>
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f0f15] dark:text-white mb-2.5">
            Welcome back, {session.name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#5f6368] dark:text-[#94a3b8] leading-relaxed">
            Here is a high-level overview of your automated customer support workspace.
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        
        {/* Chatbot Status */}
        <div className="glass-card p-6 sm:p-7 relative group shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#5f6368] dark:text-[#94a3b8]">
              Chatbot Status
            </span>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                {isConfigured && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isConfigured ? "bg-emerald-500" : "bg-amber-500"}`}></span>
              </span>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isConfigured ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                {isConfigured ? "Active" : "Pending"}
              </span>
            </div>
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-[#0f0f15] dark:text-white mb-2.5">
            {isConfigured ? "Configured" : "Not Set Up"}
          </p>
          <p className="text-xs text-[#5f6368] dark:text-[#94a3b8] leading-relaxed">
            {isConfigured
              ? `Running under context "${settings.businessName}"`
              : "Complete configuration to launch your Gemini-powered agent"}
          </p>
        </div>

        {/* Conversations */}
        <div className="glass-card p-6 sm:p-7 relative group shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#5f6368] dark:text-[#94a3b8]">
              Total Interactions
            </span>
            <div className="w-8 h-8 rounded-lg bg-neutral-50 dark:bg-white/[0.02] border border-black/[0.015] dark:border-white/[0.015] flex items-center justify-center text-black dark:text-white">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-[#0f0f15] dark:text-white mb-2.5">
            <Counter value={conversationCount} />
          </p>
          <p className="text-xs text-[#5f6368] dark:text-[#94a3b8] leading-relaxed">
            Total unique user sessions handled and audited by the Gemini LLM
          </p>
        </div>

        {/* Tenant/Organization ID */}
        <div className="glass-card p-6 sm:p-7 relative group shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#5f6368] dark:text-[#94a3b8]">
              Organization ID
            </span>
            <div className="w-8 h-8 rounded-lg bg-neutral-50 dark:bg-white/[0.02] border border-black/[0.015] dark:border-white/[0.015] flex items-center justify-center text-[#5f6368] dark:text-[#94a3b8]">
              <Key className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] font-mono text-[#0f0f15] dark:text-white break-all select-all font-semibold p-2.5 bg-neutral-50 dark:bg-white/[0.02] border border-black/[0.015] dark:border-white/[0.015] rounded-md mb-2.5">
            {session.organizationId}
          </p>
          <p className="text-xs text-[#5f6368] dark:text-[#94a3b8] leading-relaxed">
            Secure multi-tenant environment identifier
          </p>
        </div>

        {/* Subscription & Usage Card */}
        <div className="glass-card p-6 sm:p-7 relative group shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#5f6368] dark:text-[#94a3b8]">
                Subscription Plan
              </span>
              <div className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                subscription.plan === "PRO" 
                  ? "bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/15" 
                  : subscription.plan === "STARTER"
                    ? "bg-blue-500/10 text-blue-500 border border-blue-500/15"
                    : "bg-neutral-500/10 text-neutral-500 border border-neutral-500/15"
              }`}>
                {subscription.plan}
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Messages Usage */}
              <div>
                <div className="flex items-center justify-between text-[10px] mb-1.5 font-semibold">
                  <span className="text-[#5f6368] dark:text-[#94a3b8]">AI Messages</span>
                  <span className="text-[#0f0f15] dark:text-white">
                    <Counter value={subscription.usage.messagesUsed} /> / {subscription.limits.maxMessages.toLocaleString()}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-neutral-100 dark:bg-white/[0.04] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#6366f1] to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(100, (subscription.usage.messagesUsed / subscription.limits.maxMessages) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Chatbots Usage */}
              <div>
                <div className="flex items-center justify-between text-[10px] mb-1.5 font-semibold">
                  <span className="text-[#5f6368] dark:text-[#94a3b8]">AI Chatbots</span>
                  <span className="text-[#0f0f15] dark:text-white">
                    <Counter value={subscription.usage.chatbotsCreated} /> / {subscription.limits.maxChatbots}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-neutral-100 dark:bg-white/[0.04] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(100, (subscription.usage.chatbotsCreated / subscription.limits.maxChatbots) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-black/[0.015] dark:border-white/[0.015] flex items-center justify-between">
            <Link 
              href="/dashboard/pricing" 
              className="text-[10px] font-bold text-[#6366f1] dark:text-indigo-400 hover:underline flex items-center gap-0.5"
            >
              Plans & Billing
              <ChevronRight className="w-3 h-3" />
            </Link>
            <span className="text-[9px] text-[#5f6368] dark:text-[#475569] capitalize font-medium">
              Status: {subscription.status}
            </span>
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#5f6368] dark:text-[#94a3b8]">
          Support Settings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Configure Chatbot */}
          <Link
            href="/dashboard/settings"
            className="glass-card interactive-card p-6 sm:p-7 flex items-start gap-4 sm:gap-5 group cursor-pointer shadow-sm relative"
          >
            {/* Hover left accent indicator line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-black dark:bg-white opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-l-xl" />
            <div className="w-10 h-10 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-black/[0.015] dark:border-white/[0.015] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
              <Settings className="w-5 h-5 text-black dark:text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm sm:text-base text-[#0f0f15] dark:text-white mb-1.5">
                  {isConfigured ? "Update Agent Identity" : "Initialize Agent Details"}
                </h3>
                <ArrowUpRight className="w-4 h-4 text-[#5f6368] dark:text-[#94a3b8] group-hover:text-black dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <p className="text-xs text-[#5f6368] dark:text-[#94a3b8] leading-relaxed">
                {isConfigured
                  ? "Update your business profile context, AI instructions prompt, system parameters, and styling options."
                  : "Train your chatbot, enter initial FAQ knowledge bases, and personalize bot styling."}
              </p>
            </div>
          </Link>

          {/* Get Embed Code */}
          <Link
            href="/dashboard/embed"
            className="glass-card interactive-card p-6 sm:p-7 flex items-start gap-4 sm:gap-5 group cursor-pointer shadow-sm relative"
          >
            {/* Hover left accent indicator line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-black dark:bg-white opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-l-xl" />
            <div className="w-10 h-10 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-black/[0.015] dark:border-white/[0.015] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
              <Code className="w-5 h-5 text-black dark:text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm sm:text-base text-[#0f0f15] dark:text-white mb-1.5">
                  Retrieve Script Snippet
                </h3>
                <ArrowUpRight className="w-4 h-4 text-[#5f6368] dark:text-[#94a3b8] group-hover:text-black dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <p className="text-xs text-[#5f6368] dark:text-[#94a3b8] leading-relaxed">
                Copy the single script element block required to inject the responsive AI chatbot bubble onto any platform.
              </p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
