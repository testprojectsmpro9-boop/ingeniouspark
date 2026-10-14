const KEYFRAMES = `
  @keyframes twinkle {
    0%,100% { opacity:.18; transform:scale(.85); }
    50%     { opacity:.88; transform:scale(1.12); }
  }
  @keyframes nebulapulse {
    0%,100% { opacity:.14; }
    50%     { opacity:.26; }
  }
  @keyframes shoot1 {
    0%       { opacity:0;   transform:rotate(-35deg) translateX(0); }
    4%       { opacity:.82; }
    18%      { opacity:0;   transform:rotate(-35deg) translateX(-240px); }
    20%,100% { opacity:0;   transform:rotate(-35deg) translateX(0); }
  }
  @keyframes shoot2 {
    0%       { opacity:0;   transform:rotate(-30deg) translateX(0); }
    4%       { opacity:.75; }
    18%      { opacity:0;   transform:rotate(-30deg) translateX(-200px); }
    20%,100% { opacity:0;   transform:rotate(-30deg) translateX(0); }
  }
  @keyframes shoot3 {
    0%       { opacity:0;   transform:rotate(-38deg) translateX(0); }
    4%       { opacity:.70; }
    18%      { opacity:0;   transform:rotate(-38deg) translateX(-275px); }
    20%,100% { opacity:0;   transform:rotate(-38deg) translateX(0); }
  }
`;

function seed(n: number): number {
  return ((n * 2654435761) >>> 0) / 4294967295;
}

// Static star positions — computed once at module load
// First 32: biased right (behind globe); next 26: full spread; last 20: right-ish
const STARS = Array.from({ length: 78 }, (_, i) => ({
  x: i < 32
    ? 48 + seed(i * 3 + 1) * 49
    : i < 58
    ? 4  + seed(i * 7 + 2) * 88
    : 52 + seed(i * 11 + 3) * 43,
  y: seed(i * 13 + 5) * 95,
  size: i % 18 === 0 ? 4 : i % 6 === 0 ? 2.5 : 1.5,
  dur: 2.5 + seed(i * 17) * 3.5,
  delay: seed(i * 19 + 7) * 6.5,
}));

const SHOOTERS = [
  { x: 74, y: 6,  dur: 11, delay: 0.8,  anim: "shoot1" },
  { x: 82, y: 22, dur: 9,  delay: 5.2,  anim: "shoot2" },
  { x: 64, y: 14, dur: 13, delay: 10.5, anim: "shoot3" },
];

export default function HeroGalaxyBackground({ prefersReducedMotion }: { prefersReducedMotion: boolean | null }) {
  const rm = !!prefersReducedMotion;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <style>{KEYFRAMES}</style>

      {/* Center-right radial deepening — draws eye toward globe */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 80% 60% at 72% 48%, #0d2840 0%, transparent 65%)" }}
      />

      {/* Cyan/indigo nebula haze — globe side */}
      <div
        className="absolute"
        style={{
          right: "-8%",
          top: "8%",
          width: "58%",
          height: "80%",
          background: "radial-gradient(ellipse at 55% 50%, rgba(10,58,92,0.55) 0%, rgba(6,40,64,0.28) 40%, transparent 70%)",
          filter: "blur(2px)",
          animation: rm ? "none" : "nebulapulse 9s ease-in-out infinite",
        }}
      />

      {/* Globe-side soft cyan glow ring */}
      <div
        className="absolute"
        style={{
          right: "6%",
          top: "22%",
          width: "40%",
          height: "55%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.09) 0%, rgba(6,182,212,0.04) 45%, transparent 70%)",
          filter: "blur(28px)",
        }}
      />

      {/* Edge vignette — keeps edges dark and premium */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 110% 100% at 50% 50%, transparent 48%, rgba(1,11,21,0.72) 100%)" }}
      />

      {/* Star field */}
      {STARS.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${s.x.toFixed(2)}%`,
            top: `${s.y.toFixed(2)}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: "50%",
            background: "#ffffff",
            boxShadow: s.size >= 4 ? "0 0 8px rgba(191,215,234,0.45)" : undefined,
            animation: rm
              ? "none"
              : `twinkle ${s.dur.toFixed(2)}s ease-in-out ${s.delay.toFixed(2)}s infinite backwards`,
          }}
        />
      ))}

      {/* Shooting stars — rare, elegant, upper-right area */}
      {!rm && SHOOTERS.map((sh, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${sh.x}%`,
            top: `${sh.y}%`,
            width: "110px",
            height: "1px",
            background: "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.85) 50%, rgba(200,235,255,0.5) 80%, transparent 100%)",
            animation: `${sh.anim} ${sh.dur}s ease-out ${sh.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
