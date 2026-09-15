// CSS `scroll-behavior: smooth` isn't reliable across mobile browsers
// (older Safari in particular - it can just jump instantly), so anywhere
// we need a "scroll to this section" button, we drive the animation
// ourselves via requestAnimationFrame instead. Guarantees the same
// smooth, eased motion everywhere, and since it's a real scroll (not a
// teleport), anything watching scroll position - like the hero's own
// scroll-fade - reacts exactly as if the visitor had scrolled by hand.
const DEFAULT_DURATION_MS = 700;

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function smoothScrollToId(targetId, duration = DEFAULT_DURATION_MS) {
  const target = document.getElementById(targetId);
  if (!target) return;

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
