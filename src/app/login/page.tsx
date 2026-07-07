import Link from "next/link";
import { LogIn, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#030307] flex items-center justify-center px-6 grid-bg relative selection:bg-black/5 transition-colors duration-300">
      <div className="w-full max-w-[420px] relative z-10 animate-fade-in">
        <Link href="/" className="flex items-center justify-center mb-6">
          <div className="w-56 h-14 overflow-hidden flex items-center justify-center relative">
            <img 
              src="/logo.png" 
              alt="EchoDesk Logo" 
              className="w-full h-full object-contain dark:brightness-0 dark:invert" 
              style={{ transform: "scale(4.0) translateY(1.5px)" }}
            />
          </div>
        </Link>

        {/* Login Card */}
        <div className="glass-card p-8 border border-black/[0.05] dark:border-white/[0.06] relative overflow-hidden bg-white dark:bg-[#0c0c14] shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-[#0f0f15] dark:text-white mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-[#5f6368] dark:text-[#94a3b8]">
              Sign in to manage your support workspace
            </p>
          </div>

          {/* Sign in button — triggers Scalekit OAuth flow */}
          <a
            href="/api/auth/login"
            className="btn-primary w-full justify-center !py-3.5 text-sm font-medium tracking-wide"
          >
            <LogIn className="w-4 h-4" />
            Sign In with Scalekit SSO
          </a>

          <div className="mt-6 pt-6 border-t border-black/[0.05] dark:border-white/[0.06] text-center">
            <p className="text-xs text-[#94a3b8] dark:text-[#475569] leading-relaxed">
              Don&apos;t have an account yet? Proceeding will automatically onboard your organization.
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#5f6368] dark:text-[#94a3b8] hover:text-[#0f0f15] dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
