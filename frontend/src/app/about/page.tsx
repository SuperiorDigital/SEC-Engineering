import type { Metadata } from "next";
import Link from "next/link";
import { getAboutContent } from "@/lib/wordpress/queries";
import { buildCanonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about SEC MEP Engineering, our history, values, and why clients choose our team.",
  alternates: {
    canonical: buildCanonical("/about"),
  },
};

export default async function AboutPage() {
  const aboutResult = await getAboutContent();

  return (
    <section className="section-space">
      <div className="site-container">
        <h1 className="text-4xl font-bold text-foreground">
          {aboutResult.about?.title ?? "About Us"}
        </h1>

        {!aboutResult.configured ? (
          <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-white p-4 text-sm text-text-muted">
            WordPress is not configured yet. Add `WORDPRESS_BASE_URL` to
            `frontend/.env.local`.
          </div>
        ) : null}

        {aboutResult.error ? (
          <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-white p-4 text-sm text-text-muted">
            {aboutResult.error}
          </div>
        ) : null}

        {aboutResult.about ? (
          <>
            <p className="mt-4 text-text-muted">{aboutResult.about.intro}</p>

            <div className="mt-8 grid gap-6 lg:grid-cols-12">
              <article className="card lg:col-span-8">
                <h2 className="text-2xl font-semibold text-foreground">Company Overview</h2>
                {aboutResult.about.history ? (
                  <p className="mt-3 text-text-muted">{aboutResult.about.history}</p>
                ) : null}

                {aboutResult.about.bodyHtml ? (
                  <div
                    className="prose mt-5 max-w-none text-foreground"
                    dangerouslySetInnerHTML={{ __html: aboutResult.about.bodyHtml }}
                  />
                ) : null}
              </article>

              <article className="card lg:col-span-4">
                <h2 className="text-xl font-semibold text-foreground">At a Glance</h2>
                <dl className="mt-4 space-y-3 text-sm text-text-muted">
                  <div>
                    <dt className="font-semibold text-foreground">Team Size</dt>
                    <dd>{aboutResult.about.teamSize || "12-person team"}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">Service Area</dt>
                    <dd>{aboutResult.about.serviceArea || "Regional and national"}</dd>
                  </div>
                </dl>
                <Link href="/about/team" className="button-primary mt-6">
                  Meet Our Team
                </Link>
              </article>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <article className="card">
                <h2 className="text-xl font-semibold text-foreground">Core Values</h2>
                {aboutResult.about.values.length ? (
                  <ul className="mt-4 space-y-2 text-sm text-text-muted">
                    {aboutResult.about.values.map((value) => (
                      <li key={value}>• {value}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-text-muted">
                    Add `values` in WordPress ACF to display this section.
                  </p>
                )}
              </article>

              <article className="card">
                <h2 className="text-xl font-semibold text-foreground">
                  Why Clients Choose SEC
                </h2>
                {aboutResult.about.differentiators.length ? (
                  <ul className="mt-4 space-y-2 text-sm text-text-muted">
                    {aboutResult.about.differentiators.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-text-muted">
                    Add `differentiators` in WordPress ACF to display this section.
                  </p>
                )}
              </article>
            </div>
          </>
        ) : (
          <article className="mt-8 card">
            <p className="text-text-muted">
              About content is not available yet. Create a WordPress page with slug
              `about-us` (or `about`) to populate this section.
            </p>
          </article>
        )}
      </div>
    </section>
  );
}
