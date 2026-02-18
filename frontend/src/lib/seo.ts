export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3009").replace(
    /\/$/,
    ""
  );
}

export function buildCanonical(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export function getDefaultOgImage(): string {
  return `${getSiteUrl()}/placeholders/hero-21x9.svg`;
}

export function getOrganizationJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SEC MEP Engineering",
    url: siteUrl,
    sameAs: [],
    description:
      "Mechanical, Electrical, and Plumbing engineering services with a visual-first portfolio of federal, state, healthcare, education, and physical plant projects.",
    areaServed: "United States",
  };
}
