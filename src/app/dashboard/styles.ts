// These tokens apply only inside the dashboard. Public pages keep their theme.
export const dashboardTheme = `
  min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text)]
  [--dash-bg:#f7f8fa] dark:[--dash-bg:#090a0c]
  [--dash-sidebar:#ffffff] dark:[--dash-sidebar:#0d0f12]
  [--dash-panel:#ffffff] dark:[--dash-panel:#111318]
  [--dash-input:#fafbfc] dark:[--dash-input:#0d0f12]
  [--dash-hover:#f0f2f5] dark:[--dash-hover:#181b21]
  [--dash-selected:#e9edf3] dark:[--dash-selected:#1b1f27]
  [--dash-border:#e0e4ea] dark:[--dash-border:#262a32]
  [--dash-text:#1c2430] dark:[--dash-text:#eef0f4]
  [--dash-muted:#626c7a] dark:[--dash-muted:#9ca3af]
  [--dash-dim:#7c8592] dark:[--dash-dim:#777f8d]
  [--dash-accent:#526b8e] dark:[--dash-accent:#a5b9d7]
  [--dash-green:#3f7458] dark:[--dash-green:#a0c0ac]
  [--dash-amber:#8d6437] dark:[--dash-amber:#d0b28b]
  [--dash-button:#202936] dark:[--dash-button:#e7eaf0]
  [--dash-button-text:#ffffff] dark:[--dash-button-text:#14181e]
  [--text-primary:var(--dash-text)] [--text-secondary:var(--dash-muted)]
  [--text-muted:var(--dash-dim)] [--bg-primary:var(--dash-bg)]
  [--bg-secondary:var(--dash-input)] [--bg-card:var(--dash-panel)]
  [--border:var(--dash-border)] [--border-glow:var(--dash-border)]
  [--primary:var(--dash-button)] [--primary-hover:var(--dash-button)]
  [&_svg]:shrink-0 [&_:focus-visible]:outline-2
  [&_:focus-visible]:outline-[var(--dash-accent)] [&_:focus-visible]:outline-offset-3
  motion-reduce:[&_*]:transition-none
`;

export const panelClass =
  "rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)]";

export const inputClass =
  "w-full min-w-0 rounded-md border border-[var(--dash-border)] bg-[var(--dash-input)] px-3 py-2.5 text-base sm:text-[13px] text-[var(--dash-text)] placeholder:text-[var(--dash-dim)] outline-none transition-colors focus:border-[var(--dash-accent)] disabled:opacity-60";

export const primaryButtonClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-transparent bg-[var(--dash-button)] px-3.5 py-2 text-[13px] font-medium text-[var(--dash-button-text)] transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";

export const secondaryButtonClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[var(--dash-border)] bg-[var(--dash-panel)] px-3.5 py-2 text-[13px] font-medium text-[var(--dash-text)] transition-colors hover:bg-[var(--dash-hover)] disabled:cursor-not-allowed disabled:opacity-50";
