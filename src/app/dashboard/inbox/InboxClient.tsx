"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Inbox,
  Search,
  MessageSquare,
  Bot,
  User,
  Clock,
  ChevronRight,
  Trash2,
  RefreshCw,
  X,
  Hash,
  AlertCircle,
  Loader2,
  ArrowLeft,
  MailOpen,
  Flag,
  Download,
  FileText,
  FileJson,
  Printer,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ConversationItem {
  _id: string;
  sessionId: string;
  messageCount: number;
  isFlagged: boolean;
  preview: string;
  lastMessage: {
    role: "user" | "assistant";
    content: string;
    timestamp: string | null;
  } | null;
  createdAt: string | null;
  updatedAt: string | null;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string | null;
}

interface ConversationDetail {
  _id: string;
  sessionId: string;
  organizationId: string;
  messages: Message[];
  createdAt: string | null;
  updatedAt: string | null;
}

interface InboxClientProps {
  initialConversations: ConversationItem[];
  totalConversations: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTimestamp(ts: string | null): string {
  if (!ts) return "";
  const date = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffHrs < 1) {
    const mins = Math.floor(diffMs / (1000 * 60));
    return mins <= 1 ? "just now" : `${mins}m ago`;
  }
  if (diffHrs < 24) return `${Math.floor(diffHrs)}h ago`;
  if (diffDays < 7) return `${Math.floor(diffDays)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatFullTimestamp(ts: string | null): string {
  if (!ts) return "";
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncateSessionId(sessionId: string): string {
  return sessionId.length > 20 ? "…" + sessionId.slice(-12) : sessionId;
}

// ─── Export Utilities ─────────────────────────────────────────────────────────

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportAsCSV(detail: ConversationDetail) {
  const rows = [
    ["Session ID", "Role", "Message", "Timestamp"],
    ...detail.messages.map((m) => [
      detail.sessionId,
      m.role,
      `"${m.content.replace(/"/g, '""')}"`,
      m.timestamp ? new Date(m.timestamp).toISOString() : "",
    ]),
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  downloadFile(
    csv,
    `conversation-${detail.sessionId.slice(-8)}.csv`,
    "text/csv"
  );
}

function exportAsJSON(detail: ConversationDetail) {
  const payload = {
    sessionId: detail.sessionId,
    exportedAt: new Date().toISOString(),
    messageCount: detail.messages.length,
    messages: detail.messages.map((m) => ({
      role: m.role,
      content: m.content,
      timestamp: m.timestamp,
    })),
  };
  downloadFile(
    JSON.stringify(payload, null, 2),
    `conversation-${detail.sessionId.slice(-8)}.json`,
    "application/json"
  );
}

function exportAsPDF(detail: ConversationDetail) {
  // Build a clean print-ready HTML document and open it in a new window
  const rows = detail.messages
    .map(
      (m) => `
      <div class="message ${m.role}">
        <div class="bubble">
          <span class="role-label">${m.role === "user" ? "👤 Visitor" : "🤖 Bot"}</span>
          <p>${m.content.replace(/\n/g, "<br>")}</p>
          ${m.timestamp ? `<span class="ts">${formatFullTimestamp(m.timestamp)}</span>` : ""}
        </div>
      </div>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Conversation — ${detail.sessionId}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 40px auto; color: #1a1a1a; }
    h1 { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
    .meta { font-size: 11px; color: #888; margin-bottom: 24px; }
    .message { margin: 12px 0; display: flex; }
    .message.user { justify-content: flex-end; }
    .message.assistant { justify-content: flex-start; }
    .bubble { max-width: 72%; padding: 10px 14px; border-radius: 14px; font-size: 12px; line-height: 1.6; }
    .message.user .bubble { background: #0f0f15; color: #fff; border-bottom-right-radius: 4px; }
    .message.assistant .bubble { background: #f3f4f6; color: #1a1a1a; border-bottom-left-radius: 4px; border: 1px solid #e5e7eb; }
    .role-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px; opacity: 0.6; }
    .ts { font-size: 9px; color: #999; display: block; margin-top: 4px; }
    @media print { body { margin: 20px; } }
  </style>
</head>
<body>
  <h1>Conversation Transcript</h1>
  <p class="meta">Session: ${detail.sessionId} &nbsp;·&nbsp; ${detail.messages.length} messages &nbsp;·&nbsp; Exported: ${new Date().toLocaleString()}</p>
  ${rows}
  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function InboxClient({
  initialConversations,
  totalConversations,
}: InboxClientProps) {
  // ── State ──
  const [conversations, setConversations] =
    useState<ConversationItem[]>(initialConversations);
  const [total, setTotal] = useState(totalConversations);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(Math.ceil(totalConversations / 20));
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ConversationDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [mobileShowThread, setMobileShowThread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // ── Debounce search ──
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when flaggedOnly changes
  useEffect(() => {
    setPage(1);
  }, [flaggedOnly]);

  // ── Auto-dismiss toast ──
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // ── Scroll to bottom when detail loads ──
  useEffect(() => {
    if (detail) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 120);
    }
  }, [detail]);

  // ── Close export menu on outside click ──
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setExportMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Fetch conversation list ──
  const fetchConversations = useCallback(
    async (p: number, q: string, flagged: boolean, isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoadingList(true);

      try {
        const url = new URL("/api/conversations", window.location.origin);
        url.searchParams.set("page", String(p));
        url.searchParams.set("limit", "20");
        if (q) url.searchParams.set("search", q);
        if (flagged) url.searchParams.set("flagged", "true");

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("Failed to fetch conversations");
        const data = await res.json();

        setConversations(data.conversations);
        setTotal(data.total);
        setPages(data.pages);
      } catch {
        setToast({ type: "error", message: "Failed to load conversations" });
      } finally {
        setLoadingList(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchConversations(page, debouncedSearch, flaggedOnly);
  }, [page, debouncedSearch, flaggedOnly, fetchConversations]);

  // ── Fetch conversation detail ──
  const fetchDetail = useCallback(async (sessionId: string) => {
    setLoadingDetail(true);
    setDetail(null);
    try {
      const res = await fetch(`/api/conversations/${encodeURIComponent(sessionId)}`);
      if (!res.ok) throw new Error("Failed to fetch conversation");
      const data = await res.json();
      setDetail(data.conversation);
    } catch {
      setToast({ type: "error", message: "Failed to load conversation" });
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  function handleSelectConversation(conv: ConversationItem) {
    setSelectedSessionId(conv.sessionId);
    setMobileShowThread(true);
    fetchDetail(conv.sessionId);
    setExportMenuOpen(false);
  }

  // ── Delete conversation ──
  async function handleDelete(sessionId: string) {
    setDeletingSessionId(sessionId);
    try {
      const res = await fetch(`/api/conversations/${encodeURIComponent(sessionId)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");

      setConversations((prev) => prev.filter((c) => c.sessionId !== sessionId));
      setTotal((t) => t - 1);
      setDeleteConfirm(null);

      if (selectedSessionId === sessionId) {
        setSelectedSessionId(null);
        setDetail(null);
        setMobileShowThread(false);
      }

      setToast({ type: "success", message: "Conversation deleted" });
    } catch {
      setToast({ type: "error", message: "Failed to delete conversation" });
    } finally {
      setDeletingSessionId(null);
    }
  }

  // ── Flagged message detection (client-side highlight) ──
  const FALLBACK_PATTERNS = [
    "i don't have that information",
    "don't have that information in my knowledge base",
    "contact us directly",
    "please contact",
    "i'm not sure",
    "i cannot help with that",
    "i don't know",
    "not covered in",
    "outside my knowledge",
    "unable to assist",
  ];

  function isMessageFlagged(content: string): boolean {
    const lower = content.toLowerCase();
    return FALLBACK_PATTERNS.some((p) => lower.includes(p));
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  const flaggedCount = conversations.filter((c) => c.isFlagged).length;

  return (
    <div className="animate-fade-in h-full relative">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium transition-all duration-300 ${
            toast.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
              : "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
          }`}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-1 hover:opacity-70 transition-opacity">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-black/[0.03] dark:border-white/[0.06] bg-black/[0.01] dark:bg-white/[0.015] mb-1">
          <Inbox className="w-3.5 h-3.5 text-black dark:text-white" />
          <span className="text-[10px] text-[#0f0f15] dark:text-white font-bold uppercase tracking-widest">
            Live Inbox
          </span>
        </div>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f0f15] dark:text-white mb-2.5">
              Conversation Inbox
            </h1>
            <p className="text-xs sm:text-sm text-[#5f6368] dark:text-[#94a3b8] leading-relaxed">
              Browse and review every visitor chat session. Export transcripts or filter flagged responses.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Stats pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/[0.025] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06]">
              <MessageSquare className="w-3.5 h-3.5 text-[#8f8afc]" />
              <span className="text-xs font-bold text-[#0f0f15] dark:text-white">
                {total.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#5f6368] dark:text-[#94a3b8]">sessions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Panel Layout */}
      <div className="glass-card overflow-hidden" style={{ minHeight: "600px" }}>
        <div className="flex h-full" style={{ minHeight: "600px" }}>

          {/* ── Left Panel: Conversation List ────────────────────────── */}
          <div
            className={`flex flex-col border-r border-black/[0.04] dark:border-white/[0.06] ${
              mobileShowThread ? "hidden lg:flex" : "flex"
            } w-full lg:w-[360px] flex-shrink-0`}
          >
            {/* Toolbar */}
            <div className="p-3.5 border-b border-black/[0.04] dark:border-white/[0.06] space-y-2">
              {/* Search */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5f6368] dark:text-[#94a3b8] pointer-events-none" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search sessions or messages…"
                    className="w-full pl-8 pr-8 py-2 text-[11px] rounded-lg bg-black/[0.025] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] text-[#0f0f15] dark:text-white placeholder-[#94a3b8] focus:outline-none focus:ring-1 focus:ring-[#8f8afc]/30 dark:focus:ring-[#8f8afc]/20 transition-all"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#0f0f15] dark:hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => fetchConversations(page, debouncedSearch, flaggedOnly, true)}
                  disabled={refreshing}
                  title="Refresh"
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-black/[0.04] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02] text-[#5f6368] dark:text-[#94a3b8] hover:text-[#0f0f15] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                </button>
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFlaggedOnly(false)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all ${
                    !flaggedOnly
                      ? "bg-[#0f0f15] dark:bg-white text-white dark:text-[#0f0f15]"
                      : "bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] text-[#5f6368] dark:text-[#94a3b8] hover:text-[#0f0f15] dark:hover:text-white"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFlaggedOnly(true)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all ${
                    flaggedOnly
                      ? "bg-amber-500 text-white"
                      : "bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] text-[#5f6368] dark:text-[#94a3b8] hover:text-amber-600 hover:border-amber-500/30"
                  }`}
                >
                  <Flag className="w-2.5 h-2.5" />
                  Flagged
                  {!flaggedOnly && flaggedCount > 0 && (
                    <span className="ml-0.5 bg-amber-500/15 text-amber-600 px-1 rounded text-[9px] font-bold">
                      {flaggedCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {loadingList ? (
                <div className="flex flex-col items-center justify-center h-full py-20 gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-[#8f8afc]" />
                  <p className="text-xs text-[#94a3b8]">Loading conversations…</p>
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-20 gap-4 px-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] flex items-center justify-center">
                    {flaggedOnly ? (
                      <Flag className="w-5 h-5 text-[#94a3b8]" />
                    ) : (
                      <MailOpen className="w-5 h-5 text-[#94a3b8]" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0f0f15] dark:text-white mb-1">
                      {flaggedOnly
                        ? "No flagged conversations"
                        : debouncedSearch
                        ? "No matching conversations"
                        : "No conversations yet"}
                    </p>
                    <p className="text-xs text-[#94a3b8]">
                      {flaggedOnly
                        ? "Great! No low-confidence responses detected"
                        : debouncedSearch
                        ? "Try a different search term"
                        : "When visitors chat with your bot, sessions will appear here"}
                    </p>
                  </div>
                  {(flaggedOnly || debouncedSearch) && (
                    <button
                      onClick={() => { setFlaggedOnly(false); setSearch(""); }}
                      className="text-xs text-[#8f8afc] hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <ul className="divide-y divide-black/[0.03] dark:divide-white/[0.04]">
                  {conversations.map((conv) => {
                    const isSelected = selectedSessionId === conv.sessionId;
                    return (
                      <li key={conv.sessionId}>
                        <button
                          onClick={() => handleSelectConversation(conv)}
                          className={`w-full text-left px-4 py-3.5 transition-all duration-150 group relative ${
                            isSelected
                              ? "bg-[#8f8afc]/[0.07] dark:bg-[#8f8afc]/[0.1]"
                              : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                          }`}
                        >
                          {/* Active left accent bar */}
                          {isSelected && (
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#8f8afc] rounded-r-full" />
                          )}
                          {/* Flagged left accent bar */}
                          {conv.isFlagged && !isSelected && (
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-400 rounded-r-full" />
                          )}

                          <div className="flex items-start gap-3">
                            {/* Avatar */}
                            <div
                              className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-0.5 ${
                                isSelected
                                  ? "bg-[#8f8afc]/20 text-[#8f8afc]"
                                  : conv.isFlagged
                                  ? "bg-amber-500/10 text-amber-500"
                                  : "bg-black/[0.04] dark:bg-white/[0.04] text-[#5f6368] dark:text-[#94a3b8]"
                              }`}
                            >
                              {conv.isFlagged ? (
                                <Flag className="w-4 h-4" />
                              ) : (
                                <User className="w-4 h-4" />
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-0.5">
                                <span
                                  className={`text-[11px] font-mono font-semibold truncate ${
                                    isSelected
                                      ? "text-[#8f8afc]"
                                      : "text-[#0f0f15] dark:text-white"
                                  }`}
                                >
                                  {truncateSessionId(conv.sessionId)}
                                </span>
                                <span className="text-[9px] text-[#94a3b8] flex-shrink-0">
                                  {formatTimestamp(conv.updatedAt)}
                                </span>
                              </div>

                              <p className="text-[11px] text-[#5f6368] dark:text-[#94a3b8] truncate leading-relaxed mb-1.5">
                                {conv.preview}
                              </p>

                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                    isSelected
                                      ? "bg-[#8f8afc]/15 text-[#8f8afc]"
                                      : "bg-black/[0.04] dark:bg-white/[0.04] text-[#5f6368] dark:text-[#94a3b8]"
                                  }`}
                                >
                                  <MessageSquare className="w-2.5 h-2.5" />
                                  {conv.messageCount} msg{conv.messageCount !== 1 ? "s" : ""}
                                </span>
                                {conv.isFlagged && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                    <Flag className="w-2.5 h-2.5" />
                                    Flagged
                                  </span>
                                )}
                              </div>
                            </div>

                            <ChevronRight
                              className={`w-3.5 h-3.5 flex-shrink-0 mt-1 transition-all ${
                                isSelected
                                  ? "text-[#8f8afc] translate-x-0.5"
                                  : "text-[#d1d5db] dark:text-[#374151] group-hover:text-[#94a3b8] group-hover:translate-x-0.5"
                              }`}
                            />
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="p-3 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loadingList}
                  className="text-[10px] font-medium px-3 py-1.5 rounded-md border border-black/[0.04] dark:border-white/[0.06] text-[#5f6368] dark:text-[#94a3b8] hover:text-[#0f0f15] dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.02] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <span className="text-[10px] text-[#94a3b8]">
                  Page {page} of {pages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page === pages || loadingList}
                  className="text-[10px] font-medium px-3 py-1.5 rounded-md border border-black/[0.04] dark:border-white/[0.06] text-[#5f6368] dark:text-[#94a3b8] hover:text-[#0f0f15] dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.02] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* ── Right Panel: Message Thread ───────────────────────────── */}
          <div
            className={`flex-1 flex flex-col min-w-0 ${
              !mobileShowThread ? "hidden lg:flex" : "flex"
            }`}
          >
            {!selectedSessionId ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center h-full text-center px-10 gap-5">
                <div className="w-16 h-16 rounded-3xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] flex items-center justify-center">
                  <MessageSquare className="w-7 h-7 text-[#d1d5db] dark:text-[#374151]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0f0f15] dark:text-white mb-1.5">
                    Select a conversation
                  </p>
                  <p className="text-xs text-[#94a3b8] leading-relaxed max-w-xs">
                    Click any session from the left to read the full message thread and export it
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Thread Header */}
                <div className="p-4 border-b border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between gap-3">
                  {/* Mobile back */}
                  <button
                    onClick={() => { setMobileShowThread(false); setSelectedSessionId(null); }}
                    className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.04] text-[#5f6368] dark:text-[#94a3b8] hover:text-[#0f0f15] dark:hover:text-white transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#8f8afc]/10 dark:bg-[#8f8afc]/15 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-[#8f8afc]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Hash className="w-3 h-3 text-[#94a3b8] flex-shrink-0" />
                        <p className="text-[11px] font-mono font-semibold text-[#0f0f15] dark:text-white truncate">
                          {selectedSessionId}
                        </p>
                        {/* Flagged badge on header */}
                        {conversations.find((c) => c.sessionId === selectedSessionId)?.isFlagged && (
                          <span className="flex-shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <Flag className="w-2.5 h-2.5" />
                            Flagged
                          </span>
                        )}
                      </div>
                      {detail && (
                        <p className="text-[10px] text-[#94a3b8]">
                          {detail.messages.length} messages · Started{" "}
                          {formatFullTimestamp(detail.createdAt)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    {/* Export dropdown */}
                    {detail && (
                      <div className="relative" ref={exportMenuRef}>
                        <button
                          onClick={() => setExportMenuOpen((v) => !v)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-black/[0.04] dark:border-white/[0.06] text-[10px] font-semibold text-[#5f6368] dark:text-[#94a3b8] hover:text-[#0f0f15] dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-all"
                        >
                          <Download className="w-3 h-3" />
                          Export
                        </button>

                        {exportMenuOpen && (
                          <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1a1a24] shadow-xl z-30 overflow-hidden animate-fade-in">
                            <div className="p-1">
                              <button
                                onClick={() => { exportAsCSV(detail); setExportMenuOpen(false); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-medium text-[#0f0f15] dark:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors text-left"
                              >
                                <FileText className="w-3.5 h-3.5 text-emerald-500" />
                                Download CSV
                              </button>
                              <button
                                onClick={() => { exportAsJSON(detail); setExportMenuOpen(false); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-medium text-[#0f0f15] dark:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors text-left"
                              >
                                <FileJson className="w-3.5 h-3.5 text-blue-500" />
                                Download JSON
                              </button>
                              <button
                                onClick={() => { exportAsPDF(detail); setExportMenuOpen(false); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-medium text-[#0f0f15] dark:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors text-left"
                              >
                                <Printer className="w-3.5 h-3.5 text-red-500" />
                                Print / PDF
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Delete */}
                    {deleteConfirm === selectedSessionId ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-red-500 dark:text-red-400 font-medium">
                          Delete?
                        </span>
                        <button
                          onClick={() => handleDelete(selectedSessionId)}
                          disabled={!!deletingSessionId}
                          className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-50"
                        >
                          {deletingSessionId ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            "Confirm"
                          )}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-[10px] font-medium px-2.5 py-1 rounded-md border border-black/[0.04] dark:border-white/[0.06] text-[#5f6368] dark:text-[#94a3b8] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(selectedSessionId)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-black/[0.04] dark:border-white/[0.06] text-[#94a3b8] hover:text-red-500 hover:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                        title="Delete conversation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {loadingDetail ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3">
                      <Loader2 className="w-5 h-5 animate-spin text-[#8f8afc]" />
                      <p className="text-xs text-[#94a3b8]">Loading messages…</p>
                    </div>
                  ) : detail ? (
                    <>
                      {detail.messages.map((msg, idx) => {
                        const flagged = msg.role === "assistant" && isMessageFlagged(msg.content);
                        return (
                          <div
                            key={idx}
                            className={`flex items-end gap-2.5 animate-fade-in ${
                              msg.role === "user" ? "flex-row-reverse" : "flex-row"
                            }`}
                          >
                            {/* Avatar */}
                            <div
                              className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mb-1 ${
                                msg.role === "user"
                                  ? "bg-[#0f0f15] dark:bg-white"
                                  : flagged
                                  ? "bg-amber-500/15"
                                  : "bg-[#8f8afc]/15 dark:bg-[#8f8afc]/20"
                              }`}
                            >
                              {msg.role === "user" ? (
                                <User className="w-3.5 h-3.5 text-white dark:text-[#0f0f15]" />
                              ) : flagged ? (
                                <Flag className="w-3.5 h-3.5 text-amber-500" />
                              ) : (
                                <Bot className="w-3.5 h-3.5 text-[#8f8afc]" />
                              )}
                            </div>

                            {/* Bubble */}
                            <div
                              className={`max-w-[72%] group flex flex-col gap-1 ${
                                msg.role === "user" ? "items-end" : "items-start"
                              }`}
                            >
                              <div
                                className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap break-words ${
                                  msg.role === "user"
                                    ? "bg-[#0f0f15] dark:bg-white text-white dark:text-[#0f0f15] rounded-br-sm"
                                    : flagged
                                    ? "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-[#0f0f15] dark:text-[#f1f5f9] rounded-bl-sm"
                                    : "bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06] text-[#0f0f15] dark:text-[#f1f5f9] rounded-bl-sm"
                                }`}
                              >
                                {flagged && (
                                  <span className="flex items-center gap-1 text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1.5">
                                    <Flag className="w-2.5 h-2.5" />
                                    Low confidence response
                                  </span>
                                )}
                                {msg.content}
                              </div>
                              {/* Timestamp on hover */}
                              <div
                                className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                }`}
                              >
                                <Clock className="w-2.5 h-2.5 text-[#94a3b8]" />
                                <span className="text-[9px] text-[#94a3b8]">
                                  {formatFullTimestamp(msg.timestamp)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </>
                  ) : null}
                </div>

                {/* Thread Footer */}
                {detail && (
                  <div className="p-3.5 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-[10px] text-[#94a3b8]">
                      <Clock className="w-3 h-3" />
                      Last activity:{" "}
                      <span className="font-medium text-[#5f6368] dark:text-[#64748b]">
                        {formatTimestamp(detail.updatedAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Flagged message count badge */}
                      {(() => {
                        const flaggedMsgs = detail.messages.filter(
                          (m) => m.role === "assistant" && isMessageFlagged(m.content)
                        ).length;
                        if (flaggedMsgs === 0) return null;
                        return (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                            <Flag className="w-2.5 h-2.5" />
                            {flaggedMsgs} flagged
                          </span>
                        );
                      })()}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] text-[10px] text-[#94a3b8]">
                        <MessageSquare className="w-2.5 h-2.5" />
                        {detail.messages.length} messages
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
