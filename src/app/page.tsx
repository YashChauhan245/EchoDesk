// ===========================================
// Landing Page
// ===========================================
// A premium SaaS landing page that explains EchoDesk's value prop:
// AI chatbot creation, website embedding, and customer support automation.
// ===========================================

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen grid-bg">
      {/* ---- Navigation ---- */}
      <nav className="fixed top-0 w-full z-50 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-[var(--text-primary)]">
              EchoDesk
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Log in
            </Link>
            <Link href="/login" className="btn-primary !py-2.5 !px-5 !text-sm">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ---- Hero Section ---- */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-purple-600/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)] mb-8 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-[var(--text-secondary)] font-medium">
              AI-Powered Customer Support
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            Build Your AI Chatbot.
            <br />
            <span className="gradient-text">Embed It Anywhere.</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            Create intelligent customer support chatbots trained on your
            business knowledge. Add to any website with a single line of code.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Link href="/login" className="btn-primary !py-3.5 !px-8 !text-base">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
              Start Building Free
            </Link>
            <a href="#how-it-works" className="btn-secondary !py-3.5 !px-8 !text-base">
              See How It Works
            </a>
          </div>

          {/* Embed code preview */}
          <div
            className="max-w-xl mx-auto animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="glass-card p-5 text-left">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="text-xs text-[var(--text-muted)] ml-2">
                  your-website.html
                </span>
              </div>
              <pre className="text-sm font-mono text-[var(--text-secondary)] overflow-x-auto">
                <code>
                  <span className="text-[var(--text-muted)]">
                    &lt;!-- Add AI support in seconds --&gt;
                  </span>
                  {"\n"}
                  <span className="text-purple-400">&lt;script</span>
                  {"\n  "}
                  <span className="text-blue-400">src</span>
                  <span className="text-[var(--text-muted)]">=</span>
                  <span className="text-green-400">
                    &quot;https://echodesk.vercel.app/chatbot.js&quot;
                  </span>
                  {"\n  "}
                  <span className="text-blue-400">data-org-id</span>
                  <span className="text-[var(--text-muted)]">=</span>
                  <span className="text-green-400">
                    &quot;your_org_id&quot;
                  </span>
                  <span className="text-purple-400">&gt;&lt;/script&gt;</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Features Section ---- */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Automate Support</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              From chatbot creation to website embedding — EchoDesk handles it
              all.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="glass-card p-7">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-5">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">
                AI-Powered Responses
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Powered by Google Gemini, your chatbot delivers accurate answers
                based on your unique business knowledge, policies, and FAQs.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-7">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-5">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">
                One-Line Embed
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Copy a single script tag. Paste it into any HTML page. Your
                chatbot appears instantly — no coding knowledge required.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-7">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-5">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">
                Multi-Tenant SaaS
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Each business gets its own isolated workspace. Customer data
                never crosses boundaries. Enterprise-grade security built in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- How It Works Section ---- */}
      <section id="how-it-works" className="py-20 px-6 border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Up and Running in{" "}
              <span className="gradient-text">3 Simple Steps</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg">
              From sign up to live chatbot in under 10 minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-5 text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Configure</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Enter your business details, FAQs, policies, and product
                information. Customize the chatbot personality and appearance.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-5 text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Copy Script</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Get your unique embed code — a single script tag. Copy it from
                the dashboard with one click.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-5 text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Go Live</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Paste the script into your website&apos;s HTML. Your AI chatbot
                is immediately live and ready to help visitors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- CTA Section ---- */}
      <section className="py-20 px-6 border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Automate Your Customer Support?
              </h2>
              <p className="text-[var(--text-secondary)] mb-8 text-lg">
                Join businesses using EchoDesk to deliver instant, AI-powered
                support 24/7.
              </p>
              <Link href="/login" className="btn-primary !py-3.5 !px-8 !text-base">
                Get Started Free →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="py-10 px-6 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              EchoDesk
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} EchoDesk. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
