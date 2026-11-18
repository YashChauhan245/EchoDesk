"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

export default function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setError(false);
    } catch {
      setError(true);
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Organization ID copied" : "Copy organization ID"}
        className="grid h-8 w-8 place-items-center rounded text-[var(--dash-muted)] hover:bg-[var(--dash-hover)]"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
      <span
        role="status"
        className={error ? "text-[11px] text-red-500" : "sr-only"}
      >
        {error ? "Select and copy the ID manually." : copied ? "Copied" : ""}
      </span>
    </span>
  );
}
