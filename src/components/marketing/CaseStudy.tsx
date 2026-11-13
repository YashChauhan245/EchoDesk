import Image from "next/image";
import {
  ArrowUpRight,
  HeartPulse,
  Moon,
  Stethoscope,
  Wallet,
} from "lucide-react";
import { Reveal } from "./Shared";
const uses = [
  [HeartPulse, "Patient support"],
  [Stethoscope, "Dentist information"],
  [Wallet, "Pricing & subscriptions"],
  [Moon, "After-hours pain triage"],
] as const;
export default function CaseStudy() {
  return (
    <section id="case-study" className="mk-section mk-container">
      <Reveal>
        <div className="mk-case-card">
          <div className="mk-case-copy">
            <span className="mk-eyebrow">
              <span />
              OUT IN THE REAL WORLD
            </span>
            <h2>
              Care doesn’t clock out.
              <br />
              <span className="mk-soft">Neither does Toothly.</span>
            </h2>
            <p>
              Toothly, an AI dental care platform, uses EchoDesk to help
              patients find answers — from dentist information to the questions
              that come after hours.
            </p>
            <div className="mk-case-tags">
              {uses.map(([Icon, label]) => (
                <span key={label}>
                  <Icon size={12} />
                  {label}
                </span>
              ))}
            </div>
            <a
              href="https://toothly-ai.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="mk-text-link"
            >
              Meet Toothly’s live assistant
              <ArrowUpRight size={16} />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
          <div className="mk-case-visual">
            <div className="mk-case-orbit" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <div className="mk-toothly-brand">
              <span className="mk-tooth-icon">
                <Image
                  src="/marketing/toothly.png"
                  alt=""
                  width={64}
                  height={64}
                />
              </span>
              <strong>Toothly</strong>
              <span className="mk-toothly-subtitle">
                AI dental care platform
              </span>
              <span className="mk-live-badge">
                <span className="mk-live-dot" />
                Live with EchoDesk
              </span>
            </div>
            <div className="mk-case-connection">
              <span>toothly-ai.vercel.app</span>
              <span>
                Powered by <strong>echodesk.</strong>
              </span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
