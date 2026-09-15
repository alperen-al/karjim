// Decorative background atmosphere: a few thin, softly blurred, wavy
// streaks that slowly drift and undulate - like cigarette smoke dispersing
// in open air. Purely visual, so it stays out of the accessibility tree
// and never blocks clicks/taps.
//
// The drift uses native SVG <animateTransform> (SMIL) rather than a CSS
// transform, since CSS transforms on individual SVG <path> elements need
// `transform-box: fill-box`, which some mobile browsers still handle
// inconsistently - SMIL animation is interpreted directly by the SVG
// engine and reliably animates everywhere.
//
// `className` must include a position utility (e.g. "fixed" or "absolute")
// plus inset-0 and a z-index - left to the caller since that depends on
// the surrounding stacking context.
function Wisp({ d, color, width, values, dur }) {
  return (
    <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round">
      <animateTransform
        attributeName="transform"
        type="translate"
        values={values}
        dur={dur}
        repeatCount="indefinite"
        calcMode="spline"
        keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1"
        keyTimes="0;0.33;0.66;1"
      />
    </path>
  );
}

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
          <Wisp
            d="M -100 260 C 80 200, 180 340, 360 280 S 640 160, 820 260 S 1100 200, 1300 260"
            color="rgba(210,212,218,0.55)"
            width="5"
            values="-90,-10; 70,-50; -30,30; -90,-10"
            dur="18s"
          />
          <Wisp
            d="M -100 460 C 100 400, 260 540, 460 460 S 760 360, 960 470 S 1220 400, 1400 460"
            color="rgba(200,205,212,0.45)"
            width="4"
            values="60,25; -70,-40; 30,45; 60,25"
            dur="14s"
          />
          <Wisp
            d="M -100 120 C 90 70, 220 190, 420 130 S 700 40, 900 140 S 1180 80, 1360 130"
            color="rgba(220,222,226,0.4)"
            width="3.5"
            values="-50,-25; 60,35; -80,10; -50,-25"
            dur="20s"
          />
          <Wisp
            d="M -100 620 C 110 570, 250 690, 440 630 S 720 540, 940 640 S 1200 580, 1380 630"
            color="rgba(205,208,214,0.35)"
            width="4.5"
            values="75,15; -60,-45; 40,30; 75,15"
            dur="22s"
          />
        </g>
      </svg>
    </div>
  );
}
