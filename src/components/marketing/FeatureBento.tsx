"use client";

import type { MouseEvent, ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowRight, Check, CheckCheck, Code2, CreditCard, Download, FileJson, FileSpreadsheet, FileText, Fingerprint, Flag, KeyRound, MessageSquare, Palette, Search, ShieldCheck, Sparkles, SquareTerminal, Zap } from "lucide-react";
import { Reveal, SectionHeading } from "./Shared";

function Feature({ children, className = "", index }: { children: ReactNode; className?: string; index: number }) {
  const reduced = useReducedMotion();
  function spotlight(event: MouseEvent<HTMLElement>) {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--card-x', `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty('--card-y', `${event.clientY - box.top}px`);
    event.currentTarget.style.transform = `perspective(1000px) rotateX(${(event.clientY - box.top - box.height / 2) * -.008}deg) rotateY(${(event.clientX - box.left - box.width / 2) * .008}deg) translateY(-3px)`;
  }
  return <Reveal className={className} delay={(index % 3) * .08}><article className="mk-feature" onMouseMove={spotlight} onMouseLeave={event => { event.currentTarget.style.transform = ""; }}>{children}</article></Reveal>;
}

export default function FeatureBento() {
  return <section id="features" className="mk-section mk-container"><Reveal><div className="mk-features-heading"><SectionHeading eyebrow="SMALL TEAM. BIG SUPPORT ENERGY." title={<>More than a chat bubble.<br /><span className="mk-soft">A calmer way to support.</span></>} /><p>Everything you need to help customers.<br />Nothing standing between you and them.</p></div></Reveal><div className="mk-bento">
    <Feature index={0} className="mk-bento-wide"><div className="mk-feature-icon"><Search size={19} /></div><h3>Understands the question.<br />Finds your answer.</h3><p>Semantic search connects the meaning of a question to the right part of your knowledge.</p><div className="mk-semantic-demo"><div><Search size={13} /><span>“Can I give this a try first?”</span><kbd>↵</kbd></div><div><FileText size={14} /><span>Free plan includes <mark>500 messages per month</mark>.</span><span className="mk-match-label">Relevant passage</span></div><span className="mk-visual-caption">Sample search · matches meaning, not just keywords</span></div></Feature>
    <Feature index={1}><div className="mk-feature-icon"><Code2 size={19} /></div><h3>A tiny script.<br />An instant teammate.</h3><p>Add your agent to any website with one script tag.</p><div className="mk-widget-visual"><span className="mk-mini-code">&lt;script src="…"&gt;&lt;/script&gt;</span><div className="mk-widget-bubble"><MessageSquare size={23} /></div><span className="mk-widget-tooltip">Hey! How can I help?</span></div></Feature>
    <Feature index={2}><div className="mk-feature-icon coral"><Flag size={19} /></div><h3>Keep a human in the loop.</h3><p>See conversations in your live inbox. Spot uncertain replies that deserve a closer look.</p><div className="mk-flag-demo"><span><i />New customer question</span><span className="mk-flag"><Flag size={10} />Needs a look</span><div className="mk-skeleton-line" /><div className="mk-skeleton-line short" /></div></Feature>
    <Feature index={3}><div className="mk-feature-icon"><Zap size={19} /></div><h3>A backup for your backup.</h3><p>A five-stage fallback chain helps keep answers flowing when an AI model is unavailable.</p><div className="mk-fallback-demo">{['Primary', 'Fallback', 'Always trying'].map((label, index) => <span key={label}><i className={index === 0 ? "" : "is-on"} /><small>{label}</small>{index < 2 && <ArrowRight size={12} />}</span>)}</div></Feature>
    <Feature index={4}><div className="mk-feature-icon cyan"><SquareTerminal size={19} /></div><h3>A safe space to try it out.</h3><p>Test real questions in the sandbox before your customers ask them.</p><div className="mk-sandbox-demo"><span><Sparkles size={12} />Sandbox preview</span><div>How do I get started?</div><div><CheckCheck size={12} />Try. Refine. Go live.</div></div></Feature>
    <Feature index={5}><div className="mk-feature-icon"><KeyRound size={19} /></div><h3>A familiar, secure way in.</h3><p>Sign in with SSO or passkeys, powered by Scalekit.</p><div className="mk-security-demo"><Fingerprint size={42} strokeWidth={1} /><span><ShieldCheck size={13} />Your workspace. Your access.</span></div></Feature>
    <Feature index={6}><div className="mk-feature-icon cyan"><Download size={19} /></div><h3>Your conversations, to go.</h3><p>Export your inbox for reporting, reviews, or the next team meeting.</p><div className="mk-export-demo"><span><FileSpreadsheet size={20} />CSV</span><span><FileJson size={20} />JSON</span><span><FileText size={20} />PDF</span></div></Feature>
    <Feature index={7}><div className="mk-feature-icon coral"><Palette size={19} /></div><h3>Fits right into your brand.</h3><p>Your colors. Your greeting. A chatbot that feels at home.</p><div className="mk-branding-demo"><div className="mk-swatches">{['#7c5cff','#268d9e','#c3664e'].map((color, i) => <span key={color} style={{ background: color }}>{i === 0 && <Check size={13} />}</span>)}</div><span>Hello, nice to meet you. 👋</span></div></Feature>
    <Feature index={8} className="mk-bento-full"><div className="mk-billing-copy"><div className="mk-feature-icon"><CreditCard size={19} /></div><div><h3>Start small. Grow on your terms.</h3><p>Free, Starter, and Pro plans. Choose the room your business needs.</p></div></div><a href="#pricing" className="mk-text-link">Find your plan<ArrowRight size={16} /></a></Feature>
  </div></section>;
}
