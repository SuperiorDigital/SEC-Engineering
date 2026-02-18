import Link from "next/link";
import Image from "next/image";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
      <div className="site-container flex min-h-16 items-center justify-between gap-4 py-2">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/placeholders/logo-mark.png"
            alt="Schendt Engineering Corporation"
            width={112}
            height={150}
            className="h-10 w-auto"
            style={{ objectFit: "contain" }}
            priority
          />
          <span className="sr-only">Schendt Engineering Corporation</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/projects" className="button-primary text-sm">
          View Projects
        </Link>
      </div>

      <nav aria-label="Mobile" className="border-t border-border md:hidden">
        <div className="site-container flex gap-4 overflow-x-auto py-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-sm font-medium text-foreground hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
