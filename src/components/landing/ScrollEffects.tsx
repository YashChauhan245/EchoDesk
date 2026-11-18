"use client";

import { useEffect } from "react";

/** Presentation-only effects. The interactive previews keep their own React state. */
export default function ScrollEffects() {
  useEffect(() => {
    const root = document.getElementById("echodesk-landing");
    if (!root) return;

    const stage = root.querySelector<HTMLElement>(".product-stage");
    const product = root.querySelector<HTMLElement>(".product-frame");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopPointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    );
    const animations = new Set<Animation>();
    const revealed = new Set<HTMLElement>();
    const targets = new Map<HTMLElement, number>();
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    let disposed = false;

    function reveal(element: HTMLElement, delay = 0, hero = false) {
      if (disposed) return;
      if (reducedMotion.matches || typeof element.animate !== "function")
        return;
      const animation = element.animate(
        [
          {
            opacity: hero ? 0 : 0.12,
            transform: `translateY(${hero ? 10 : 14}px)`,
          },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: hero ? 750 : 650,
          delay,
          easing: "cubic-bezier(.22,1,.36,1)",
          fill: "backwards",
        },
      );
      animations.add(animation);
      const remove = () => animations.delete(animation);
      animation.finished.then(remove, remove);
    }

    root
      .querySelectorAll<HTMLElement>(
        ".proof-line, .section-label, .editorial-heading, .knowledge-visual, .embed-browser, .inbox-frame, .pricing-footnote, .faq-section > div, .final-cta-inner, .infrastructure-grid > div:first-child",
      )
      .forEach((element) => targets.set(element, 0));

    // Related cards enter in a short sequence rather than all at once.
    [
      ".knowledge-notes > article",
      ".workflow-grid > article",
      ".infrastructure-list > article",
      ".pricing-grid > article",
      ".inbox-notes > span",
    ].forEach((selector) => {
      root.querySelectorAll<HTMLElement>(selector).forEach((element, index) => {
        targets.set(element, (index % 3) * 70);
      });
    });

    function observeSections() {
      observer?.disconnect();
      if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const element = entry.target as HTMLElement;
            if (!entry.isIntersecting || revealed.has(element)) return;
            revealed.add(element);
            observer?.unobserve(element);
            reveal(element, targets.get(element));
          });
        },
        { threshold: 0, rootMargin: "0px 0px 24px 0px" },
      );

      targets.forEach((_, element) => {
        if (element.getBoundingClientRect().top < window.innerHeight) {
          revealed.add(element);
        } else if (!revealed.has(element)) {
          observer?.observe(element);
        }
      });
    }

    function resetTilt() {
      product?.style.removeProperty("transform");
      product?.style.removeProperty("transform-origin");
    }

    function updateTilt() {
      frame = 0;
      if (!stage || !product) return;
      const bounds = stage.getBoundingClientRect();
      if (
        reducedMotion.matches ||
        !desktopPointer.matches ||
        window.innerWidth <= 900 ||
        product.matches(":hover, :focus-within") ||
        bounds.bottom < 0 ||
        bounds.top > window.innerHeight
      ) {
        resetTilt();
        return;
      }

      const progress = Math.min(
        1,
        Math.max(
          0,
          (bounds.top - window.innerHeight * 0.14) /
            (window.innerHeight * 0.75),
        ),
      );
      if (progress <= 0.001) {
        resetTilt();
        return;
      }
      product.style.transformOrigin = "center 14%";
      product.style.transform = `perspective(1800px) rotateX(${progress * 2.4}deg) scale(${1 - progress * 0.006})`;
    }

    function scheduleTilt() {
      if (!frame) frame = requestAnimationFrame(updateTilt);
    }

    function handleMotionChange() {
      if (reducedMotion.matches) {
        animations.forEach((animation) => animation.cancel());
        animations.clear();
      }
      observeSections();
      scheduleTilt();
    }

    observeSections();
    root
      .querySelectorAll<HTMLElement>(".hero-announcement, .hero-editorial")
      .forEach((element, index) => reveal(element, index * 70, true));
    scheduleTilt();
    window.addEventListener("scroll", scheduleTilt, { passive: true });
    window.addEventListener("resize", scheduleTilt);
    reducedMotion.addEventListener("change", handleMotionChange);
    desktopPointer.addEventListener("change", scheduleTilt);
    const productEvents = [
      "pointerenter",
      "pointerleave",
      "focusin",
      "focusout",
    ];
    productEvents.forEach((event) =>
      product?.addEventListener(event, scheduleTilt),
    );

    return () => {
      disposed = true;
      observer?.disconnect();
      cancelAnimationFrame(frame);
      animations.forEach((animation) => animation.cancel());
      resetTilt();
      window.removeEventListener("scroll", scheduleTilt);
      window.removeEventListener("resize", scheduleTilt);
      reducedMotion.removeEventListener("change", handleMotionChange);
      desktopPointer.removeEventListener("change", scheduleTilt);
      productEvents.forEach((event) =>
        product?.removeEventListener(event, scheduleTilt),
      );
    };
  }, []);

  return null;
}
