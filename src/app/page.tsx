"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import Counter from "@/components/Counter";
import {
  Menu,
  X,
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
  Zap,
  Users,
  Clock,
  Star,
} from "lucide-react";

interface Message {
  id: number;
  sender: "bot" | "user";
  text: string;
  isTyping?: boolean;
  isResponding?: boolean;
}

// Static section wrapper
interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

function RevealSection({ children, className = "", id }: RevealSectionProps) {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
}

export default function LandingPage() {
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

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

  // Auto-scroll messages internally within the container (never scrolls the page)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (currentStep >= conversationScript.length) {
      // Loop conversation back after a delay
      const resetTimeout = setTimeout(() => {
        setMessages([{ id: 1, sender: "bot", text: "Hello! Welcome to EchoDesk support. How can I help you today? 👋" }]);
        setCurrentStep(0);
      }, 8000);
      return () => clearTimeout(resetTimeout);
    }

    const nextMsg = conversationScript[currentStep];
    let typewriterInterval: NodeJS.Timeout;
    let nextStepTimeout: NodeJS.Timeout;
    let typewriterTimeout: NodeJS.Timeout;

    const isUser = nextMsg.sender === "user";
    const typingDuration = isUser ? 100 : 900;

    // 1. Show typing indicator (skip for user messages)
    const typingTimeout = setTimeout(() => {
      const tempId = Date.now();
      
      if (isUser) {
        // User message enters directly
        setMessages(prev => [
          ...prev,
          { id: tempId, sender: "user", text: nextMsg.text }
        ]);
        nextStepTimeout = setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, 1800);
      } else {
        // Assistant message shows typing indicator
        setMessages(prev => [
          ...prev,
          { id: tempId, sender: "bot", text: "", isTyping: true }
        ]);

        // 2. Clear typing indicator and start typewriter
        typewriterTimeout = setTimeout(() => {
          setMessages(prev =>
            prev.map(m => m.id === tempId ? { ...m, isTyping: false, isResponding: true } : m)
          );

          let currentLength = 0;
          const fullText = nextMsg.text;
          
          typewriterInterval = setInterval(() => {
            currentLength++;
            setMessages(prev =>
              prev.map(m => m.id === tempId ? { ...m, text: fullText.substring(0, currentLength) } : m)
            );

            if (currentLength >= fullText.length) {
              clearInterval(typewriterInterval);
              setMessages(prev =>
                prev.map(m => m.id === tempId ? { ...m, isResponding: false } : m)
              );
              nextStepTimeout = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
              }, 1800);
            }
          }, 20);

        }, typingDuration);
      }

    }, nextMsg.delay);

    return () => {
      clearTimeout(typingTimeout);
      clearTimeout(typewriterTimeout);
      clearInterval(typewriterInterval);
      clearTimeout(nextStepTimeout);
    };
  }, [currentStep]);


  return (
    <div className="min-h-screen bg-white dark:bg-[#030307] text-[#0f0f15] dark:text-[#f8fafc] selection:bg-black/5 overflow-x-hidden transition-colors duration-300 relative">
      {/* Background Noise Texture */}
      <div className="noise-overlay" />
      
      {/* Subtle background blurred lights */}
      <div className="absolute top-[12%] left-[-10%] w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full bg-[#8f8afc]/[0.012] dark:bg-[#8f8afc]/[0.006] blur-[120px] pointer-events-none" />
      <div className="absolute top-[42%] right-[-10%] w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full bg-purple-500/[0.012] dark:bg-purple-500/[0.006] blur-[140px] pointer-events-none" />
      <div className="absolute top-[78%] left-[-5%] w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full bg-emerald-500/[0.01] dark:bg-emerald-500/[0.005] blur-[120px] pointer-events-none" />

      <div className="linear-glow" />

      {/* ---- Navigation ---- */}
      <nav className="fixed top-0 w-full z-50 border-b border-black/[0.015] dark:border-white/[0.015] bg-white/80 dark:bg-[#030307]/80 backdrop-blur-xl transition-all duration-300">
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
              className="md:hidden p-2 rounded-lg text-[#5f6368] dark:text-[#94a3b8] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-black/[0.015] dark:border-white/[0.015] bg-white/95 dark:bg-[#030307]/95 backdrop-blur-xl animate-fade-in">
            <div className="px-4 py-4 space-y-1">
              {[{label: "Features", href: "#features"}, {label: "How It Works", href: "#workflow"}, {label: "Subscription", href: "#pricing"}, {label: "Testimonials", href: "#testimonials"}].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[#5f6368] dark:text-[#94a3b8] hover:text-[#0f0f15] dark:hover:text-white hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-3 mt-2 border-t border-black/[0.015] dark:border-white/[0.015] flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-[#5f6368] dark:text-[#94a3b8] hover:text-[#0f0f15] dark:hover:text-white px-3 py-2 transition-colors">Sign in</Link>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn-primary !py-2.5 !px-4 !text-sm text-center">
                  Get Started <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
      {/* ---- Hero Section Container with Grid and Radial Gradient ---- */}
      <div className="relative w-full grid-bg border-b border-black/[0.015] dark:border-white/[0.015]">
        <div className="hero-gradient" />
        
        <section className="relative pt-24 sm:pt-32 pb-20 sm:pb-28 px-4 sm:px-6 max-w-7xl mx-auto z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[800px] h-[200px] sm:h-[350px] bg-[#8f8afc]/[0.015] dark:bg-[#8f8afc]/[0.02] rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-[45%] right-10 w-[150px] sm:w-[300px] h-[150px] sm:h-[300px] bg-[#6c67f5]/[0.01] dark:bg-[#6c67f5]/[0.015] rounded-full blur-[100px] pointer-events-none" />

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Hero Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#8f8afc]/20 dark:border-[#a5a1fd]/20 bg-[#8f8afc]/5 dark:bg-[#a5a1fd]/10 mb-6 shadow-sm backdrop-blur-md">
                <span className="inline-flex rounded-full h-2 w-2 bg-[#8f8afc]"></span>
                <span className="text-[11px] text-[#7874e0] dark:text-[#bbb8fe] font-bold tracking-wider uppercase">
                  Autonomous Support Infrastructure
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6 text-[#0f0f15] dark:text-white">
                Instant customer support,
                <span className="block mt-2 bg-gradient-to-r from-[#a5a1fd] via-[#8f8afc] to-[#6c67f5] bg-clip-text text-transparent font-black tracking-tight drop-shadow-sm">automated by AI.</span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-[#5f6368] dark:text-[#94a3b8] max-w-xl mb-8 leading-relaxed">
                Train intelligent support chatbots on your product docs, FAQs, and files. Deploy to any website in under 10 minutes with a single line of script.
              </p>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
                <Link href="/login" className="btn-primary !py-3 !px-6 !text-sm group">
                  Start Building Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#features" className="btn-secondary !py-3 !px-6 !text-sm">
                  Explore Features
                </a>
              </div>

              {/* Copy Snippet Panel */}
              <div className="w-full max-w-lg bg-[#fafafa] dark:bg-[#09090f] border border-black/[0.02] dark:border-white/[0.02] rounded-xl p-4 shadow-sm relative overflow-hidden group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#5f6368] dark:text-[#94a3b8] font-mono">
                    <Terminal className="w-3.5 h-3.5 text-[#5f6368] dark:text-[#94a3b8]" />
                    <span>install-widget.html</span>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="p-1.5 rounded-md hover:bg-black/[0.02] dark:hover:bg-white/[0.02] text-[#5f6368] dark:text-[#94a3b8] hover:text-black dark:hover:text-white transition-colors"
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
            <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
              <div className="w-full max-w-[380px] bg-[#fafafa] dark:bg-[#09090f] border border-black/[0.025] dark:border-white/[0.025] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.35)] overflow-hidden relative">

                {/* Header */}
                <div className="p-4 border-b border-black/[0.015] dark:border-white/[0.015] bg-[#fafafa] dark:bg-[#09090f] flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-black dark:bg-white flex items-center justify-center shadow-sm">
                      <Bot className="w-5 h-5 text-white dark:text-black" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#0f0f15] dark:text-white">EchoDesk AI</h4>
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        <span className="text-[11px] text-[#5f6368] dark:text-[#94a3b8]">Typically replies instantly</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Messages Simulator */}
                <div ref={chatContainerRef} className="p-4 h-[280px] overflow-y-auto flex flex-col gap-3 font-sans text-xs scrollbar-thin bg-[#f5f5f7]/30 dark:bg-[#06060a]/30">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[80%] ${msg.sender === "user" ? "self-end items-end animate-message-bubble-user" : "self-start items-start animate-message-bubble-bot"
                        }`}
                    >
                      <div
                        className={`p-3 rounded-2xl ${msg.sender === "user"
                            ? "bg-black dark:bg-white text-white dark:text-black rounded-tr-none"
                            : "bg-[#ffffff] dark:bg-[#0e0e16] text-[#0f0f15] dark:text-[#f8fafc] border border-black/[0.015] dark:border-white/[0.015] rounded-tl-none shadow-sm"
                          }`}
                      >
                        {msg.isTyping ? (
                          <div className="flex items-center gap-1.5 py-1 px-2">
                            <span className="w-1.5 h-1.5 bg-[#94a3b8] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-[#94a3b8] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-[#94a3b8] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        ) : (
                          <>
                            <span>{msg.text}</span>
                            {msg.isResponding && <span className="inline-block w-1.5 h-3 ml-0.5 bg-current animate-blink" />}
                          </>
                        )}
                      </div>
                      <span className="text-[9px] text-[#94a3b8] mt-1 px-1">
                        {msg.sender === "user" ? "You" : "EchoDesk AI"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Chat Input Mock */}
                <div className="p-3 border-t border-black/[0.015] dark:border-white/[0.015] bg-[#fafafa] dark:bg-[#09090f] flex items-center gap-2">
                  <input
                    type="text"
                    disabled
                    placeholder="Ask support anything..."
                    className="flex-1 bg-white dark:bg-[#0e0e16] border border-black/[0.015] dark:border-white/[0.015] rounded-full px-3 py-1.5 text-xs text-[#94a3b8] outline-none echodesk-breathe-placeholder"
                  />
                  <div className="w-7 h-7 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black flex-shrink-0 active:scale-90 transition-transform">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* ---- Trusted By Strip ---- */}
      <RevealSection className="py-16 sm:py-20 px-4 sm:px-6 border-t border-black/[0.015] dark:border-white/[0.015]">
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
      </RevealSection>

      {/* ---- Stats Counter Row ---- */}
      <RevealSection className="py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <Users className="w-5 h-5" />, value: "2,400+", label: "Active businesses" },
            { icon: <MessageSquare className="w-5 h-5" />, value: "12M+", label: "AI messages sent" },
            { icon: <Clock className="w-5 h-5" />, value: "< 8 min", label: "Average setup time" },
            { icon: <Star className="w-5 h-5" />, value: "4.9/5", label: "Customer rating" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-6 text-center group">
              <div className="w-10 h-10 rounded-xl bg-black/[0.015] dark:bg-white/[0.015] border border-black/[0.015] dark:border-white/[0.015] flex items-center justify-center text-[#8f8afc] dark:text-[#a5a1fd] mx-auto mb-3 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#0f0f15] dark:text-white tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs text-[#94a3b8] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* ---- Features Section ---- */}
      <RevealSection id="features" className="section-padding px-4 sm:px-6 max-w-7xl mx-auto relative border-t border-black/[0.015] dark:border-white/[0.015]">

        <div className="text-center mb-16 relative z-10">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8f8afc] dark:text-[#a5a1fd] bg-[#8f8afc]/5 dark:bg-[#a5a1fd]/10 px-4 py-1.5 rounded-full border border-[#8f8afc]/5 dark:border-[#a5a1fd]/05 mb-4">Capabilities</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-[#0f0f15] dark:text-white">
            Engineered for <span className="bg-gradient-to-r from-[#8f8afc] to-[#6c67f5] bg-clip-text text-transparent">Conversational Excellence</span>
          </h2>
          <p className="text-[#5f6368] dark:text-[#94a3b8] mt-3 max-w-xl mx-auto text-sm sm:text-base">
            EchoDesk combines cutting-edge LLMs with developer simplicity. Set up in minutes, scale to thousands.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative z-10">

          {/* Card 1 */}
          <div className="glass-card interactive-card p-6 flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-lg bg-black/[0.015] dark:bg-white/[0.015] border border-black/[0.015] dark:border-white/[0.015] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
              <div className="w-10 h-10 rounded-lg bg-black/[0.015] dark:bg-white/[0.015] border border-black/[0.015] dark:border-white/[0.015] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
              <div className="w-10 h-10 rounded-lg bg-black/[0.015] dark:bg-white/[0.015] border border-black/[0.015] dark:border-white/[0.015] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
      </RevealSection>

      {/* ---- Interactive Walkthrough / Workflow Section ---- */}
      <RevealSection id="workflow" className="section-padding px-4 sm:px-6 border-t border-black/[0.015] dark:border-white/[0.015] bg-[#fafafa]/50 dark:bg-[#06060a]/50 relative">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          <div className="lg:col-span-5 text-left">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8f8afc] dark:text-[#a5a1fd] bg-[#8f8afc]/5 dark:bg-[#a5a1fd]/10 px-4 py-1.5 rounded-full border border-[#8f8afc]/5 dark:border-[#a5a1fd]/05 mb-4">Simple Setup</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter mb-6 text-[#0f0f15] dark:text-white">
              Launch support in <span className="bg-gradient-to-r from-[#8f8afc] to-[#6c67f5] bg-clip-text text-transparent">three milestones</span>
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
                      ? "bg-white dark:bg-[#0c0c14] border-black/[0.02] dark:border-white/[0.02] shadow-sm"
                      : "bg-transparent border-transparent hover:bg-neutral-50 dark:hover:bg-white/[0.02]"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeStep === s.step ? "bg-black dark:bg-white text-white dark:text-black" : "bg-black/[0.015] dark:bg-white/[0.015] text-[#5f6368] dark:text-[#94a3b8]"
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
            <div className="w-full max-w-lg bg-white dark:bg-[#0c0c14] border border-black/[0.02] dark:border-white/[0.02] rounded-2xl p-6 shadow-sm relative min-h-[300px] flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-black/[0.015] dark:border-white/[0.015] pb-4 mb-4">
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
                  <div className="bg-[#fafafa] dark:bg-[#09090f] p-3 rounded border border-black/[0.015] dark:border-white/[0.015] font-mono text-xs text-[#0f0f15] dark:text-white">
                    $ pbcopy &lt; script_embed.txt
                  </div>
                  <p className="text-xs text-[#5f6368] dark:text-[#94a3b8]">
                    Inject script anywhere inside <span className="text-[#0f0f15] dark:text-white font-mono">&lt;body&gt;</span> tag. Supports NextJS, Webflow, Shopify, static HTML files.
                  </p>
                </div>
              )}

              {activeStep === 3 && (
                <div className="flex-1 flex flex-col justify-center animate-fade-in text-center py-6 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.015] dark:bg-white/[0.015] text-[#0f0f15] dark:text-white border border-black/[0.015] dark:border-white/[0.015] md:mx-auto">
                    <Zap className="w-3.5 h-3.5 text-black dark:text-white animate-pulse" />
                    Sandbox Active
                  </div>
                  <p className="text-xs text-[#5f6368] dark:text-[#94a3b8] max-w-sm mx-auto leading-relaxed">
                    Test bot replies inside our visual workspace. Logs sync in real-time to analyze queries and response confidence.
                  </p>
                </div>
              )}

              <div className="border-t border-black/[0.015] dark:border-white/[0.015] pt-4 mt-4 flex items-center justify-between text-[11px] text-[#94a3b8]">
                <span>Status: Fully Configured</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Online
                </span>
              </div>
            </div>
          </div>

        </div>
      </RevealSection>

      {/* ---- Subscription / Pricing Section ---- */}
      <RevealSection id="pricing" className="section-padding px-4 sm:px-6 border-t border-black/[0.015] dark:border-white/[0.015] max-w-7xl mx-auto relative">
        <div className="pricing-gradient" />
        
        <div className="text-center mb-16 relative z-10">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8f8afc] dark:text-[#a5a1fd] bg-[#8f8afc]/5 dark:bg-[#a5a1fd]/10 px-4 py-1.5 rounded-full border border-[#8f8afc]/5 dark:border-[#a5a1fd]/05 mb-4">Subscription</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-[#0f0f15] dark:text-white">
            Simple, <span className="bg-gradient-to-r from-[#8f8afc] to-[#6c67f5] bg-clip-text text-transparent">Transparent Plans</span>
          </h2>
          <p className="text-[#5f6368] dark:text-[#94a3b8] mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Scale your automated support workspace seamlessly. Choose the plan that fits your customer interaction volume.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4 relative z-10">
          
          {/* Free Plan */}
          <div className="glass-card p-8 sm:p-10 flex flex-col justify-between border border-black/[0.015] dark:border-white/[0.015] bg-[#fafafa] dark:bg-[#09090f] relative rounded-2xl">
            <div>
              <h3 className="text-lg font-bold text-[#0f0f15] dark:text-white mb-2">Free Plan</h3>
              <p className="text-xs text-[#5f6368] dark:text-[#94a3b8] leading-relaxed mb-6">
                Ideal for testing and small personal projects
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#0f0f15] dark:text-white">₹0</span>
                <span className="text-xs text-[#5f6368] dark:text-[#94a3b8]">/month</span>
              </div>
              <ul className="space-y-4">
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
            <div className="mt-10">
              <Link
                href="/login"
                className="btn-secondary !w-full text-center block text-xs font-semibold py-2.5 rounded-lg border border-black/[0.015] dark:border-white/[0.015]"
              >
                Get Started Free
              </Link>
            </div>
          </div>

          {/* Starter Plan */}
          <div className="glass-card p-8 sm:p-10 flex flex-col justify-between border border-black/[0.015] dark:border-white/[0.015] bg-[#fafafa] dark:bg-[#09090f] relative rounded-2xl">
            <div>
              <h3 className="text-lg font-bold text-[#0f0f15] dark:text-white mb-2">Starter Plan</h3>
              <p className="text-xs text-[#5f6368] dark:text-[#94a3b8] leading-relaxed mb-6">
                Perfect for growing sites & customer service
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#0f0f15] dark:text-white">₹799</span>
                <span className="text-xs text-[#5f6368] dark:text-[#94a3b8]">/month</span>
              </div>
              <ul className="space-y-4">
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
            <div className="mt-10">
              <Link
                href="/login"
                className="btn-secondary !w-full text-center block text-xs font-semibold py-2.5 rounded-lg border border-black/[0.015] dark:border-white/[0.015]"
              >
                Choose Starter
              </Link>
            </div>
          </div>

          {/* Pro Plan (Larger and Raised) */}
          <div className="glass-card p-8 sm:p-10 flex flex-col justify-between border border-[#8f8afc]/25 shadow-[0_25px_50px_-12px_rgba(143,138,252,0.12)] bg-[#fafafa] dark:bg-[#0c0c16]/95 lg:scale-[1.08] lg:-translate-y-3 z-20 relative rounded-2xl">
            {/* Glow Accent */}
            <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-[#8f8afc]/40 to-transparent" />
            
            {/* Popular Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#8f8afc]/15 bg-[#8f8afc]/5 text-[#8f8afc] text-[10px] font-bold uppercase tracking-wider">
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
              <ul className="space-y-4">
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
            <div className="mt-10">
              <Link
                href="/login"
                className="btn-primary !w-full text-center block text-xs font-semibold py-2.5 rounded-lg"
              >
                Choose Pro
              </Link>
            </div>
          </div>

        </div>
      </RevealSection>

      {/* ---- Testimonials Marquee Section ---- */}
      <RevealSection id="testimonials" className="section-padding border-t border-black/[0.015] dark:border-white/[0.015] overflow-hidden relative">
        <div className="text-center mb-10 sm:mb-14 px-4 sm:px-6">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8f8afc] dark:text-[#a5a1fd] bg-[#8f8afc]/5 dark:bg-[#a5a1fd]/10 px-4 py-1.5 rounded-full border border-[#8f8afc]/5 dark:border-[#a5a1fd]/05 mb-4">Testimonials</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-[#0f0f15] dark:text-white">
            Loved by <span className="bg-gradient-to-r from-[#8f8afc] to-[#6c67f5] bg-clip-text text-transparent">teams everywhere</span>
          </h2>
          <p className="text-[#5f6368] dark:text-[#94a3b8] mt-3 max-w-xl mx-auto text-sm sm:text-base">
            See what our customers are saying about EchoDesk.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Priya Sharma", role: "CTO, FinLeap", img: "https://randomuser.me/api/portraits/women/44.jpg", stars: 5, text: "EchoDesk cut our support tickets by 60%. The AI responses feel genuinely human — our customers love it." },
            { name: "Marcus Chen", role: "Head of Support, Cloudfolio", img: "https://randomuser.me/api/portraits/men/32.jpg", stars: 5, text: "Setup took 8 minutes. We went from zero chatbot to live production support in a single sprint." },
            { name: "Anika Patel", role: "Founder, ShipFast", img: "https://randomuser.me/api/portraits/women/68.jpg", stars: 5, text: "The one-line embed is a game-changer. No dev time wasted — just paste and it works instantly." },
            { name: "James O'Brien", role: "VP Eng, DataMesh", img: "https://randomuser.me/api/portraits/men/75.jpg", stars: 4, text: "Multi-tenant isolation means each client's data stays completely separate. Enterprise security, startup speed." },
            { name: "Sofia Reyes", role: "Product Lead, NovaByte", img: "https://randomuser.me/api/portraits/women/90.jpg", stars: 5, text: "We replaced our entire Zendesk chatbot. EchoDesk is faster, smarter, and costs a fraction of the price." },
            { name: "Raj Mehta", role: "CEO, QuickServe", img: "https://randomuser.me/api/portraits/men/46.jpg", stars: 5, text: "Our customer satisfaction score jumped 35% in the first month. EchoDesk practically runs itself." },
          ].map((t, i) => (
            <div key={`t-${i}`} className="glass-card p-6 flex flex-col justify-between">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, s) => (
                  <svg key={s} className={`w-3.5 h-3.5 ${s < t.stars ? 'text-[#a5a1fd]' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
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
      </RevealSection>

      {/* ---- Interactive Call to Action Banner ---- */}
      <RevealSection className="section-padding px-4 sm:px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-6 sm:p-12 rounded-2xl sm:rounded-3xl overflow-hidden border border-[#8f8afc]/10 dark:border-[#a5a1fd]/05">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#8f8afc]/5 via-[#6c67f5]/5 to-[#a78bfa]/5 dark:from-[#8f8afc]/10 dark:via-[#6c67f5]/10 dark:to-[#a78bfa]/10 pointer-events-none" />
            
            <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter mb-4 text-[#0f0f15] dark:text-white">
                Redefine your <span className="bg-gradient-to-r from-[#8f8afc] to-[#6c67f5] bg-clip-text text-transparent">support workspace</span>
              </h2>
              <p className="text-[#5f6368] dark:text-[#94a3b8] mb-8 text-sm sm:text-base leading-relaxed">
                Unlock instant AI support with secure organizational logic. Start building your first chatbot for free.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/login" className="btn-primary !py-3.5 !px-8 !text-sm group">
                  Get Started Free
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <a href="#features" className="btn-secondary !py-3.5 !px-8 !text-sm">
                  See How It Works
                </a>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* ---- Footer ---- */}
      <footer className="py-16 px-4 sm:px-6 border-t border-black/[0.015] dark:border-white/[0.015] text-xs text-[#94a3b8]">
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
          <div className="border-t border-black/[0.015] dark:border-white/[0.015] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-[#94a3b8]">© {new Date().getFullYear()} EchoDesk. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-8 h-8 rounded-full border border-black/[0.015] dark:border-white/[0.015] flex items-center justify-center text-[#94a3b8] hover:text-[#0f0f15] dark:hover:text-white hover:border-[#8f8afc]/30 transition-all" aria-label="Twitter">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-black/[0.015] dark:border-white/[0.015] flex items-center justify-center text-[#94a3b8] hover:text-[#0f0f15] dark:hover:text-white hover:border-[#8f8afc]/30 transition-all" aria-label="GitHub">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-black/[0.015] dark:border-white/[0.015] flex items-center justify-center text-[#94a3b8] hover:text-[#0f0f15] dark:hover:text-white hover:border-[#8f8afc]/30 transition-all" aria-label="LinkedIn">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
