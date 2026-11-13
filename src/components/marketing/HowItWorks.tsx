"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { Check, Code2, FileText, Globe, MessageSquare, Palette, Plus, Sparkles, Upload } from "lucide-react";
import { Reveal, SectionHeading } from "./Shared";

const steps = [
  { title: "Give it your knowledge.", text: "Drop in PDFs, paste a website URL, or add your FAQs. Your expertise is the starting point." },
  { title: "Make it feel like you.", text: "Pick your colors, set a friendly greeting, and try a conversation before going live." },
  { title: "One line. You’re live.", text: "Copy your script into your website. Your new support agent is ready for its first question." },
];

function StepVisual({ step }: { step: number }) {
  return <div className="mk-step-visual"><div className="mk-step-visual-top"><span><span className="mk-tiny-mark">≋</span> {['Your knowledge', 'Your brand, your assistant', 'Ready for the real world'][step]}</span><small>0{step + 1} / 03</small></div>{step === 0 ? <div className="mk-upload-scene"><div className="mk-upload-target"><span className="mk-upload-icon"><Upload size={24} /></span><strong>Everything you know, in one place.</strong><p>PDFs, website URLs, and plain text.</p><span className="mk-small-pill"><Plus size={12} />Add knowledge</span></div><div className="mk-training-file"><FileText size={18} /><div><strong>Product guide.pdf</strong><small>Ready for questions</small></div><Check size={15} /></div><div className="mk-training-file"><Globe size={18} /><div><strong>yourwebsite.com/help</strong><small>Connected to your agent</small></div><Check size={15} /></div><span className="mk-visual-caption">Sample knowledge sources</span></div> : step === 1 ? <div className="mk-customize-scene"><div className="mk-color-label"><Palette size={15} />A little personality goes a long way.</div><div className="mk-swatches">{['#7c5cff','#22a5b7','#d2684f','#3e996e'].map((color, index) => <span style={{ background: color }} key={color}>{index === 0 && <Check size={17} />}</span>)}</div><label>Assistant name</label><div className="mk-demo-field">Your friendly expert</div><label>Welcome message</label><div className="mk-demo-field">Hey there! What can I help you with? 👋</div><div className="mk-greeting-preview"><span className="mk-agent-icon"><Sparkles size={19} /></span><span>Hey there! What can I help you with? 👋</span></div><span className="mk-visual-caption">Branding preview</span></div> : <div className="mk-publish-scene"><span className="mk-publish-symbol"><Code2 size={32} /></span><strong>A small snippet.<br />A big difference.</strong><div className="mk-mini-code"><span>&lt;script</span> src=<i>"…/chatbot.js"</i><br /> data-org-id=<i>"your_chatbot_id"</i><br /><span>&gt;&lt;/script&gt;</span></div><div className="mk-publish-success"><Check size={14} />Your assistant is ready to meet your customers.</div><span className="mk-visual-caption">Get your unique script in the dashboard</span></div>}</div>;
}

export default function HowItWorks() {
  const track = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: track, offset: ["start 0.2", "end 0.9"] });
  useMotionValueEvent(scrollYProgress, "change", value => setStep(Math.min(2, Math.floor(value * 3))));
  return <section id="workflow" className="mk-section mk-container"><div className="mk-workflow-track" ref={track}><div className="mk-workflow-sticky"><div className="mk-workflow-copy"><Reveal><SectionHeading eyebrow="FROM KNOWLEDGE TO KNOW-HOW" title={<>Expert support.<br /><span className="mk-soft">Without the setup.</span></>}>Three small steps between your business knowledge and a better customer experience.</SectionHeading></Reveal><div className="mk-workflow-steps"><div className="mk-step-progress" aria-hidden="true"><motion.span style={{ scaleY: scrollYProgress }} /></div>{steps.map((item, index) => <div className={`mk-workflow-step ${step === index ? "is-active" : ""}`} key={item.title}><a href={`#workflow-step-${index}`}><span className="mk-step-number">0{index + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></a><div className="mk-workflow-mobile"><StepVisual step={index} /></div></div>)}</div></div><div className="mk-workflow-desktop"><AnimatePresence mode="wait" initial={false}><motion.div key={step} initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : .97, y: reduced ? 0 : 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -8 }} transition={{ duration: reduced ? 0 : .3 }}><StepVisual step={step} /></motion.div></AnimatePresence></div></div>{steps.map((_, i) => <span className="mk-workflow-anchor" style={{ top: `${i * 33}%` }} id={`workflow-step-${i}`} key={i} />)}</div></section>;
}
