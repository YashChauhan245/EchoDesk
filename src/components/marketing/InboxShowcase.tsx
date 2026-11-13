"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, CheckCheck, Download, Flag, Inbox, MessageSquare, Search, Sparkles } from "lucide-react";
import { Reveal, SectionHeading } from "./Shared";

const conversations = [
  { name: "Visitor 01", initial: "01", subject: "A question worth a closer look", question: "Can I get a custom agreement for my team?", answer: "I don’t have that information in the current help docs. Your team can take a closer look at this question.", flagged: true },
  { name: "Visitor 02", initial: "02", subject: "Getting started", question: "How do I put the chatbot on my site?", answer: "Copy the script tag from your EchoDesk dashboard, then paste it before the closing body tag on your website. Your agent is ready to help!", flagged: false },
  { name: "Visitor 03", initial: "03", subject: "Finding the right plan", question: "What does the Starter plan include?", answer: "Starter includes 3 chatbots, 3 website deployments, and 10,000 AI messages per month, for ₹799/month.", flagged: false },
];

function exportSample(format: "CSV" | "JSON" | "PDF") {
  const sample = conversations.map(item => ({ visitor: item.name, question: item.question, answer: item.answer, flagged: item.flagged }));
  let content: string;
  if (format === "JSON") content = JSON.stringify({ note: "EchoDesk illustrative inbox sample", conversations: sample }, null, 2);
  else if (format === "CSV") content = ["visitor,question,answer,flagged", ...sample.map(item => Object.values(item).map(value => `"${String(value).replaceAll('"', '""')}"`).join(","))].join("\r\n");
  else {
    // A small, valid one-page PDF; sample-only export needs no runtime PDF library.
    const lines = ["EchoDesk - illustrative inbox sample", "", ...sample.flatMap(item => [item.visitor + (item.flagged ? " - Flagged for review" : " - Answered"), item.question, ""])];
    const stream = `BT /F1 12 Tf 50 780 Td 20 TL ${lines.map((line, i) => `${i ? "T* " : ""}(${line.replace(/[^\x20-\x7E]/g, "").replace(/[\\()]/g, "\\$&")}) Tj`).join("\n")} ET`;
    const objects = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`];
    content = "%PDF-1.4\n";
    const offsets = [0];
    objects.forEach((object, i) => { offsets.push(content.length); content += `${i + 1} 0 obj\n${object}\nendobj\n`; });
    const xref = content.length;
    content += `xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  }
  const url = URL.createObjectURL(new Blob([content], { type: format === "JSON" ? "application/json" : format === "CSV" ? "text/csv;charset=utf-8" : "application/pdf" }));
  const link = document.createElement("a"); link.href = url; link.download = `echodesk-sample.${format.toLowerCase()}`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function InboxShowcase() {
  const [selected, setSelected] = useState(0);
  const [exported, setExported] = useState("");
  const scene = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: scene, offset: ["start end", "center center"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [9, 0]);
  const conversation = conversations[selected];
  return <section className="mk-section mk-container" id="inbox"><Reveal><div className="mk-inbox-heading"><SectionHeading eyebrow="THE CONVERSATION DOESN’T END WITH AI" title={<>AI handles the everyday.<br /><span className="mk-soft">You see the bigger picture.</span></>}>Read every conversation. Review replies that need attention. Take the insights with you.</SectionHeading><Link href="/dashboard/inbox" className="mk-text-link">Explore your inbox<ArrowUpRight size={15} /></Link></div></Reveal><div ref={scene} className="mk-inbox-scene"><motion.div className="mk-inbox-window mk-panel" style={{ rotateX: reduced ? 0 : rotateX, transformPerspective: 1400 }}><div className="mk-inbox-toolbar"><span><Inbox size={16} />Live inbox<span className="mk-inbox-demo-label">SAMPLE PREVIEW</span></span><div><span>Export sample</span>{(["CSV", "JSON", "PDF"] as const).map(format => <button key={format} onClick={() => { exportSample(format); setExported(`${format} sample downloaded`); }} aria-label={`Export sample conversations as ${format}`}><Download size={11} />{format}</button>)}</div></div><div className="mk-inbox-body"><div className="mk-conversation-list"><div className="mk-inbox-search"><Search size={12} />Your conversations<span>3</span></div>{conversations.map((item, index) => <button key={item.name} className={`mk-conversation-item ${index === selected ? "selected" : ""}`} onClick={() => setSelected(index)} aria-pressed={selected === index}><span className="mk-visitor-avatar">{item.initial}</span><span><strong>{item.name}</strong><small>{item.subject}</small>{item.flagged && <span className="mk-flag"><Flag size={9} />Flagged for review</span>}</span><span className="mk-conversation-time">Demo</span></button>)}<div className="mk-inbox-list-foot"><ShieldIcon />A view into the questions that matter.</div></div><div className="mk-conversation-view"><div className="mk-conversation-view-head"><span><span className="mk-visitor-avatar">{conversation.initial}</span><strong>{conversation.name}</strong></span>{conversation.flagged ? <span className="mk-flag"><Flag size={9} />Flagged</span> : <span className="mk-answered"><CheckCheck size={13} />Answered</span>}</div><div className="mk-inbox-thread" key={selected}><span className="mk-thread-label">ILLUSTRATIVE CONVERSATION</span><div className="mk-thread-user">{conversation.question}</div><div className="mk-thread-agent"><span className="mk-agent-icon"><Sparkles size={15} /></span><p>{conversation.answer}</p></div>{conversation.flagged && <div className="mk-review-callout"><Flag size={13} /><div><strong>A chance to make your knowledge better.</strong><p>This reply needs a human review. Add the missing details to help with future questions.</p></div></div>}</div><div className="mk-inbox-view-foot"><MessageSquare size={12} />Learn from every conversation.<span className="mk-export-status" role="status">{exported}</span></div></div></div></motion.div></div></section>;
}
function ShieldIcon() { return <span className="mk-live-dot" />; }
