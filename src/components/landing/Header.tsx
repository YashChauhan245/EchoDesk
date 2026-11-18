"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Brand } from "./LandingUI";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleScroll() {
      const distance =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(distance > 0 ? window.scrollY / distance : 0);
      setScrolled(window.scrollY > 24);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleEscape(event: React.KeyboardEvent) {
    if (event.key === "Escape" && mobileMenuOpen) {
      setMobileMenuOpen(false);
      menuButton.current?.focus();
    }
  }
  return (
    <>
      <div
        className="scroll-progress fixed top-0 right-0 bottom-auto left-0 h-0.5 bg-[#f1f2f4] opacity-[.65] z-[150] [transform:scaleX(0)] [transform-origin:left] pointer-events-none print:hidden!"

        aria-hidden="true"
        style={{ transform: `scaleX(${progress})` }}
      />
      <header
        className="site-header fixed top-0 left-0 right-0 z-[100] bg-[#090a0cf5] border-b border-b-[#22252b] [transition:background-color_180ms_ease,_border-color_180ms_ease] print:hidden! [&[data-scrolled='true']]:bg-[#0d0f12fb] [&[data-scrolled='true']]:border-b-[#ffffff1d]"
        data-scrolled={scrolled}
        onKeyDown={handleEscape}
      >
        <nav
          className="nav ed-container max-w-320 w-full flex items-center justify-between py-0 m-auto max-[390px]:px-5 min-[390px]:max-[720px]:px-6 min-[720px]:h-18 min-[720px]:px-8 max-[720px]:h-17 max-[720px]:gap-3 min-[720px]:max-[900px]:gap-5 min-[900px]:gap-10 max-[720px]:[&_.button-small]:text-[12px] max-[720px]:[&_.button-small]:min-h-9 max-[720px]:[&_.button-small]:py-0 max-[390px]:[&_.button-small]:px-[9px] max-[390px]:[&_.button-small]:gap-1.5 min-[390px]:max-[720px]:[&_.button-small]:px-2.5 min-[390px]:max-[720px]:[&_.button-small]:gap-2"
          aria-label="Main navigation"
        >
          <Brand />
          <div className="nav-links max-[720px]:hidden min-[720px]:flex items-center text-[#a2a3ad] text-[13px] max-[900px]:gap-[21px] min-[900px]:gap-7.5 [&_a]:relative [&_a]:[transition:color_180ms_ease] [&_a]:px-0 [&_a]:py-[15px] [&_a:hover]:text-[#f1f2f4] [&_a::after]:[content:''] [&_a::after]:absolute [&_a::after]:left-0 [&_a::after]:right-0 [&_a::after]:bottom-[7px] [&_a::after]:h-px [&_a::after]:w-auto [&_a::after]:rounded-[0] [&_a::after]:bg-[#91a6c8] [&_a::after]:opacity-[0] [&_a::after]:[transform:scaleX(.6)] [&_a::after]:[transition:opacity_.2s,transform_.2s] motion-reduce:[&_a::after]:transition-none! [&_a:hover::after]:opacity-[1] [&_a:hover::after]:[transform:scaleX(1)]">
            <a href="#product">Product</a>
            <a href="#workflow">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="nav-actions flex items-center max-[390px]:gap-[5px] min-[390px]:max-[720px]:gap-2.5 min-[720px]:max-[900px]:gap-[17px] min-[900px]:gap-[23px] max-[720px]:[&>.login]:hidden">
            <a
              href="/login"
              className="login text-[14px] text-[#9297a3] hover:text-[#f1f2f4]"
            >
              Log in
            </a>
            <a
              href="/login"
              className="button button-primary button-small inline-flex items-center justify-center min-h-[33px] rounded-[6px] text-[13px] font-medium leading-[1.3] whitespace-nowrap [transition:background-color_.18s,border-color_.18s,transform_.18s] bg-[#e8e9ed] text-[#131419] [box-shadow:0_1px_0_#ffffff2a_inset] px-3 py-0 border border-[#e8e9ed] gap-3 hover:bg-white hover:border-[white] [&_svg]:[transition:transform_.2s] [&:hover_svg]:[transform:translate(2px,-1px)] motion-reduce:[&:hover_svg]:[transform:none]! active:[transform:translateY(1px)] motion-reduce:active:[transform:none]! [&:focus-visible_svg]:[transform:translate(2px,-1px)] motion-reduce:[&:focus-visible_svg]:[transform:none]!"
            >
              Start free
              <ArrowUpRight size={12} />
            </a>
            <button
              className="menu-button max-[720px]:flex min-[720px]:hidden items-center justify-center w-8.5 h-8.5 text-[#9297a3] [&[aria-expanded='true']_.open-menu-icon]:hidden [&[aria-expanded='true']_.close-menu-icon]:block"

              aria-label={
                mobileMenuOpen ? "Close navigation" : "Open navigation"
              }
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
              ref={menuButton}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={20} className="open-menu-icon" />
              <X size={20} className="close-menu-icon hidden" />
            </button>
          </div>
        </nav>
        <div
          className="mobile-nav pt-[15px] pb-6 flex-col border-t border-t-[#22252b] bg-[#090a0c] px-6 gap-1 [@media(width<721px)]:flex min-[721px]:hidden! [&_a]:text-[#9297a3] [&_a]:flex [&_a]:items-center [&_a]:justify-between [&_a]:text-[14px] [&_a]:p-3 [&_a:hover]:text-[#f1f2f4] [&_a:hover]:bg-[#111318]"
          id="mobile-nav"
          hidden={!mobileMenuOpen}
          onClick={() => setMobileMenuOpen(false)}
        >
          <a href="#product">Product</a>
          <a href="#workflow">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <a href="/login">
            Log in <ArrowUpRight size={14} />
          </a>
        </div>
      </header>
    </>
  );
}
