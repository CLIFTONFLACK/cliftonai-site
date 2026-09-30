"use client";

import { useEffect, useRef, useState } from "react";

const BURST = "/healthy/mascot/hero-burst.webp";
const STILL = "/healthy/mascot/hero-burst-still.webp";

/** Both files share this canvas: he is cut out, feet on the bottom edge. */
const WIDTH = 236;
const HEIGHT = 300;

/**
 * When the footage's feet touch down, in ms from its first frame. The flight
 * from the button is timed to end on it, so the move across the hero and the
 * landing squash inside the footage read as one motion.
 */
export const LANDING_MS = 546;

/** How small he starts, as a fraction of his resting size. */
const START_SCALE = 0.18;

/** Past this much scroll the button he leaps from may be off screen. */
const MAX_SCROLL_FOR_BURST = 120;

export type MascotMode = "pending" | "bursting" | "still";

/**
 * Whether to play the entrance or go straight to the standing pose. Split out
 * of the component because it is the only decision here, and it is one a test
 * can make without a browser.
 *
 * `restInView` is whether the spot he lands on is on screen. It matters
 * because the two clocks involved disagree off screen: a browser stops
 * advancing an animated image it is not showing, while the flight carries on.
 * He would finish a flight nobody saw, then leap on the spot once scrolled to.
 *
 * `saveData` is the reader's data-saver setting: the footage is half a
 * megabyte and the still is 14 KB.
 */
export function entranceMode({
  reducedMotion,
  scrollY,
  hasOrigin,
  restInView = true,
  saveData = false,
}: {
  reducedMotion: boolean;
  scrollY: number;
  hasOrigin: boolean;
  restInView?: boolean;
  saveData?: boolean;
}): "bursting" | "still" {
  if (reducedMotion || saveData || !hasOrigin || !restInView) return "still";
  return scrollY > MAX_SCROLL_FOR_BURST ? "still" : "bursting";
}

type Box = { left: number; top: number; width: number; height: number };

/**
 * The flight's start, as an offset from the resting box: the translation that
 * puts the box's centre on the origin's centre.
 */
export function flightOffset(origin: Box, rest: Box) {
  return {
    dx: origin.left + origin.width / 2 - (rest.left + rest.width / 2),
    dy: origin.top + origin.height / 2 - (rest.top + rest.height / 2),
  };
}

/**
 * The Healthy mascot's entrance on the /healthy hero: he bursts out of the
 * hero's call-to-action button, lands at the foot of the hero and waves.
 *
 * The footage is an animated WebP with a real alpha channel, because he lands
 * on a photograph: a white-ground clip blended with `multiply` would let the
 * photo show through his white face. It is encoded to play once and hold its
 * last frame, which is the same pose as the still.
 *
 * Two wrappers move him, one per axis, because a thrown thing travels evenly
 * sideways while it accelerates downward, and a single transform can only have
 * one easing.
 *
 * The footage is downloaded first and handed to the <img> as an object URL.
 * That is one download whatever the cache headers say, and the image's own
 * clock starts only when it is on the page, which the flight is timed against.
 *
 * He is decoration: hidden from assistive tech, ignores the pointer, and under
 * reduced motion, with data saver on, after a scroll, with his landing spot
 * off screen, or if the footage fails to load, he is simply standing there.
 *
 * Place inside a positioned box whose bottom edge is the ground he lands on.
 */
export function HealthyHeroMascot({
  originSelector,
  className = "",
}: {
  originSelector: string;
  className?: string;
}) {
  const [mode, setMode] = useState<MascotMode>("pending");
  const [burstUrl, setBurstUrl] = useState<string | null>(null);
  const [landed, setLanded] = useState(false);
  // The image is in place a moment before its flight is set up. Kept hidden
  // until then, or he would flash at the landing spot and then leap to it.
  const [airborne, setAirborne] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const xRef = useRef<HTMLDivElement>(null);
  const yRef = useRef<HTMLDivElement>(null);
  const flights = useRef<Animation[]>([]);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    const stand = () => {
      if (cancelled) return;
      setMode("still");
      setLanded(true);
    };

    /** His ground is the box's bottom edge; on screen means that edge is. */
    const restInView = () => {
      const box = boxRef.current;
      if (!box || document.hidden) return false;
      const { bottom } = box.getBoundingClientRect();
      return bottom > 0 && bottom <= window.innerHeight;
    };

    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;

    const decided = entranceMode({
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches,
      scrollY: window.scrollY,
      hasOrigin: document.querySelector(originSelector) !== null,
      restInView: restInView(),
      saveData: connection?.saveData === true,
    });

    let raf = 0;
    if (decided === "still") {
      // From a frame callback, not the effect body: no synchronous setState
      // in an effect.
      raf = requestAnimationFrame(stand);
    } else {
      fetch(BURST)
        .then((response) => {
          if (!response.ok) throw new Error(String(response.status));
          return response.blob();
        })
        .then((blob) => {
          if (cancelled) return;
          // Asked again now rather than trusted from mount: the file is half
          // a megabyte, and the reader may have scrolled on while it arrived.
          if (window.scrollY > MAX_SCROLL_FOR_BURST || !restInView()) {
            return stand();
          }
          objectUrl = URL.createObjectURL(blob);
          setBurstUrl(objectUrl);
          setMode("bursting");
        })
        .catch(stand);
    }

    const running = flights.current;
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      running.forEach((flight) => flight.cancel());
      running.length = 0;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [originSelector]);

  /** Runs when the animated image has decoded: its clock starts here, so ours does. */
  const startFlight = () => {
    const origin = document.querySelector(originSelector);
    const x = xRef.current;
    const y = yRef.current;
    setAirborne(true);
    if (!origin || !x || !y) return setLanded(true);
    const { dx, dy } = flightOffset(
      origin.getBoundingClientRect(),
      x.getBoundingClientRect(),
    );
    const timing = { duration: LANDING_MS, fill: "backwards" as const };
    const across = x.animate(
      [
        { transform: `translateX(${dx}px) scale(${START_SCALE})` },
        { transform: "translateX(0) scale(1)" },
      ],
      { ...timing, easing: "cubic-bezier(0.3, 0.6, 0.6, 1)" },
    );
    // Up out of the button first, then down faster and faster.
    const down = y.animate(
      [
        { transform: `translateY(${dy}px)`, easing: "ease-out" },
        {
          transform: `translateY(${dy - 36}px)`,
          offset: 0.25,
          easing: "cubic-bezier(0.5, 0, 0.9, 0.6)",
        },
        { transform: "translateY(0)" },
      ],
      timing,
    );
    down.onfinish = () => setLanded(true);
    flights.current.push(across, down);
  };

  const showBurst = mode === "bursting" && burstUrl !== null;

  return (
    <div
      ref={boxRef}
      aria-hidden="true"
      className={`pointer-events-none ${mode === "still" || airborne ? "opacity-100" : "opacity-0"} ${className}`}
    >
      {/* Ground shadow: only once he is on the ground. */}
      <span
        className={`absolute bottom-0 left-1/2 h-[7%] w-3/5 -translate-x-1/2 translate-y-1/3 rounded-[50%] bg-slate-950/30 blur-[6px] transition-opacity duration-300 ${
          landed ? "opacity-100" : "opacity-0"
        }`}
      />
      <div ref={xRef}>
        <div ref={yRef}>
          {(showBurst || mode === "still") && (
            // eslint-disable-next-line @next/next/no-img-element -- an animated WebP: next/image would re-encode it to a single frame
            <img
              src={showBurst ? burstUrl : STILL}
              alt=""
              width={WIDTH}
              height={HEIGHT}
              onLoad={showBurst ? startFlight : undefined}
              // Downloaded fine but would not decode: stand him there instead
              // of leaving the box hidden for good.
              onError={
                showBurst
                  ? () => {
                      setMode("still");
                      setLanded(true);
                    }
                  : undefined
              }
              className="relative block h-auto w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}
