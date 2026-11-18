import { ArrowUpRight, AudioLines } from "lucide-react";
import { panelClass } from "./styles";

export default function WidgetPreview({
  businessName,
  welcomeMessage,
  color,
}: {
  businessName: string;
  welcomeMessage: string;
  color: string;
}) {
  return (
    <section
      className={`${panelClass} p-5`}
      aria-label="Live widget appearance preview"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[13px] font-medium">Your widget</h2>
        <span className="text-[11px] text-[var(--dash-muted)]">
          Live preview
        </span>
      </div>
      <div className="overflow-hidden rounded-lg border border-[var(--dash-border)] bg-[var(--dash-bg)]">
        <div
          className="flex items-center gap-2 border-b border-t-2 border-[var(--dash-border)] p-4"
          style={{ borderTopColor: color }}
        >
          <span
            className="grid h-7 w-7 place-items-center rounded-md bg-[var(--dash-hover)]"
            style={{ color }}
          >
            <AudioLines className="h-4 w-4" />
          </span>
          <span className="truncate text-[12px] font-medium">
            {businessName.trim() || "Your business"} support
          </span>
        </div>
        <div className="min-h-40 p-4">
          <p className="max-w-[90%] rounded-md border border-[var(--dash-border)] bg-[var(--dash-hover)] p-3 text-[12px] leading-relaxed">
            {welcomeMessage || "Your welcome message"}
          </p>
        </div>
        <div className="flex justify-between border-t border-[var(--dash-border)] px-3 py-3 text-[11px] text-[var(--dash-muted)]">
          <span>Ask a question…</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      </div>
      <p className="mt-4 text-[11px] leading-relaxed text-[var(--dash-muted)]">
        Check your greeting and colors before saving your changes.
      </p>
    </section>
  );
}
