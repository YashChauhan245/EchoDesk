"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { Action, Brand } from "./Shared";

const links = [
  ["Features", "features"],
  ["How it works", "workflow"],
  ["Pricing", "pricing"],
  ["FAQ", "faq"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    let previous = window.scrollY;
    const scroll = () => {
      const next = window.scrollY;
      setScrolled(next > 40);
      if (Math.abs(next - previous) > 8) {
        setHidden(next > previous && next > 600);
        previous = next;
      }
    };
    window.addEventListener("scroll", scroll, { passive: true });
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        }),
      { rootMargin: "-15% 0px -50% 0px" },
    );
    links.forEach(([, id]) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", scroll);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    const menu = dialog.current;
    if (open) {
      menu?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      menu?.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  function close() {
    setOpen(false);
    trigger.current?.focus();
  }
  return (
    <>
      <header
        className={`mk-nav ${scrolled ? "is-scrolled" : ""} ${hidden && !open ? "is-hidden" : ""}`}
      >
        <nav className="mk-nav-inner" aria-label="Main navigation">
          <Brand />
          <div className="mk-nav-links">
            {links.map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                className={active === id ? "is-active" : ""}
                aria-current={active === id ? "location" : undefined}
              >
                {label}
              </a>
            ))}
          </div>
          <div className="mk-nav-actions">
            <ThemeToggle />
            <Link href="/login" className="mk-login-link">
              Log in
            </Link>
            <Action className="mk-nav-cta">Start free</Action>
            <button
              ref={trigger}
              className="mk-icon-button mk-menu-trigger"
              onClick={() => setOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={open}
              aria-controls="mobile-navigation"
            >
              <Menu size={22} />
            </button>
          </div>
        </nav>
      </header>
      <dialog
        ref={dialog}
        id="mobile-navigation"
        className="mk-mobile-menu"
        data-lenis-prevent
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        aria-label="Navigation"
      >
        <div className="mk-mobile-top">
          <Brand />
          <button
            className="mk-icon-button"
            onClick={close}
            aria-label="Close navigation menu"
          >
            <X />
          </button>
        </div>
        <div className="mk-mobile-links">
          {links.map(([label, id], index) => (
            <a href={`#${id}`} key={id} onClick={close}>
              <small>0{index + 1}</small>
              {label}
            </a>
          ))}
        </div>
        <Action>Start building for free</Action>
        <Link href="/login" onClick={close} className="mk-mobile-login">
          Already have an account? Log in ↗
        </Link>
        <p>Your knowledge. Always on.</p>
      </dialog>
    </>
  );
}
