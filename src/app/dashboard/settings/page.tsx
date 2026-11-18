"use client";

import {
  primaryButtonClass,
  secondaryButtonClass,
  inputClass,
} from "@/app/dashboard/styles";

import { PageHeading } from "@/app/dashboard/DashboardUI";
import WidgetPreview from "@/app/dashboard/WidgetPreview";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Palette,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Plus,
  Settings,
  ArrowLeft,
  Bot,
  Copy,
  Check,
  Upload,
  Globe,
  FileText,
  Link as LinkIcon,
} from "lucide-react";
import type { IChatbotSettings, ISubscription } from "@/types";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [chatbots, setChatbots] = useState<IChatbotSettings[]>([]);
  const [subscription, setSubscription] = useState<ISubscription | null>(null);

  // Navigation / View states
  // "list" | "create" | "edit"
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [appUrl, setAppUrl] = useState("");

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form states
  const [chatbotName, setChatbotName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [knowledgeBase, setKnowledgeBase] = useState("");
  const [widgetColor, setWidgetColor] = useState("#6366f1");
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Hi there! 👋 How can I help you today?",
  );

  // Scraper states
  const [activeImportTab, setActiveImportTab] = useState<"file" | "url">(
    "file",
  );
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  // Auto-dismiss import toast alerts
  useEffect(() => {
    if (importError || importSuccess) {
      const timer = setTimeout(() => {
        setImportError(null);
        setImportSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [importError, importSuccess]);

  // File Upload Scraper Handler
  async function handleFileImport(e: React.MouseEvent) {
    e.preventDefault();
    if (!selectedFile) return;

    setImporting(true);
    setImportError(null);
    setImportSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/scrape/file", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to parse file");
      }

      const textHeader = `\n\n=== IMPORTED FROM FILE: ${data.fileName} ===\n${data.text}\n=== END IMPORT ===\n`;

      // Enforce total limit on client side
      if ((knowledgeBase + textHeader).length > 50000) {
        throw new Error(
          "Importing this file would exceed the 50,000 character limit.",
        );
      }

      setKnowledgeBase((prev) => prev + textHeader);
      setImportSuccess(`Successfully imported text from ${data.fileName}!`);
      setSelectedFile(null);

      // Reset file input element visually
      const fileInput = document.getElementById(
        "file-uploader-input",
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err: any) {
      setImportError(err.message || "Failed to process document upload.");
    } finally {
      setImporting(false);
    }
  }

  // URL Scraper Handler
  async function handleUrlScrape(e: React.MouseEvent) {
    e.preventDefault();
    if (!scrapeUrl || !scrapeUrl.trim()) return;

    setImporting(true);
    setImportError(null);
    setImportSuccess(null);

    try {
      const res = await fetch("/api/scrape/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scrapeUrl.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to scrape URL");
      }

      const textHeader = `\n\n=== SCRAPED FROM URL: ${scrapeUrl.trim()} ===\n${data.text}\n=== END SCRAPE ===\n`;

      if ((knowledgeBase + textHeader).length > 50000) {
        throw new Error(
          "Scraping this website would exceed the 50,000 character limit.",
        );
      }

      setKnowledgeBase((prev) => prev + textHeader);
      setImportSuccess(`Successfully scraped text content from host!`);
      setScrapeUrl("");
    } catch (err: any) {
      setImportError(err.message || "Failed to process website scraping.");
    } finally {
      setImporting(false);
    }
  }

  // Load app URL on mount
  useEffect(() => {
    setAppUrl(window.location.origin);
    fetchData();
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  async function fetchData() {
    try {
      setLoading(true);
      const res = await fetch("/api/settings");
      const data = await res.json();

      if (data.chatbots) {
        setChatbots(data.chatbots);
      }
      if (data.subscription) {
        setSubscription(data.subscription);
      }
    } catch (err) {
      console.error("Failed to load settings data:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setSelectedBotId(null);
    setChatbotName("");
    setBusinessName("");
    setEmail("");
    setKnowledgeBase("");
    setWidgetColor("#6366f1");
    setWelcomeMessage("Hi there! 👋 How can I help you today?");
    setView("create");
  }

  function handleOpenConfigure(bot: IChatbotSettings) {
    setSelectedBotId(bot._id || null);
    setChatbotName(bot.chatbotName || "My Chatbot");
    setBusinessName(bot.businessName || "");
    setEmail(bot.email || "");
    setKnowledgeBase(bot.knowledgeBase || "");
    setWidgetColor(bot.widgetColor || "#6366f1");
    setWelcomeMessage(
      bot.welcomeMessage || "Hi there! 👋 How can I help you today?",
    );
    setView("edit");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setToast(null);

    try {
      const payload: any = {
        chatbotName,
        businessName,
        email,
        knowledgeBase,
        widgetColor,
        welcomeMessage,
      };

      if (view === "edit" && selectedBotId) {
        payload.chatbotId = selectedBotId;
      }

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      setToast({ type: "success", message: "Settings saved successfully! ✓" });
      await fetchData();
      setView("list");
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to save settings",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleCopyEmbed(botId: string) {
    const embedScript = `<!-- EchoDesk AI Chatbot Embed -->\n<script\n  src="${appUrl}/chatbot.js"\n  data-org-id="${botId}"\n></script>`;
    try {
      await navigator.clipboard.writeText(embedScript);
      setCopiedId(botId);
      setTimeout(() => setCopiedId(null), 3000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = embedScript;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedId(botId);
      setTimeout(() => setCopiedId(null), 3000);
    }
  }

  const maxChatbotsLimit = subscription?.limits?.maxChatbots || 1;
  const currentChatbotsCount = chatbots.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[var(--dash-text)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <PageHeading
        eyebrow="Agent workspace"
        title={
          view === "list"
            ? "Make it feel like you."
            : view === "create"
              ? "Create your support agent."
              : "A little more you."
        }
        description={
          view === "list"
            ? "Manage your agents, their knowledge, and the way they greet your customers."
            : "Give your agent a clear identity, useful knowledge, and a familiar welcome."
        }
        actions={
          view === "list" ? (
            <button
              onClick={handleOpenCreate}
              disabled={currentChatbotsCount >= maxChatbotsLimit}
              className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs font-medium transition-all cursor-pointer w-full sm:w-auto ${
                currentChatbotsCount >= maxChatbotsLimit
                  ? "bg-[var(--dash-panel)] text-[var(--dash-text)] border border-[var(--dash-border)] cursor-not-allowed"
                  : "inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-transparent bg-[var(--dash-button)] px-3.5 py-2 text-[13px] font-medium text-[var(--dash-button-text)] transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              } `}
            >
              <Plus className="w-4 h-4" />
              Create Chatbot
            </button>
          ) : (
            <button
              onClick={() => setView("list")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium text-[var(--dash-muted)] border border-[var(--dash-border)] hover:bg-[var(--dash-panel)] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Chatbots
            </button>
          )
        }
      />

      {/* Main content conditional rendering */}
      {view === "list" ? (
        <div className="space-y-6">
          {/* Usage Tracker Banner */}
          <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] p-4 sm:p-5 bg-[var(--dash-selected)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-none">
            <div className="flex items-center gap-3">
              <Bot className="w-5 h-5 text-[var(--dash-accent)]" />
              <div>
                <p className="text-xs font-medium text-[var(--dash-text)]">
                  Chatbot Limit Usage
                </p>
                <p className="text-[11px] text-[var(--dash-muted)]">
                  Plan:{" "}
                  <span className="font-medium text-[var(--dash-accent)]">
                    {subscription?.plan || "FREE"}
                  </span>{" "}
                  Tier
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs font-medium text-[var(--dash-text)]">
                  {currentChatbotsCount}
                </span>
                <span className="text-[11px] text-[var(--dash-muted)]">
                  {" "}
                  / {maxChatbotsLimit} Chatbots
                </span>
              </div>
              <div className="w-32 bg-[var(--dash-panel)] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[var(--dash-selected)] h-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (currentChatbotsCount / maxChatbotsLimit) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {chatbots.length === 0 ? (
            <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] p-10 sm:p-12 text-center max-w-none space-y-4">
              <Bot className="w-12 h-12 text-[var(--dash-muted)] mx-auto animate-pulse" />
              <h3 className="text-sm font-medium text-[var(--dash-text)]">
                No chatbots created
              </h3>
              <p className="text-xs text-[var(--dash-muted)] max-w-sm mx-auto leading-relaxed">
                Configure your first AI customer assistant to get embed scripts
                and start training your AI agents.
              </p>
              <button
                onClick={handleOpenCreate}
                className={`${primaryButtonClass} !py-2.5 !px-5 text-xs cursor-pointer`}
              >
                <Plus className="w-4 h-4" /> Add Chatbot
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 max-w-none">
              {chatbots.map((bot) => (
                <div
                  key={bot._id}
                  className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 transition-all duration-200"
                >
                  <div className="space-y-3.5">
                    {/* Bot Title & Name */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: bot.widgetColor || "#6366f1",
                        }}
                      />
                      <div>
                        <h3 className="text-sm font-medium text-[var(--dash-text)]">
                          {bot.chatbotName || "Chatbot Agent"}
                        </h3>
                        <p className="text-[11px] text-[var(--dash-muted)]">
                          Business: {bot.businessName} • Email: {bot.email}
                        </p>
                      </div>
                    </div>

                    {/* Compact Code Block Preview */}
                    <div className="flex items-center gap-2 bg-[var(--dash-panel)] p-2 sm:p-3 rounded-lg border border-[var(--dash-border)] font-mono text-[11px] sm:text-[10px] max-w-lg select-all overflow-x-auto">
                      <code className="text-[var(--dash-text)] truncate block">
                        {`<script src="${appUrl}/chatbot.js" data-org-id="${bot._id}"></script>`}
                      </code>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-shrink-0">
                    <button
                      onClick={() => handleOpenConfigure(bot)}
                      className={`${primaryButtonClass} !py-2 !px-4 text-xs flex gap-1.5 cursor-pointer`}
                    >
                      <Settings className="w-3.5 h-3.5" />
                      Configure
                    </button>

                    <button
                      onClick={() => handleCopyEmbed(bot._id || "")}
                      className={`${secondaryButtonClass} !py-2 !px-4 text-xs flex gap-1.5 cursor-pointer`}
                    >
                      {copiedId === bot._id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Embed
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <form
          onSubmit={handleSave}
          className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]"
        >
          <div className="min-w-0 space-y-6">
            <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6 sm:p-7 relative">
              <h2 className="font-medium text-[var(--dash-text)] mb-5 flex items-center gap-2.5 text-[15px]">
                <div className="w-7 h-7 rounded-lg bg-[var(--dash-panel)] border border-[var(--dash-border)] flex items-center justify-center text-[var(--dash-text)]">
                  <Bot className="w-4 h-4" />
                </div>
                Agent identity
              </h2>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="chatbot-name"
                    className="block font-medium text-[var(--dash-muted)] mb-2 text-[13px]"
                  >
                    Agent name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="chatbot-name"
                    maxLength={100}
                    type="text"
                    value={chatbotName}
                    onChange={(e) => setChatbotName(e.target.value)}
                    placeholder="e.g. Website Main Support Bot"
                    className={inputClass}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="business-name"
                      className="block font-medium text-[var(--dash-muted)] mb-2 text-[13px] text-[var(--dash-text)]"
                    >
                      Business Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="business-name"
                      maxLength={200}
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Acme Corporation"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="support-email"
                      className="block font-medium text-[var(--dash-muted)] mb-2 text-[13px] text-[var(--dash-text)]"
                    >
                      Support Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="support-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. support@acme.com"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6 sm:p-7 relative">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-medium text-[var(--dash-text)] flex items-center gap-2.5 text-[15px]">
                  <div className="w-7 h-7 rounded-lg bg-[var(--dash-panel)] border border-[var(--dash-border)] flex items-center justify-center text-[var(--dash-text)]">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  Business knowledge
                </h2>
                <div className="group relative">
                  <HelpCircle className="w-4 h-4 text-[var(--dash-muted)] hover:text-[var(--dash-text)] cursor-pointer" />
                  <div className="absolute right-0 bottom-full mb-2 w-72 p-3 bg-[var(--dash-panel)] border border-[var(--dash-border)] rounded-lg text-[11px] text-[var(--dash-text)] leading-relaxed opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20">
                    Provide detailed paragraphs, FAQs, rules, and links. Your
                    agent uses this information to guide its responses.
                  </div>
                </div>
              </div>
              <p className="text-xs text-[var(--dash-muted)] mb-5 leading-relaxed">
                Enter all core facts, business details, operating hours,
                policies, and FAQs the AI agent needs to formulate support
                replies for this bot.
              </p>

              <label htmlFor="knowledge-base" className="sr-only">
                Business knowledge
              </label>
              <textarea
                id="knowledge-base"
                maxLength={50000}
                value={knowledgeBase}
                onChange={(e) => setKnowledgeBase(e.target.value)}
                placeholder={`Example:
  
You are an AI support assistant for Acme Corporation.
  
Company Details:
Acme Corporation offers premium cloud services.
Operating hours: 24/7.
Refund Policy: Refund request is eligible within 14 days of subscription activation.
  
FAQs:
Q: Do you support Single Sign-On (SSO)?
A: Yes, we support SAML and OIDC SSO powered by Scalekit.`}
                className="textarea-field !min-h-[250px] font-sans leading-relaxed text-xs"
                required
              />

              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] text-[var(--dash-muted)]">
                  Supports Markdown format
                </span>
                <span
                  className={`text-[11px] ${knowledgeBase.length > 45000 ? "text-[var(--dash-accent)] font-medium" : "text-[var(--dash-muted)]"} `}
                >
                  {knowledgeBase.length.toLocaleString()} / 50,000 characters
                </span>
              </div>

              {/* Smart Import Sources Sub-section */}
              <div className="mt-6 pt-6 border-t border-[var(--dash-border)]">
                <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--dash-text)] mb-1">
                  Import knowledge
                </h3>
                <p className="text-[11px] text-[var(--dash-muted)] mb-4">
                  Fast-track training by uploading business documents or
                  scraping public website content.
                </p>

                {/* Scraper Tab Selectors */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    aria-pressed={activeImportTab === "file"}
                    type="button"
                    onClick={() => setActiveImportTab("file")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      activeImportTab === "file"
                        ? "bg-[var(--dash-panel)] text-[var(--dash-text)] border-[var(--dash-border)]"
                        : "bg-transparent text-[var(--dash-muted)] border-[var(--dash-border)] hover:bg-[var(--dash-panel)]"
                    } `}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Upload Document (PDF / TXT)
                  </button>
                  <button
                    aria-pressed={activeImportTab === "url"}
                    type="button"
                    onClick={() => setActiveImportTab("url")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      activeImportTab === "url"
                        ? "bg-[var(--dash-panel)] text-[var(--dash-text)] border-[var(--dash-border)]"
                        : "bg-transparent text-[var(--dash-muted)] border-[var(--dash-border)] hover:bg-[var(--dash-panel)]"
                    } `}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Scrape Web Link
                  </button>
                </div>

                {/* Import status messages */}
                {importError && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{importError}</span>
                  </div>
                )}
                {importSuccess && (
                  <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{importSuccess}</span>
                  </div>
                )}

                {/* Tab Content */}
                {activeImportTab === "file" ? (
                  <div className="bg-[var(--dash-panel)] border border-dashed border-[var(--dash-border)] rounded-lg p-5 text-center flex flex-col items-center justify-center gap-3">
                    <Upload className="w-8 h-8 text-[var(--dash-muted)]" />
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-[var(--dash-text)]">
                        {selectedFile ? selectedFile.name : "Choose a document"}
                      </p>
                      <p className="text-[11px] text-[var(--dash-muted)]">
                        Supports PDF or Plain Text (.txt) up to 2MB
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <label className="px-3 py-1.5 rounded-lg border border-[var(--dash-border)] font-medium text-[var(--dash-text)] hover:bg-[var(--dash-panel)] transition-colors cursor-pointer text-[13px]">
                        Browse File
                        <input
                          id="file-uploader-input"
                          type="file"
                          accept=".pdf,.txt"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              setSelectedFile(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        disabled={!selectedFile || importing}
                        onClick={handleFileImport}
                        className="px-3 py-1.5 rounded-lg bg-[var(--dash-selected)] text-[var(--dash-text)] text-xs font-medium hover:bg-[#7874e0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                      >
                        {importing && (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        )}
                        {importing ? "Parsing..." : "Import Text"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[var(--dash-panel)] border border-[var(--dash-border)] rounded-lg p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex-1 relative flex items-center">
                      <LinkIcon className="absolute left-3 w-4 h-4 text-[var(--dash-muted)]" />
                      <input
                        id="knowledge-url"
                        aria-label="Public website URL"
                        type="url"
                        value={scrapeUrl}
                        onChange={(e) => setScrapeUrl(e.target.value)}
                        placeholder="e.g. https://acme.com/about-us"
                        className={`${inputClass} !pl-9`}
                      />
                    </div>
                    <button
                      type="button"
                      disabled={!scrapeUrl.trim() || importing}
                      onClick={handleUrlScrape}
                      className="px-4 py-2.5 rounded-lg bg-[var(--dash-selected)] text-[var(--dash-text)] text-xs font-medium hover:bg-[#7874e0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
                    >
                      {importing && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      )}
                      {importing ? "Scraping..." : "Scrape Link"}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={saving}
                className={`${primaryButtonClass} !py-3 !px-8 text-xs cursor-pointer`}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving Chatbot...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {view === "create" ? "Create Chatbot" : "Save changes"}
                  </>
                )}
              </button>
            </div>
          </div>
          <aside className="min-w-0 space-y-5">
            <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6 sm:p-7 relative">
              <h2 className="font-medium text-[var(--dash-text)] mb-5 flex items-center gap-2.5 text-[15px]">
                <div className="w-7 h-7 rounded-lg bg-[var(--dash-panel)] border border-[var(--dash-border)] flex items-center justify-center text-[var(--dash-text)]">
                  <Palette className="w-4 h-4" />
                </div>
                Appearance
              </h2>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="widget-color"
                    className="block font-medium text-[var(--dash-muted)] mb-2 text-[13px] text-[var(--dash-text)]"
                  >
                    Brand color
                  </label>
                  <div className="flex flex-wrap items-center gap-3 bg-[var(--dash-panel)] p-3 rounded-lg border border-[var(--dash-border)]">
                    <input
                      id="widget-color"
                      type="color"
                      value={widgetColor}
                      onChange={(e) => setWidgetColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      id="widget-color-value"
                      aria-label="Widget color hex value"
                      pattern="#[0-9a-fA-F]{6}"
                      type="text"
                      value={widgetColor}
                      onChange={(e) => setWidgetColor(e.target.value)}
                      className={`${inputClass} !w-28 font-mono text-xs text-center !py-1.5`}
                    />

                    {/* Color presets */}
                    <div className="flex flex-wrap gap-2 ml-2">
                      {[
                        "#8f8afc",
                        "#6c67f5",
                        "#06b6d4",
                        "#10b981",
                        "#3b82f6",
                        "#ef4444",
                        "#ec4899",
                      ].map((color) => (
                        <button
                          aria-label={`Use ${color} widget color`}
                          aria-pressed={
                            widgetColor.toLowerCase() === color.toLowerCase()
                          }
                          key={color}
                          type="button"
                          onClick={() => setWidgetColor(color)}
                          className="w-6 h-6 rounded-full border transition-transform hover:scale-110 cursor-pointer text-[var(--dash-text)]"
                          style={{
                            backgroundColor: color,
                            borderColor:
                              widgetColor.toLowerCase() === color.toLowerCase()
                                ? "currentColor"
                                : "transparent",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="welcome-message"
                    className="block font-medium text-[var(--dash-muted)] mb-2 text-[13px] text-[var(--dash-text)]"
                  >
                    Welcome message
                  </label>
                  <input
                    id="welcome-message"
                    maxLength={500}
                    type="text"
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    placeholder="Hi there! 👋 How can I help you today?"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
            <WidgetPreview
              businessName={businessName}
              welcomeMessage={welcomeMessage}
              color={widgetColor}
            />
          </aside>
        </form>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-5 right-5 z-50 flex max-w-[calc(100vw-40px)] items-center gap-2 rounded-lg border bg-[var(--dash-panel)] px-4 py-3 text-[13px] ${toast.type === "success" ? "border-[var(--dash-green)] text-[var(--dash-green)]" : "border-red-500/40 text-red-500"}`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
