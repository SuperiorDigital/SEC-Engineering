import { getCareersContent } from "@/lib/wordpress/queries";
import { CareersApplicationForm } from "@/components/forms/CareersApplicationForm";

export default async function CareersPage() {
  const careersResult = await getCareersContent();

  return (
    <section className="section-space">
      <div className="site-container">
        <h1 className="text-4xl font-bold text-foreground">
          {careersResult.careers?.title ?? "Careers"}
        </h1>

        {!careersResult.configured ? (
          <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-white p-4 text-sm text-text-muted">
            WordPress is not configured yet. Add `WORDPRESS_BASE_URL` to
            `frontend/.env.local`.
          </div>
        ) : null}

        {careersResult.error ? (
          <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-white p-4 text-sm text-text-muted">
            {careersResult.error}
          </div>
        ) : null}

        {careersResult.careers ? (
          <>
            <p className="mt-4 text-text-muted">{careersResult.careers.intro}</p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <article className="card">
                <h2 className="text-xl font-semibold text-foreground">Why Work Here</h2>
                {careersResult.careers.whyWorkHere.length ? (
                  <ul className="mt-4 space-y-2 text-sm text-text-muted">
                    {careersResult.careers.whyWorkHere.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-text-muted">
                    Add `why_work_here` items in WordPress ACF.
                  </p>
                )}
              </article>

              <article className="card">
                <h2 className="text-xl font-semibold text-foreground">
                  Typical Positions
                </h2>
                {careersResult.careers.positions.length ? (
                  <ul className="mt-4 space-y-2 text-sm text-text-muted">
                    {careersResult.careers.positions.map((position) => (
                      <li key={position}>• {position}</li>
                    ))}
                  </ul>
                ) : (
                  <ul className="mt-4 space-y-2 text-sm text-text-muted">
                    <li>• Licensed Mechanical Engineers</li>
                    <li>• Licensed Electrical Engineers</li>
                    <li>• Unlicensed Engineers (entry-level)</li>
                  </ul>
                )}
              </article>
            </div>

            {careersResult.recruitingEnabled && careersResult.careers.recruitingLinkUrl ? (
              <article className="mt-8 card">
                <h2 className="text-xl font-semibold text-foreground">Active Recruiting</h2>
                <p className="mt-2 text-sm text-text-muted">
                  We are actively recruiting for select roles.
                </p>
                <a
                  href={careersResult.careers.recruitingLinkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button-primary mt-4"
                >
                  {careersResult.careers.recruitingLinkLabel || "View Job Posting"}
                </a>
              </article>
            ) : null}

            <article className="mt-8 card">
              <h2 className="text-xl font-semibold text-foreground">Apply</h2>
              <p className="mt-3 text-sm text-text-muted">
                Submit your application below. Required fields include resume
                upload (PDF, DOC, DOCX).
              </p>
              <CareersApplicationForm />
            </article>
          </>
        ) : (
          <article className="mt-8 card">
            <p className="text-text-muted">
              Careers content is not available yet. Create a WordPress page with
              slug `careers`.
            </p>
          </article>
        )}
      </div>
    </section>
  );
}
