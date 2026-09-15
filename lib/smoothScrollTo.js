// Prefer the browser's own native smooth scroll: on real devices it runs
// on the compositor thread, so it stays fluid even while the main thread
// is busy with other work (e.g. the hero's own per-frame scroll-fade
// loop) - a hand-rolled requestAnimationFrame scroller runs on the main
// thread instead and visibly stutters on phones under that same load.
// Only browsers with no smooth-scroll support at all (very old Safari)
// fall back to a manual eased scroll.
const DEFAULT_DURATION_MS = 700;

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function manualScrollTo(target, duration) {
  const startY = window.scrollY;
  const endY = target.getBoundingClientRect().top + startY;
  const distance = endY - startY;
  const startTime = performance.now();

  const step = (now) => {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutQuad(t));
    if (t < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

export function smoothScrollToId(targetId, duration = DEFAULT_DURATION_MS) {
  const target = document.getElementById(targetId);
  if (!target) return;

  const supportsNativeSmoothScroll =
    typeof CSS !== "undefined" && CSS.supports?.("scroll-behavior", "smooth");

  if (supportsNativeSmoothScroll) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    manualScrollTo(target, duration);
  }
}
