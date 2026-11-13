"use client";

import { useEffect, useRef, type ReactNode, type MouseEvent } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import Lenis from "lenis";

export function Brand({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className="mk-brand" aria-label="EchoDesk home"><span className="mk-brand-mark" aria-hidden="true"><i /><i /><i /></span>{!compact && <span>echo<span className="mk-brand-light">desk</span><span className="mk-brand-period">.</span></span>}</Link>;
}

export function Action({ children, href = "/login", secondary = false, className = "" }: { children: ReactNode; href?: string; secondary?: boolean; className?: string }) {
  const reduced = useReducedMotion();
  function move(event: MouseEvent<HTMLAnchorElement>) {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.transform = `translate(${(event.clientX - box.left - box.width / 2) * 0.09}px, ${(event.clientY - box.top - box.height / 2) * 0.12}px)`;
  }
  return <Link href={href} className={`mk-button ${secondary ? "mk-button-secondary" : "mk-button-primary"} ${className}`} onMouseMove={move} onMouseLeave={e => { e.currentTarget.style.transform = ""; }}>{children}<ArrowUpRight size={17} aria-hidden="true" /></Link>;
}

export function SectionHeading({ eyebrow, title, children, centered = false }: { eyebrow: string; title: ReactNode; children?: ReactNode; centered?: boolean }) {
  return <div className={`mk-section-heading ${centered ? "mk-center" : ""}`}><span className="mk-eyebrow"><span />{eyebrow}</span><h2>{title}</h2>{children && <p>{children}</p>}</div>;
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}><div className="mk-reveal">{children}</div></motion.div>;
}

export function MarketingShell({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 150, damping: 30 });
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;
    const update = () => {
      lenis?.destroy();
      if (!preference.matches) lenis = new Lenis({ autoRaf: true, anchors: { offset: -96 }, duration: 1.05 });
    };
    update();
    preference.addEventListener("change", update);
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    root.current?.querySelectorAll(".mk-reveal").forEach(el => observer.observe(el));
    return () => { lenis?.destroy(); observer.disconnect(); preference.removeEventListener("change", update); };
  }, []);
  return <div className="marketing" ref={root}><a className="mk-skip" href="#main">Skip to content</a><motion.div className="mk-scroll-progress" style={{ scaleX: reduced ? scrollYProgress : progress }} aria-hidden="true" />{children}</div>;
}
