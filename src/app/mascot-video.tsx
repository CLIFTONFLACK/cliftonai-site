"use client";

import { useRef, type ReactNode } from "react";

/** HTMLMediaElement.HAVE_FUTURE_DATA: enough buffered to start playing. */
const HAVE_FUTURE_DATA = 3;

/** How long a click waits for the video to become playable before playing anyway. */
const PLAY_ANYWAY_MS = 1200;

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
 * so a closed dialog costs no bandwidth. The 1.9MB file is fetched when the
 * pointer, a touch or keyboard focus reaches the mascot (`warm`), or at the
 * latest on the click. Opening starts playback once the browser reports the
 * video can play (the click is the user gesture that lets it play with sound;
 * starting before that loses the first second of audio) and closing pauses it
 * and rewinds, so the next open starts from the top.
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

  // Start fetching the video when the pointer or a finger goes near the
  // mascot, so it is usually buffered by the time the click lands.
  const warm = () => {
    const video = videoRef.current;
    if (video && video.preload !== "auto") {
      video.preload = "auto";
      video.load();
    }
  };

  const open = () => {
    const dialog = dialogRef.current;
    const video = videoRef.current;
    dialog?.showModal();
    if (!video) return;
    warm();
    // Calling play() on a video that has not buffered yet starts the audio
    // clock before there is anything to play, which swallows the first second
    // of the voiceover. Wait until the browser says it can play, and only if
    // the modal is still open by then.
    //
    // `canplay` is not guaranteed to arrive: Data Saver, a metered connection,
    // iOS Safari and a failed fetch can all leave the video unbuffered. So a
    // short timer plays it anyway, and a click is never a no-op. `oncanplay`
    // is a single slot, so reopening replaces the previous handler instead of
    // stacking another. Autoplay can still be refused (a strict browser
    // policy); the controls are on screen, so a rejected play() leaves it one
    // tap from playing rather than broken.
    let fallback: ReturnType<typeof setTimeout> | undefined;
    const play = () => {
      clearTimeout(fallback);
      video.oncanplay = null;
      if (dialog?.open) video.play().catch(() => {});
    };
    if (video.readyState >= HAVE_FUTURE_DATA) {
      play();
    } else {
      video.oncanplay = play;
      fallback = setTimeout(play, PLAY_ANYWAY_MS);
    }
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
        onPointerEnter={warm}
        onPointerDown={warm}
        onFocus={warm}
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
