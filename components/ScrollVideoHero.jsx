"use client";

import { useEffect, useRef } from "react";

// A normal-flow block (not position:sticky) that sits right at the top of
// <main>, sharing the same document flow and the same single page-level
// FogLayer as everything below it. An earlier version pinned this in a
// tall separate panel with its own internal fog layer - that produced a
// visible seam where the two independent fog patterns met. Plain flow
// avoids that entirely: there's only ever one fog layer, so there's
// nothing to seam.
//
// The video plays continuously (autoPlay + loop). As the user scrolls it
// out of view, it fades (starting almost immediately, `FADE_START`) and
// drifts up slightly beyond its natural scroll motion, so it reads as
// dissolving away rather than just plainly scrolling off - and the next
// section arrives right underneath with no big empty gap, since this is
// just a normal `h-dvh` block, not an oversized pinned one.
export default function ScrollVideoHero({ children }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const rafRef = useRef(null);

  // Reads scroll position in a self-driving requestAnimationFrame loop
  // instead of only reacting to the 'scroll' event, since mobile browsers
  // often coalesce/throttle scroll events during momentum scrolling -
  // sampling every frame keeps the fade smooth at the display refresh
  // rate instead of visibly stepping.
  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const FADE_START = 0.1;
    const EXTRA_LIFT_PX = 60;
    let running = true;

    const loop = () => {
      if (!running) return;

      const rect = container.getBoundingClientRect();
      if (rect.height > 0) {
        const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
        const fade =
          Math.min(Math.max((progress - FADE_START) / (1 - FADE_START), 0), 1);
        video.style.opacity = String(1 - fade);
        video.style.transform = `translateY(${-fade * EXTRA_LIFT_PX}px)`;
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
    <div ref={containerRef} className="relative h-dvh w-full overflow-hidden">
      <video
        ref={videoRef}
        src="/hero.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover will-change-[opacity,transform]"
      >
        Tarayıcınız video etiketini desteklemiyor.
      </video>

      {children}
    </div>
  );
}
