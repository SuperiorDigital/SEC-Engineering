import type { Metadata } from "next";
import { buildCanonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read SEC MEP Engineering terms of service.",
  alternates: {
    canonical: buildCanonical("/terms-of-service"),
  },
};

export default function TermsOfServicePage() {
  return (
    <section className="section-space">
      <div className="site-container">
        <h1 className="text-4xl font-bold text-foreground">Terms of Service</h1>
        <p className="mt-4 text-text-muted">
          Terms of service content will be finalized during launch preparation.
        </p>
      </div>
    </section>
  );
}
