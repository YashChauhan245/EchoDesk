"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { Menu, X } from "lucide-react";
import {
  ArrowRight,
  Bot,
  Code,
  Shield,
  Sparkles,
  MessageSquare,
  Check,
  Copy,
  ChevronRight,
  Terminal,
  Settings,
  Zap,
  Globe,
  Users,
  BarChart3,
  Clock,
  Star
} from "lucide-react";

interface Message {
  id: number;
  sender: "bot" | "user";
  text: string;
  isTyping?: boolean;
}

export default function LandingPage() {
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Simulated chat messages
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "bot", text: "Hello! Welcome to EchoDesk support. How can I help you today? 👋" }
  ]);
  const [currentStep, setCurrentStep] = useState(0);

  const scriptSnippet = `<script
  src="https://echodesk-platform.vercel.app/chatbot.js"
  data-org-id="your_org_id"
></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scriptSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Chat simulator script
  const conversationScript = [
    { sender: "user", text: "Hi! How do I add this chatbot to my website?", delay: 2000 },
    { sender: "bot", text: "It's super easy! Just copy the one-line script tag from your EchoDesk dashboard and paste it into your HTML file. 🚀", delay: 2500 },
    { sender: "user", text: "Wow, is it really that simple? No complex APIs?", delay: 1800 },
    { sender: "bot", text: "Exactly! It runs instantly, trained on your custom FAQs and docs. Try it out!", delay: 2000 }
  ];

  useEffect(() => {
    if (currentStep >= conversationScript.length) {
      // Loop conversation back after a delay
      const resetTimeout = setTimeout(() => {
        setMessages([{ id: 1, sender: "bot", text: "Hello! Welcome to EchoDesk support. How can I help you today? 👋" }]);
        setCurrentStep(0);
      }, 7000);
      return () => clearTimeout(resetTimeout);
    }

    const nextMsg = conversationScript[currentStep];

    // 1. Show typing indicator
    const typingTimeout = setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: nextMsg.sender as "user" | "bot", text: "...", isTyping: true }
      ]);

      // 2. Replace typing with real text
      const sendTimeout = setTimeout(() => {
        setMessages(prev =>
          prev.map(m => m.isTyping ? { ...m, text: nextMsg.text, isTyping: false } : m)
        );
        setCurrentStep(prev => prev + 1);
      }, 1000);

      return () => clearTimeout(sendTimeout);

    }, nextMsg.delay);

    return () => clearTimeout(typingTimeout);
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#030307] text-[#0f0f15] dark:text-[#f8fafc] grid-bg selection:bg-black/5 overflow-x-hidden transition-colors duration-300">
      <div className="linear-glow" />

      {/* ---- Navigation ---- */}
      <nav className="fixed top-0 w-full z-50 border-b border-black/[0.04] dark:border-white/[0.04] bg-white/80 dark:bg-[#030307]/80 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="w-36 sm:w-48 h-12 overflow-hidden flex items-center justify-center relative">
              <img
                src="/logo.png"
                alt="EchoDesk Logo"
                className="w-full h-full object-contain dark:brightness-0 dark:invert"
                style={{ transform: "scale(4.0) translateY(1.5px)" }}
              />
            </div>
          </Link>

          {/* Center navigation links (desktop) */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-[#5f6368] dark:text-[#94a3b8] hover:text-[#0f0f15] dark:hover:text-white transition-colors">Features</a>
            <a href="#workflow" className="text-sm font-medium text-[#5f6368] dark:text-[#94a3b8] hover:text-[#0f0f15] dark:hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm font-medium text-[#5f6368] dark:text-[#94a3b8] hover:text-[#0f0f15] dark:hover:text-white transition-colors">Subscription</a>
            <a href="#testimonials" className="text-sm font-medium text-[#5f6368] dark:text-[#94a3b8] hover:text-[#0f0f15] dark:hover:text-white transition-colors">Testimonials</a>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <ThemeToggle />
            <Link href="/login" className="hidden sm:inline text-sm font-medium text-[#5f6368] dark:text-[#94a3b8] hover:text-[#0f0f15] dark:hover:text-white transition-colors">Sign in</Link>
            <Link href="/login" className="hidden sm:inline-flex btn-primary !py-2 !px-4 !text-sm">
              Get Started
              <ChevronRight className="w-4 h-4" />
            </Link>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#5f6368] dark:text-[#94a3b8] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-black/[0.04] dark:border-white/[0.04] bg-white/95 dark:bg-[#030307]/95 backdrop-blur-xl animate-fade-in">
            <div className="px-4 py-4 space-y-1">
              {[{label: "Features", href: "#features"}, {label: "How It Works", href: "#workflow"}, {label: "Subscription", href: "#pricing"}, {label: "Testimonials", href: "#testimonials"}].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[#5f6368] dark:text-[#94a3b8] hover:text-[#0f0f15] dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-3 mt-2 border-t border-black/[0.04] dark:border-white/[0.04] flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-[#5f6368] dark:text-[#94a3b8] hover:text-[#0f0f15] dark:hover:text-white px-3 py-2 transition-colors">Sign in</Link>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn-primary !py-2.5 !px-4 !text-sm text-center">
                  Get Started <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ---- Hero Section ---- */}
      <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[800px] h-[200px] sm:h-[350px] bg-neutral-100/50 dark:bg-neutral-900/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-[45%] right-10 w-[150px] sm:w-[300px] h-[150px] sm:h-[300px] bg-neutral-50/50 dark:bg-neutral-900/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-black/[0.05] dark:border-white/[0.08] bg-black/[0.01] dark:bg-white/[0.01] mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-[#5f6368] dark:text-[#94a3b8] font-medium tracking-wide">
                Next-Gen AI Customer Support
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-[1.1] mb-6 animate-slide-up text-[#0f0f15] dark:text-white">
              Instant customer support,
              <span className="block mt-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">automated by AI.</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#5f6368] dark:text-[#94a3b8] max-w-xl mb-8 leading-relaxed animate-slide-up">
              Train intelligent support chatbots on your product docs, FAQs, and files. Deploy to any website in under 10 minutes with a single line of script.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto animate-slide-up">
              <Link href="/login" className="btn-primary !py-3 !px-6 !text-sm group">
                Start Building Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#features" className="btn-secondary !py-3 !px-6 !text-sm">
                Explore Features
              </a>
            </div>

            {/* Copy Snippet Panel */}
            <div className="w-full max-w-lg bg-[#f9fafb] dark:bg-[#0c0c14] border border-black/[0.05] dark:border-white/[0.06] rounded-xl p-4 shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs text-[#5f6368] dark:text-[#94a3b8] font-mono">
                  <Terminal className="w-3.5 h-3.5 text-[#5f6368] dark:text-[#94a3b8]" />
                  <span>install-widget.html</span>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="p-1.5 rounded-md hover:bg-black/[0.03] dark:hover:bg-white/[0.03] text-[#5f6368] dark:text-[#94a3b8] hover:text-black dark:hover:text-white transition-colors"
                  title="Copy widget script tag"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <pre className="text-xs font-mono text-[#5f6368] overflow-x-auto leading-relaxed select-all">
                <code>
                  <span className="text-[#94a3b8]">&lt;!-- Add to &lt;body&gt; --&gt;</span>{"\n"}
                  {scriptSnippet}
                </code>
              </pre>
            </div>
          </div>

          {/* Hero Right Content (Floating Chat Simulator) */}
          <div className="lg:col-span-5 w-full flex justify-center lg:justify-end animate-float">
            <div className="w-full max-w-[380px] bg-white dark:bg-[#0c0c14] border border-black/[0.06] dark:border-white/[0.04] rounded-2xl shadow-xl overflow-hidden relative">

              {/* Header */}
              <div className="p-4 border-b border-black/[0.05] dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.02] flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-black dark:bg-white flex items-center justify-center shadow-sm">
                    <Bot className="w-5 h-5 text-white dark:text-black" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#0f0f15] dark:text-white">EchoDesk AI</h4>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] text-[#5f6368] dark:text-[#94a3b8]">Typically replies instantly</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Messages Simulator */}
              <div className="p-4 h-[280px] overflow-y-auto flex flex-col gap-3 font-sans text-xs scrollbar-thin bg-[#fcfcfd] dark:bg-[#08080d]">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[80%] ${msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                      } animate-fade-in`}
                  >
                    <div
                      className={`p-3 rounded-2xl ${msg.sender === "user"
                          ? "bg-black dark:bg-white text-white dark:text-black rounded-tr-none"
                          : "bg-white dark:bg-[#0c0c14] text-[#0f0f15] dark:text-[#f8fafc] border border-black/[0.05] dark:border-white/[0.06] rounded-tl-none shadow-sm"
                        }`}
                    >
                      {msg.isTyping ? (
                        <div className="flex items-center gap-1.5 py-1 px-2">
                          <span className="w-1.5 h-1.5 bg-[#94a3b8] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-[#94a3b8] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-[#94a3b8] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      ) : (
                        msg.text
                      )}
                    </div>
                    <span className="text-[9px] text-[#94a3b8] mt-1 px-1">
                      {msg.sender === "user" ? "You" : "EchoDesk AI"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Chat Input Mock */}
              <div className="p-3 border-t border-black/[0.05] dark:border-white/[0.06] bg-white dark:bg-[#0c0c14] flex items-center gap-2">
                <div className="flex-1 bg-neutral-50 dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.06] rounded-full px-3 py-1.5 text-xs text-[#94a3b8]">
                  Ask support anything...
                </div>
                <div className="w-7 h-7 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ---- Trusted By Strip ---- */}
      <section className="py-8 sm:py-10 px-4 sm:px-6 border-t border-black/[0.03] dark:border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#94a3b8] mb-6">Trusted by forward-thinking teams</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-12 gap-y-3 sm:gap-y-4">
            {["FinLeap", "Cloudfolio", "ShipFast", "DataMesh", "NovaByte", "QuickServe"].map((brand) => (
              <span key={brand} className="text-sm font-bold tracking-wider text-[#cbd5e1] dark:text-[#475569] uppercase select-none hover:text-[#0f0f15] dark:hover:text-white transition-colors duration-300 cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Stats Counter Row ---- */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <Users className="w-5 h-5" />, value: "2,400+", label: "Active businesses" },
            { icon: <MessageSquare className="w-5 h-5" />, value: "12M+", label: "AI messages sent" },
            { icon: <Clock className="w-5 h-5" />, value: "< 8 min", label: "Average setup time" },
            { icon: <Star className="w-5 h-5" />, value: "4.9/5", label: "Customer rating" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-6 text-center group">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-400/10 flex items-center justify-center text-indigo-500 dark:text-indigo-400 mx-auto mb-3 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#0f0f15] dark:text-white tracking-tight">{stat.value}</p>
              <p className="text-xs text-[#94a3b8] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Features Section ---- */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto relative border-t border-black/[0.03] dark:border-white/[0.04]">

        <div className="text-center mb-16 relative z-10">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 bg-indigo-500/5 dark:bg-indigo-400/10 px-4 py-1.5 rounded-full border border-indigo-500/10 dark:border-indigo-400/10 mb-4">Capabilities</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-[#0f0f15] dark:text-white">
            Engineered for <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Conversational Excellence</span>
          </h2>
          <p className="text-[#5f6368] dark:text-[#94a3b8] mt-3 max-w-xl mx-auto text-sm sm:text-base">
            EchoDesk combines cutting-edge LLMs with developer simplicity. Set up in minutes, scale to thousands.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative z-10">

          {/* Card 1 */}
          <div className="glass-card interactive-card p-6 flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-[#0f0f15] dark:text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#0f0f15] dark:text-white mb-2">AI Agent Playground</h3>
              <p className="text-xs sm:text-sm text-[#5f6368] dark:text-[#94a3b8] leading-relaxed">
                Trained on Google Gemini to provide contextual, natural-sounding replies to complex client support questions automatically.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-1 text-xs text-[#0f0f15] dark:text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Learn more</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card interactive-card p-6 flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Code className="w-5 h-5 text-[#0f0f15] dark:text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#0f0f15] dark:text-white mb-2">One-Line Embed</h3>
              <p className="text-xs sm:text-sm text-[#5f6368] dark:text-[#94a3b8] leading-relaxed">
                Paste a single script block anywhere in your HTML. Config updates, design matches, and AI answers apply dynamically without redeploy.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-1 text-xs text-[#0f0f15] dark:text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Learn more</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card interactive-card p-6 flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5 text-[#0f0f15] dark:text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#0f0f15] dark:text-white mb-2">Multi-Tenant Vault</h3>
              <p className="text-xs sm:text-sm text-[#5f6368] dark:text-[#94a3b8] leading-relaxed">
                Powered by Scalekit enterprise logins. Isolates chat logs, training contexts, and users in strict organizational buckets.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-1 text-xs text-[#0f0f15] dark:text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Learn more</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>

        </div>
      </section>

      {/* ---- Interactive Walkthrough / Workflow Section ---- */}
      <section id="workflow" className="py-16 sm:py-24 px-4 sm:px-6 border-t border-black/[0.03] dark:border-white/[0.04] bg-neutral-50/20 dark:bg-white/[0.01] relative">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          <div className="lg:col-span-5 text-left">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 bg-indigo-500/5 dark:bg-indigo-400/10 px-4 py-1.5 rounded-full border border-indigo-500/10 dark:border-indigo-400/10 mb-4">Simple Setup</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter mb-6 text-[#0f0f15] dark:text-white">
              Launch support in <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">three milestones</span>
            </h2>
            <div className="flex flex-col gap-4">
              {[
                { step: 1, title: "Initialize AI Settings", desc: "Define business hours, context, custom welcome prompts, and support style." },
                { step: 2, title: "Copy the script snippet", desc: "Retrieve your script tag in the dashboard and inject it onto any site structure." },
                { step: 3, title: "Simulate & Audit logs", desc: "Test the chatbot using the built-in sandbox and check logs instantly." }
              ].map((s) => (
                <div
                  key={s.step}
                  onClick={() => setActiveStep(s.step)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${activeStep === s.step
                      ? "bg-white dark:bg-[#0c0c14] border-black/[0.06] dark:border-white/[0.03] shadow-sm"
                      : "bg-transparent border-transparent hover:bg-neutral-50 dark:hover:bg-white/[0.02]"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeStep === s.step ? "bg-black dark:bg-white text-white dark:text-black" : "bg-neutral-100 dark:bg-white/[0.04] text-[#5f6368] dark:text-[#94a3b8]"
                      }`}>
                      {s.step}
                    </span>
                    <h4 className={`text-sm font-semibold ${activeStep === s.step ? "text-[#0f0f15] dark:text-white" : "text-[#5f6368] dark:text-[#94a3b8]"}`}>
                      {s.title}
                    </h4>
                  </div>
                  {activeStep === s.step && (
                    <p className="text-xs text-[#5f6368] dark:text-[#94a3b8] mt-2 ml-9 leading-relaxed">
                      {s.desc}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 w-full flex justify-center">
            <div className="w-full max-w-lg bg-white dark:bg-[#0c0c14] border border-black/[0.06] dark:border-white/[0.03] rounded-2xl p-6 shadow-sm relative min-h-[300px] flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.03] pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-[#94a3b8] font-mono">
                  {activeStep === 1 && "chatbot-config.json"}
                  {activeStep === 2 && "copy-embed.bash"}
                  {activeStep === 3 && "live-agent-preview"}
                </span>
              </div>

              {activeStep === 1 && (
                <div className="flex-1 flex flex-col justify-center animate-fade-in font-mono text-xs text-[#5f6368] dark:text-[#94a3b8] space-y-2">
                  <p><span className="text-neutral-800 dark:text-neutral-200">"organization"</span>: "Acme Corp",</p>
                  <p><span className="text-neutral-800 dark:text-neutral-200">"botName"</span>: "Acme Assistant",</p>
                  <p><span className="text-neutral-800 dark:text-neutral-200">"welcomeMessage"</span>: "Hi there! How can I help you?",</p>
                  <p><span className="text-neutral-800 dark:text-neutral-200">"primaryColor"</span>: <span className="text-emerald-600 dark:text-emerald-400">"#10b981"</span>,</p>
                  <p><span className="text-neutral-800 dark:text-neutral-200">"instructions"</span>: "Train chatbot on Acme Docs v2.1..."</p>
                </div>
              )}

              {activeStep === 2 && (
                <div className="flex-1 flex flex-col justify-center animate-fade-in space-y-3">
                  <div className="bg-[#f9fafb] dark:bg-[#08080d] p-3 rounded border border-black/[0.04] dark:border-white/[0.03] font-mono text-xs text-[#0f0f15] dark:text-white">
                    $ pbcopy &lt; script_embed.txt
                  </div>
                  <p className="text-xs text-[#5f6368] dark:text-[#94a3b8]">
                    Inject script anywhere inside <span className="text-[#0f0f15] dark:text-white font-mono">&lt;body&gt;</span> tag. Supports NextJS, Webflow, Shopify, static HTML files.
                  </p>
                </div>
              )}

              {activeStep === 3 && (
                <div className="flex-1 flex flex-col justify-center animate-fade-in text-center py-6 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-white/[0.04] text-[#0f0f15] dark:text-white border border-black/[0.05] dark:border-white/[0.03] md:mx-auto">
                    <Zap className="w-3.5 h-3.5 text-black dark:text-white animate-pulse" />
                    Sandbox Active
                  </div>
                  <p className="text-xs text-[#5f6368] dark:text-[#94a3b8] max-w-sm mx-auto leading-relaxed">
                    Test bot replies inside our visual workspace. Logs sync in real-time to analyze queries and response confidence.
                  </p>
                </div>
              )}

              <div className="border-t border-black/[0.05] dark:border-white/[0.03] pt-4 mt-4 flex items-center justify-between text-[11px] text-[#94a3b8]">
                <span>Status: Fully Configured</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Online
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ---- Subscription / Pricing Section ---- */}
      <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 border-t border-black/[0.03] dark:border-white/[0.04] max-w-7xl mx-auto relative">
        <div className="text-center mb-16 relative z-10">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 bg-indigo-500/5 dark:bg-indigo-400/10 px-4 py-1.5 rounded-full border border-indigo-500/10 dark:border-indigo-400/10 mb-4">Subscription</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-[#0f0f15] dark:text-white">
            Simple, <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Transparent Plans</span>
          </h2>
          <p className="text-[#5f6368] dark:text-[#94a3b8] mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Scale your automated support workspace seamlessly. Choose the plan that fits your customer interaction volume.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch pt-4 relative z-10">
          
          {/* Free Plan */}
          <div className="glass-card p-6 sm:p-8 flex flex-col justify-between border border-black/[0.05] dark:border-white/[0.06] bg-white dark:bg-[#0c0c14] relative rounded-2xl">
            <div>
              <h3 className="text-lg font-bold text-[#0f0f15] dark:text-white mb-2">Free Plan</h3>
              <p className="text-xs text-[#5f6368] dark:text-[#94a3b8] leading-relaxed mb-6">
                Ideal for testing and small personal projects
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#0f0f15] dark:text-white">₹0</span>
                <span className="text-xs text-[#5f6368] dark:text-[#94a3b8]">/month</span>
              </div>
              <ul className="space-y-3.5">
                {[
                  "1 AI chatbot",
                  "1 website deployment",
                  "500 AI messages/month",
                  "Standard support",
                ].map((limit) => (
                  <li key={limit} className="flex items-start gap-2.5 text-xs text-[#475569] dark:text-[#cbd5e1]">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{limit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <Link
                href="/login"
                className="btn-secondary !w-full text-center block text-xs font-semibold py-2.5 rounded-lg border border-black/[0.08] dark:border-white/[0.08] hover:bg-neutral-50 dark:hover:bg-white/[0.02]"
              >
                Get Started Free
              </Link>
            </div>
          </div>

          {/* Starter Plan */}
          <div className="glass-card p-6 sm:p-8 flex flex-col justify-between border border-black/[0.05] dark:border-white/[0.06] bg-white dark:bg-[#0c0c14] relative rounded-2xl">
            <div>
              <h3 className="text-lg font-bold text-[#0f0f15] dark:text-white mb-2">Starter Plan</h3>
              <p className="text-xs text-[#5f6368] dark:text-[#94a3b8] leading-relaxed mb-6">
                Perfect for growing sites & customer service
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#0f0f15] dark:text-white">₹799</span>
                <span className="text-xs text-[#5f6368] dark:text-[#94a3b8]">/month</span>
              </div>
              <ul className="space-y-3.5">
                {[
                  "3 AI chatbots",
                  "3 website deployments",
                  "10,000 AI messages/month",
                  "Fast response support",
                  "Custom widget branding",
                ].map((limit) => (
                  <li key={limit} className="flex items-start gap-2.5 text-xs text-[#475569] dark:text-[#cbd5e1]">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{limit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <Link
                href="/login"
                className="btn-secondary !w-full text-center block text-xs font-semibold py-2.5 rounded-lg border border-black/[0.08] dark:border-white/[0.08] hover:bg-neutral-50 dark:hover:bg-white/[0.02]"
              >
                Choose Starter
              </Link>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="glass-card p-6 sm:p-8 flex flex-col justify-between border border-[#6366f1] shadow-[0_0_24px_rgba(99,102,241,0.06)] dark:shadow-[0_0_32px_rgba(99,102,241,0.08)] bg-white dark:bg-[#0c0c16]/90 lg:scale-[1.03] z-10 relative rounded-2xl">
            {/* Glow Accent */}
            <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-[#6366f1] to-transparent" />
            
            {/* Popular Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#6366f1]/20 bg-[#6366f1]/5 text-[#6366f1] text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Most Popular
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#0f0f15] dark:text-white mb-2">Pro Plan</h3>
              <p className="text-xs text-[#5f6368] dark:text-[#94a3b8] leading-relaxed mb-6">
                For high-traffic businesses needing maximum reach
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#0f0f15] dark:text-white">₹2499</span>
                <span className="text-xs text-[#5f6368] dark:text-[#94a3b8]">/month</span>
              </div>
              <ul className="space-y-3.5">
                {[
                  "10 AI chatbots",
                  "10 website deployments",
                  "50,000 AI messages/month",
                  "Priority 24/7 support",
                  "Custom widget branding",
                  "Advanced training context limit",
                ].map((limit) => (
                  <li key={limit} className="flex items-start gap-2.5 text-xs text-[#475569] dark:text-[#cbd5e1]">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{limit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <Link
                href="/login"
                className="btn-primary !w-full text-center block text-xs font-semibold py-2.5 rounded-lg"
              >
                Choose Pro
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ---- Testimonials Marquee Section ---- */}
      <section id="testimonials" className="py-16 sm:py-24 border-t border-black/[0.03] dark:border-white/[0.04] overflow-hidden relative">
        <div className="text-center mb-10 sm:mb-14 px-4 sm:px-6">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 bg-indigo-500/5 dark:bg-indigo-400/10 px-4 py-1.5 rounded-full border border-indigo-500/10 dark:border-indigo-400/10 mb-4">Testimonials</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-[#0f0f15] dark:text-white">
            Loved by <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">teams everywhere</span>
          </h2>
          <p className="text-[#5f6368] dark:text-[#94a3b8] mt-3 max-w-xl mx-auto text-sm sm:text-base">
            See what our customers are saying about EchoDesk.
          </p>
        </div>

        <div className="marquee-row">
          <div className="marquee-track">
            {/* First set */}
            {[
              { name: "Priya Sharma", role: "CTO, FinLeap", img: "https://randomuser.me/api/portraits/women/44.jpg", stars: 5, text: "EchoDesk cut our support tickets by 60%. The AI responses feel genuinely human — our customers love it." },
              { name: "Marcus Chen", role: "Head of Support, Cloudfolio", img: "https://randomuser.me/api/portraits/men/32.jpg", stars: 5, text: "Setup took 8 minutes. We went from zero chatbot to live production support in a single sprint." },
              { name: "Anika Patel", role: "Founder, ShipFast", img: "https://randomuser.me/api/portraits/women/68.jpg", stars: 5, text: "The one-line embed is a game-changer. No dev time wasted — just paste and it works instantly." },
              { name: "James O'Brien", role: "VP Eng, DataMesh", img: "https://randomuser.me/api/portraits/men/75.jpg", stars: 4, text: "Multi-tenant isolation means each client's data stays completely separate. Enterprise security, startup speed." },
              { name: "Sofia Reyes", role: "Product Lead, NovaByte", img: "https://randomuser.me/api/portraits/women/90.jpg", stars: 5, text: "We replaced our entire Zendesk chatbot. EchoDesk is faster, smarter, and costs a fraction of the price." },
              { name: "Raj Mehta", role: "CEO, QuickServe", img: "https://randomuser.me/api/portraits/men/46.jpg", stars: 5, text: "Our customer satisfaction score jumped 35% in the first month. EchoDesk practically runs itself." },
              { name: "Emily Zhang", role: "Ops Manager, TrueScale", img: "https://randomuser.me/api/portraits/women/26.jpg", stars: 4, text: "The sandbox testing mode saved us from embarrassing bot mistakes. We test everything before going live." },
              { name: "Daniel Kim", role: "Tech Lead, GrowthLab", img: "https://randomuser.me/api/portraits/men/22.jpg", stars: 5, text: "Gemini-powered responses are incredibly accurate. Our bot handles 90% of queries without human intervention." },
            ].map((t, i) => (
              <div key={`t-${i}`} className="testimonial-card">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg key={s} className={`w-3.5 h-3.5 ${s < t.stars ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-[#475569] dark:text-[#cbd5e1] leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 mt-auto">
                  <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20 dark:ring-white/10" />
                  <div>
                    <p className="text-xs font-semibold text-[#0f0f15] dark:text-white">{t.name}</p>
                    <p className="text-[10px] text-[#94a3b8]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
            {/* Duplicate set for seamless infinite scroll */}
            {[
              { name: "Priya Sharma", role: "CTO, FinLeap", img: "https://randomuser.me/api/portraits/women/44.jpg", stars: 5, text: "EchoDesk cut our support tickets by 60%. The AI responses feel genuinely human — our customers love it." },
              { name: "Marcus Chen", role: "Head of Support, Cloudfolio", img: "https://randomuser.me/api/portraits/men/32.jpg", stars: 5, text: "Setup took 8 minutes. We went from zero chatbot to live production support in a single sprint." },
              { name: "Anika Patel", role: "Founder, ShipFast", img: "https://randomuser.me/api/portraits/women/68.jpg", stars: 5, text: "The one-line embed is a game-changer. No dev time wasted — just paste and it works instantly." },
              { name: "James O'Brien", role: "VP Eng, DataMesh", img: "https://randomuser.me/api/portraits/men/75.jpg", stars: 4, text: "Multi-tenant isolation means each client's data stays completely separate. Enterprise security, startup speed." },
              { name: "Sofia Reyes", role: "Product Lead, NovaByte", img: "https://randomuser.me/api/portraits/women/90.jpg", stars: 5, text: "We replaced our entire Zendesk chatbot. EchoDesk is faster, smarter, and costs a fraction of the price." },
              { name: "Raj Mehta", role: "CEO, QuickServe", img: "https://randomuser.me/api/portraits/men/46.jpg", stars: 5, text: "Our customer satisfaction score jumped 35% in the first month. EchoDesk practically runs itself." },
              { name: "Emily Zhang", role: "Ops Manager, TrueScale", img: "https://randomuser.me/api/portraits/women/26.jpg", stars: 4, text: "The sandbox testing mode saved us from embarrassing bot mistakes. We test everything before going live." },
              { name: "Daniel Kim", role: "Tech Lead, GrowthLab", img: "https://randomuser.me/api/portraits/men/22.jpg", stars: 5, text: "Gemini-powered responses are incredibly accurate. Our bot handles 90% of queries without human intervention." },
            ].map((t, i) => (
              <div key={`td-${i}`} className="testimonial-card" aria-hidden="true">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg key={s} className={`w-3.5 h-3.5 ${s < t.stars ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-[#475569] dark:text-[#cbd5e1] leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 mt-auto">
                  <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20 dark:ring-white/10" />
                  <div>
                    <p className="text-xs font-semibold text-[#0f0f15] dark:text-white">{t.name}</p>
                    <p className="text-[10px] text-[#94a3b8]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edge fades */}
        <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-white dark:from-[#030307] to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-white dark:from-[#030307] to-transparent pointer-events-none z-10" />
      </section>

      {/* ---- Interactive Call to Action Banner ---- */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-6 sm:p-12 rounded-2xl sm:rounded-3xl overflow-hidden border border-indigo-500/20 dark:border-indigo-400/10">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10 pointer-events-none" />
            {/* Animated glow orbs */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none animate-float" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none animate-float" style={{ animationDelay: '3s' }} />

            <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter mb-4 text-[#0f0f15] dark:text-white">
                Redefine your <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">support workspace</span>
              </h2>
              <p className="text-[#5f6368] dark:text-[#94a3b8] mb-8 text-sm sm:text-base leading-relaxed">
                Unlock instant AI support with secure organizational logic. Start building your first chatbot for free.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/login" className="btn-primary !py-3.5 !px-8 !text-sm group">
                  Get Started Free
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#features" className="btn-secondary !py-3.5 !px-8 !text-sm">
                  See How It Works
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="py-10 sm:py-16 px-4 sm:px-6 border-t border-black/[0.04] dark:border-white/[0.04] text-xs text-[#94a3b8]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 mb-10 sm:mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="w-36 h-10 overflow-hidden flex items-center justify-start relative mb-4">
                <img
                  src="/logo.png"
                  alt="EchoDesk Logo"
                  className="w-full h-full object-contain dark:brightness-0 dark:invert"
                  style={{ transform: "scale(4.0) translateY(1.5px)" }}
                />
              </div>
              <p className="text-[11px] text-[#94a3b8] leading-relaxed max-w-[200px]">
                Intelligent AI customer support that deploys in minutes, not months.
              </p>
            </div>

            {/* Product */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#0f0f15] dark:text-white mb-4">Product</p>
              <ul className="space-y-2.5">
                <li><a href="#features" className="hover:text-[#0f0f15] dark:hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-[#0f0f15] dark:hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#workflow" className="hover:text-[#0f0f15] dark:hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#testimonials" className="hover:text-[#0f0f15] dark:hover:text-white transition-colors">Testimonials</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#0f0f15] dark:text-white mb-4">Company</p>
              <ul className="space-y-2.5">
                <li><a href="#" className="hover:text-[#0f0f15] dark:hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-[#0f0f15] dark:hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[#0f0f15] dark:hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-[#0f0f15] dark:hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#0f0f15] dark:text-white mb-4">Legal</p>
              <ul className="space-y-2.5">
                <li><a href="#" className="hover:text-[#0f0f15] dark:hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#0f0f15] dark:hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#0f0f15] dark:hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-black/[0.04] dark:border-white/[0.04] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-[#94a3b8]">© {new Date().getFullYear()} EchoDesk. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-8 h-8 rounded-full border border-black/[0.06] dark:border-white/[0.06] flex items-center justify-center text-[#94a3b8] hover:text-[#0f0f15] dark:hover:text-white hover:border-indigo-500/30 transition-all" aria-label="Twitter">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-black/[0.06] dark:border-white/[0.06] flex items-center justify-center text-[#94a3b8] hover:text-[#0f0f15] dark:hover:text-white hover:border-indigo-500/30 transition-all" aria-label="GitHub">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-black/[0.06] dark:border-white/[0.06] flex items-center justify-center text-[#94a3b8] hover:text-[#0f0f15] dark:hover:text-white hover:border-indigo-500/30 transition-all" aria-label="LinkedIn">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
