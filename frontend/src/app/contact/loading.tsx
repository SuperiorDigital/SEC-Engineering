export default function ContactLoading() {
  return (
    <section className="section-space">
      <div className="site-container space-y-6">
        <div className="h-10 w-48 animate-pulse rounded bg-surface-soft" />
        <div className="h-24 animate-pulse rounded-[var(--radius-lg)] bg-surface-soft" />
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="h-80 animate-pulse rounded-[var(--radius-lg)] bg-surface-soft lg:col-span-5" />
          <div className="h-80 animate-pulse rounded-[var(--radius-lg)] bg-surface-soft lg:col-span-7" />
        </div>
      </div>
    </section>
  );
}
