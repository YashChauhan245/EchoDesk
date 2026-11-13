"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { Reveal } from "./Shared";
const technologies = [
  ["nextdotjs", "Next.js"],
  ["mongodb", "MongoDB"],
  ["googlegemini", "Gemini"],
  ["razorpay", "Razorpay"],
  ["scalekit", "Scalekit"],
  ["vercel", "Vercel"],
];
export default function TrustStrip() {
  const [paused, setPaused] = useState(false);
  return (
    <section
      className="mk-trust mk-container"
      aria-label="Technology and integrations"
    >
      <Reveal>
        <p>BUILT ON A STACK YOU CAN TRUST</p>
        <div className="mk-marquee">
          <div
            className="mk-marquee-track"
            style={{ animationPlayState: paused ? "paused" : undefined }}
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="mk-logo-set" aria-hidden={copy === 1}>
                {technologies.map(([icon, name]) => (
                  <span className="mk-tech-logo" key={icon}>
                    <Image
                      src={`/marketing/${icon === "scalekit" ? "scalekit.png" : `${icon}.svg`}`}
                      width={22}
                      height={22}
                      alt=""
                      loading="eager"
                    />
                    {name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <a href="#case-study" className="mk-trust-foot">
          <span className="mk-live-dot" />
          Powering live support on <strong>Toothly</strong>
          <ArrowUpRight size={12} aria-hidden="true" />
        </a>
        <button
          className="mk-marquee-pause"
          onClick={() => setPaused((value) => !value)}
          aria-label={
            paused ? "Play integration logos" : "Pause integration logos"
          }
          aria-pressed={paused}
        >
          {paused ? <Play size={11} /> : <Pause size={11} />}
        </button>
      </Reveal>
    </section>
  );
}
