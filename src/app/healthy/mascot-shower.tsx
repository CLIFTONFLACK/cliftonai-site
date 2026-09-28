"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { Icon, type IconName } from "./icons";

/*
 * A small mascot above each pick, tossing that pick's goal icons (energy,
 * strength, calm...) down onto its card in a steady waterfall: what the pick
 * gives you, falling into the product. Used by job-rail.tsx between each
 * goal's label and its card.
 *
 * The keyframes are `.healthy-shower-*` in globals.css. Each icon falls on the
 * same clock at its own delay and drift, read from CSS variables set here.
 * Under reduced motion nothing moves: the icons rest where they are scattered
 * down the column, so the column still reads as a shower. Off screen it pauses.
 */
const MASCOT = "/healthy/brand/healthy-mascot.webp";

/** One falling icon: horizontal start and end (px from centre), spin, delay (s), size (px), resting height (px). */
const DROPS = [
  { x0: -6, x1: -40, r: -35, delay: 0, size: 22, rest: 20 },
  { x0: 8, x1: 30, r: 30, delay: 0.3, size: 17, rest: 66 },
  { x0: -2, x1: 6, r: 15, delay: 0.6, size: 24, rest: 40 },
  { x0: 6, x1: -20, r: -20, delay: 0.9, size: 18, rest: 86 },
  { x0: -8, x1: 44, r: 40, delay: 1.2, size: 20, rest: 10 },
  { x0: 2, x1: -46, r: -45, delay: 1.5, size: 16, rest: 56 },
  { x0: 0, x1: 16, r: 25, delay: 1.8, size: 22, rest: 96 },
  { x0: -4, x1: -8, r: -15, delay: 2.1, size: 19, rest: 74 },
  { x0: 4, x1: 36, r: 35, delay: 2.4, size: 16, rest: 32 },
];

export function MascotShower({ icons }: { icons: IconName[] }) {
  const ref = useRef<HTMLDivElement>(null);

  // Pause while off screen; it resumes where it left off.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) node.removeAttribute("data-paused");
      else node.setAttribute("data-paused", "");
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (icons.length === 0) return null;

  return (
    <div ref={ref} className="healthy-shower mx-auto flex flex-col items-center" aria-hidden="true">
      <Image src={MASCOT} alt="" width={473} height={372} unoptimized className="healthy-shower-mascot h-auto w-24" />
      <div className="relative h-28 w-40">
        {DROPS.map((d, i) => (
          <span
            key={i}
            className={`healthy-shower-icon absolute top-0 left-1/2 ${i % 2 ? "text-kinetic-primary" : "text-kinetic-teal"}`}
            style={
              {
                "--x0": `${d.x0}px`,
                "--x1": `${d.x1}px`,
                "--r": `${d.r}deg`,
                "--rest": `${d.rest}px`,
                marginLeft: `${-d.size / 2}px`,
                animationDelay: `${d.delay}s`,
              } as CSSProperties
            }
          >
            <Icon name={icons[i % icons.length]} size={d.size} />
          </span>
        ))}
      </div>
    </div>
  );
}
