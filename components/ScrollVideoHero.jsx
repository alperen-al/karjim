"use client";

import { useEffect, useRef } from "react";
import FogLayer from "@/components/FogLayer";

export default function ScrollVideoHero({ children, revealContent }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const rafRef = useRef(null);

  // The video just plays continuously on its own (autoPlay + loop) - scroll
  // no longer scrubs its currentTime. Scroll only drives a fade: `progress`
  // (0..1) covers the sticky pin itself, and starting the fade partway
  // through (FADE_START) means it's already darkening while still playing.
  // Both the fade-out and `revealContent` fading in on top of it (via
  // --reveal) finish exactly at progress===1, i.e. while the video is
  // STILL pinned/on screen - so the reveal is fully visible before any
  // further scrolling carries the (by-then-empty) hero away.
  //
  // This reads scroll position in a self-driving requestAnimationFrame
  // loop instead of only reacting to the 'scroll' event. Mobile browsers
  // often coalesce/throttle scroll events during momentum scrolling (they
  // can fire as infrequently as a handful of times per second), which
  // made the fade visibly stepped/choppy. Sampling every animation frame
  // regardless decouples the visual update rate from that and keeps it
  // smooth at the display's real refresh rate.
  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const FADE_START = 0.65;
    let running = true;

    const loop = () => {
      if (!running) return;

      const rect = container.getBoundingClientRect();
      const scrollableHeight = rect.height - window.innerHeight;
      if (scrollableHeight > 0) {
        const progress = Math.min(Math.max(-rect.top / scrollableHeight, 0), 1);
        const fade =
          Math.min(Math.max((progress - FADE_START) / (1 - FADE_START), 0), 1);
        video.style.opacity = String(1 - fade);
        container.style.setProperty("--reveal", String(fade));
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative isolate h-[190dvh]">
      <div className="sticky top-0 h-dvh w-full overflow-hidden bg-zinc-950">
        {/* Sits below the (opaque, while playing) video - only becomes
            visible once the video fades out, right alongside revealContent. */}
        <FogLayer className="absolute inset-0" />

        <video
          ref={videoRef}
          src="/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover will-change-[opacity]"
        >
          Tarayıcınız video etiketini desteklemiyor.
        </video>

        {children}

        {/* Fades in on top of the video as it darkens (driven by --reveal,
            set above) - so the next section is already fully in place, on
            screen, superimposed on the hero, by the time the video is gone.
            No separate scroll is needed to "reach" it afterward. */}
        {revealContent && (
          <div
            className="pointer-events-none absolute inset-0 flex items-end justify-center pb-6 sm:pb-10 will-change-[opacity,transform]"
            style={{
              opacity: "var(--reveal, 0)",
              transform: "translateY(calc((1 - var(--reveal, 0)) * 24px))",
            }}
          >
            <div className="pointer-events-auto w-full">{revealContent}</div>
          </div>
        )}
      </div>
    </div>
  );
}
