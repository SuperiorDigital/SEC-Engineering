export default function AboutLoading() {
  return (
    <section className="section-space">
      <div className="site-container space-y-6">
        <div className="h-10 w-56 animate-pulse rounded bg-surface-soft" />
        <div className="h-28 animate-pulse rounded-[var(--radius-lg)] bg-surface-soft" />
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="h-72 animate-pulse rounded-[var(--radius-lg)] bg-surface-soft lg:col-span-8" />
          <div className="h-72 animate-pulse rounded-[var(--radius-lg)] bg-surface-soft lg:col-span-4" />
        </div>
      </div>
    </section>
  );
}
