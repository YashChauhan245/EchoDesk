"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Settings, 
  Code, 
  Eye, 
  LogOut, 
  Menu, 
  X, 
  MessageSquare,
  Bot
} from "lucide-react";

interface SidebarNavProps {
  session: {
    name?: string | null;
    email?: string | null;
  };
}

export default function SidebarNav({ session }: SidebarNavProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/settings",
      label: "Chatbot Settings",
      icon: Settings,
    },
    {
      href: "/dashboard/embed",
      label: "Embed Code",
      icon: Code,
    },
    {
      href: "/dashboard/preview",
      label: "Live Preview",
      icon: Eye,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#08080d] border-r border-white/[0.04]">
      {/* Logo */}
      <div className="p-4 border-b border-white/[0.04] flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="w-40 h-10 overflow-hidden flex items-center justify-center relative">
            <img 
              src="/logo.png" 
              alt="EchoDesk Logo" 
              className="w-full h-full object-contain" 
              style={{ filter: "invert(1) hue-rotate(180deg)", transform: "scale(4.0) translateY(1.5px)" }}
            />
          </div>
        </Link>
        {isOpen && (
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 rounded-md text-[#94a3b8] hover:bg-white/[0.05] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group relative ${
                isActive 
                  ? "bg-white/[0.04] text-white border border-white/[0.05] shadow-inner" 
                  : "text-[#94a3b8] hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${
                  isActive ? "text-[#c084fc]" : "text-[#475569] group-hover:text-[#94a3b8]"
                }`} />
                <span>{item.label}</span>
              </div>
              
              {/* Active Indicator Pin */}
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-[#c084fc] to-[#6366f1]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Signout Footer */}
      <div className="p-4 border-t border-white/[0.04] bg-white/[0.01]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#c084fc] to-[#6366f1] flex items-center justify-center text-white text-xs font-bold shadow-md shadow-[#6366f1]/10">
            {session.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {session.name}
            </p>
            <p className="text-[10px] text-[#475569] truncate">
              {session.email}
            </p>
          </div>
        </div>
        <a
          href="/api/auth/logout"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#475569] hover:text-red-400 hover:bg-red-500/5 transition-all w-full"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </a>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <header className="lg:hidden fixed top-0 w-full z-40 border-b border-white/[0.04] bg-[#030307]/80 backdrop-blur-xl h-14 flex items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center">
          <div className="w-32 h-10 overflow-hidden flex items-center justify-center relative">
            <img 
              src="/logo.png" 
              alt="EchoDesk Logo" 
              className="w-full h-full object-contain" 
              style={{ filter: "invert(1) hue-rotate(180deg)", transform: "scale(4.0) translateY(1.5px)" }}
            />
          </div>
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg text-[#94a3b8] hover:bg-white/[0.02] hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 fixed h-screen top-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Overlay Sidebar Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          {/* Drawer content */}
          <div className="relative w-64 max-w-xs h-full flex-col z-10 animate-fade-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
