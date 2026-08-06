"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type NavLink = { href: string; label: string };

/**
 * The phone-width half of the primary nav.
 *
 * The desktop nav is `hidden md:flex`, so before this existed every section
 * link — Work, Pricing, Who's Brian, Contact — was in the DOM and unreachable
 * below 768px. The only nav affordance a phone got was the gold CTA, on a page
 * that is ~12,600px tall.
 *
 * Deliberately a sheet rather than an expanding header block: the header is
 * `fixed`, so growing it in place would push nothing and instead overlay the
 * hero at an arbitrary height. A sheet owns the whole viewport, which also
 * gives the links room to be 48px apart without looking sparse.
 */
export function MobileNav({
  links,
  ctaHref,
  ctaLabel,
}: {
  links: NavLink[];
  ctaHref: string;
  ctaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  // The sheet is portalled, and a portal cannot exist during SSR. Gating on
  // mount keeps the server and first client render identical.
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => {
    setOpen(false);
    // Return focus to the control that opened the sheet, or a keyboard user is
    // dumped back at the top of the document.
    toggleRef.current?.focus();
  }, []);

  // Escape closes, and while the sheet is up the page behind it must not
  // scroll — otherwise the hero drifts under the panel on iOS momentum.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    // Rotating to a tablet width hides the sheet via md:hidden but would leave
    // the scroll lock on, freezing a page with no visible menu to close.
    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", onBreakpoint);

    return () => {
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onBreakpoint);
      document.body.style.overflow = overflow;
    };
  }, [open, close]);

  return (
    <div className="md:hidden">
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        className="-mr-2 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-brand-navy transition-colors duration-200 hover:bg-brand-navy/5"
      >
        {/* Two bars that cross into an X. Drawn rather than swapped for an
            icon so the transition has something to animate between. */}
        <span aria-hidden="true" className="relative block h-4 w-5">
          <span
            className={`absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-transform duration-200 ${
              open ? "top-[7px] rotate-45" : "top-0.5"
            }`}
          />
          <span
            className={`absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-transform duration-200 ${
              open ? "top-[7px] -rotate-45" : "top-[13px]"
            }`}
          />
        </span>
      </button>

      {/* Both of these are portalled to <body>.
          The header's .glass-nav sets backdrop-filter, and a filtered element
          becomes the containing block for its position:fixed descendants — so
          rendered in place, `inset-0` resolved to the 358x103 nav pill rather
          than the 390x844 viewport, and the scrim covered only the header.
          Escaping to body is what makes `fixed` mean fixed here. */}
      {mounted &&
        createPortal(
          <>
            {/* Scrim. Sits below the panel but above the page. */}
            <div
              aria-hidden="true"
              onClick={close}
              className={`fixed inset-0 z-40 bg-brand-navy/40 transition-opacity duration-200 md:hidden ${
                open ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            />

            <div
              id="mobile-nav-panel"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              tabIndex={-1}
              // inert keeps the closed sheet out of the tab order and off the
              // accessibility tree without display:none, so it can still animate.
              inert={!open}
              // Solid bg-bg, not the header's translucent glass: a menu panel
              // has to stay legible over whatever it lands on, and
              // backdrop-filter is the first thing dropped on low-power devices
              // and in reduced-transparency modes — which would leave dark hero
              // type showing straight through the links.
              // top-32 = 128px: the header pill runs y=16..119 at phone widths,
              // so anything less overlaps it and clips the wordmark.
              className={`fixed inset-x-4 top-32 z-50 origin-top rounded-2xl border border-border bg-bg p-2 shadow-[0_24px_60px_-24px_rgba(10,29,59,0.45)] transition duration-200 focus:outline-none md:hidden ${
                open
                  ? "translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none -translate-y-2 scale-[0.98] opacity-0"
              }`}
            >
              <nav aria-label="Primary mobile">
                <ul>
                  {links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={close}
                        className="flex min-h-12 cursor-pointer items-center rounded-xl px-4 text-base font-medium text-fg-muted transition-colors duration-200 hover:bg-brand-navy/5 hover:text-fg"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <a
                  href={ctaHref}
                  onClick={close}
                  className="mt-2 flex min-h-12 cursor-pointer items-center justify-center rounded-xl bg-brand-gold px-4 text-base font-semibold text-fg transition-colors duration-200 hover:bg-brand-gold-hover"
                >
                  {ctaLabel}
                </a>
              </nav>
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}
