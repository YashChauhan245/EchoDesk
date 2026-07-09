"use client";

import { useState, useEffect } from "react";
import { 
  Building, 
  BookOpen, 
  Palette, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Plus,
  Settings,
  Code,
  ArrowLeft,
  Bot,
  Copy,
  Check,
  Upload,
  Globe,
  FileText,
  Link as LinkIcon
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
    "Hi there! 👋 How can I help you today?"
  );

  // Scraper states
  const [activeImportTab, setActiveImportTab] = useState<"file" | "url">("file");
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
        throw new Error("Importing this file would exceed the 50,000 character limit.");
      }

      setKnowledgeBase((prev) => prev + textHeader);
      setImportSuccess(`Successfully imported text from ${data.fileName}!`);
      setSelectedFile(null);

      // Reset file input element visually
      const fileInput = document.getElementById("file-uploader-input") as HTMLInputElement;
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
        throw new Error("Scraping this website would exceed the 50,000 character limit.");
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
    setWelcomeMessage(bot.welcomeMessage || "Hi there! 👋 How can I help you today?");
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
        <Loader2 className="w-8 h-8 text-black dark:text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0f0f15] dark:text-white mb-2">
            {view === "list"
              ? "Chatbot Settings"
              : view === "create"
              ? "Create Chatbot"
              : `Configure ${chatbotName}`}
          </h1>
          <p className="text-sm text-[#5f6368] dark:text-[#94a3b8]">
            {view === "list"
              ? "Create and manage your AI chatbot support agents and retrieve their embed codes."
              : "Set up details, training facts, and design themes for this specific chatbot."}
          </p>
        </div>

        {view === "list" ? (
          <button
            onClick={handleOpenCreate}
            disabled={currentChatbotsCount >= maxChatbotsLimit}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
              currentChatbotsCount >= maxChatbotsLimit
                ? "bg-neutral-100 dark:bg-white/[0.02] text-neutral-400 dark:text-neutral-600 border border-black/[0.04] dark:border-white/[0.04] cursor-not-allowed"
                : "btn-primary"
            }`}
          >
            <Plus className="w-4 h-4" />
            Create Chatbot
          </button>
        ) : (
          <button
            onClick={() => setView("list")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold text-[#5f6368] dark:text-[#94a3b8] border border-black/[0.08] dark:border-white/[0.08] hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Chatbots
          </button>
        )}
      </div>

      {/* Main content conditional rendering */}
      {view === "list" ? (
        <div className="space-y-6">
          {/* Usage Tracker Banner */}
          <div className="glass-card p-5 border border-[#6366f1]/20 bg-[#6366f1]/5 dark:bg-[#6366f1]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-4xl rounded-2xl">
            <div className="flex items-center gap-3">
              <Bot className="w-5 h-5 text-[#6366f1]" />
              <div>
                <p className="text-xs font-semibold text-[#0f0f15] dark:text-white">
                  Chatbot Limit Usage
                </p>
                <p className="text-[10px] text-[#5f6368] dark:text-[#94a3b8]">
                  Plan: <span className="font-bold text-[#6366f1]">{subscription?.plan || "FREE"}</span> Tier
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs font-extrabold text-[#0f0f15] dark:text-white">
                  {currentChatbotsCount}
                </span>
                <span className="text-[10px] text-[#5f6368] dark:text-[#94a3b8]">
                  {" "}
                  / {maxChatbotsLimit} Chatbots
                </span>
              </div>
              <div className="w-32 bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#6366f1] h-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (currentChatbotsCount / maxChatbotsLimit) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {chatbots.length === 0 ? (
            <div className="glass-card p-12 border border-black/[0.05] dark:border-white/[0.06] bg-white dark:bg-[#0c0c14] text-center max-w-4xl space-y-4">
              <Bot className="w-12 h-12 text-[#94a3b8] dark:text-[#475569] mx-auto animate-pulse" />
              <h3 className="text-sm font-semibold text-[#0f0f15] dark:text-white">No chatbots created</h3>
              <p className="text-xs text-[#5f6368] dark:text-[#94a3b8] max-w-sm mx-auto leading-relaxed">
                Configure your first AI customer assistant to get embed scripts and start training your AI agents.
              </p>
              <button
                onClick={handleOpenCreate}
                className="btn-primary !py-2.5 !px-5 text-xs inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Chatbot
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 max-w-4xl">
              {chatbots.map((bot) => (
                <div
                  key={bot._id}
                  className="glass-card p-6 border border-black/[0.05] dark:border-white/[0.06] bg-white dark:bg-[#0c0c14] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-black/10 dark:hover:border-white/10 transition-all duration-200"
                >
                  <div className="space-y-3.5">
                    {/* Bot Title & Name */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: bot.widgetColor || "#6366f1" }}
                      />
                      <div>
                        <h3 className="text-sm font-bold text-[#0f0f15] dark:text-white">
                          {bot.chatbotName || "Chatbot Agent"}
                        </h3>
                        <p className="text-[10px] text-[#5f6368] dark:text-[#94a3b8]">
                          Business: {bot.businessName} • Email: {bot.email}
                        </p>
                      </div>
                    </div>

                    {/* Compact Code Block Preview */}
                    <div className="flex items-center gap-2 bg-neutral-50 dark:bg-white/[0.01] p-3 rounded-lg border border-black/[0.04] dark:border-white/[0.06] font-mono text-[10px] max-w-lg select-all">
                      <code className="text-neutral-800 dark:text-neutral-300 truncate block">
                        {`<script src="${appUrl}/chatbot.js" data-org-id="${bot._id}"></script>`}
                      </code>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      onClick={() => handleCopyEmbed(bot._id || "")}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#5f6368] dark:text-[#94a3b8] border border-black/[0.08] dark:border-white/[0.08] hover:bg-neutral-50 dark:hover:bg-white/[0.02] cursor-pointer"
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

                    <button
                      onClick={() => handleOpenConfigure(bot)}
                      className="btn-primary !py-2 !px-4 text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      Configure
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
          {/* Chatbot Name and General Details */}
          <div className="glass-card p-6 border border-black/[0.05] dark:border-white/[0.06] bg-white dark:bg-[#0c0c14] shadow-sm relative">
            <h2 className="text-sm font-semibold text-[#0f0f15] dark:text-white mb-5 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-neutral-50 dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.06] flex items-center justify-center text-black dark:text-white">
                <Bot className="w-4 h-4" />
              </div>
              Chatbot Profile
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-[#94a3b8] mb-2">
                  Chatbot Identifier Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={chatbotName}
                  onChange={(e) => setChatbotName(e.target.value)}
                  placeholder="e.g. Website Main Support Bot"
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-[#94a3b8] mb-2">
                    Business Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Acme Corporation"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-[#94a3b8] mb-2">
                    Support Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. support@acme.com"
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Knowledge Base Section */}
          <div className="glass-card p-6 border border-black/[0.05] dark:border-white/[0.06] bg-white dark:bg-[#0c0c14] shadow-sm relative">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-[#0f0f15] dark:text-white flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-neutral-50 dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.06] flex items-center justify-center text-black dark:text-white">
                  <BookOpen className="w-4 h-4" />
                </div>
                Knowledge Base Training Context
              </h2>
              <div className="group relative">
                <HelpCircle className="w-4 h-4 text-[#5f6368] dark:text-[#94a3b8] hover:text-[#0f0f15] dark:hover:text-white cursor-pointer" />
                <div className="absolute right-0 bottom-full mb-2 w-72 p-3 bg-black border border-black rounded-lg text-[10px] text-white leading-relaxed shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20">
                  Provide detailed paragraphs, FAQs, rules, and links. The Gemini model uses this data exclusively to build responses.
                </div>
              </div>
            </div>
            <p className="text-xs text-[#5f6368] dark:text-[#94a3b8] mb-5 leading-relaxed">
              Enter all core facts, business details, operating hours, policies, and FAQs the AI agent needs to formulate support replies for this bot.
            </p>

            <textarea
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
              <span className="text-[10px] text-[#5f6368] dark:text-[#94a3b8]">Supports Markdown format</span>
              <span className={`text-[10px] ${knowledgeBase.length > 45000 ? "text-amber-500 font-semibold" : "text-[#5f6368] dark:text-[#94a3b8]"}`}>
                {knowledgeBase.length.toLocaleString()} / 50,000 characters
              </span>
            </div>

            {/* Smart Import Sources Sub-section */}
            <div className="mt-6 pt-6 border-t border-black/[0.05] dark:border-white/[0.05]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f0f15] dark:text-white mb-1">
                Smart Import Tools
              </h3>
              <p className="text-[11px] text-[#5f6368] dark:text-[#94a3b8] mb-4">
                Fast-track training by uploading business documents or scraping public website content.
              </p>

              {/* Scraper Tab Selectors */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setActiveImportTab('file')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    activeImportTab === 'file'
                      ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                      : 'bg-transparent text-[#5f6368] dark:text-[#94a3b8] border-black/[0.08] dark:border-white/[0.08] hover:bg-neutral-50 dark:hover:bg-white/[0.02]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Upload Document (PDF / TXT)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImportTab('url')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    activeImportTab === 'url'
                      ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                      : 'bg-transparent text-[#5f6368] dark:text-[#94a3b8] border-black/[0.08] dark:border-white/[0.08] hover:bg-neutral-50 dark:hover:bg-white/[0.02]'
                  }`}
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
              {activeImportTab === 'file' ? (
                <div className="bg-neutral-50 dark:bg-white/[0.01] border border-dashed border-black/[0.08] dark:border-white/[0.08] rounded-xl p-5 text-center flex flex-col items-center justify-center gap-3">
                  <Upload className="w-8 h-8 text-[#5f6368] dark:text-[#475569]" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-[#0f0f15] dark:text-white">
                      {selectedFile ? selectedFile.name : "Select or Drop a Document"}
                    </p>
                    <p className="text-[10px] text-[#5f6368] dark:text-[#94a3b8]">
                      Supports PDF or Plain Text (.txt) up to 2MB
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <label className="px-3 py-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-xs font-semibold text-[#0f0f15] dark:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
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
                      className="px-3 py-1.5 rounded-lg bg-[#6366f1] text-white text-xs font-semibold hover:bg-[#5356e3] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                    >
                      {importing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      {importing ? "Parsing..." : "Import Text"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-neutral-50 dark:bg-white/[0.01] border border-black/[0.08] dark:border-white/[0.08] rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1 relative flex items-center">
                    <LinkIcon className="absolute left-3 w-4 h-4 text-[#5f6368] dark:text-[#475569]" />
                    <input
                      type="url"
                      value={scrapeUrl}
                      onChange={(e) => setScrapeUrl(e.target.value)}
                      placeholder="e.g. https://acme.com/about-us"
                      className="input-field !pl-9"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={!scrapeUrl.trim() || importing}
                    onClick={handleUrlScrape}
                    className="px-4 py-2.5 rounded-xl bg-[#6366f1] text-white text-xs font-semibold hover:bg-[#5356e3] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
                  >
                    {importing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {importing ? "Scraping..." : "Scrape Link"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Widget Appearance Section */}
          <div className="glass-card p-6 border border-black/[0.05] dark:border-white/[0.06] bg-white dark:bg-[#0c0c14] shadow-sm relative">
            <h2 className="text-sm font-semibold text-[#0f0f15] dark:text-white mb-5 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-neutral-50 dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.06] flex items-center justify-center text-black dark:text-white">
                <Palette className="w-4 h-4" />
              </div>
              Widget Appearance
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-[#94a3b8] mb-2">
                  Brand Accent Color
                </label>
                <div className="flex flex-wrap items-center gap-3 bg-neutral-50 dark:bg-white/[0.02] p-3 rounded-lg border border-black/[0.04] dark:border-white/[0.06]">
                  <input
                    type="color"
                    value={widgetColor}
                    onChange={(e) => setWidgetColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={widgetColor}
                    onChange={(e) => setWidgetColor(e.target.value)}
                    className="input-field !w-28 font-mono text-xs text-center !py-1.5"
                  />
                  
                  {/* Color presets */}
                  <div className="flex flex-wrap gap-2 ml-2">
                    {[
                      "#6366f1",
                      "#8b5cf6",
                      "#06b6d4",
                      "#10b981",
                      "#f59e0b",
                      "#ef4444",
                      "#ec4899",
                    ].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setWidgetColor(color)}
                        className="w-6 h-6 rounded-full border transition-transform hover:scale-110 cursor-pointer text-[#0f0f15] dark:text-white"
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
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-[#94a3b8] mb-2">
                  Welcome Response Prompt
                </label>
                <input
                  type="text"
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  placeholder="Hi there! 👋 How can I help you today?"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary !py-3 !px-8 text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-full animate-spin" />
                  Saving Chatbot...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {view === "create" ? "Create Chatbot" : "Save Configurations"}
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
          {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
