"use client";

import { Children, useRef, useState, type ReactNode } from "react";

/**
 * The client cards' container. One list, three layouts:
 *
 * - `sm` and up: a plain grid, every card on the page.
 * - Phones, by default: a swipeable row. Eight stacked cards would push
 *   everything below them some 2,500px down a phone, so the row keeps the
 *   section to one card's height. Each card is narrower than the screen so the
 *   next one shows at the edge, which is what says the row scrolls.
 * - Phones, after "View all": the same cards stacked, for anyone who would
 *   rather scroll down than swipe across.
 *
 * It is CSS scroll-snap rather than a scripted slider: the browser's own
 * horizontal scroll, so it works with touch, trackpad and keyboard focus
 * without any of that being reimplemented here. The only state is the toggle.
 *
 * Cards arrive as children so they stay server-rendered; this file ships the
 * toggle and nothing else.
 */
export function ClientsCarousel({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  const [showAll, setShowAll] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const cards = Children.toArray(children);

  return (
    <>
      <ul
        ref={listRef}
        id="client-list"
        aria-label={label}
        className={
          showAll
            ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            : // -mx-6/px-6 runs the row to the screen edges while the first card
              // still lines up with the heading; scroll-px-6 makes snapping
              // respect that inset instead of pulling cards flush left.
              // py-3/-my-3 is room for the cards' focus ring: overflow-x-auto
              // clips vertically too, and the ring sits 6px outside the card.
              // The scrollbar is left visible on purpose. It is an overlay on
              // phones, and in a narrow desktop window it is the only thing a
              // mouse can drag.
              // scroll-mt clears the fixed header when "Show fewer" scrolls
              // back up to the row.
              "-mx-6 -my-3 flex scroll-mt-10 snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 py-3 sm:m-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:p-0 lg:grid-cols-4"
        }
      >
        {cards.map((card, i) => (
          <li
            key={i}
            className={showAll ? "" : "w-[82%] shrink-0 snap-start sm:w-auto"}
          >
            {card}
          </li>
        ))}
      </ul>
      <div className="mt-6 sm:hidden">
        <button
          type="button"
          aria-expanded={showAll}
          aria-controls="client-list"
          onClick={() => {
            // Collapsing from the foot of the stacked list would otherwise
            // leave the reader several screens below where the list now ends.
            if (showAll) {
              requestAnimationFrame(() =>
                listRef.current?.scrollIntoView({ block: "start" }),
              );
            }
            setShowAll(!showAll);
          }}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-[14px] bg-bg px-6 text-base font-bold text-brand-navy transition-colors duration-200 hover:bg-bg-tint focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-navy-bright cursor-pointer"
        >
          {showAll ? "Show fewer" : `View all ${cards.length}`}
        </button>
      </div>
    </>
  );
}
