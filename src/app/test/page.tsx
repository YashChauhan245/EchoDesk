"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function TestStorefrontContent() {
  const searchParams = useSearchParams();
  const orgId = searchParams.get("orgId") || "demo_org";

  useEffect(() => {
    // Dynamically load chatbot.js
    const chatScript = document.createElement("script");
    chatScript.src = `${window.location.origin}/chatbot.js`;
    chatScript.setAttribute("data-org-id", orgId);
    document.body.appendChild(chatScript);

    // Sync theme with parent
    const checkParentTheme = () => {
      try {
        if (window.parent && window.parent.document && window.parent.document.documentElement) {
          const isDark = window.parent.document.documentElement.classList.contains("dark");
          if (isDark) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      } catch (_) {}
    };

    checkParentTheme();
    const interval = setInterval(checkParentTheme, 500);

    return () => {
      clearInterval(interval);
      if (chatScript.parentNode) {
        chatScript.parentNode.removeChild(chatScript);
      }
      // Clean up chatbot UI root element created by chatbot.js if it exists
      const widgetRoot = document.getElementById("echodesk-chatbot-root");
      if (widgetRoot) {
        widgetRoot.remove();
      }
    };
  }, [orgId]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#333] font-sans transition-colors duration-200 dark:bg-[#08080d] dark:text-[#94a3b8]">
      {/* Header */}
      <header className="bg-white dark:bg-[#0c0c14] py-4 px-8 border-b border-black/[0.05] dark:border-white/[0.05] shadow-sm flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#1a1a1a] dark:text-[#f8fafc]">
          🏪 My Awesome Store
        </h1>
        <nav className="hidden sm:flex space-x-6">
          <a href="#" className="text-sm text-[#666] hover:text-[#333] dark:text-[#94a3b8] dark:hover:text-[#f8fafc] transition-colors">Home</a>
          <a href="#" className="text-sm text-[#666] hover:text-[#333] dark:text-[#94a3b8] dark:hover:text-[#f8fafc] transition-colors">Products</a>
          <a href="#" className="text-sm text-[#666] hover:text-[#333] dark:text-[#94a3b8] dark:hover:text-[#f8fafc] transition-colors">About</a>
          <a href="#" className="text-sm text-[#666] hover:text-[#333] dark:text-[#94a3b8] dark:hover:text-[#f8fafc] transition-colors">Contact</a>
        </nav>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white py-20 px-8 text-center">
        <h2 className="text-4xl font-extrabold mb-4 tracking-tight">
          Welcome to Our Store
        </h2>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          Discover amazing products at great prices. Need help? Chat with our AI assistant using the bubble in the bottom-right corner!
        </p>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#0c0c14] border border-black/[0.05] dark:border-white/[0.05] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-[#1a1a1a] dark:text-[#f8fafc] mb-2">
              📱 Latest Smartphones
            </h3>
            <p className="text-sm text-[#666] dark:text-[#94a3b8] leading-relaxed">
              Check out our collection of the latest smartphones from top brands. We carry iPhone, Samsung Galaxy, OnePlus, and more.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0c0c14] border border-black/[0.05] dark:border-white/[0.05] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-[#1a1a1a] dark:text-[#f8fafc] mb-2">
              💻 Premium Laptops
            </h3>
            <p className="text-sm text-[#666] dark:text-[#94a3b8] leading-relaxed">
              From MacBooks to Dell XPS, find the perfect laptop for work, school, or gaming. Expert advice available.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0c0c14] border border-black/[0.05] dark:border-white/[0.05] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-[#1a1a1a] dark:text-[#f8fafc] mb-2">
              🎧 Accessories
            </h3>
            <p className="text-sm text-[#666] dark:text-[#94a3b8] leading-relaxed">
              Complete your setup with our range of accessories — cases, chargers, earphones, and more.
            </p>
          </div>

          <div className="bg-[#f0f4ff] dark:bg-indigo-950/20 border-l-4 border-[#6366f1] rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#1a1a1a] dark:text-[#f8fafc] mb-2">
              💬 Need Help?
            </h3>
            <p className="text-sm text-[#666] dark:text-[#94a3b8] leading-relaxed">
              Click the chat bubble in the bottom-right corner to talk to our AI assistant. It knows about our products, policies, and can answer your questions instantly!
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-10 text-xs text-[#999] dark:text-[#475569]">
        <p>© 2026 My Awesome Store. This is a test page for EchoDesk chatbot.</p>
      </footer>
    </div>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] dark:bg-[#08080d] text-sm text-[#666] dark:text-[#94a3b8]">
        Loading storefront...
      </div>
    }>
      <TestStorefrontContent />
    </Suspense>
  );
}
