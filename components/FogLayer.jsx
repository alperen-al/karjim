// Decorative background atmosphere: a handful of thin, softly blurred
// streaks at scattered angles and positions that drift quickly - like
// cigarette smoke breaking apart and dispersing in open air (deliberately
// NOT neat parallel horizontal bands). Purely visual, so it stays out of
// the accessibility tree and never blocks clicks/taps.
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
function Wisp({ d, color, width, rotate, cx, cy, values, dur }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      transform={`rotate(${rotate} ${cx} ${cy})`}
    >
      <animateTransform
        attributeName="transform"
        type="translate"
        values={values}
        dur={dur}
        repeatCount="indefinite"
        calcMode="spline"
        keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1"
        keyTimes="0;0.33;0.66;1"
        additive="sum"
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
            rotate={-22}
            cx={600}
            cy={260}
            values="-100,-40; 90,-70; -40,50; -100,-40"
            dur="11s"
          />
          <Wisp
            d="M -100 460 C 100 400, 260 540, 460 460 S 760 360, 960 470 S 1220 400, 1400 460"
            color="rgba(200,205,212,0.45)"
            width="4"
            rotate={31}
            cx={650}
            cy={460}
            values="80,35; -90,-60; 45,65; 80,35"
            dur="9s"
          />
          <Wisp
            d="M -100 120 C 90 70, 220 190, 420 130 S 700 40, 900 140 S 1180 80, 1360 130"
            color="rgba(220,222,226,0.4)"
            width="3.5"
            rotate={12}
            cx={550}
            cy={120}
            values="-70,-35; 80,50; -110,15; -70,-35"
            dur="13s"
          />
          <Wisp
            d="M -100 620 C 110 570, 250 690, 440 630 S 720 540, 940 640 S 1200 580, 1380 630"
            color="rgba(205,208,214,0.4)"
            width="4.5"
            rotate={-38}
            cx={650}
            cy={630}
            values="95,20; -80,-60; 55,40; 95,20"
            dur="10s"
          />
          <Wisp
            d="M -50 380 C 150 340, 300 420, 500 370 S 780 300, 980 380 S 1150 340, 1300 370"
            color="rgba(215,217,222,0.35)"
            width="3"
            rotate={55}
            cx={600}
            cy={380}
            values="-60,50; 70,-45; -30,-70; -60,50"
            dur="8s"
          />
          <Wisp
            d="M -50 700 C 120 660, 260 740, 480 690 S 760 620, 960 700 S 1150 650, 1320 690"
            color="rgba(200,203,210,0.3)"
            width="3.5"
            rotate={-8}
            cx={600}
            cy={690}
            values="65,-30; -75,45; 40,60; 65,-30"
            dur="12s"
          />
        </g>
      </svg>
    </div>
  );
}
