import Image from "next/image";
import { MascotVideo } from "./mascot-video";

/**
 * The GetBrian mascot, standing on the rule under the hero headline, giving
 * one wave as the page arrives.
 *
 * Place inside a `relative` box whose top edge is the line he stands on.
 *
 * He is two cut-outs on the same 512px square canvas: the body with one arm
 * removed, and that arm on its own. The arm sits behind the body and turns
 * about his shoulder (`.hero-mascot-arm` in globals.css), so the body's edge
 * covers the joint and no seam shows. Both files are cut from
 * getbrian-mascot-transparent.png; re-cut both together if the artwork changes,
 * and move the pivot in the CSS if the shoulder moves.
 *
 * The canvas has empty margin round the figure: his soles sit 86.5% of the way
 * down it. The box is therefore hung 13.5% of its own height below the line,
 * which is what puts the feet on it rather than floating above.
 *
 * Clicking him opens the 15-second GetBrian video (mascot-video.tsx). The
 * images stay decorative, with empty alt text, and the button around them
 * carries the label. He is the mascot, not Brian, so nothing here names him.
 */
export function HeroMascot() {
  const sizes = "(max-width: 768px) 104px, 192px";
  return (
    <MascotVideo className="absolute right-0 bottom-full w-[clamp(6.5rem,15vw,12rem)] translate-y-[13.5%]">
      <Image
        src="/brand/getbrian-mascot-arm-512.webp"
        alt=""
        width={512}
        height={512}
        sizes={sizes}
        priority
        className="hero-mascot-arm absolute inset-0 h-full w-full"
      />
      <Image
        src="/brand/getbrian-mascot-body-512.webp"
        alt=""
        width={512}
        height={512}
        sizes={sizes}
        priority
        className="relative h-auto w-full"
      />
    </MascotVideo>
  );
}
