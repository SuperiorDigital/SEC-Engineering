export default function TeamLoading() {
  return (
    <section className="section-space">
      <div className="site-container space-y-6">
        <div className="h-10 w-56 animate-pulse rounded bg-surface-soft" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-80 animate-pulse rounded-[var(--radius-lg)] bg-surface-soft"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
