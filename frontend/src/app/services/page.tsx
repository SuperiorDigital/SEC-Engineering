import type { Metadata } from "next";
import Link from "next/link";
import { getServices } from "@/lib/wordpress/queries";
import { buildCanonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore SEC's mechanical, electrical, and plumbing engineering service capabilities.",
  alternates: {
    canonical: buildCanonical("/services"),
  },
};

function toServiceLabel(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function ServicesPage() {
  const servicesResult = await getServices();

  return (
    <section className="section-space">
      <div className="site-container">
        <h1 className="text-4xl font-bold text-foreground">Services</h1>
        <p className="mt-4 text-text-muted">
          Mechanical, Electrical, and Plumbing disciplines sourced from
          WordPress.
        </p>

        {!servicesResult.configured ? (
          <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-white p-4 text-sm text-text-muted">
            WordPress is not configured yet. Add `WORDPRESS_BASE_URL` to
            `frontend/.env.local`.
          </div>
        ) : null}

        {servicesResult.error ? (
          <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-white p-4 text-sm text-text-muted">
            {servicesResult.error}
          </div>
        ) : null}

        <div className="mt-10 space-y-10">
          {servicesResult.services.map((service) => (
            <article key={service.id} className="card">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold text-foreground">
                  {service.name}
                </h2>
                <span className="inline-flex items-center rounded-full border border-border bg-surface-soft px-3 py-1 text-xs font-semibold text-foreground">
                  {toServiceLabel(service.slug)}
                </span>
              </div>

              <p className="mt-4 text-text-muted">{service.summary}</p>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Capabilities
                  </h3>
                  {service.capabilities.length ? (
                    <ul className="mt-3 space-y-2 text-sm text-text-muted">
                      {service.capabilities.map((capability) => (
                        <li key={capability}>• {capability}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-text-muted">
                      Capability details coming soon.
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Certifications
                  </h3>
                  {service.certifications.length ? (
                    <ul className="mt-3 space-y-2 text-sm text-text-muted">
                      {service.certifications.map((certification) => (
                        <li key={certification}>• {certification}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-text-muted">
                      Certification details coming soon.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-foreground">
                  Related Projects
                </h3>
                {service.relatedProjects.length ? (
                  <div className="mt-3 flex flex-wrap gap-3">
                    {service.relatedProjects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects/${project.slug}`}
                        className="button-secondary"
                      >
                        {project.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-text-muted">
                    Related projects will appear here once linked in WordPress.
                  </p>
                )}
              </div>
            </article>
          ))}

          {!servicesResult.services.length && !servicesResult.error ? (
            <article className="card">
              <p className="text-text-muted">
                No services found. Add records in WordPress `services`.
              </p>
            </article>
          ) : null}
        </div>
      </div>
    </section>
  );
}
