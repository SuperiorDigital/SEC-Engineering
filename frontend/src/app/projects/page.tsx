import type { Metadata } from "next";
import { getProjects } from "@/lib/wordpress/queries";
import Link from "next/link";
import { buildCanonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Browse SEC project work by category, including featured projects and archive history.",
  alternates: {
    canonical: buildCanonical("/projects"),
  },
};

function toCategoryLabel(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

type ProjectsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const selectedCategoryRaw = resolvedSearchParams.category;
  const selectedCategory = Array.isArray(selectedCategoryRaw)
    ? selectedCategoryRaw[0]
    : selectedCategoryRaw;

  const projectsResult = await getProjects(selectedCategory);

  return (
    <section className="section-space">
      <div className="site-container">
        <h1 className="text-4xl font-bold text-foreground">Projects</h1>
        <p className="mt-4 text-text-muted">
          Portfolio grouped by category with featured showcase cards and archive
          history.
        </p>

        {!projectsResult.configured ? (
          <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-white p-4 text-sm text-text-muted">
            WordPress is not configured yet. Add `WORDPRESS_BASE_URL` to
            `frontend/.env.local`.
          </div>
        ) : null}

        {projectsResult.error ? (
          <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-white p-4 text-sm text-text-muted">
            {projectsResult.error}
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/projects"
            className={`button-secondary ${!selectedCategory ? "ring-2 ring-primary" : ""}`}
          >
            All Projects
          </Link>
          {projectsResult.categories.map((category) => (
            <a
              key={category}
              href={`/projects?category=${category}`}
              className={`button-secondary ${
                selectedCategory === category ? "ring-2 ring-primary" : ""
              }`}
            >
              {toCategoryLabel(category)}
            </a>
          ))}
        </div>

        <div className="mt-10 space-y-12">
          {projectsResult.groups.map((group) => (
            <section key={group.category}>
              <h2 className="text-2xl font-semibold text-foreground">
                {toCategoryLabel(group.category)}
              </h2>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {group.featured.map((project) => (
                  <article key={project.id} className="card overflow-hidden p-0">
                    <div
                      role="img"
                      aria-label={`${project.name} exterior image`}
                      className="aspect-[16/9] w-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url('${
                          project.heroImage || "/placeholders/project-16x9.svg"
                        }')`,
                      }}
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-foreground">
                        {project.name}
                      </h3>
                      <p className="mt-2 text-sm text-text-muted">
                        {project.location
                          ? `${project.location} • ${project.description}`
                          : project.description}
                      </p>
                      <a
                        href={`/projects/${project.slug}`}
                        className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
                      >
                        View Project
                      </a>
                    </div>
                  </article>
                ))}

                {!group.featured.length ? (
                  <article className="card lg:col-span-2">
                    <p className="text-text-muted">
                      No featured projects available in this category yet.
                    </p>
                  </article>
                ) : null}
              </div>

              <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-white p-6">
                <h3 className="text-lg font-semibold text-foreground">
                  Project Archive
                </h3>
                {group.archive.length ? (
                  <ul className="mt-3 space-y-2 text-sm text-text-muted">
                    {group.archive.map((project) => (
                      <li key={project.id}>
                        {project.name}
                        {project.location ? ` — ${project.location}` : ""}
                        {project.completionDate
                          ? ` (${project.completionDate})`
                          : ""}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-text-muted">
                    No archive projects in this category yet.
                  </p>
                )}
              </div>
            </section>
          ))}

          {!projectsResult.groups.length && !projectsResult.error ? (
            <article className="card">
              <p className="text-text-muted">
                No project records found. Create projects in WordPress to render
                this portfolio view.
              </p>
            </article>
          ) : null}
        </div>
      </div>
    </section>
  );
}
