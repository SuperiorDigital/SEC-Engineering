import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-surface-soft">
      <div className="site-container grid gap-8 py-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-4">
            <Image
              src="/placeholders/logo.png"
              alt="Schendt Engineering Corporation"
              width={746}
              height={150}
              className="h-10 w-auto"
              style={{ objectFit: "contain" }}
            />
          </div>
          <p className="mt-2 text-sm text-text-muted">
            Mechanical, Electrical, and Plumbing engineering for public and
            institutional clients.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-foreground">
            Quick Links
          </p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/about" className="text-text-muted hover:text-primary">
              About Us
            </Link>
            <Link href="/services" className="text-text-muted hover:text-primary">
              Services
            </Link>
            <Link href="/projects" className="text-text-muted hover:text-primary">
              Projects
            </Link>
            <Link href="/careers" className="text-text-muted hover:text-primary">
              Careers
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-foreground">
            Contact
          </p>
          <p className="mt-3 text-sm text-text-muted">Colorado Springs, CO</p>
          <a
            href="mailto:info@example.com"
            className="mt-1 block text-sm text-text-muted hover:text-primary"
          >
            info@example.com
          </a>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="site-container flex flex-wrap items-center justify-between gap-3 py-4 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} Schendt Engineering Corporation</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
