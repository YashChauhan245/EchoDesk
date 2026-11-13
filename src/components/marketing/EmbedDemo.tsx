"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Code2, Copy, Globe, MessageSquare, RotateCcw, Sparkles } from "lucide-react";
import { Reveal, SectionHeading } from "./Shared";

export const embedSnippet = `<script\n  src="https://echodesk-platform.vercel.app/chatbot.js"\n  data-org-id="your_chatbot_id"\n></script>`;

export default function EmbedDemo() {
  const block = useRef<HTMLDivElement>(null);
  const inView = useInView(block, { once: true, amount: .4 });
  const reduced = useReducedMotion();
  const [length, setLength] = useState(0);
  const [installed, setInstalled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const copyReset = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    if (!inView || reduced) return;
    let characters = 0;
    const interval = setInterval(() => { characters += 3; setLength(characters); if (characters >= embedSnippet.length) clearInterval(interval); }, 16);
    return () => clearInterval(interval);
  }, [inView, reduced]);
  useEffect(() => () => clearTimeout(copyReset.current), []);
  async function copy() {
    try { await navigator.clipboard.writeText(embedSnippet); setCopied(true); setError(""); clearTimeout(copyReset.current); copyReset.current = setTimeout(() => setCopied(false), 2500); }
    catch { setError("Select the snippet and copy it manually with Ctrl/Cmd+C."); }
  }
  return <section className="mk-section mk-embed-section"><div className="mk-container"><Reveal><SectionHeading centered eyebrow="GO FROM READY TO LIVE" title={<>One line of code.<br /><span className="mk-soft">That’s it. Seriously.</span></>}>No complicated integration. Copy your snippet, paste it into your website, and let your agent take it from there.</SectionHeading></Reveal><Reveal><div className="mk-embed-grid" ref={block}><div className="mk-code-panel mk-panel"><div className="mk-code-bar"><span><Code2 size={14} />index.html</span><button onClick={copy} aria-label={copied ? "Embed code copied" : "Copy embed code"}>{copied ? <Check size={13} /> : <Copy size={13} />}{copied ? "Copied!" : "Copy code"}</button></div><div className="mk-code-content"><span className="mk-code-comment">&lt;!-- Your new favorite line of code. --&gt;</span><pre tabIndex={0} aria-label="Example embed script. Replace your_chatbot_id with the ID from your dashboard."><code>{reduced ? embedSnippet : embedSnippet.slice(0, length)}<span className="mk-code-caret" aria-hidden="true">▏</span></code></pre><span className="mk-code-comment">&lt;!-- Add before the closing body tag. --&gt;</span></div><div className="mk-code-footer"><span>Use your unique chatbot ID from the dashboard.</span><button onClick={() => setInstalled(value => !value)} className="mk-paste-button">{installed ? <><RotateCcw size={12} />Reset preview</> : <>Paste into preview<ArrowRight size={13} /></>}</button></div>{error && <p className="mk-copy-error" role="status">{error}</p>}</div><div className="mk-embed-browser mk-panel"><div className="mk-browser-bar"><div className="mk-traffic" aria-hidden="true"><i /><i /><i /></div><span><Globe size={10} />your-website.com</span></div><div className="mk-preview-website" aria-label="Illustrative website preview"><div className="mk-preview-nav"><span>your brand<span>®</span></span><i /><i /><i /></div><span className="mk-preview-eyebrow">A LITTLE MORE HUMAN.</span><h3>Your website.<br /><span className="mk-soft">Now with a helping hand.</span></h3><div className="mk-preview-lines"><i /><i /></div><div className="mk-preview-blocks"><i /><i /><i /></div><div className={`mk-installed-widget ${installed ? 'is-installed' : ''}`} aria-hidden={!installed}><div><Sparkles size={13} />Hey there! Need a hand?</div><span><MessageSquare size={22} /></span></div><div className="mk-preview-status" role="status">{installed ? <><span className="mk-live-dot" />Your assistant is live in this preview.</> : <>Try pasting the snippet. Watch the magic. <ArrowRight size={12} /></>}</div></div></div></div></Reveal></div></section>;
}
