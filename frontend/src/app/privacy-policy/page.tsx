import type { Metadata } from "next";
import { buildCanonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read SEC MEP Engineering privacy policy information.",
  alternates: {
    canonical: buildCanonical("/privacy-policy"),
  },
};

export default function PrivacyPolicyPage() {
  return (
    <section className="section-space">
      <div className="site-container">
        <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
        <p className="mt-4 text-text-muted">
          Privacy policy content will be finalized during launch preparation.
        </p>
      </div>
    </section>
  );
}
