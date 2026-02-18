export default function CareersLoading() {
  return (
    <section className="section-space">
      <div className="site-container space-y-6">
        <div className="h-10 w-48 animate-pulse rounded bg-surface-soft" />
        <div className="h-28 animate-pulse rounded-[var(--radius-lg)] bg-surface-soft" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-64 animate-pulse rounded-[var(--radius-lg)] bg-surface-soft" />
          <div className="h-64 animate-pulse rounded-[var(--radius-lg)] bg-surface-soft" />
        </div>
      </div>
    </section>
  );
}
