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
  HelpCircle
} from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form state
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [knowledgeBase, setKnowledgeBase] = useState("");
  const [widgetColor, setWidgetColor] = useState("#6366f1");
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Hi there! 👋 How can I help you today?"
  );

  // Load existing settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();

      if (data.settings) {
        setBusinessName(data.settings.businessName || "");
        setEmail(data.settings.email || "");
        setKnowledgeBase(data.settings.knowledgeBase || "");
        setWidgetColor(data.settings.widgetColor || "#6366f1");
        setWelcomeMessage(
          data.settings.welcomeMessage ||
            "Hi there! 👋 How can I help you today?"
        );
      }
    } catch {
      console.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          email,
          knowledgeBase,
          widgetColor,
          welcomeMessage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      setToast({ type: "success", message: "Settings saved successfully! ✓" });
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to save settings",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#c084fc] animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          Chatbot Settings
        </h1>
        <p className="text-sm text-[#94a3b8]">
          Configure your AI agent identity, context rules, support instructions, and widget UI design.
        </p>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        
        {/* Business Details Section */}
        <div className="glass-card p-6 border border-white/[0.04] relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c084fc]/15 to-transparent" />
          <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#c084fc]/10 border border-[#c084fc]/20 flex items-center justify-center text-[#c084fc]">
              <Building className="w-4 h-4" />
            </div>
            Business Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-2">
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-2">
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

        {/* Knowledge Base Section */}
        <div className="glass-card p-6 border border-white/[0.04] relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#6366f1]/15 to-transparent" />
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center text-[#6366f1]">
                <BookOpen className="w-4 h-4" />
              </div>
              Knowledge Base Training Context
            </h2>
            <div className="group relative">
              <HelpCircle className="w-4 h-4 text-[#475569] hover:text-[#94a3b8] cursor-pointer" />
              <div className="absolute right-0 bottom-full mb-2 w-72 p-3 bg-[#08080d] border border-white/[0.06] rounded-lg text-[10px] text-[#94a3b8] leading-relaxed shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20">
                Provide detailed paragraphs, FAQs, rules, and links. The Gemini model uses this data exclusively to build responses.
              </div>
            </div>
          </div>
          <p className="text-xs text-[#94a3b8] mb-5 leading-relaxed">
            Enter all core facts, business details, operating hours, policies, and FAQs the AI agent needs to formulate support replies.
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
            className="textarea-field !min-h-[300px] font-sans leading-relaxed text-xs"
            required
          />

          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-[#475569]">Supports Markdown format</span>
            <span className={`text-[10px] ${knowledgeBase.length > 45000 ? "text-amber-400" : "text-[#475569]"}`}>
              {knowledgeBase.length.toLocaleString()} / 50,000 characters
            </span>
          </div>
        </div>

        {/* Widget Appearance Section */}
        <div className="glass-card p-6 border border-white/[0.04] relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-[#94a3b8]">
              <Palette className="w-4 h-4" />
            </div>
            Widget Appearance
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-2">
                Brand Accent Color
              </label>
              <div className="flex flex-wrap items-center gap-3 bg-white/[0.01] p-3 rounded-lg border border-white/[0.03]">
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
                      className="w-6 h-6 rounded-full border transition-transform hover:scale-110 cursor-pointer"
                      style={{
                        backgroundColor: color,
                        borderColor:
                          widgetColor.toLowerCase() === color.toLowerCase()
                            ? "white"
                            : "transparent",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-2">
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
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Configurations
              </>
            )}
          </button>
        </div>
      </form>

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
