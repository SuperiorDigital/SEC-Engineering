import Image from "next/image";
import Link from "next/link";
import { getHomepageFeaturedProjects } from "@/lib/wordpress/queries";

function toCategoryLabel(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function Home() {
  const featuredResult = await getHomepageFeaturedProjects(4);

  return (
    <div>
      <section className="section-space border-b border-border bg-surface-soft">
        <div className="site-container">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                SEC MEP Engineering
              </p>
              <h1 className="mt-4 text-4xl font-bold text-foreground md:text-6xl">
                Engineering systems that support the buildings people rely on.
              </h1>
              <p className="mt-6 text-base text-text-muted md:text-lg">
                Visual-first portfolio and fast updates powered by WordPress.
                Designed for mobile and built for real-world facilities.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/projects" className="button-primary">
                  View Our Projects
                </Link>
                <a href="/about/team" className="button-secondary">
                  Meet Our Team
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-white">
                <Image
                  src="/placeholders/hero-21x9.svg"
                  alt="Building exterior hero placeholder"
                  width={1600}
                  height={686}
                  className="h-auto w-full"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="site-container grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-semibold text-foreground">
              A small team with deep experience.
            </h2>
            <p className="mt-4 text-text-muted">
              We stay intentionally lean so clients can reach the right person
              quickly. Our work spans federal, state, healthcare, education, and
              physical plant projects.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-white">
                <Image
                  src="/placeholders/project-16x9.svg"
                  alt="Office and project photography placeholder"
                  width={1600}
                  height={900}
                  className="h-auto w-full"
                />
              </div>
              <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-white">
                <Image
                  src="/placeholders/project-16x9.svg"
                  alt="Team in action placeholder"
                  width={1600}
                  height={900}
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space border-y border-border bg-surface-soft">
        <div className="site-container">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl font-semibold text-foreground">
                Featured Projects
              </h2>
              <p className="mt-2 text-text-muted">
                Image-forward highlights from the WordPress content model.
              </p>
            </div>
            <Link href="/projects" className="button-secondary">
              View All
            </Link>
          </div>

          {featuredResult.error ? (
            <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-white p-4 text-sm text-text-muted">
              {featuredResult.error}
            </div>
          ) : null}

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredResult.projects.map((project) => (
              <article key={project.id} className="card overflow-hidden p-0">
                <div className="overflow-hidden">
                  <div
                    role="img"
                    aria-label={`${project.name} exterior image`}
                    className="aspect-[16/9] w-full bg-cover bg-center transition-transform duration-200 hover:scale-[1.03]"
                    style={{
                      backgroundImage: `url('${
                        project.heroImage || "/placeholders/project-16x9.svg"
                      }')`,
                    }}
                  />
                </div>
                <div className="p-6">
                  <div className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-foreground">
                    {toCategoryLabel(project.category)}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">
                    {project.name}
                  </h3>
                  <p className="mt-2 text-sm text-text-muted">
                    {project.description}
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

            {!featuredResult.projects.length && !featuredResult.error ? (
              <article className="card p-6 md:col-span-2 lg:col-span-4">
                <p className="text-text-muted">
                  No featured projects are available yet. Add projects in
                  WordPress and mark them as featured.
                </p>
              </article>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="site-container">
          <h2 className="text-3xl font-semibold text-foreground">
            Services
          </h2>
          <p className="mt-2 text-text-muted">
            Three disciplines with clear, approachable explanations.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Mechanical Engineering",
                href: "/services",
              },
              {
                title: "Electrical Engineering",
                href: "/services",
              },
              {
                title: "Plumbing Engineering",
                href: "/services",
              },
            ].map((s) => (
              <article key={s.title} className="card">
                <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-white">
                  <Image
                    src="/placeholders/service-1x1.svg"
                    alt="Service illustration placeholder"
                    width={512}
                    height={512}
                    className="h-auto w-full"
                  />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-text-muted">
                  Short service summary placeholder for homepage.
                </p>
                <a
                  href={s.href}
                  className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
                >
                  Learn More
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space border-y border-border bg-surface-soft">
        <div className="site-container grid gap-6 md:grid-cols-4">
          {[
            { k: "Years", v: "20+" },
            { k: "Projects", v: "200+" },
            { k: "Team", v: "12" },
            { k: "Certifications", v: "PE / LEED" },
          ].map((stat) => (
            <div key={stat.k} className="card">
              <p className="text-sm font-semibold text-text-muted">{stat.k}</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{stat.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-space">
        <div className="site-container">
          <div className="grid gap-8 rounded-[var(--radius-lg)] border border-border bg-white p-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <h2 className="text-3xl font-semibold text-foreground">
                Let’s talk about your next project.
              </h2>
              <p className="mt-3 text-text-muted">
                Reach the right person quickly—direct team contact is a core
                requirement.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <a href="/about/team" className="button-primary">
                  Contact the Team
                </a>
                <a href="/contact" className="button-secondary">
                  Office Information
                </a>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-[var(--radius-md)] border border-border bg-white"
                  >
                    <Image
                      src="/placeholders/headshot-1x1.svg"
                      alt="Team headshot placeholder"
                      width={512}
                      height={512}
                      className="h-auto w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
