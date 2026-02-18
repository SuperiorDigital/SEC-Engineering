"use client";

export default function RootError({
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
            Something went wrong
          </h1>
          <p className="mt-3 text-text-muted">{error.message}</p>
          <button type="button" onClick={reset} className="button-primary mt-6">
            Try Again
          </button>
        </div>
      </div>
    </section>
  );
}
