import type { Metadata } from "next";
import EmbedDemo from "@/components/marketing/EmbedDemo";
import FeatureBento from "@/components/marketing/FeatureBento";
import RagPipeline from "@/components/marketing/RagPipeline";
import HowItWorks from "@/components/marketing/HowItWorks";
import TrustStrip from "@/components/marketing/TrustStrip";
import Hero from "@/components/marketing/Hero";
import Navbar from "@/components/marketing/Navbar";
import { MarketingShell } from "@/components/marketing/Shared";

export const metadata: Metadata = {
  title: "EchoDesk — Your knowledge. Your always-on support.",
  description: "Turn your PDFs, website, and FAQs into an AI support agent. Give customers answers from your content, embed with one line of code, and start free.",
  alternates: { canonical: "https://echodesk-platform.vercel.app" },
  openGraph: { title: "EchoDesk — Your knowledge. Your always-on support.", description: "An AI support agent trained on your content. One line of code. Always there for your customers.", url: "https://echodesk-platform.vercel.app", siteName: "EchoDesk", type: "website" },
  twitter: { card: "summary_large_image", title: "EchoDesk — Your always-on support", description: "Turn your knowledge into customer answers. Start free." },
};

export default function LandingPage() {
  return <MarketingShell><Navbar /><main id="main"><Hero /><TrustStrip /><HowItWorks /><RagPipeline /><FeatureBento /><EmbedDemo /></main></MarketingShell>;
}
