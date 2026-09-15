// Decorative background atmosphere: a few thin, softly blurred, wavy
// streaks that slowly drift and undulate - like cigarette smoke dispersing
// in open air. Purely visual, so it stays out of the accessibility tree
// and never blocks clicks/taps.
//
// `className` must include a position utility (e.g. "fixed" or "absolute")
// plus inset-0 and a z-index - left to the caller since that depends on
// the surrounding stacking context.
export default function FogLayer({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none overflow-hidden ${className}`}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="smoke-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>
        <g filter="url(#smoke-blur)">
          <path
            className="smoke-wisp smoke-wisp-a"
            d="M -100 260 C 80 200, 180 340, 360 280 S 640 160, 820 260 S 1100 200, 1300 260"
            fill="none"
            stroke="rgba(210,212,218,0.5)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            className="smoke-wisp smoke-wisp-b"
            d="M -100 460 C 100 400, 260 540, 460 460 S 760 360, 960 470 S 1220 400, 1400 460"
            fill="none"
            stroke="rgba(200,205,212,0.4)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            className="smoke-wisp smoke-wisp-c"
            d="M -100 120 C 90 70, 220 190, 420 130 S 700 40, 900 140 S 1180 80, 1360 130"
            fill="none"
            stroke="rgba(220,222,226,0.35)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            className="smoke-wisp smoke-wisp-d"
            d="M -100 620 C 110 570, 250 690, 440 630 S 720 540, 940 640 S 1200 580, 1380 630"
            fill="none"
            stroke="rgba(205,208,214,0.3)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
