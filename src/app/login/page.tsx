// ===========================================
// Login Page
// ===========================================
// Simple, premium login page with a "Sign in" button
// that initiates the Scalekit OAuth flow.
// ===========================================

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 grid-bg relative">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <svg
              width="22"
              height="22"
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
          <span className="text-2xl font-bold text-[var(--text-primary)]">
            EchoDesk
          </span>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">
              Welcome Back
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Sign in to manage your AI chatbot
            </p>
          </div>

          {/* Sign in button — triggers Scalekit OAuth flow */}
          <a
            href="/api/auth/login"
            className="btn-primary w-full justify-center !py-3.5 !text-base"
          >
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
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Sign In with EchoDesk
          </a>

          <div className="mt-6 pt-6 border-t border-[var(--border)] text-center">
            <p className="text-xs text-[var(--text-muted)]">
              Don&apos;t have an account? Clicking above will let you sign up
              too.
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
