import Link from "next/link";
import { MessageSquare, LogIn, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#030307] flex items-center justify-center px-6 grid-bg relative selection:bg-[#c084fc]/30 selection:text-white">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#6366f1]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10 animate-fade-in">
        <Link href="/" className="flex items-center justify-center mb-6">
          <div className="w-56 h-14 overflow-hidden flex items-center justify-center relative">
            <img 
              src="/logo.png" 
              alt="EchoDesk Logo" 
              className="w-full h-full object-contain" 
              style={{ filter: "invert(1) hue-rotate(180deg)", transform: "scale(4.0) translateY(1.5px)" }}
            />
          </div>
        </Link>

        {/* Login Card */}
        <div className="glass-card p-8 border border-white/[0.05] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c084fc]/25 to-transparent" />
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-[#94a3b8]">
              Sign in to manage your support workspace
            </p>
          </div>

          {/* Sign in button — triggers Scalekit OAuth flow */}
          <a
            href="/api/auth/login"
            className="btn-primary w-full justify-center !py-3.5 text-sm font-medium tracking-wide shadow-md shadow-[#6366f1]/10"
          >
            <LogIn className="w-4 h-4" />
            Sign In with Scalekit SSO
          </a>

          <div className="mt-6 pt-6 border-t border-white/[0.05] text-center">
            <p className="text-xs text-[#475569] leading-relaxed">
              Don&apos;t have an account yet? Proceeding will automatically onboard your organization.
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#475569] hover:text-[#94a3b8] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
