// Decorative background atmosphere: a handful of thin, softly blurred
// streaks at scattered angles and positions, each trailed by a couple of
// small soft puffs - like cigarette smoke breaking apart into wispier bits
// as it disperses in open air, rather than looking like plain drawn lines.
// Purely visual, so it stays out of the accessibility tree and never
// blocks clicks/taps.
//
// The drift uses native SVG <animateTransform> (SMIL) rather than a CSS
// transform, since CSS transforms on individual SVG elements need
// `transform-box: fill-box`, which some mobile browsers still handle
// inconsistently - SMIL animation is interpreted directly by the SVG
// engine and reliably animates everywhere.
//
// `className` must include a position utility (e.g. "fixed" or "absolute")
// plus inset-0 and a z-index - left to the caller since that depends on
// the surrounding stacking context.
function Drift({ values, dur, children }) {
  return (
    <g>
      {children}
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
    </g>
  );
}

function Wisp({ d, color, width, rotate, cx, cy, values, dur, puffs }) {
  return (
    <g transform={`rotate(${rotate} ${cx} ${cy})`}>
      <Drift values={values} dur={dur}>
        <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />
        {puffs.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={color} />
        ))}
      </Drift>
    </g>
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
          <filter id="smoke-blur-soft" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="22" />
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
            puffs={[
              { x: 500, y: 230, r: 30 },
              { x: 900, y: 230, r: 22 },
            ]}
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
            puffs={[
              { x: 380, y: 440, r: 26 },
              { x: 1050, y: 450, r: 34 },
            ]}
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
            puffs={[
              { x: 250, y: 150, r: 24 },
              { x: 1050, y: 100, r: 28 },
            ]}
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
            puffs={[
              { x: 300, y: 600, r: 32 },
              { x: 800, y: 660, r: 24 },
            ]}
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
            puffs={[{ x: 650, y: 350, r: 20 }]}
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
            puffs={[{ x: 950, y: 670, r: 26 }]}
          />
        </g>

        {/* Extra tiny, very soft puffs drifting independently around the
            main streaks - the bits that look like they broke off. */}
        <g filter="url(#smoke-blur-soft)" opacity="0.5">
          <Drift values="40,-25; -35,20; 40,-25" dur="15s">
            <circle cx={420} cy={210} r={45} fill="rgba(210,213,219,0.4)" />
          </Drift>
          <Drift values="-45,30; 30,-20; -45,30" dur="17s">
            <circle cx={880} cy={430} r={55} fill="rgba(205,209,215,0.35)" />
          </Drift>
          <Drift values="35,20; -40,-15; 35,20" dur="13s">
            <circle cx={650} cy={90} r={40} fill="rgba(218,220,225,0.3)" />
          </Drift>
          <Drift values="-30,-25; 45,15; -30,-25" dur="16s">
            <circle cx={250} cy={610} r={50} fill="rgba(208,211,217,0.32)" />
          </Drift>
          <Drift values="25,30; -35,-20; 25,30" dur="14s">
            <circle cx={1020} cy={640} r={42} fill="rgba(212,215,220,0.3)" />
          </Drift>
        </g>
      </svg>
    </div>
  );
}
