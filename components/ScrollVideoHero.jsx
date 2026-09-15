"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { smoothScrollToId } from "@/lib/smoothScrollTo";

// Slide 0 is always the looping video (the default/main view). The rest
// are real gym photos the visitor can flip through with the side arrows -
// the video keeps playing underneath the whole time, so coming back to
// slide 0 always shows it still running, never restarted.
const GALLERY_IMAGES = [
  "/gallery/gym-1.png",
  "/gallery/gym-2.png",
  "/gallery/gym-3.png",
  "/gallery/gym-6.png",
  "/gallery/gym-7.png",
  "/gallery/gym-8.png",
  "/gallery/gym-9.png",
];
const SLIDE_COUNT = GALLERY_IMAGES.length + 1;

// A normal-flow block (not position:sticky) that sits right at the top of
// the page, sharing the same document flow and the same single page-level
// FogLayer as everything below it. An earlier version pinned this in a
// tall separate panel with its own internal fog layer - that produced a
// visible seam where the two independent fog patterns met. Plain flow
// avoids that entirely: there's only ever one fog layer, so there's
// nothing to seam.
//
// Whichever slide is showing fades out (and drifts up slightly) as the
// user scrolls it out of view - driven by a self-running
// requestAnimationFrame loop rather than the 'scroll' event, since mobile
// browsers often coalesce/throttle scroll events during momentum
// scrolling, which made the fade visibly stepped/choppy.
export default function ScrollVideoHero({ children }) {
  const containerRef = useRef(null);
  const mediaRef = useRef(null);
  const rafRef = useRef(null);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const media = mediaRef.current;
    if (!container || !media) return;

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
        media.style.opacity = String(1 - fade);
        media.style.transform = `translateY(${-fade * EXTRA_LIFT_PX}px)`;
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

  const goTo = (delta) => {
    setSlide((current) => (current + delta + SLIDE_COUNT) % SLIDE_COUNT);
  };

  return (
    <div ref={containerRef} className="relative h-svh w-full overflow-hidden">
      <div ref={mediaRef} className="absolute inset-0 h-full w-full will-change-[opacity,transform]">
        {/* The video never unmounts (just hidden), so it keeps playing in
            the background and is exactly where it left off when the
            visitor flips back to slide 0. */}
        <video
          src="/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ display: slide === 0 ? "block" : "none" }}
        >
          Tarayıcınız video etiketini desteklemiyor.
        </video>

        {GALLERY_IMAGES.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt="KarJim Spor Merkezi"
            fill
            sizes="100vw"
            priority={index === 0}
            className="object-cover"
            style={{ display: slide === index + 1 ? "block" : "none" }}
          />
        ))}
      </div>

      {children}

      {/* Slide navigation - always available, independent of the HUD's
          own fade, so the gallery stays usable even once the video has
          mostly dissolved on scroll. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-3 sm:px-6">
        <button
          type="button"
          onClick={() => goTo(-1)}
          aria-label="Önceki görsel"
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-neon-blue/30 bg-zinc-950/50 text-neon-blue backdrop-blur transition-colors hover:bg-neon-blue/10"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={() => goTo(1)}
          aria-label="Sonraki görsel"
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-neon-blue/30 bg-zinc-950/50 text-neon-blue backdrop-blur transition-colors hover:bg-neon-blue/10"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Scrolls smoothly down to Kampanyalar - a real (animated) scroll,
          not a teleport, so the fade above reacts exactly as if the
          visitor had scrolled by hand. */}
      <button
        type="button"
        onClick={() => smoothScrollToId("kampanyalar")}
        aria-label="Kampanyalara git"
        className="absolute bottom-6 left-1/2 z-20 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-neon-blue/30 bg-zinc-950/50 text-neon-blue backdrop-blur transition-colors hover:bg-neon-blue/10"
      >
        <ChevronDown className="h-6 w-6" />
      </button>
    </div>
  );
}
