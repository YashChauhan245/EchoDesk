import type { Metadata } from "next";
import {
  Inter,
  Plus_Jakarta_Sans,
  Outfit,
  Bricolage_Grotesque,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  preload: false,
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  preload: false,
  subsets: ["latin"],
  variable: "--font-outfit",
});

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  preload: false,
});

export const metadata: Metadata = {
  title: "EchoDesk — AI Customer Support Chatbot Platform",
  description:
    "Create AI-powered customer support chatbots and embed them on any website. Build, configure, and deploy in minutes.",
  keywords: [
    "AI chatbot",
    "customer support",
    "SaaS",
    "embeddable chatbot",
    "AI customer service",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && (window.location.pathname === '/' || window.matchMedia('(prefers-color-scheme: dark)').matches))) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} ${outfit.variable} ${display.variable} ${mono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
