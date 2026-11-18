import type { ReactNode } from "react";
import { panelClass } from "./styles";

export function PageHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-5">
      <div>
        <p className="mb-2 text-[11px] font-medium uppercase tracking-[.14em] text-[var(--dash-muted)]">
          {eyebrow}
        </p>
        <h1 className="text-[28px] font-medium leading-tight tracking-[-.035em] sm:text-[32px]">
          {title}
        </h1>
        <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-[var(--dash-muted)]">
          {description}
        </p>
      </div>
      {actions && <div className="flex flex-wrap gap-2 sm:pt-5">{actions}</div>}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: ReactNode;
  description: string;
  icon: ReactNode;
}) {
  return (
    <article className={`${panelClass} p-5`}>
      <div className="flex items-center justify-between text-[12px] text-[var(--dash-muted)]">
        <span>{label}</span>
        {icon}
      </div>
      <p className="mt-4 text-[30px] font-medium leading-none tracking-[-.04em] tabular-nums">
        {value}
      </p>
      <p className="mt-2 text-[12px] text-[var(--dash-muted)]">{description}</p>
    </article>
  );
}

export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning";
}) {
  const colors = {
    neutral: "border-[var(--dash-border)] text-[var(--dash-muted)]",
    success: "border-[var(--dash-green)]/25 text-[var(--dash-green)]",
    warning: "border-[var(--dash-amber)]/25 text-[var(--dash-amber)]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-1 text-[11px] ${colors[tone]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
