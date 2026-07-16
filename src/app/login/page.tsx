"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Fingerprint, Mail, Bot, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const err = params.get("error");
      const details = params.get("details");
      if (err) {
        if (err === "callback_failed") {
          setErrorMsg("Authentication callback failed");
        } else if (err === "auth_failed") {
          setErrorMsg("Authentication failed");
        } else if (err === "no_code") {
          setErrorMsg("No authorization code received");
        } else {
          setErrorMsg(err.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()));
        }
        setErrorDetails(details);
      }
    }
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    // Redirect to the auth API with the email as login_hint
    window.location.href = `/api/auth/login?login_hint=${encodeURIComponent(email)}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#030307] text-[#0f0f15] dark:text-[#f8fafc] grid-bg selection:bg-black/5 overflow-hidden transition-colors duration-300 relative px-4">
      {/* Decorative linear glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-60" />

      {/* Back button to homepage */}
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-[#5f6368] dark:text-[#94a3b8] hover:text-[#0f0f15] dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to EchoDesk
      </Link>

      <div className="w-full max-w-[420px] bg-white/70 dark:bg-[#0c0c14]/70 border border-black/[0.06] dark:border-white/[0.05] rounded-2xl shadow-xl overflow-hidden p-8 backdrop-blur-xl relative z-10 animate-fade-in">
        {/* Logo and Brand */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center shadow-md mb-3">
            <Bot className="w-6 h-6 text-white dark:text-black" />
          </div>
          <h2 className="text-xl font-bold tracking-tighter text-[#0f0f15] dark:text-white text-center">
            Login to EchoDesk
          </h2>
          <p className="text-xs text-[#5f6368] dark:text-[#94a3b8] mt-1 text-center">
            Access your customer support dashboard
          </p>
        </div>

        {/* Error Alert Banner */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-wider">{errorMsg}</h4>
              {errorDetails && (
                <p className="text-[11px] font-normal leading-relaxed mt-1 text-red-500/80 dark:text-red-400/80 break-words font-mono">
                  {errorDetails}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Identity Providers Buttons */}
        <div className="space-y-3 mb-6">
          {/* Continue with Google */}
          <a
            href="/api/auth/login?provider=google"
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white hover:bg-neutral-50 dark:bg-white/[0.02] dark:hover:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.08] rounded-xl text-xs font-semibold text-[#0f0f15] dark:text-white transition-all shadow-sm active:translate-y-0.5 hover:-translate-y-0.5 cursor-pointer"
          >
            {/* Google Icon SVG */}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </a>

          {/* Continue with Passkey */}
          <a
            href="/api/auth/login"
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white hover:bg-neutral-50 dark:bg-white/[0.02] dark:hover:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.08] rounded-xl text-xs font-semibold text-[#0f0f15] dark:text-white transition-all shadow-sm active:translate-y-0.5 hover:-translate-y-0.5 cursor-pointer"
          >
            <Fingerprint className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            Continue with Passkey
          </a>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-[1px] bg-black/[0.06] dark:border-white/[0.05] bg-gradient-to-r from-transparent to-neutral-200 dark:to-neutral-800" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#94a3b8] dark:text-[#475569]">
            OR
          </span>
          <div className="flex-1 h-[1px] bg-black/[0.06] dark:border-white/[0.05] bg-gradient-to-r from-neutral-200 dark:from-neutral-800 to-transparent" />
        </div>

        {/* Email Login Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-[10px] font-bold uppercase tracking-wider text-[#5f6368] dark:text-[#94a3b8] mb-1.5"
            >
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                required
                disabled={isLoading}
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
              />
              <Mail className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="btn-primary !w-full !py-3 !rounded-xl !text-xs font-semibold flex items-center justify-center gap-2 group relative overflow-hidden"
          >
            {isLoading ? (
              <span className="spinner" />
            ) : (
              <>
                Continue
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 text-center border-t border-black/[0.04] dark:border-white/[0.04] pt-4 flex flex-col items-center gap-1.5">
          <p className="text-[11px] text-[#5f6368] dark:text-[#94a3b8]">
            Don't have an account?{" "}
            <a
              href="/api/auth/login"
              className="text-indigo-500 hover:text-indigo-600 font-semibold"
            >
              Sign Up
            </a>
          </p>
          <div className="flex items-center gap-1 mt-1 text-[9px] text-[#94a3b8] dark:text-[#475569] font-medium tracking-wide">
            <span>Powered by</span>
            <a
              href="https://scalekit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:text-[#5f6368] dark:hover:text-white transition-colors"
            >
              scalekit
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
