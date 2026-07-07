// ===========================================
// Chatbot Settings Page
// ===========================================
// Client component with a form for configuring the chatbot.
// Handles loading existing settings, editing, and saving via API.
// ===========================================

"use client";

import { useState, useEffect } from "react";

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
        <div className="spinner !w-8 !h-8 !border-[3px]" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
          Chatbot Settings
        </h1>
        <p className="text-[var(--text-secondary)]">
          Configure your AI chatbot&apos;s knowledge base, appearance, and
          behavior.
        </p>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        {/* Business Details Section */}
        <div className="glass-card p-6 !transform-none !shadow-none">
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-5 flex items-center gap-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--primary-light)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Business Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Business Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Gada Electronics"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Support Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. support@gada.com"
                className="input-field"
                required
              />
            </div>
          </div>
        </div>

        {/* Knowledge Base Section */}
        <div className="glass-card p-6 !transform-none !shadow-none">
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--primary-light)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            Knowledge Base
          </h2>
          <p className="text-xs text-[var(--text-muted)] mb-4">
            Enter everything about your business that the AI should know — FAQs,
            policies, product details, support instructions, etc.
          </p>

          <textarea
            value={knowledgeBase}
            onChange={(e) => setKnowledgeBase(e.target.value)}
            placeholder={`Example:

You are an AI customer support assistant for Gada Electronics.

Store Details:
Gada Electronics sells mobile phones, laptops, and accessories.
We have stores in Mumbai, Delhi, and Bangalore.
Operating hours: 10 AM to 9 PM, Monday to Saturday.

Products:
- Smartphones: iPhone, Samsung Galaxy, OnePlus
- Laptops: MacBook, Dell XPS, HP Spectre
- Accessories: Cases, chargers, earphones

Policies:
- Refund available within 7 days of purchase with original receipt.
- Exchange available within 15 days.
- Warranty as per manufacturer terms.

FAQs:
Q: Do you offer EMI?
A: Yes, we offer EMI on all products above ₹10,000 via major banks.

Q: Do you deliver?
A: Yes, we deliver across India. Free delivery on orders above ₹5,000.

Support Contact:
- Email: support@gada.com
- Phone: +91 98765 43210`}
            className="textarea-field !min-h-[350px]"
            required
          />

          <p className="text-xs text-[var(--text-muted)] mt-2 text-right">
            {knowledgeBase.length.toLocaleString()} / 50,000 characters
          </p>
        </div>

        {/* Widget Appearance Section */}
        <div className="glass-card p-6 !transform-none !shadow-none">
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-5 flex items-center gap-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--primary-light)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
              <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
              <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
              <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
            </svg>
            Widget Appearance
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Theme Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={widgetColor}
                  onChange={(e) => setWidgetColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-[var(--border)] bg-transparent"
                />
                <input
                  type="text"
                  value={widgetColor}
                  onChange={(e) => setWidgetColor(e.target.value)}
                  className="input-field !w-32 font-mono text-sm"
                />
                {/* Color presets */}
                <div className="flex gap-2">
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
                      className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                      style={{
                        backgroundColor: color,
                        borderColor:
                          widgetColor === color
                            ? "white"
                            : "transparent",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Welcome Message
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
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary !py-3 !px-8"
          >
            {saving ? (
              <>
                <div className="spinner" />
                Saving...
              </>
            ) : (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
