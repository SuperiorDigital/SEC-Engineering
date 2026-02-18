import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/wordpress/queries";
import { buildCanonical, getDefaultOgImage } from "@/lib/seo";

function toCategoryLabel(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function toServiceLabel(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProjectBySlug(slug);
  const project = result.project;

  if (!project) {
    return {
      title: "Project",
      description: "Project details for SEC MEP Engineering.",
      alternates: {
        canonical: buildCanonical(`/projects/${slug}`),
      },
    };
  }

  return {
    title: project.name,
    description: project.description,
    alternates: {
      canonical: buildCanonical(`/projects/${project.slug}`),
    },
    openGraph: {
      title: project.name,
      description: project.description,
      url: buildCanonical(`/projects/${project.slug}`),
      images: [project.heroImage || getDefaultOgImage()],
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const result = await getProjectBySlug(slug);

  if (!result.project && !result.error) {
    notFound();
  }

  if (!result.project) {
    return (
      <section className="section-space">
        <div className="site-container">
          <div className="card">
            <h1 className="text-2xl font-semibold text-foreground">Project unavailable</h1>
            <p className="mt-3 text-text-muted">
              {result.error || "This project could not be loaded."}
            </p>
            <Link href="/projects" className="button-secondary mt-6">
              Back to Projects
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const project = result.project;

  return (
    <div>
      <section className="section-space border-b border-border bg-surface-soft">
        <div className="site-container">
          <div className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-foreground">
            {toCategoryLabel(project.category)}
          </div>
          <h1 className="mt-4 text-4xl font-bold text-foreground md:text-5xl">{project.name}</h1>
          <p className="mt-3 text-text-muted">
            {project.location || "Location pending"}
            {project.completionDate ? ` • Completed ${project.completionDate}` : ""}
          </p>
        </div>
      </section>

      <section className="section-space">
        <div className="site-container">
          <div
            role="img"
            aria-label={`${project.name} hero image`}
            className="aspect-[16/7] w-full rounded-[var(--radius-lg)] border border-border bg-cover bg-center"
            style={{
              backgroundImage: `url('${project.heroImage || "/placeholders/project-16x9.svg"}')`,
            }}
          />
        </div>
      </section>

      <section className="section-space border-y border-border bg-surface-soft">
        <div className="site-container grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 className="text-2xl font-semibold text-foreground">Project Overview</h2>
            <p className="mt-3 text-text-muted">{project.description}</p>
            {project.bodyHtml ? (
              <div
                className="prose mt-6 max-w-none text-foreground"
                dangerouslySetInnerHTML={{ __html: project.bodyHtml }}
              />
            ) : null}
          </div>
          <div className="lg:col-span-4">
            <div className="card">
              <h3 className="text-lg font-semibold text-foreground">Project Details</h3>
              <dl className="mt-4 space-y-3 text-sm text-text-muted">
                <div>
                  <dt className="font-semibold text-foreground">Location</dt>
                  <dd>{project.location || "Pending"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Completion Date</dt>
                  <dd>{project.completionDate || "Pending"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Square Footage</dt>
                  <dd>
                    {project.squareFootage
                      ? `${project.squareFootage.toLocaleString()} sq ft`
                      : "Pending"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Services Provided</dt>
                  <dd>
                    {project.services.length
                      ? project.services.map(toServiceLabel).join(", ")
                      : "Pending"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="site-container">
          <h2 className="text-2xl font-semibold text-foreground">Project Gallery</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(project.galleryImages.length
              ? project.galleryImages
              : ["/placeholders/project-16x9.svg"]
            ).map((imageUrl, index) => (
              <div
                key={`${imageUrl}-${index}`}
                role="img"
                aria-label={`${project.name} gallery image ${index + 1}`}
                className="aspect-[4/3] w-full rounded-[var(--radius-lg)] border border-border bg-cover bg-center"
                style={{ backgroundImage: `url('${imageUrl}')` }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-space border-t border-border">
        <div className="site-container">
          <h2 className="text-2xl font-semibold text-foreground">Related Projects</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {result.relatedProjects.map((related) => (
              <article key={related.id} className="card">
                <h3 className="text-lg font-semibold text-foreground">{related.name}</h3>
                <p className="mt-2 text-sm text-text-muted">{related.description}</p>
                <a
                  href={`/projects/${related.slug}`}
                  className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
                >
                  View Project
                </a>
              </article>
            ))}

            {!result.relatedProjects.length ? (
              <article className="card md:col-span-2 lg:col-span-3">
                <p className="text-text-muted">No related projects are linked yet.</p>
              </article>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
