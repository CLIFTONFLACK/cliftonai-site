"use client";

import { usePathname } from "next/navigation";
import { MobileNav, type NavLink } from "../mobile-nav";

const navLinks: NavLink[] = [
  { href: "/cliftonflack", label: "Home" },
  { href: "/cliftonflack/vance-health-hub", label: "Vance Health Hub" },
  { href: "/cliftonflack/ciitech", label: "CiiTECH" },
  { href: "/cliftonflack/getbrian", label: "GetBrian" },
];

export function CliftonFlackHeader() {
  const pathname = usePathname();

  return (
    <header className="cf-header fixed inset-x-4 top-4 z-50 rounded-2xl sm:inset-x-6">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between px-3 py-2.5 sm:px-4"
      >
        <a
          href="/cliftonflack"
          className="flex min-h-11 cursor-pointer items-center gap-2 px-1"
        >
          <span className="font-heading text-4xl font-bold tracking-tighter">
            <span className="text-[var(--cf-navy)]">Clifton</span>{" "}
            <span className="text-[var(--cf-gold-deep)]">Flack</span>
          </span>
        </a>
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="cf-nav-link cursor-pointer"
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://www.linkedin.com/in/cliftonflack/"
            target="_blank"
            rel="noopener noreferrer"
            className="cf-clay-ghost hidden min-h-11 items-center px-4 text-sm font-semibold text-[var(--cf-gold-deep)] md:inline-flex"
          >
            Connect on LinkedIn
          </a>
          <MobileNav
            links={navLinks}
            ctaHref="https://www.linkedin.com/in/cliftonflack/"
            ctaLabel="Connect on LinkedIn"
          />
        </div>
      </nav>
    </header>
  );
}
