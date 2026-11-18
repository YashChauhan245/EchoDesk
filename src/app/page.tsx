import { Geist, JetBrains_Mono } from "next/font/google";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import KnowledgeSection from "@/components/landing/KnowledgeSection";
import WorkflowSection from "@/components/landing/WorkflowSection";
import InboxSection from "@/components/landing/InboxSection";
import InfrastructureSection from "@/components/landing/InfrastructureSection";
import PricingSection from "@/components/landing/PricingSection";
import FaqSection from "@/components/landing/FaqSection";
import Footer from "@/components/landing/Footer";
import ScrollEffects from "@/components/landing/ScrollEffects";

const sans = Geist({ subsets: ["latin"], variable: "--font-landing-sans" });
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-landing-mono",
});

export default function Home() {
  return (
    <div
      id="echodesk-landing"
      className={`ed-landing ${sans.variable} ${mono.variable}
        min-h-screen bg-[#090a0c] font-sans text-[14px] leading-[1.65]
        tracking-[-.008em] text-[#f1f2f4] antialiased [color-scheme:dark]
        [--font-sans:var(--font-landing-sans),sans-serif] [--font-mono:var(--font-landing-mono),monospace]
        selection:bg-[#c0c8d630] selection:text-white
        [&_svg]:shrink-0 [&_[hidden]]:hidden! [&_[id]]:scroll-mt-25
        [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-[#91a6c8]
        [&_:focus-visible]:outline-offset-4 motion-reduce:[&_*]:transition-none
        print:bg-white print:text-[#111]`}
    >
      <a
        className="skip-link fixed top-[-80px] left-5 z-[200] bg-[#16191f] p-3 border border-[#22252b] [&:focus]:top-3.5"
        href="#main"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="overflow-clip">
        <HeroSection />
        <KnowledgeSection />
        <WorkflowSection />
        <InboxSection />
        <InfrastructureSection />
        <PricingSection />
        <FaqSection />
      </main>
      <Footer />
      <ScrollEffects />
    </div>
  );
}
