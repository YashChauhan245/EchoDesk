import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  BookOpen,
  Check,
  ChevronRight,
  MessageSquare,
  Plus,
} from "lucide-react";
import type { ReactNode } from "react";
import Counter from "@/components/Counter";
import CopyButton from "./CopyButton";
import { MetricCard, PageHeading, StatusBadge } from "./DashboardUI";
import { panelClass, primaryButtonClass, secondaryButtonClass } from "./styles";

export interface OverviewProps {
  organizationId: string;
  conversationCount: number;
  agent: { name: string; businessName: string; hasKnowledge: boolean } | null;
  subscription: {
    plan: string;
    status: string;
    limits: { maxMessages: number; maxChatbots: number };
    usage: { messagesUsed: number; chatbotsCreated: number };
  };
  recentConversations: {
    sessionId: string;
    preview: string;
    flagged: boolean;
    date: string;
  }[];
}

function SetupStep({
  title,
  number,
  complete,
  href,
  detail,
}: {
  title: string;
  number: number;
  complete: boolean;
  href: string;
  detail: string;
}) {
  return (
    <Link href={href} className="flex items-center gap-3 py-4 text-[13px]">
      <span
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] ${complete ? "border-[var(--dash-green)]/25 text-[var(--dash-green)]" : "border-[var(--dash-border)] text-[var(--dash-muted)]"}`}
      >
        {complete ? <Check className="h-3.5 w-3.5" /> : number}
      </span>
      <span className="flex-1">{title}</span>
      <span className="hidden text-[11px] text-[var(--dash-muted)] sm:inline">
        {detail}
      </span>
      <ChevronRight className="h-3.5 w-3.5 text-[var(--dash-muted)]" />
    </Link>
  );
}

function PanelHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex items-center justify-between gap-3 px-5 py-4">
      <div>
        <h2 className="text-[14px] font-medium">{title}</h2>
        {description && (
          <p className="mt-1 text-[12px] text-[var(--dash-muted)]">
            {description}
          </p>
        )}
      </div>
      {action}
    </header>
  );
}

export default function Overview({
  organizationId,
  conversationCount,
  agent,
  subscription,
  recentConversations,
}: OverviewProps) {
  const { usage, limits } = subscription;
  const messagePercent =
    limits.maxMessages > 0
      ? Math.min(
          100,
          Math.max(0, (usage.messagesUsed / limits.maxMessages) * 100),
        )
      : 0;
  const atAgentLimit = usage.chatbotsCreated >= limits.maxChatbots;

  return (
    <>
      <PageHeading
        eyebrow="Workspace overview"
        title="Your support, at a glance."
        description="A clear view of your agent, conversations, and monthly usage."
        actions={
          <>
            {agent && (
              <Link href="/dashboard/settings" className={secondaryButtonClass}>
                Edit agent
              </Link>
            )}
            <Link
              href={agent ? "/dashboard/preview" : "/dashboard/settings"}
              className={primaryButtonClass}
            >
              {agent ? (
                <>
                  <ArrowUpRight className="h-4 w-4" /> Open playground
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Create your first agent
                </>
              )}
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Conversations"
          value={<Counter value={conversationCount} />}
          description="Customer conversations handled"
          icon={<MessageSquare className="h-[18px] w-[18px]" />}
        />
        <MetricCard
          label="AI messages"
          value={<Counter value={usage.messagesUsed} />}
          description={`of ${limits.maxMessages.toLocaleString()} messages this month`}
          icon={<Activity className="h-[18px] w-[18px]" />}
        />
        <MetricCard
          label="Your agents"
          value={<Counter value={usage.chatbotsCreated} />}
          description={`of ${limits.maxChatbots} on your ${subscription.plan.toLowerCase()} plan`}
          icon={<AudioLines className="h-[18px] w-[18px]" />}
        />
      </div>

      <div className="mt-7 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_310px]">
        <div className="space-y-5">
          <section className={`${panelClass} overflow-hidden`}>
            <div className="border-b border-[var(--dash-border)]">
              <PanelHeading
                title="Your agent"
                action={
                  <Link
                    href={
                      atAgentLimit
                        ? "/dashboard/pricing"
                        : "/dashboard/settings"
                    }
                    className={secondaryButtonClass}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {atAgentLimit ? "Compare plans" : "Add agent"}
                  </Link>
                }
              />
            </div>
            {agent ? (
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-lg border border-[var(--dash-border)] bg-[var(--dash-hover)] text-[var(--dash-accent)]">
                      <AudioLines className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-[14px] font-medium">{agent.name}</h3>
                      <p className="mt-1 text-[12px] text-[var(--dash-muted)]">
                        {agent.businessName}
                      </p>
                    </div>
                  </div>
                  <StatusBadge tone="success">Configured</StatusBadge>
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--dash-border)] pt-4">
                  <p className="flex items-center gap-2 text-[12px] text-[var(--dash-muted)]">
                    <BookOpen className="h-3.5 w-3.5" />
                    {agent.hasKnowledge
                      ? "Connected to your business knowledge"
                      : "Add knowledge to guide your answers"}
                  </p>
                  <Link
                    href="/dashboard/settings"
                    className="inline-flex items-center gap-2 text-[12px] hover:text-[var(--dash-accent)]"
                  >
                    Manage agent <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="px-6 py-10 text-center">
                <AudioLines className="mx-auto mb-4 h-7 w-7 text-[var(--dash-accent)]" />
                <h3 className="text-[16px] font-medium">
                  A little setup. Always-on support.
                </h3>
                <p className="mx-auto mb-5 mt-2 max-w-sm text-[13px] leading-relaxed text-[var(--dash-muted)]">
                  Create your first agent, add what your business knows, and
                  make it your own.
                </p>
                <Link href="/dashboard/settings" className={primaryButtonClass}>
                  <Plus className="h-4 w-4" /> Create your first agent
                </Link>
              </div>
            )}
          </section>

          <section className={panelClass}>
            <PanelHeading
              title="Make yourself available"
              description="Three small steps to useful answers."
            />
            <div className="divide-y divide-[var(--dash-border)] px-5">
              <SetupStep
                title="Give your agent its identity"
                number={1}
                complete={!!agent}
                href="/dashboard/settings"
                detail={agent ? "Complete" : "Get started"}
              />
              <SetupStep
                title="Add your business knowledge"
                number={2}
                complete={!!agent?.hasKnowledge}
                href="/dashboard/settings"
                detail={agent?.hasKnowledge ? "Complete" : "Add knowledge"}
              />
              <SetupStep
                title="Add the widget to your website"
                number={3}
                complete={false}
                href="/dashboard/embed"
                detail="View script"
              />
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className={`${panelClass} p-5`}>
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-medium">Plan & usage</h2>
              <span className="rounded border border-[var(--dash-border)] bg-[var(--dash-hover)] px-2 py-0.5 text-[10px] font-medium">
                {subscription.plan}
              </span>
            </div>
            <p className="mt-1 text-[12px] text-[var(--dash-muted)]">
              Room to start. Flexibility to grow.
            </p>
            <div className="mt-6 space-y-5">
              <div>
                <div className="mb-2 flex justify-between text-[12px]">
                  <span className="text-[var(--dash-muted)]">AI messages</span>
                  <span>
                    {usage.messagesUsed.toLocaleString()} /{" "}
                    {limits.maxMessages.toLocaleString()}
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-label="Monthly AI message usage"
                  aria-valuenow={Math.min(
                    usage.messagesUsed,
                    limits.maxMessages,
                  )}
                  aria-valuemin={0}
                  aria-valuemax={limits.maxMessages}
                  className="h-1.5 overflow-hidden rounded-full bg-[var(--dash-hover)]"
                >
                  <div
                    className="h-full rounded-full bg-[var(--dash-accent)] transition-all"
                    style={{ width: `${messagePercent}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-[var(--dash-muted)]">Agents</span>
                <span>
                  {usage.chatbotsCreated} / {limits.maxChatbots}
                </span>
              </div>
            </div>
            <div className="mt-6 border-t border-[var(--dash-border)] pt-4">
              <Link
                href="/dashboard/pricing"
                className="flex items-center justify-between text-[12px] font-medium"
              >
                Compare plans <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </section>

          <section className={`${panelClass} p-5`}>
            <h2 className="text-[13px] font-medium">Workspace details</h2>
            <p className="mt-3 text-[11px] text-[var(--dash-muted)]">
              Organization ID
            </p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <code className="min-w-0 break-all text-[11px] text-[var(--dash-muted)]">
                {organizationId}
              </code>
              <CopyButton value={organizationId} />
            </div>
            <p className="mt-3 border-t border-[var(--dash-border)] pt-3 text-[11px] leading-relaxed text-[var(--dash-muted)]">
              Your knowledge and conversations belong to this workspace.
            </p>
          </section>
        </aside>
      </div>

      <section className={`${panelClass} mt-7 overflow-hidden`}>
        <PanelHeading
          title="Recent conversations"
          description="Stay close to what your customers are asking."
          action={
            <Link
              href="/dashboard/inbox"
              className="inline-flex items-center gap-2 text-[12px] text-[var(--dash-muted)] hover:text-[var(--dash-text)]"
            >
              View inbox <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        {recentConversations.length ? (
          recentConversations.map((conversation) => (
            <Link
              key={conversation.sessionId}
              href={`/dashboard/inbox?session=${encodeURIComponent(conversation.sessionId)}`}
              className="grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-3 border-t border-[var(--dash-border)] px-5 py-4 transition-colors hover:bg-[var(--dash-hover)] sm:grid-cols-[32px_minmax(0,1fr)_112px_90px]"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full border border-[var(--dash-border)] bg-[var(--dash-hover)] text-[var(--dash-muted)]">
                <MessageSquare className="h-3.5 w-3.5" />
              </span>
              <span className="min-w-0">
                <strong className="block text-[13px] font-medium">
                  Website visitor
                </strong>
                <span className="mt-0.5 block truncate text-[12px] text-[var(--dash-muted)]">
                  {conversation.preview}
                </span>
              </span>
              <span
                className={`text-[11px] ${conversation.flagged ? "text-[var(--dash-amber)]" : "text-[var(--dash-green)]"}`}
              >
                {conversation.flagged ? "Needs review" : "Conversation"}
              </span>
              <span className="hidden text-right text-[11px] text-[var(--dash-muted)] sm:block">
                {conversation.date}
              </span>
            </Link>
          ))
        ) : (
          <div className="border-t border-[var(--dash-border)] px-6 py-9 text-center">
            <p className="text-[14px]">Your next conversation starts here.</p>
            <p className="mt-2 text-[12px] text-[var(--dash-muted)]">
              Once your widget is live, customer questions will appear in your
              inbox.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
