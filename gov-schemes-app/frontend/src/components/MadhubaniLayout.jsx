/* ─── MadhubaniLayout.jsx ─────────────────────────────────────────────
   Global Madhubani / Mithila folk-art frame applied to every page.
   Top border, bottom border, and fixed side strips.
   Fully inline SVG — no external images needed.
─────────────────────────────────────────────────────────────────────── */

/* ── Colour palette (Madhubani traditional) ────────────────────────── */
// Red: #b91c1c  |  Orange: #ea580c  |  Yellow: #d97706
// Teal: #0f766e |  Blue: #1d4ed8  |  Black: #111827

const C = {
  red: '#b91c1c',
  orange: '#ea580c',
  yellow: '#d97706',
  teal: '#0f766e',
  blue: '#1d4ed8',
  green: '#15803d',
  cream: '#fefce8',
};

/* ── Shared pattern helpers ─────────────────────────────────────────── */
const Diamond = ({ cx, cy, r = 10, stroke = C.red }) => (
  <>
    <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2}
      transform={`rotate(45,${cx},${cy})`}
      fill="none" stroke={stroke} strokeWidth="1.8" />
    <circle cx={cx} cy={cy} r={r * 0.32} fill={C.orange} />
  </>
);

const Lotus = ({ cx, cy, r = 13 }) => {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <>
      {petals.map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const px = cx + Math.cos(rad) * r;
        const py = cy + Math.sin(rad) * r;
        return (
          <ellipse key={i} cx={px} cy={py} rx={r * 0.55} ry={r * 0.3}
            transform={`rotate(${deg},${px},${py})`}
            fill={i % 2 === 0 ? C.red : C.yellow} opacity="0.88" />
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.42} fill={C.yellow} stroke={C.red} strokeWidth="1.2" />
      <circle cx={cx} cy={cy} r={r * 0.2} fill={C.red} />
    </>
  );
};

const Fish = ({ cx, cy }) => (
  <>
    <ellipse cx={cx} cy={cy} rx="18" ry="9" fill={C.teal} opacity="0.72" />
    <polygon points={`${cx - 18},${cy} ${cx - 26},${cy - 8} ${cx - 26},${cy + 8}`}
      fill="#0d9488" opacity="0.8" />
    <circle cx={cx + 9} cy={cy - 3} r="3" fill="white" opacity="0.9" />
    <circle cx={cx + 9} cy={cy - 3} r="1.5" fill="#1e293b" />
    <path d={`M${cx - 6},${cy} Q${cx},${cy - 6} ${cx + 4},${cy}`}
      fill="none" stroke="#134e4a" strokeWidth="1" />
    <path d={`M${cx - 6},${cy} Q${cx},${cy + 6} ${cx + 4},${cy}`}
      fill="none" stroke="#134e4a" strokeWidth="1" />
  </>
);

const Peacock = ({ cx, cy }) => {
  const fanSpreads = [-32, -22, -12, 0, 12, 22, 32];
  return (
    <>
      {fanSpreads.map((dx, i) => (
        <g key={i}>
          <line x1={cx} y1={cy + 4} x2={cx + dx} y2={cy + 26}
            stroke={C.green} strokeWidth="1.3" opacity="0.7" />
          <ellipse cx={cx + dx} cy={cy + 28} rx="4.5" ry="6.5"
            fill={C.blue} opacity="0.45" />
          <circle cx={cx + dx} cy={cy + 27} r="2.2" fill={C.yellow} />
        </g>
      ))}
      <ellipse cx={cx} cy={cy + 4} rx="13" ry="10" fill={C.blue} opacity="0.8" />
      <ellipse cx={cx} cy={cy - 7} rx="5" ry="8" fill={C.green} opacity="0.9" />
      <circle cx={cx} cy={cy - 17} r="5" fill={C.blue} />
      {[-4, -1, 2].map((dx, i) => (
        <g key={i}>
          <line x1={cx + dx} y1={cy - 22} x2={cx + dx} y2={cy - 30}
            stroke={C.yellow} strokeWidth="1.5" />
          <circle cx={cx + dx} cy={cy - 31} r="2" fill={C.orange} />
        </g>
      ))}
    </>
  );
};

/* ── Horizontal top/bottom border ──────────────────────────────────── */
export const MadhubaniHBorder = ({ flip = false }) => (
  <div
    className={`w-full overflow-hidden flex-shrink-0 ${flip ? '' : ''}`}
    style={{
      height: 44,
      transform: flip ? 'scaleY(-1)' : 'none',
      userSelect: 'none',
      pointerEvents: 'none',
    }}
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 1440 88"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }}
    >
      {/* base */}
      <rect width="1440" height="88" fill={C.cream} />

      {/* top bands */}
      <rect y="0" width="1440" height="7" fill={C.red} />
      <rect y="7" width="1440" height="3.5" fill={C.orange} />
      <rect y="10.5" width="1440" height="2" fill={C.yellow} />

      {/* bottom bands */}
      <rect y="78.5" width="1440" height="2" fill={C.yellow} />
      <rect y="80.5" width="1440" height="3.5" fill={C.orange} />
      <rect y="84" width="1440" height="4" fill={C.red} />

      {/* top dot stripe */}
      {Array.from({ length: 80 }).map((_, i) => (
        <circle key={i} cx={i * 18 + 9} cy={19}
          r="2.8"
          fill={i % 3 === 0 ? C.red : i % 3 === 1 ? C.orange : C.green}
          opacity="0.75" />
      ))}

      {/* bottom dot stripe */}
      {Array.from({ length: 80 }).map((_, i) => (
        <circle key={i} cx={i * 18 + 9} cy={69}
          r="2.8"
          fill={i % 3 === 0 ? C.teal : i % 3 === 1 ? C.red : C.yellow}
          opacity="0.7" />
      ))}

      {/* diamond row (centre) */}
      {Array.from({ length: 38 }).map((_, i) => (
        <Diamond key={i} cx={i * 38 + 19} cy={44} r={10}
          stroke={i % 2 === 0 ? C.red : C.blue} />
      ))}

      {/* Lotus flowers */}
      {[80, 240, 400, 560, 720, 880, 1040, 1200, 1360].map((x, i) => (
        <Lotus key={i} cx={x} cy={44} r={12} />
      ))}

      {/* Peacocks */}
      {[160, 480, 800, 1120].map((x, i) => (
        <Peacock key={i} cx={x} cy={36} />
      ))}

      {/* Fish */}
      {[320, 640, 960, 1280].map((x, i) => (
        <Fish key={i} cx={x} cy={46} />
      ))}
    </svg>
  </div>
);

/* ── Vertical side strip ────────────────────────────────────────────── */
export const MadhubaniVBorder = ({ side = 'left' }) => (
  <div
    className="hidden xl:block fixed top-0 h-screen z-10 overflow-hidden flex-shrink-0"
    style={{
      width: 56,
      [side]: 0,
      top: 0,
      pointerEvents: 'none',
      userSelect: 'none',
    }}
    aria-hidden="true"
  >
    <svg
      width="56"
      height="100%"
      viewBox="0 0 56 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: side === 'right' ? 'scaleX(-1)' : 'none' }}
    >
      <rect width="56" height="900" fill={C.cream} />

      {/* left edge bands */}
      <rect x="0" width="6" height="900" fill={C.red} />
      <rect x="6" width="3" height="900" fill={C.orange} />
      <rect x="9" width="1.5" height="900" fill={C.yellow} />

      {/* right edge band */}
      <rect x="52" width="4" height="900" fill={C.red} opacity="0.3" />

      {/* diamond column */}
      {Array.from({ length: 24 }).map((_, i) => (
        <Diamond key={i} cx={28} cy={i * 38 + 19} r={9}
          stroke={i % 2 === 0 ? C.red : C.blue} />
      ))}

      {/* Lotus flowers */}
      {[80, 230, 380, 530, 680, 830].map((y, i) => (
        <Lotus key={i} cx={28} cy={y} r={11} />
      ))}

      {/* dot edge right side */}
      {Array.from({ length: 45 }).map((_, i) => (
        <circle key={i}
          cx={47}
          cy={i * 20 + 10}
          r="2.2"
          fill={i % 3 === 0 ? C.red : i % 3 === 1 ? C.orange : C.teal}
          opacity="0.65" />
      ))}

      {/* small triangles fill */}
      {Array.from({ length: 22 }).map((_, i) => (
        <polygon key={i}
          points={`14,${i * 40 + 14} 22,${i * 40 + 30} 6,${i * 40 + 30}`}
          fill={i % 2 === 0 ? C.yellow : C.orange} opacity="0.45" />
      ))}
    </svg>
  </div>
);

/* ── Full page wrapper used in App.jsx ─────────────────────────────── */
const MadhubaniLayout = ({ children }) => (
  <div className="relative min-h-screen flex flex-col overflow-x-hidden">
    {/* Fixed side strips — only on xl screens */}
    <MadhubaniVBorder side="left" />
    <MadhubaniVBorder side="right" />

    {/* Top border */}
    <MadhubaniHBorder />

    {/* Page content — offset for side borders only on xl */}
    <div className="flex-1 xl:px-14">
      {children}
    </div>

    {/* Bottom border */}
    <MadhubaniHBorder flip />
  </div>
);

export default MadhubaniLayout;
