import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/wordpress/queries";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const staticRoutes = [
    "",
    "/about",
    "/about/team",
    "/services",
    "/projects",
    "/careers",
    "/contact",
    "/privacy-policy",
    "/terms-of-service",
    "/llm-context",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const projectsResult = await getProjects();
  const projectRoutes = projectsResult.projects.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
