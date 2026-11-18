export default function DashboardLoading() {
  return (
    <div role="status" aria-label="Loading dashboard" className="space-y-7">
      <span className="sr-only">Loading your workspace…</span>
      <div aria-hidden="true" className="space-y-3">
        <div className="h-3 w-32 rounded bg-[var(--dash-hover)]" />
        <div className="h-9 w-3/4 max-w-md rounded bg-[var(--dash-hover)]" />
        <div className="h-4 w-4/5 max-w-lg rounded bg-[var(--dash-hover)]" />
      </div>
      <div aria-hidden="true" className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((card) => (
          <div key={card} className="h-32 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] motion-safe:animate-pulse" />
        ))}
      </div>
      <div aria-hidden="true" className="h-64 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] motion-safe:animate-pulse" />
    </div>
  );
}
