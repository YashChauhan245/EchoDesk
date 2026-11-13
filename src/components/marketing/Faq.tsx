"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Minus, Plus } from "lucide-react";
import { Reveal, SectionHeading } from "./Shared";
const questions = [
  ["What can I teach my agent?", "Upload PDFs, add website URLs, or paste plain text. Product guides, FAQs, pricing pages, and help articles are all good starting points. Your agent searches the relevant parts of that content to answer questions."],
  ["Does it answer only from my content?", "Your agent is instructed to use the knowledge you provide. It looks for relevant passages before answering, rather than treating the whole internet as your help center. When it can’t find a confident answer, the conversation can be flagged in your inbox for review."],
  ["Is my business data kept separate?", "Knowledge and conversations are scoped to your organization. Your agent retrieves your organization’s content for its answers. Sign in to your workspace using the existing SSO or passkey flow, and only add information you want your agent to reference."],
  ["How do I install it on my website?", "Create your chatbot, add your knowledge, and copy the unique script tag from the Embed section of your dashboard. Paste it before the closing body tag on your website. You don’t need to build a chat interface or connect an AI API yourself."],
  ["What happens if an AI model is unavailable?", "EchoDesk tries a chain of backup models and includes a knowledge-based fallback. Low-confidence replies can be flagged in the live inbox, so you can find gaps in your content and improve future answers."],
  ["Can I try it before my customers do?", "Yes. Use the sandbox preview in your dashboard to test questions and fine-tune your knowledge, colors, and greeting before embedding your agent. The Free plan includes 1 chatbot, 1 website, and 500 AI messages per month."],
  ["Can I review and export conversations?", "Yes. The live inbox lets you read conversations, search for questions, and filter flagged replies. Export conversations as CSV, JSON, or PDF for reviews and reporting."],
  ["Can I upgrade when my business grows?", "Yes. Start with Free, then choose Starter or Pro from the pricing page in your dashboard when you need more chatbots, websites, or monthly messages. Paid plans are billed monthly through Razorpay."],
];
export default function Faq() {
  const [active, setActive] = useState<number | null>(0);
  const prefix = useId();
  return <section id="faq" className="mk-section mk-container"><div className="mk-faq-grid"><Reveal><SectionHeading eyebrow="A FEW GOOD QUESTIONS" title={<>Curious?<br /><span className="mk-soft">We like that.</span></>}>A little clarity before you meet your new support teammate.</SectionHeading><Link href="/login" className="mk-text-link">Take a look around<ArrowUpRight size={15} /></Link></Reveal><div className="mk-faq-list">{questions.map(([question, answer], index) => { const isOpen = active === index; const id = `${prefix}-${index}`; return <Reveal key={question}><div className={`mk-faq-item ${isOpen ? "is-open" : ""}`}><h3><button id={`${id}-question`} aria-expanded={isOpen} aria-controls={`${id}-answer`} onClick={() => setActive(isOpen ? null : index)}><span>{question}</span>{isOpen ? <Minus size={16} /> : <Plus size={16} />}</button></h3><div className="mk-faq-answer" id={`${id}-answer`} role="region" aria-labelledby={`${id}-question`} aria-hidden={!isOpen} inert={!isOpen}><div><p>{answer}</p></div></div></div></Reveal>; })}</div></div></section>;
}
