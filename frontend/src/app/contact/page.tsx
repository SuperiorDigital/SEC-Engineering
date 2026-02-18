import type { Metadata } from "next";
import Link from "next/link";
import { getContactContent } from "@/lib/wordpress/queries";
import { ContactInquiryForm } from "@/components/forms/ContactInquiryForm";
import { buildCanonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact SEC MEP Engineering for office information and general project inquiries.",
  alternates: {
    canonical: buildCanonical("/contact"),
  },
};

export default async function ContactPage() {
  const contactResult = await getContactContent();

  return (
    <section className="section-space">
      <div className="site-container">
        <h1 className="text-4xl font-bold text-foreground">
          {contactResult.contact?.title ?? "Contact"}
        </h1>

        {!contactResult.configured ? (
          <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-white p-4 text-sm text-text-muted">
            WordPress is not configured yet. Add `WORDPRESS_BASE_URL` to
            `frontend/.env.local`.
          </div>
        ) : null}

        {contactResult.error ? (
          <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-white p-4 text-sm text-text-muted">
            {contactResult.error}
          </div>
        ) : null}

        {contactResult.contact ? (
          <>
            <p className="mt-4 text-text-muted">{contactResult.contact.intro}</p>

            <div className="mt-8 grid gap-6 lg:grid-cols-12">
              <article className="card lg:col-span-5">
                <h2 className="text-xl font-semibold text-foreground">Office Information</h2>
                <dl className="mt-4 space-y-3 text-sm text-text-muted">
                  <div>
                    <dt className="font-semibold text-foreground">Address</dt>
                    <dd>{contactResult.contact.officeAddress || "Add office_address in WordPress."}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">Phone</dt>
                    <dd>{contactResult.contact.officePhone || "Add office_phone in WordPress."}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">Hours</dt>
                    <dd>{contactResult.contact.officeHours || "Add office_hours in WordPress."}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">General Email</dt>
                    <dd>
                      {contactResult.contact.infoEmail ? (
                        <a
                          href={`mailto:${contactResult.contact.infoEmail}`}
                          className="font-semibold text-primary hover:underline"
                        >
                          {contactResult.contact.infoEmail}
                        </a>
                      ) : (
                        "Add info_email in WordPress."
                      )}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 rounded-[var(--radius-md)] border border-border bg-surface-soft p-4 text-sm text-text-muted">
                  For project-specific questions, contact team members directly.
                  <div className="mt-3">
                    <Link href="/about/team" className="button-secondary">
                      View Team Contacts
                    </Link>
                  </div>
                </div>
              </article>

              <article className="card lg:col-span-7">
                <h2 className="text-xl font-semibold text-foreground">Map & Directions</h2>
                {contactResult.contact.mapEmbedUrl ? (
                  <div className="mt-4 overflow-hidden rounded-[var(--radius-md)] border border-border">
                    <iframe
                      title="Office location map"
                      src={contactResult.contact.mapEmbedUrl}
                      className="h-[320px] w-full"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="mt-4 rounded-[var(--radius-md)] border border-border bg-surface-soft p-4 text-sm text-text-muted">
                    Add `map_embed_url` in WordPress to display the office map.
                  </div>
                )}

                <p className="mt-4 text-sm text-text-muted">
                  {contactResult.contact.directionsParking ||
                    "Add directions_parking in WordPress for visitor guidance."}
                </p>
              </article>
            </div>

            <article className="mt-8 card">
              <h2 className="text-xl font-semibold text-foreground">General Inquiry</h2>
              <p className="mt-3 text-sm text-text-muted">
                Use this form for general inquiries. For discipline-specific
                questions, contact team members directly.
              </p>
              <ContactInquiryForm />
            </article>
          </>
        ) : (
          <article className="mt-8 card">
            <p className="text-text-muted">
              Contact content is not available yet. Create a WordPress page with
              slug `contact`.
            </p>
          </article>
        )}
      </div>
    </section>
  );
}
