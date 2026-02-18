"use client";

export default function ServicesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="section-space">
      <div className="site-container">
        <div className="card">
          <h1 className="text-2xl font-semibold text-foreground">
            Unable to load services
          </h1>
          <p className="mt-3 text-text-muted">{error.message}</p>
          <button type="button" onClick={reset} className="button-primary mt-6">
            Retry
          </button>
        </div>
      </div>
    </section>
  );
}
