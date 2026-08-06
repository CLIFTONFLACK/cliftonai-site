"use client";

import { useEffect, useState } from "react";

/**
 * Thumb-zone CTA for phones.
 *
 * A permanent bottom tab bar would be the wrong pattern here — this is a
 * one-page site with a single conversion action, so a tab bar would spend
 * ~64px of an 844px viewport on navigation nobody needs twice. Instead the bar
 * stays out of the way until the hero's own CTA has scrolled off, then docks
 * the same action to the bottom of the screen for the remaining ~11,000px.
 *
 * Hidden at `md` and up, where the fixed header CTA is always in view anyway.
 */
export function StickyCta({
  href,
  label,
  watchId,
}: {
  href: string;
  label: string;
  /** Element whose passing out of view arms the bar — normally the hero CTA. */
  watchId: string;
}) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const target = document.getElementById(watchId);
    if (!target) return;

    // Show once the watched element is fully above the viewport. An observer
    // beats a scroll listener here: no per-frame work, and it self-corrects
    // if the layout reflows (fonts landing, images sizing).
    const io = new IntersectionObserver(
      ([entry]) => {
        setShown(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [watchId]);

  return (
    <div
      // pb picks up the iPhone home-indicator inset; it resolves to 0 on
      // hardware without one. Requires viewport-fit=cover, set in layout.tsx.
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg-elevated px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-300 md:hidden ${
        shown ? "translate-y-0" : "translate-y-full"
      }`}
      // Off-screen it must not be tabbable or announced.
      inert={!shown}
    >
      <a
        href={href}
        className="flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-brand-gold px-6 text-base font-semibold text-fg transition-colors duration-200 hover:bg-brand-gold-hover"
      >
        {label}
      </a>
    </div>
  );
}
