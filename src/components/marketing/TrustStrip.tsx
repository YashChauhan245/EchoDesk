import Image from "next/image";
import { Reveal } from "./Shared";
const technologies = [["nextdotjs", "Next.js"], ["mongodb", "MongoDB"], ["googlegemini", "Gemini"], ["razorpay", "Razorpay"], ["scalekit", "Scalekit"], ["vercel", "Vercel"]];
export default function TrustStrip() {
  return <section className="mk-trust mk-container" aria-label="Technology and integrations"><Reveal><p>BUILT ON A STACK YOU CAN TRUST</p><div className="mk-marquee"><div className="mk-marquee-track">{[0, 1].map(copy => <div key={copy} className="mk-logo-set" aria-hidden={copy === 1}>{technologies.map(([icon, name]) => <span className="mk-tech-logo" key={icon}>{icon === "scalekit" ? <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true"><path fill="currentColor" d="M3 2h7v7H3zm0 10h7v10H3zm11-10h7v20h-7z" /></svg> : <Image src={`/marketing/${icon}.svg`} width={22} height={22} alt="" />}{name}</span>)}</div>)}</div></div><a href="#case-study" className="mk-trust-foot"><span className="mk-live-dot" />Powering live support on <strong>Toothly</strong><span aria-hidden="true">↗</span></a></Reveal></section>;
}
