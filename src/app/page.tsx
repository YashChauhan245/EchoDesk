import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Footer from "@/components/marketing/Footer";
import FinalCta from "@/components/marketing/FinalCta";
import Pricing from "@/components/marketing/Pricing";
import CaseStudy from "@/components/marketing/CaseStudy";
import RagPipeline from "@/components/marketing/RagPipeline";
import TrustStrip from "@/components/marketing/TrustStrip";
import Hero from "@/components/marketing/Hero";
import Navbar from "@/components/marketing/Navbar";
import { MarketingShell } from "@/components/marketing/Shared";

// Server-rendered content, with separate bundles for the richer product demos.
const Faq = dynamic(() => import("@/components/marketing/Faq"));
const InboxShowcase = dynamic(
  () => import("@/components/marketing/InboxShowcase"),
);
const EmbedDemo = dynamic(() => import("@/components/marketing/EmbedDemo"));
const FeatureBento = dynamic(
  () => import("@/components/marketing/FeatureBento"),
);
const HowItWorks = dynamic(() => import("@/components/marketing/HowItWorks"));

export const metadata: Metadata = {
  title: "EchoDesk — Your knowledge. Your always-on support.",
  description:
    "Turn your PDFs, website, and FAQs into an AI support agent. Give customers answers from your content, embed with one line of code, and start free.",
  alternates: { canonical: "https://echodesk-platform.vercel.app" },
  openGraph: {
    title: "EchoDesk — Your knowledge. Your always-on support.",
    description:
      "An AI support agent trained on your content. One line of code. Always there for your customers.",
    url: "https://echodesk-platform.vercel.app",
    siteName: "EchoDesk",
    type: "website",
    images: [
      {
        url: "https://echodesk-platform.vercel.app/marketing/og.png",
        width: 1200,
        height: 630,
        alt: "EchoDesk — Your knowledge. Your always-on support.",
      },
    ],
  },
  twitter: {
    images: ["https://echodesk-platform.vercel.app/marketing/og.png"],
    card: "summary_large_image",
    title: "EchoDesk — Your always-on support",
    description: "Turn your knowledge into customer answers. Start free.",
  },
};

const softwareApplication = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "EchoDesk",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://echodesk-platform.vercel.app",
  description:
    "An AI customer support agent trained on your PDFs, website, and FAQs, embedded with one line of code.",
  offers: [
    { "@type": "Offer", name: "Free", price: "0", priceCurrency: "INR" },
    { "@type": "Offer", name: "Starter", price: "799", priceCurrency: "INR" },
    { "@type": "Offer", name: "Pro", price: "2499", priceCurrency: "INR" },
  ],
};

export default function LandingPage() {
  return (
    <MarketingShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplication),
        }}
      />
      <Navbar />
      <main id="main">
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <RagPipeline />
        <FeatureBento />
        <EmbedDemo />
        <InboxShowcase />
        <CaseStudy />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </MarketingShell>
  );
}
