"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  Globe
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
  
  // Simulated chat messages
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "bot", text: "Hello! Welcome to EchoDesk support. How can I help you today? 👋" }
  ]);
  const [currentStep, setCurrentStep] = useState(0);

  const scriptSnippet = `<script
  src="https://echodesk.vercel.app/chatbot.js"
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
    <div className="min-h-screen bg-[#030307] text-[#f8fafc] grid-bg selection:bg-[#c084fc]/30 selection:text-white overflow-x-hidden">
      <div className="linear-glow" />

      {/* ---- Navigation ---- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/[0.05] bg-[#030307]/75 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="w-48 h-12 overflow-hidden flex items-center justify-center relative">
              <img 
                src="/logo.png" 
                alt="EchoDesk Logo" 
                className="w-full h-full object-contain" 
                style={{ filter: "invert(1) hue-rotate(180deg)", transform: "scale(4.0) translateY(1.5px)" }}
              />
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm font-medium text-[#94a3b8] hover:text-[#f8fafc] transition-colors"
            >
              Sign in
            </Link>
            <Link href="/login" className="btn-primary !py-2 !px-4 !text-sm">
              Get Started
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ---- Hero Section ---- */}
      <section className="relative pt-36 pb-24 px-6 max-w-7xl mx-auto">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-[#6366f1]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-[45%] right-10 w-[300px] h-[300px] bg-[#c084fc]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] mb-6 animate-fade-in shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-[#94a3b8] font-medium tracking-wide">
                Next-Gen AI Customer Support
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 animate-slide-up">
              Instant customer support,
              <span className="block mt-2 gradient-text">automated by AI.</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#94a3b8] max-w-xl mb-8 leading-relaxed animate-slide-up">
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
            <div className="w-full max-w-lg bg-[#0c0c14] border border-white/[0.04] rounded-xl p-4 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c084fc]/20 to-transparent" />
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs text-[#475569] font-mono">
                  <Terminal className="w-3.5 h-3.5 text-[#94a3b8]" />
                  <span>install-widget.html</span>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="p-1.5 rounded-md hover:bg-white/[0.05] text-[#94a3b8] hover:text-white transition-colors"
                  title="Copy widget script tag"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <pre className="text-xs font-mono text-[#94a3b8] overflow-x-auto leading-relaxed select-all">
                <code>
                  <span className="text-[#475569]">&lt;!-- Add to &lt;body&gt; --&gt;</span>{"\n"}
                  {scriptSnippet}
                </code>
              </pre>
            </div>
          </div>

          {/* Hero Right Content (Floating Chat Simulator) */}
          <div className="lg:col-span-5 w-full flex justify-center lg:justify-end animate-float">
            <div className="w-full max-w-[380px] bg-[#0c0c14] border border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden relative">
              {/* Card top shimmer glow */}
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#6366f1]/10 to-transparent pointer-events-none" />
              
              {/* Header */}
              <div className="p-4 border-b border-white/[0.05] bg-white/[0.01] flex items-center gap-3 relative z-10">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#c084fc] to-[#6366f1] flex items-center justify-center shadow-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">EchoDesk AI</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] text-[#94a3b8]">Live Agent</span>
                  </div>
                </div>
              </div>

              {/* Chat Messages Simulator */}
              <div className="p-4 h-[280px] overflow-y-auto flex flex-col gap-3 font-sans text-xs scrollbar-thin">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[80%] ${
                      msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                    } animate-fade-in`}
                  >
                    <div
                      className={`p-3 rounded-2xl ${
                        msg.sender === "user"
                          ? "bg-[#6366f1] text-white rounded-tr-none"
                          : "bg-white/[0.04] text-[#e2e8f0] border border-white/[0.05] rounded-tl-none"
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
                    <span className="text-[9px] text-[#475569] mt-1 px-1">
                      {msg.sender === "user" ? "You" : "EchoDesk AI"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Chat Input Mock */}
              <div className="p-3 border-t border-white/[0.05] bg-white/[0.01] flex items-center gap-2">
                <div className="flex-1 bg-white/[0.02] border border-white/[0.04] rounded-full px-3 py-1.5 text-xs text-[#475569]">
                  Ask support anything...
                </div>
                <div className="w-7 h-7 rounded-full bg-[#6366f1]/20 flex items-center justify-center text-[#6366f1]">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ---- Features Section ---- */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto relative border-t border-white/[0.03]">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#6366f1]/2 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="text-center mb-16 relative z-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#c084fc] block mb-2">Capabilities</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Engineered for <span className="gradient-text">Conversational Excellence</span>
          </h2>
          <p className="text-[#94a3b8] mt-3 max-w-xl mx-auto text-sm sm:text-base">
            EchoDesk combines cutting-edge LLMs with developer simplicity. Set up in minutes, scale to thousands.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative z-10">
          
          {/* Card 1 */}
          <div className="glass-card p-6 flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#c084fc]/10 border border-[#c084fc]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-[#c084fc]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Agent Playground</h3>
              <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
                Trained on Google Gemini to provide contextual, natural-sounding replies to complex client support questions automatically.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-1 text-xs text-[#c084fc] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Learn more</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-6 flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Code className="w-5 h-5 text-[#6366f1]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">One-Line Embed</h3>
              <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
                Paste a single script block anywhere in your HTML. Config updates, design matches, and AI answers apply dynamically without redeploy.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-1 text-xs text-[#6366f1] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Learn more</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-6 flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Multi-Tenant Vault</h3>
              <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
                Powered by Scalekit enterprise logins. Isolates chat logs, training contexts, and users in strict organizational buckets.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-1 text-xs text-emerald-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Learn more</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>

        </div>
      </section>

      {/* ---- Interactive Walkthrough / Workflow Section ---- */}
      <section className="py-24 px-6 border-t border-white/[0.03] bg-white/[0.01] relative">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 text-left">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#6366f1] block mb-2">Simple Setup</span>
            <h2 className="text-3xl font-bold tracking-tight mb-6">
              Launch support in three milestones
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
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    activeStep === s.step 
                      ? "bg-[#0c0c14] border-white/[0.08] shadow-lg" 
                      : "bg-transparent border-transparent hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      activeStep === s.step ? "bg-[#c084fc] text-white" : "bg-white/[0.05] text-[#94a3b8]"
                    }`}>
                      {s.step}
                    </span>
                    <h4 className={`text-sm font-semibold ${activeStep === s.step ? "text-white" : "text-[#94a3b8]"}`}>
                      {s.title}
                    </h4>
                  </div>
                  {activeStep === s.step && (
                    <p className="text-xs text-[#94a3b8] mt-2 ml-9 leading-relaxed">
                      {s.desc}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 w-full flex justify-center">
            <div className="w-full max-w-lg bg-[#0c0c14] border border-white/[0.06] rounded-2xl p-6 shadow-2xl relative min-h-[300px] flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/[0.05] pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs text-[#475569] font-mono">
                  {activeStep === 1 && "chatbot-config.json"}
                  {activeStep === 2 && "copy-embed.bash"}
                  {activeStep === 3 && "live-agent-preview"}
                </span>
              </div>

              {activeStep === 1 && (
                <div className="flex-1 flex flex-col justify-center animate-fade-in font-mono text-xs text-[#94a3b8] space-y-2">
                  <p><span className="text-[#c084fc]">"organization"</span>: "Acme Corp",</p>
                  <p><span className="text-[#c084fc]">"botName"</span>: "Acme Assistant",</p>
                  <p><span className="text-[#c084fc]">"welcomeMessage"</span>: "Hi there! How can I help you?",</p>
                  <p><span className="text-[#c084fc]">"primaryColor"</span>: <span className="text-emerald-400">"#10b981"</span>,</p>
                  <p><span className="text-[#c084fc]">"instructions"</span>: "Train chatbot on Acme Docs v2.1..."</p>
                </div>
              )}

              {activeStep === 2 && (
                <div className="flex-1 flex flex-col justify-center animate-fade-in space-y-3">
                  <div className="bg-black/40 p-3 rounded border border-white/[0.03] font-mono text-xs text-emerald-400">
                    $ pbcopy &lt; script_embed.txt
                  </div>
                  <p className="text-xs text-[#94a3b8]">
                    Inject script anywhere inside <span className="text-white font-mono">&lt;body&gt;</span> tag. Supports NextJS, Webflow, Shopify, static HTML files.
                  </p>
                </div>
              )}

              {activeStep === 3 && (
                <div className="flex-1 flex flex-col justify-center animate-fade-in text-center py-6 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6366f1]/10 text-[#6366f1] text-xs font-medium mx-auto border border-[#6366f1]/20">
                    <Zap className="w-3.5 h-3.5" />
                    Sandbox Active
                  </div>
                  <p className="text-xs text-[#94a3b8] max-w-sm mx-auto leading-relaxed">
                    Test bot replies inside our visual workspace. Logs sync in real-time to analyze queries and response confidence.
                  </p>
                </div>
              )}

              <div className="border-t border-white/[0.05] pt-4 mt-4 flex items-center justify-between text-[11px] text-[#475569]">
                <span>Status: Fully Configured</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Online
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ---- Interactive Call to Action Banner ---- */}
      <section className="py-24 px-6 relative">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-[#c084fc]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/5 to-[#c084fc]/5 pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#c084fc]/10 rounded-full blur-[60px] pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            
            <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Redefine your support workspace
              </h2>
              <p className="text-[#94a3b8] mb-8 text-sm sm:text-base leading-relaxed">
                Unlock instant AI support with secure organizational logic. Sign up via Scalekit today.
              </p>
              <Link href="/login" className="btn-primary !py-3.5 !px-8 !text-sm group">
                Get Started Free
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="py-12 px-6 border-t border-white/[0.03] text-xs text-[#475569]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <div className="w-36 h-10 overflow-hidden flex items-center justify-center relative">
              <img 
                src="/logo.png" 
                alt="EchoDesk Logo" 
                className="w-full h-full object-contain" 
                style={{ filter: "invert(1) hue-rotate(180deg)", transform: "scale(4.0) translateY(1.5px)" }}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Status</a>
          </div>

          <p>© {new Date().getFullYear()} EchoDesk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
