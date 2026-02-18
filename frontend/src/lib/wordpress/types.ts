export type WpRenderText = {
  rendered: string;
};

export type WpMediaReference = {
  id?: number;
  source_url?: string;
};

export type WpProjectAcf = {
  location?: string;
  completion_date?: string;
  featured?: boolean;
  square_footage?: number;
  description?: string;
  hero_image?: string;
  gallery_images?: string[];
  services?: string[];
  related_projects?: number[];
};

export type WpProject = {
  id: number;
  slug: string;
  status: "publish" | "draft" | "pending" | string;
  title: WpRenderText;
  excerpt?: WpRenderText;
  content?: WpRenderText;
  featured_media?: number;
  category?: string;
  acf?: WpProjectAcf;
  _embedded?: {
    "wp:featuredmedia"?: WpMediaReference[];
  };
};

export type WpTeamMemberAcf = {
  job_title?: string;
  credentials?: string[];
  email?: string;
  bio?: string;
  years_with_company?: number;
  notable_projects?: string[];
  linkedin_url?: string;
  headshot_image?: string;
};

export type WpTeamMember = {
  id: number;
  slug: string;
  status: "publish" | "draft" | "pending" | string;
  title: WpRenderText;
  content?: WpRenderText;
  featured_media?: number;
  acf?: WpTeamMemberAcf;
  _embedded?: {
    "wp:featuredmedia"?: WpMediaReference[];
  };
};

export type WpServiceAcf = {
  summary?: string;
  capabilities?: string[];
  certifications?: string[];
  related_projects?: number[];
};

export type WpService = {
  id: number;
  slug: string;
  status: "publish" | "draft" | "pending" | string;
  title: WpRenderText;
  content?: WpRenderText;
  service_type?: string;
  acf?: WpServiceAcf;
};

export type WpAboutAcf = {
  intro?: string;
  history?: string;
  values?: string[];
  differentiators?: string[];
  team_size?: string;
  service_area?: string;
};

export type WpCareersAcf = {
  intro?: string;
  why_work_here?: string[];
  positions?: string[];
  recruiting_link_url?: string;
  recruiting_link_label?: string;
};

export type WpContactAcf = {
  office_address?: string;
  office_phone?: string;
  office_hours?: string;
  info_email?: string;
  map_embed_url?: string;
  directions_parking?: string;
};

export type WpPage = {
  id: number;
  slug: string;
  status: "publish" | "draft" | "pending" | string;
  title: WpRenderText;
  excerpt?: WpRenderText;
  content?: WpRenderText;
  acf?: WpAboutAcf & WpCareersAcf & WpContactAcf;
};

export type ProjectModel = {
  id: number;
  slug: string;
  name: string;
  category: string;
  location?: string;
  completionDate?: string;
  description: string;
  featured: boolean;
  heroImage?: string;
  squareFootage?: number;
  services: string[];
  galleryImages: string[];
  relatedProjectIds: number[];
  bodyHtml?: string;
};

export type ProjectCategoryGroup = {
  category: string;
  featured: ProjectModel[];
  archive: ProjectModel[];
};

export type TeamMemberModel = {
  id: number;
  slug: string;
  name: string;
  jobTitle: string;
  credentials: string[];
  email: string;
  bio: string;
  yearsWithCompany?: number;
  notableProjects: string[];
  linkedinUrl?: string;
  headshotImage?: string;
};

export type ServiceModel = {
  id: number;
  slug: string;
  name: string;
  summary: string;
  bodyHtml?: string;
  capabilities: string[];
  certifications: string[];
  relatedProjectIds: number[];
  relatedProjects: ProjectModel[];
};

export type AboutModel = {
  id: number;
  slug: string;
  title: string;
  intro: string;
  history?: string;
  bodyHtml?: string;
  values: string[];
  differentiators: string[];
  teamSize?: string;
  serviceArea?: string;
};

export type CareersModel = {
  id: number;
  slug: string;
  title: string;
  intro: string;
  bodyHtml?: string;
  whyWorkHere: string[];
  positions: string[];
  recruitingLinkUrl?: string;
  recruitingLinkLabel?: string;
};

export type ContactModel = {
  id: number;
  slug: string;
  title: string;
  intro: string;
  bodyHtml?: string;
  officeAddress?: string;
  officePhone?: string;
  officeHours?: string;
  infoEmail?: string;
  mapEmbedUrl?: string;
  directionsParking?: string;
};
