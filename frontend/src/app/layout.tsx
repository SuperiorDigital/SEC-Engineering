import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import {
  buildCanonical,
  getDefaultOgImage,
  getOrganizationJsonLd,
  getSiteUrl,
} from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "SEC MEP Engineering",
    template: "%s | SEC MEP Engineering",
  },
  description:
    "Mechanical, Electrical, and Plumbing engineering firm showcasing services, team expertise, and project portfolio.",
  alternates: {
    canonical: buildCanonical("/"),
  },
  openGraph: {
    title: "SEC MEP Engineering",
    description:
      "Mechanical, Electrical, and Plumbing engineering firm showcasing services, team expertise, and project portfolio.",
    url: buildCanonical("/"),
    siteName: "SEC MEP Engineering",
    type: "website",
    images: [
      {
        url: getDefaultOgImage(),
        width: 1600,
        height: 686,
        alt: "SEC MEP Engineering hero image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEC MEP Engineering",
    description:
      "Mechanical, Electrical, and Plumbing engineering firm showcasing services, team expertise, and project portfolio.",
    images: [getDefaultOgImage()],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = getOrganizationJsonLd();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
