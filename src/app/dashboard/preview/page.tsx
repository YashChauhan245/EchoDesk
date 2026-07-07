// ===========================================
// Live Preview Page
// ===========================================
// Renders an iframe with the chatbot embedded so the
// business owner can test their chatbot in real-time.
// ===========================================

import { getSession } from "@/lib/session";

export default async function PreviewPage() {
  const session = await getSession();
  if (!session) return null;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
          Live Preview
        </h1>
        <p className="text-[var(--text-secondary)]">
          Test your AI chatbot in a simulated website environment.
        </p>
      </div>

      {/* Info Banner */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 mb-6 max-w-3xl">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#818cf8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <p className="text-sm text-[var(--text-secondary)]">
          The chatbot bubble appears in the bottom-right corner.
          Make sure you&apos;ve configured your chatbot settings first.
        </p>
      </div>

      {/* Preview iframe */}
      <div className="glass-card overflow-hidden !transform-none !shadow-none max-w-3xl">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-tertiary)]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <div className="flex-1 mx-3">
            <div className="bg-[var(--bg-secondary)] rounded-md px-3 py-1.5 text-xs text-[var(--text-muted)] font-mono">
              your-website.com
            </div>
          </div>
        </div>

        {/* Iframe */}
        <iframe
          src={`${appUrl}/test.html?orgId=${session.organizationId}`}
          className="w-full h-[600px] bg-white"
          title="Chatbot Preview"
        />
      </div>
    </div>
  );
}
