import { Check } from "lucide-react";
import { Action, Reveal } from "./Shared";
export default function FinalCta() {
  return <section className="mk-final-cta"><div className="mk-aurora" aria-hidden="true"><i /><i /><i /></div><div className="mk-container"><Reveal><span className="mk-eyebrow"><span />YOUR NEXT TEAMMATE IS READY</span><h2>Your knowledge deserves<br /><span className="mk-gradient">to be there for everyone.</span></h2><p>Give your customers answers.<br />Give your team a little breathing room.</p><Action>Build your agent free</Action><span className="mk-cta-fine"><Check size={11} />No credit card. Just your knowledge.</span></Reveal></div></section>;
}
