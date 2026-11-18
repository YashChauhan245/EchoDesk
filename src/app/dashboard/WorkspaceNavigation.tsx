"use client";

import {
  AudioLines,
  Code2,
  CreditCard,
  Eye,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

interface WorkspaceNavigationProps {
  session: { name?: string | null; email?: string | null };
}

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  {
    href: "/dashboard/settings",
    label: "Chatbot settings",
    icon: SlidersHorizontal,
  },
  { href: "/dashboard/inbox", label: "Live inbox", icon: Inbox },
  { href: "/dashboard/embed", label: "Embed code", icon: Code2 },
  { href: "/dashboard/preview", label: "Live preview", icon: Eye },
  { href: "/dashboard/pricing", label: "Billing & plans", icon: CreditCard },
];

export default function WorkspaceNavigation({
  session,
}: WorkspaceNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  const currentPage =
    navItems.find((item) => item.href === pathname)?.label || "Overview";
  const initials = (session.name || "User")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function closeMenu() {
    setIsOpen(false);
    menuButton.current?.focus();
  }

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeMenu();
      if (event.key !== "Tab") return;
      const controls = sidebar.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    const desktop = window.matchMedia("(min-width:1024px)");
    const handleResize = () => {
      if (desktop.matches) setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    desktop.addEventListener("change", handleResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      desktop.removeEventListener("change", handleResize);
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <button
          type="button"
          onClick={closeMenu}
          aria-label="Close navigation backdrop"
          tabIndex={-1}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}
      <aside
        ref={sidebar}
        role={isOpen ? "dialog" : undefined}
        aria-modal={isOpen || undefined}
        aria-label={isOpen ? "Workspace navigation" : undefined}
        className={
          "fixed inset-y-0 left-0 z-50 flex w-[232px] flex-col border-r border-[var(--dash-border)] bg-[var(--dash-sidebar)] transition-transform lg:visible lg:translate-x-0 " +
          (isOpen ? "visible translate-x-0" : "invisible -translate-x-full")
        }
      >
        <div className="flex h-[76px] items-center justify-between px-5">
          <Link
            href="/"
            aria-label="EchoDesk home"
            className="block h-10 w-[145px] overflow-hidden"
          >
            <img
              src="/logo.png"
              alt="EchoDesk"
              className="h-full w-full object-contain dark:brightness-0 dark:invert"
              style={{ transform: "scale(4.7) translateY(1px)" }}
            />
          </Link>
          <button
            ref={closeButton}
            type="button"
            onClick={closeMenu}
            aria-label="Close navigation"
            className="grid h-8 w-8 place-items-center rounded hover:bg-[var(--dash-hover)] lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mx-4 mb-6 flex items-center gap-2.5 rounded-md border border-[var(--dash-border)] bg-[var(--dash-panel)] px-3 py-3">
          <span className="grid h-7 w-7 place-items-center rounded-md border border-[var(--dash-border)] bg-[var(--dash-hover)] text-[var(--dash-accent)]">
            <AudioLines className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[12px] font-medium">Your workspace</p>
            <p className="text-[11px] text-[var(--dash-muted)]">
              Customer support
            </p>
          </div>
        </div>
        <p className="mb-2 px-7 text-[10px] font-medium uppercase tracking-[.13em] text-[var(--dash-dim)]">
          Workspace
        </p>
        <nav aria-label="Dashboard navigation" className="space-y-1 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => router.prefetch(item.href)}
                onFocus={() => router.prefetch(item.href)}
                onClick={() => setIsOpen(false)}
                aria-current={active ? "page" : undefined}
                className={
                  "flex min-h-10 items-center gap-3 rounded-md border px-3 text-[13px] transition-colors " +
                  (active
                    ? "border-[var(--dash-border)] bg-[var(--dash-selected)] text-[var(--dash-text)]"
                    : "border-transparent text-[var(--dash-muted)] hover:bg-[var(--dash-hover)] hover:text-[var(--dash-text)]")
                }
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto px-4 pb-4 pt-8">
          <ThemeToggle
            showLabel
            className="mb-4 flex min-h-10 w-full items-center gap-3 rounded-md px-3 text-[12px] text-[var(--dash-muted)] transition-colors hover:bg-[var(--dash-hover)]"
          />
          <div className="flex items-center gap-3 border-t border-[var(--dash-border)] px-2 pt-4">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--dash-border)] bg-[var(--dash-hover)] text-[11px]">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-medium">
                {session.name || "User"}
              </p>
              <p className="truncate text-[11px] text-[var(--dash-muted)]">
                {session.email}
              </p>
            </div>
            <a
              href="/api/auth/logout"
              aria-label="Sign out"
              className="grid h-8 w-8 shrink-0 place-items-center rounded text-[var(--dash-muted)] hover:bg-[var(--dash-hover)] hover:text-red-500"
            >
              <LogOut className="h-4 w-4" />
            </a>
          </div>
        </div>
      </aside>
      <header className="flex h-[66px] items-center justify-between gap-3 border-b border-[var(--dash-border)] px-4 sm:px-8 lg:ml-[232px]">
        <div className="flex min-w-0 items-center gap-3">
          <button
            ref={menuButton}
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open navigation"
            aria-expanded={isOpen}
            className="grid h-9 w-9 place-items-center rounded-md border border-[var(--dash-border)] text-[var(--dash-muted)] lg:hidden"
          >
            <Menu className="h-[18px] w-[18px]" />
          </button>
          <span className="hidden text-[12px] text-[var(--dash-muted)] sm:inline">
            Workspace
          </span>
          <span
            aria-hidden="true"
            className="hidden text-[var(--dash-dim)] sm:inline"
          >
            /
          </span>
          <span className="truncate text-[12px]">{currentPage}</span>
        </div>
        <span
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--dash-border)] bg-[var(--dash-hover)] text-[10px]"
          aria-label={session.name || "User"}
        >
          {initials}
        </span>
      </header>
    </>
  );
}
