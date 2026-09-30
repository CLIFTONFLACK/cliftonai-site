"use client";

import { useRef, type ReactNode } from "react";

/**
 * Wraps the homepage mascot so a click on him opens the 15-second GetBrian
 * video in a modal.
 *
 * The trigger takes the positioning classes, so it stands where the bare
 * mascot used to stand. `children` are the mascot's images, passed in from
 * the server component so they stay server-rendered.
 *
 * The modal is a native <dialog> opened with showModal(): the browser supplies
 * the focus trap, Escape to close, the inert page behind it and focus return
 * to the trigger. The <video> is always in the markup but is `preload="none"`,
 * so a closed dialog costs no bandwidth; the 1.8MB file is fetched on the
 * first click. Opening starts playback (the click is the user gesture that
 * lets it play with sound) and closing pauses it and rewinds, so the next
 * open starts from the top.
 *
 * The video loops on purpose: it is cut to end on its own first frame.
 */
export function MascotVideo({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Whether the current press began on the backdrop. A drag that starts on the
  // seek bar and is released outside the video still fires its click on the
  // dialog, and must not read as a backdrop click.
  const pressBeganOnBackdrop = useRef(false);

  const open = () => {
    dialogRef.current?.showModal();
    // Autoplay can still be refused (data saver, a strict browser policy). The
    // controls are on screen, so a rejected play() leaves it one tap from
    // playing rather than broken.
    videoRef.current?.play().catch(() => {});
  };

  const stop = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  // The button and the backdrop stop the video themselves rather than waiting
  // for the dialog's `close` event, which is queued as a task and lands after
  // the dialog has already gone. Escape is the one path we cannot call from:
  // the browser closes the dialog itself, so `onCancel` (fires first) and
  // `onClose` (fires after) are what stop the video then.
  const close = () => {
    dialogRef.current?.close();
    stop();
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-label="Watch the GetBrian video"
        className={`group cursor-pointer rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-navy-bright ${className ?? ""}`}
      >
        {children}
        <span
          aria-hidden="true"
          className="mascot-play-blink absolute top-[12%] left-[8%] grid size-5 place-items-center rounded-full bg-brand-navy text-white shadow-md"
        >
          <svg viewBox="0 0 24 24" className="ml-px size-2.5" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="GetBrian video"
        onCancel={stop}
        onClose={stop}
        // A click on the dialog's own box, outside the video, is a click on
        // the backdrop: the ::backdrop belongs to the dialog element.
        onPointerDown={(e) => {
          pressBeganOnBackdrop.current = e.target === e.currentTarget;
        }}
        onClick={(e) => {
          if (pressBeganOnBackdrop.current && e.target === e.currentTarget) close();
        }}
        className="m-auto w-fit max-w-[92vw] overflow-hidden rounded-2xl border-0 bg-black p-0 shadow-2xl backdrop:bg-black/70"
      >
        <video
          ref={videoRef}
          src="/video/getbrian-mascot.mp4"
          poster="/video/getbrian-mascot-poster.webp"
          preload="none"
          controls
          loop
          playsInline
          className="block h-auto max-h-[88dvh] w-auto max-w-[92vw]"
        />
        <button
          type="button"
          onClick={close}
          aria-label="Close video"
          className="absolute top-2 right-2 grid size-11 cursor-pointer place-items-center rounded-full bg-black/60 text-white transition-colors duration-200 hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </dialog>
    </>
  );
}
