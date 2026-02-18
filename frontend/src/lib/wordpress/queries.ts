import { isWordPressConfigured, wpFetch } from "@/lib/wordpress/client";
import {
  type AboutModel,
  type CareersModel,
  type ContactModel,
  type ProjectCategoryGroup,
  type ProjectModel,
  type ServiceModel,
  type TeamMemberModel,
  type WpPage,
  type WpProject,
  type WpService,
  type WpTeamMember,
} from "@/lib/wordpress/types";

const DEFAULT_CATEGORIES = [
  "federal-government",
  "state-government",
  "higher-education",
  "healthcare",
  "physical-plant",
];

const DEFAULT_SERVICE_SLUGS = [
  "mechanical-engineering",
  "electrical-engineering",
  "plumbing-engineering",
];

function stripHtml(input?: string): string {
  if (!input) {
    return "";
  }
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function mapProject(project: WpProject): ProjectModel {
  const featuredImage = project._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const galleryImages = project.acf?.gallery_images ?? [];
  const services = project.acf?.services ?? [];
  const relatedProjectIds = project.acf?.related_projects ?? [];

  return {
    id: project.id,
    slug: project.slug,
    name: stripHtml(project.title?.rendered) || "Untitled Project",
    category: project.category || "uncategorized",
    location: project.acf?.location,
    completionDate: project.acf?.completion_date,
    description:
      stripHtml(project.acf?.description) ||
      stripHtml(project.excerpt?.rendered) ||
      "Project description coming soon.",
    featured: Boolean(project.acf?.featured),
    heroImage: project.acf?.hero_image || featuredImage,
    squareFootage: project.acf?.square_footage,
    services,
    galleryImages,
    relatedProjectIds,
    bodyHtml: project.content?.rendered,
  };
}

function mapTeamMember(member: WpTeamMember): TeamMemberModel {
  const featuredImage = member._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  return {
    id: member.id,
    slug: member.slug,
    name: stripHtml(member.title?.rendered) || "Unnamed Team Member",
    jobTitle: member.acf?.job_title || "Team Member",
    credentials: member.acf?.credentials ?? [],
    email: member.acf?.email || "",
    bio:
      stripHtml(member.acf?.bio) ||
      stripHtml(member.content?.rendered) ||
      "Bio coming soon.",
    yearsWithCompany: member.acf?.years_with_company,
    notableProjects: member.acf?.notable_projects ?? [],
    linkedinUrl: member.acf?.linkedin_url,
    headshotImage: member.acf?.headshot_image || featuredImage,
  };
}

function mapService(service: WpService): ServiceModel {
  return {
    id: service.id,
    slug: service.slug,
    name: stripHtml(service.title?.rendered) || "Untitled Service",
    summary:
      stripHtml(service.acf?.summary) ||
      stripHtml(service.content?.rendered) ||
      "Service summary coming soon.",
    bodyHtml: service.content?.rendered,
    capabilities: service.acf?.capabilities ?? [],
    certifications: service.acf?.certifications ?? [],
    relatedProjectIds: service.acf?.related_projects ?? [],
    relatedProjects: [],
  };
}

function mapAboutPage(page: WpPage): AboutModel {
  return {
    id: page.id,
    slug: page.slug,
    title: stripHtml(page.title?.rendered) || "About Us",
    intro:
      stripHtml(page.acf?.intro) ||
      stripHtml(page.excerpt?.rendered) ||
      "Company overview content coming soon.",
    history: stripHtml(page.acf?.history),
    bodyHtml: page.content?.rendered,
    values: page.acf?.values ?? [],
    differentiators: page.acf?.differentiators ?? [],
    teamSize: page.acf?.team_size,
    serviceArea: page.acf?.service_area,
  };
}

function mapCareersPage(page: WpPage): CareersModel {
  return {
    id: page.id,
    slug: page.slug,
    title: stripHtml(page.title?.rendered) || "Careers",
    intro:
      stripHtml(page.acf?.intro) ||
      stripHtml(page.excerpt?.rendered) ||
      "Join SEC to work on meaningful mechanical, electrical, and plumbing engineering projects.",
    bodyHtml: page.content?.rendered,
    whyWorkHere: page.acf?.why_work_here ?? [],
    positions: page.acf?.positions ?? [],
    recruitingLinkUrl: page.acf?.recruiting_link_url,
    recruitingLinkLabel: page.acf?.recruiting_link_label,
  };
}

function mapContactPage(page: WpPage): ContactModel {
  return {
    id: page.id,
    slug: page.slug,
    title: stripHtml(page.title?.rendered) || "Contact",
    intro:
      stripHtml(page.excerpt?.rendered) ||
      "Contact SEC for general inquiries, and reach team members directly for discipline-specific questions.",
    bodyHtml: page.content?.rendered,
    officeAddress: page.acf?.office_address,
    officePhone: page.acf?.office_phone,
    officeHours: page.acf?.office_hours,
    infoEmail: page.acf?.info_email,
    mapEmbedUrl: page.acf?.map_embed_url,
    directionsParking: page.acf?.directions_parking,
  };
}

async function getPageBySlugCandidates(slugs: string[]): Promise<WpPage | null> {
  for (const slug of slugs) {
    const pages = await wpFetch<WpPage[]>(
      `/wp/v2/pages?slug=${encodeURIComponent(slug)}`,
      undefined,
      { revalidate: 120, tags: ["pages", slug] }
    );

    if (pages[0]) {
      return pages[0];
    }
  }

  return null;
}

export type ProjectsQueryResult = {
  configured: boolean;
  projects: ProjectModel[];
  groups: ProjectCategoryGroup[];
  categories: string[];
  error?: string;
};

function buildGroups(projects: ProjectModel[], categoryFilter?: string) {
  const categorySet = new Set<string>(DEFAULT_CATEGORIES);
  for (const project of projects) {
    if (project.category) {
      categorySet.add(project.category);
    }
  }

  const categories = Array.from(categorySet);
  const categoriesToRender = categoryFilter
    ? categories.filter((category) => category === categoryFilter)
    : categories;

  const groups: ProjectCategoryGroup[] = categoriesToRender.map((category) => {
    const categoryProjects = projects.filter((project) => project.category === category);
    const featured = categoryProjects.filter((project) => project.featured).slice(0, 2);

    const fallbackFeatured =
      featured.length < 2
        ? categoryProjects
            .filter((project) => !featured.some((item) => item.id === project.id))
            .slice(0, 2 - featured.length)
        : [];

    const featuredMerged = [...featured, ...fallbackFeatured];
    const archive = categoryProjects.filter(
      (project) => !featuredMerged.some((item) => item.id === project.id)
    );

    return {
      category,
      featured: featuredMerged,
      archive,
    };
  });

  return { categories, groups };
}

export async function getProjects(
  categoryFilter?: string
): Promise<ProjectsQueryResult> {
  if (!isWordPressConfigured()) {
    return {
      configured: false,
      projects: [],
      groups: [],
      categories: DEFAULT_CATEGORIES,
      error:
        "WordPress is not configured yet. Set WORDPRESS_BASE_URL in frontend/.env.local.",
    };
  }

  try {
    const rawProjects = await wpFetch<WpProject[]>(
      "/wp/v2/projects?per_page=100&_embed",
      undefined,
      { revalidate: 120, tags: ["projects"] }
    );

    const projects = rawProjects
      .map(mapProject)
      .filter((project) => project.name && project.category);

    const { categories, groups } = buildGroups(projects, categoryFilter);

    return {
      configured: true,
      projects,
      groups,
      categories,
    };
  } catch (error) {
    return {
      configured: true,
      projects: [],
      groups: [],
      categories: DEFAULT_CATEGORIES,
      error:
        error instanceof Error
          ? error.message
          : "Unknown WordPress API error while loading projects.",
    };
  }
}

export async function getHomepageFeaturedProjects(limit = 4): Promise<{
  configured: boolean;
  projects: ProjectModel[];
  error?: string;
}> {
  const result = await getProjects();

  if (result.error) {
    return {
      configured: result.configured,
      projects: [],
      error: result.error,
    };
  }

  const featuredFirst = result.projects
    .filter((project) => project.featured)
    .slice(0, limit);

  const fill =
    featuredFirst.length < limit
      ? result.projects
          .filter((project) => !featuredFirst.some((item) => item.id === project.id))
          .slice(0, limit - featuredFirst.length)
      : [];

  return {
    configured: result.configured,
    projects: [...featuredFirst, ...fill],
  };
}

export type ProjectDetailResult = {
  configured: boolean;
  project: ProjectModel | null;
  relatedProjects: ProjectModel[];
  error?: string;
};

export async function getProjectBySlug(
  slug: string
): Promise<ProjectDetailResult> {
  if (!isWordPressConfigured()) {
    return {
      configured: false,
      project: null,
      relatedProjects: [],
      error:
        "WordPress is not configured yet. Set WORDPRESS_BASE_URL in frontend/.env.local.",
    };
  }

  try {
    const items = await wpFetch<WpProject[]>(
      `/wp/v2/projects?slug=${encodeURIComponent(slug)}&_embed`,
      undefined,
      { revalidate: 120, tags: ["projects", `project:${slug}`] }
    );

    const rawProject = items[0];
    if (!rawProject) {
      return {
        configured: true,
        project: null,
        relatedProjects: [],
        error: `Project not found for slug: ${slug}`,
      };
    }

    const project = mapProject(rawProject);
    let relatedProjects: ProjectModel[] = [];

    if (project.relatedProjectIds.length) {
      const include = project.relatedProjectIds.join(",");
      const relatedItems = await wpFetch<WpProject[]>(
        `/wp/v2/projects?include=${include}&per_page=100&_embed`,
        undefined,
        { revalidate: 120, tags: ["projects", `project:${slug}`] }
      );
      relatedProjects = relatedItems.map(mapProject);
    }

    return {
      configured: true,
      project,
      relatedProjects,
    };
  } catch (error) {
    return {
      configured: true,
      project: null,
      relatedProjects: [],
      error:
        error instanceof Error
          ? error.message
          : "Unknown WordPress API error while loading project detail.",
    };
  }
}

export type TeamMembersQueryResult = {
  configured: boolean;
  members: TeamMemberModel[];
  error?: string;
};

export async function getTeamMembers(): Promise<TeamMembersQueryResult> {
  if (!isWordPressConfigured()) {
    return {
      configured: false,
      members: [],
      error:
        "WordPress is not configured yet. Set WORDPRESS_BASE_URL in frontend/.env.local.",
    };
  }

  try {
    const rawMembers = await wpFetch<WpTeamMember[]>(
      "/wp/v2/team-members?per_page=100&_embed",
      undefined,
      { revalidate: 120, tags: ["team-members"] }
    );

    const members = rawMembers
      .map(mapTeamMember)
      .filter((member) => member.name)
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      configured: true,
      members,
    };
  } catch (error) {
    return {
      configured: true,
      members: [],
      error:
        error instanceof Error
          ? error.message
          : "Unknown WordPress API error while loading team members.",
    };
  }
}

export type ServicesQueryResult = {
  configured: boolean;
  services: ServiceModel[];
  error?: string;
};

export async function getServices(): Promise<ServicesQueryResult> {
  if (!isWordPressConfigured()) {
    return {
      configured: false,
      services: [],
      error:
        "WordPress is not configured yet. Set WORDPRESS_BASE_URL in frontend/.env.local.",
    };
  }

  try {
    const rawServices = await wpFetch<WpService[]>(
      "/wp/v2/services?per_page=100",
      undefined,
      { revalidate: 120, tags: ["services"] }
    );

    const mapped = rawServices.map(mapService);

    const relatedIdSet = new Set<number>();
    for (const service of mapped) {
      for (const id of service.relatedProjectIds) {
        relatedIdSet.add(id);
      }
    }

    let relatedProjectsById = new Map<number, ProjectModel>();
    if (relatedIdSet.size > 0) {
      const relatedItems = await wpFetch<WpProject[]>(
        `/wp/v2/projects?include=${Array.from(relatedIdSet).join(",")}&per_page=100&_embed`,
        undefined,
        { revalidate: 120, tags: ["services", "projects"] }
      );

      relatedProjectsById = new Map(
        relatedItems.map((project) => {
          const mappedProject = mapProject(project);
          return [mappedProject.id, mappedProject];
        })
      );
    }

    const services = mapped.map((service) => ({
      ...service,
      relatedProjects: service.relatedProjectIds
        .map((id) => relatedProjectsById.get(id))
        .filter((project): project is ProjectModel => Boolean(project)),
    }));

    const sorted = services.sort((a, b) => {
      const aDefaultIndex = DEFAULT_SERVICE_SLUGS.indexOf(a.slug);
      const bDefaultIndex = DEFAULT_SERVICE_SLUGS.indexOf(b.slug);

      if (aDefaultIndex === -1 && bDefaultIndex === -1) {
        return a.name.localeCompare(b.name);
      }
      if (aDefaultIndex === -1) {
        return 1;
      }
      if (bDefaultIndex === -1) {
        return -1;
      }

      return aDefaultIndex - bDefaultIndex;
    });

    return {
      configured: true,
      services: sorted,
    };
  } catch (error) {
    return {
      configured: true,
      services: [],
      error:
        error instanceof Error
          ? error.message
          : "Unknown WordPress API error while loading services.",
    };
  }
}

export type AboutQueryResult = {
  configured: boolean;
  about: AboutModel | null;
  error?: string;
};

export async function getAboutContent(): Promise<AboutQueryResult> {
  if (!isWordPressConfigured()) {
    return {
      configured: false,
      about: null,
      error:
        "WordPress is not configured yet. Set WORDPRESS_BASE_URL in frontend/.env.local.",
    };
  }

  try {
    const page = await getPageBySlugCandidates(["about-us", "about"]);
    if (!page) {
      return {
        configured: true,
        about: null,
        error: "About page not found in WordPress (expected slug `about-us` or `about`).",
      };
    }

    return {
      configured: true,
      about: mapAboutPage(page),
    };
  } catch (error) {
    return {
      configured: true,
      about: null,
      error:
        error instanceof Error
          ? error.message
          : "Unknown WordPress API error while loading About content.",
    };
  }
}

export type CareersQueryResult = {
  configured: boolean;
  careers: CareersModel | null;
  recruitingEnabled: boolean;
  error?: string;
};

type CareersToggleResponse = {
  careers_openings_enabled?: boolean;
};

export async function getCareersContent(): Promise<CareersQueryResult> {
  if (!isWordPressConfigured()) {
    return {
      configured: false,
      careers: null,
      recruitingEnabled: false,
      error:
        "WordPress is not configured yet. Set WORDPRESS_BASE_URL in frontend/.env.local.",
    };
  }

  try {
    const [page, toggle] = await Promise.all([
      getPageBySlugCandidates(["careers"]),
      wpFetch<CareersToggleResponse>("/sec/v1/settings/careers", undefined, {
        revalidate: 60,
        tags: ["careers", "settings"],
      }).catch(() => ({ careers_openings_enabled: false })),
    ]);

    if (!page) {
      return {
        configured: true,
        careers: null,
        recruitingEnabled: Boolean(toggle.careers_openings_enabled),
        error: "Careers page not found in WordPress (expected slug `careers`).",
      };
    }

    return {
      configured: true,
      careers: mapCareersPage(page),
      recruitingEnabled: Boolean(toggle.careers_openings_enabled),
    };
  } catch (error) {
    return {
      configured: true,
      careers: null,
      recruitingEnabled: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown WordPress API error while loading Careers content.",
    };
  }
}

export type ContactQueryResult = {
  configured: boolean;
  contact: ContactModel | null;
  error?: string;
};

export async function getContactContent(): Promise<ContactQueryResult> {
  if (!isWordPressConfigured()) {
    return {
      configured: false,
      contact: null,
      error:
        "WordPress is not configured yet. Set WORDPRESS_BASE_URL in frontend/.env.local.",
    };
  }

  try {
    const page = await getPageBySlugCandidates(["contact"]);
    if (!page) {
      return {
        configured: true,
        contact: null,
        error: "Contact page not found in WordPress (expected slug `contact`).",
      };
    }

    return {
      configured: true,
      contact: mapContactPage(page),
    };
  } catch (error) {
    return {
      configured: true,
      contact: null,
      error:
        error instanceof Error
          ? error.message
          : "Unknown WordPress API error while loading Contact content.",
    };
  }
}
