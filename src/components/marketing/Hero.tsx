"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowDown, ArrowRight, Check, ChevronDown, FileText, Globe, Layers3, MessageSquare, Plus, Send, Settings2, ShieldCheck, Sparkles, X } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Action } from "./Shared";

const starter = "Can I try EchoDesk for free?";
const freeAnswer = "Absolutely! The Free plan includes 1 chatbot, 1 website, and 500 AI messages per month. Start free and upgrade whenever you’re ready.";
const demoAnswers = [
  { match: /price|plan|cost|free|trial|pricing/i, answer: freeAnswer, source: "Pricing.pdf" },
  { match: /install|embed|code|website|setup/i, answer: "Add your knowledge, customize your chatbot, then copy your unique script from the dashboard into your website. One script tag is all it takes.", source: "Getting started" },
  { match: /doc|content|train|pdf|knowledge/i, answer: "You can add PDFs, website URLs, or plain text. EchoDesk finds relevant passages in your content before writing an answer.", source: "Getting started" },
];

export function ChatDemo({ compact = false }: { compact?: boolean }) {
  const reduced = useReducedMotion();
  const [question, setQuestion] = useState(starter);
  const [answer, setAnswer] = useState(freeAnswer);
  const [source, setSource] = useState("Pricing.pdf");
  const [visible, setVisible] = useState(0);
  const [typing, setTyping] = useState(true);
  const [input, setInput] = useState("");
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (reduced) return;
    let count = 0;
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      setTyping(false);
      interval = setInterval(() => { count += 3; setVisible(count); if (count >= answer.length) clearInterval(interval); }, 20);
    }, 900);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, [answer, run, reduced]);
  function ask(event: FormEvent) {
    event.preventDefault();
    if (!input.trim()) return;
    const result = demoAnswers.find(item => item.match.test(input));
    setQuestion(input.trim()); setInput("");
    setAnswer(result?.answer || "That isn’t covered in this sample knowledge base. In your own bot, add the relevant content so it can help with questions like this.");
    setSource(result?.source || "Not in sample content"); setVisible(0); setTyping(true); setRun(value => value + 1);
  }
  return <div className={`mk-chat ${compact ? "mk-chat-compact" : ""}`}>
    <div className="mk-chat-head"><span className="mk-agent-icon"><Sparkles size={18} /></span><div><strong>Echo assistant</strong><span><i />Here to help, around the clock</span></div><span className="mk-chat-head-more" aria-hidden="true">···</span></div>
    <div className="mk-chat-messages"><span className="mk-demo-caption">INTERACTIVE DEMO · SAMPLE CONTENT</span><div className="mk-chat-bot">Hi there! 👋 What would you like to know about EchoDesk?</div><div className="mk-chat-user">{question}</div><div className="mk-chat-bot mk-chat-answer">{typing && !reduced ? <span className="mk-typing" aria-label="Preparing sample reply"><i /><i /><i /></span> : <><span>{reduced ? answer : answer.slice(0, visible)}</span>{(reduced || visible >= answer.length) && <span className="mk-source"><FileText size={11} />{source}</span>}</>}</div></div>
    <form onSubmit={ask} className="mk-chat-form"><label className="sr-only" htmlFor={compact ? "compact-chat-question" : "hero-chat-question"}>Ask a sample question</label><input id={compact ? "compact-chat-question" : "hero-chat-question"} value={input} onChange={event => setInput(event.target.value)} placeholder="Ask about pricing or setup…" maxLength={200} autoComplete="off" /><button aria-label="Send sample question" type="submit"><Send size={15} /></button></form><div className="mk-chat-credit"><span className="mk-tiny-mark">≋</span> Powered by <strong>EchoDesk</strong></div>
  </div>;
}

export default function Hero() {
  const area = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: area, offset: ["start start", "end start"] });
  const floatY = useTransform(scrollYProgress, [0, 1], [0, -65]);
  return <section ref={area} className="mk-hero" onPointerMove={event => { if (reduced || event.pointerType !== "mouse") return; const rect = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`); event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`); }}>
    <div className="mk-hero-grid" aria-hidden="true" /><div className="mk-hero-orb" aria-hidden="true" />
    <div className="mk-container"><div className="mk-hero-copy"><a href="#case-study" className="mk-announcement"><span className="mk-live-dot" />Built for real questions. Live on Toothly.<ArrowRight size={13} /></a><h1>Your knowledge.<br /><span className="mk-gradient">Your always-on support.</span></h1><p>Turn your docs, website, and FAQs into an AI support agent.<br className="mk-desktop-break" /> Answers from your content. On your site. In one line of code.</p><div className="mk-hero-actions"><Action>Build your agent free</Action><a href="#live-demo" className="mk-button mk-button-secondary">Try the live demo <span className="mk-play" aria-hidden="true">▶</span></a></div><div className="mk-hero-fine"><span><Check size={12} />No credit card required</span><span><Check size={12} />Free plan, always</span></div></div>
    <div className="mk-hero-product" id="live-demo"><div className="mk-product-glow" aria-hidden="true" /><div className="mk-browser mk-panel"><div className="mk-browser-bar"><div className="mk-traffic" aria-hidden="true"><i /><i /><i /></div><span><ShieldCheck size={11} /> app.echodesk / your workspace</span><span className="mk-browser-status"><i />All systems ready</span></div><div className="mk-workspace"><aside className="mk-workspace-sidebar" aria-hidden="true"><div className="mk-workspace-logo"><span className="mk-tiny-mark">≋</span></div><Layers3 size={18} /><span className="selected"><FileText size={18} /></span><MessageSquare size={18} /><Settings2 size={18} /><span className="mk-sidebar-avatar">Y</span></aside><div className="mk-knowledge"><div className="mk-workspace-title"><div><small>YOUR WORKSPACE</small><h3>A little knowledge.<br />A lot of possibilities.</h3></div><span className="mk-workspace-avatar">Y<ChevronDown size={11} /></span></div><div className="mk-resource-list"><div><span className="mk-file-icon"><FileText size={17} /></span><span><strong>Pricing.pdf</strong><small>PDF document</small></span><span className="mk-ready"><Check size={10} />Ready</span></div><div><span className="mk-file-icon cyan"><Globe size={17} /></span><span><strong>yourwebsite.com</strong><small>Website content</small></span><span className="mk-ready"><Check size={10} />Ready</span></div><div><span className="mk-file-icon coral"><FileText size={17} /></span><span><strong>Getting started</strong><small>Help center article</small></span><span className="mk-ready"><Check size={10} />Ready</span></div></div><div className="mk-knowledge-bottom"><div className="mk-knowledge-line" /><span><Sparkles size={15} />Your content. Connected.</span><div className="mk-knowledge-line" /></div><span className="mk-sample-label">Illustrative workspace</span></div><ChatDemo /></div></div><motion.div className="mk-float-note mk-float-note-top" style={{ y: reduced ? 0 : floatY }}><span className="mk-note-icon"><Globe size={17} /></span><div><strong>Trained on your world</strong><small>Not the whole internet.</small></div><Check size={14} /></motion.div><motion.div className="mk-float-note mk-float-note-bottom" style={{ y: reduced ? 0 : floatY }}><span className="mk-note-icon green"><ShieldCheck size={17} /></span><div><strong>Grounded in your content</strong><small>A source behind the answer.</small></div></motion.div></div>
    <a href="#workflow" className="mk-discover">LESS BUSYWORK. MORE HUMAN CONNECTION.<ArrowDown size={13} /></a></div>
  </section>;
}
