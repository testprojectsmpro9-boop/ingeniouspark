import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Download,
  IdCard,
  Lightbulb,
  Search,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE } from "../types";
import { SubmissionWebGL } from "./SubmissionWebGL";
import PublicSiteHeader from "../components/PublicSiteHeader";
import MobileBackButton from "../components/MobileBackButton";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ────────────────────────────────────────────────────────

const ctas = [
  { href: "/submit-idea",      label: "Submit Your Idea",     Icon: Lightbulb, primary: true,  download: false },
  { href: "/track-idea",       label: "Track My Idea",        Icon: Search,    primary: false, download: false },
  { href: "/offline-form.pdf", label: "Download Offline Form", Icon: Download, primary: false, download: true  },
  { href: "/who-can-apply",    label: "Who Can Apply",        Icon: IdCard,    primary: false, download: false },
] as const;

// ─── CSS keyframes ───────────────────────────────────────────────

const FILM_STYLES = `
  @keyframes rectGlow {
    0%,100% { box-shadow: 0 0 50px rgba(212,160,23,0.12), 0 0 0 rgba(212,160,23,0); }
    50%      { box-shadow: 0 0 110px rgba(212,160,23,0.28), 0 0 180px rgba(212,160,23,0.08); }
  }
  @keyframes filmFloat {
    0%,100% { transform: translateY(0px);   opacity: var(--dot-o, 0.10); }
    50%      { transform: translateY(-16px); opacity: calc(var(--dot-o, 0.10) * 1.5); }
  }
  @keyframes filmGlowBreath {
    0%,100% { opacity: 0.07; transform: scale(1);    }
    50%      { opacity: 0.14; transform: scale(1.04); }
  }
  @keyframes filmDrift1 {
    0%,100% { transform: translate(0, 0);       opacity: 0.14; }
    50%      { transform: translate(22px, 16px); opacity: 0.22; }
  }
  @keyframes filmDrift2 {
    0%,100% { transform: translate(0, 0);        opacity: 0.12; }
    50%      { transform: translate(-20px,-12px); opacity: 0.20; }
  }
  @keyframes filmDrift3 {
    0%,100% { transform: translate(0, 0);      opacity: 0.13; }
    50%      { transform: translate(14px,-22px); opacity: 0.21; }
  }
  @keyframes scanPulse {
    0%   { transform: translateY(-8px);  opacity: 0;    }
    8%   { opacity: 0.38; }
    92%  { opacity: 0.38; }
    100% { transform: translateY(500px); opacity: 0;    }
  }
  @keyframes docBreath {
    0%,100% { opacity: 0.17; transform: scale(1);    }
    50%      { opacity: 0.24; transform: scale(1.02); }
  }
  .film-rect-glow { animation: rectGlow 3s ease-in-out infinite; }
`;

// ─── SVG Companions ──────────────────────────────────────────────

const C = "rgba(212,160,23,0.85)";
const CF = "rgba(212,160,23,0.12)";
const nsProps = { vectorEffect: "non-scaling-stroke" as const };

function SvgDocSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 100" fill="none" className={className} aria-hidden="true">
      <path d="M6 6 L58 6 L74 22 L74 94 L6 94 Z" stroke={C} strokeWidth="1.2" fill={CF} {...nsProps}/>
      <path d="M58 6 L58 22 L74 22"               stroke={C} strokeWidth="1.2" fill="none" {...nsProps}/>
      {[34,44,54,64,74,82].map(y => (
        <line key={y} x1="14" y1={y} x2="66" y2={y} stroke={C} strokeWidth="0.7" strokeOpacity="0.55" {...nsProps}/>
      ))}
    </svg>
  );
}

function SvgBrowser({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 75" fill="none" className={className} aria-hidden="true">
      <rect x="2" y="2" width="96" height="71" rx="3"  stroke={C} strokeWidth="1.1" fill={CF} {...nsProps}/>
      <rect x="2" y="2" width="96" height="14" rx="3"  stroke="none" fill="rgba(212,160,23,0.10)"/>
      <line x1="2" y1="16" x2="98" y2="16" stroke={C} strokeWidth="0.5" strokeOpacity="0.5" {...nsProps}/>
      {[8,15,22].map((cx,i) => (
        <circle key={i} cx={cx} cy="9" r="2.5" stroke={C} strokeWidth="0.8" fill="none" {...nsProps}/>
      ))}
      <rect x="30" y="6" width="48" height="6" rx="1.5" stroke={C} strokeWidth="0.6" strokeOpacity="0.5" {...nsProps}/>
      {[24,34,44,54].map((y, i) => (
        <rect key={y} x="8" y={y} width={i===3?32:60} height="5" rx="1" stroke={C} strokeWidth="0.7" strokeOpacity="0.65" {...nsProps}/>
      ))}
      <rect x="8" y="62" width="22" height="8" rx="2" stroke={C} strokeWidth="0.7" fill="rgba(212,160,23,0.18)" {...nsProps}/>
    </svg>
  );
}

function SvgFoldedDoc({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 75 95" fill="none" className={className} aria-hidden="true">
      <path d="M5 5 L55 5 L70 20 L70 90 L5 90 Z" stroke={C} strokeWidth="1.2" fill={CF} {...nsProps}/>
      <path d="M55 5 L55 20 L70 20"               stroke={C} strokeWidth="1.2" fill="rgba(212,160,23,0.18)" {...nsProps}/>
      {[32,42,52,62,72,80].map(y => (
        <line key={y} x1="14" y1={y} x2="62" y2={y} stroke={C} strokeWidth="0.7" strokeOpacity="0.55" {...nsProps}/>
      ))}
      <text x="14" y="26" fill={C} fontSize="6" fontWeight="700" fontFamily="monospace" opacity="0.7">PDF</text>
    </svg>
  );
}

function SvgPaper({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 75 95" fill="none" className={className} aria-hidden="true">
      <rect x="4" y="4" width="67" height="87" stroke={C} strokeWidth="1.2" fill={CF} {...nsProps}/>
      <line x1="16" y1="4" x2="16" y2="91" stroke={C} strokeWidth="0.6" strokeOpacity="0.4" {...nsProps}/>
      {Array.from({length:11},(_,i)=>20+i*7).map(y => (
        <line key={y} x1="20" y1={y} x2="68" y2={y} stroke={C} strokeWidth="0.6" strokeOpacity="0.55" {...nsProps}/>
      ))}
    </svg>
  );
}

function SvgSketch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 80" fill="none" className={className} aria-hidden="true">
      <path d="M10 65 Q28 20 50 45 T90 30"       stroke={C} strokeWidth="1.4" strokeLinecap="round" {...nsProps}/>
      <path d="M8 72 Q35 55 60 68 T92 58"         stroke={C} strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.6" {...nsProps}/>
      <path d="M20 18 Q40 10 55 25 Q65 35 50 50" stroke={C} strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.45" {...nsProps}/>
      <circle cx="50" cy="46" r="6" stroke={C} strokeWidth="0.8" strokeOpacity="0.45" {...nsProps}/>
      <line x1="5"  y1="75" x2="95" y2="75" stroke={C} strokeWidth="0.4" strokeOpacity="0.25" strokeDasharray="3 4" {...nsProps}/>
      <line x1="50" y1="5"  x2="50" y2="75" stroke={C} strokeWidth="0.4" strokeOpacity="0.22" strokeDasharray="3 4" {...nsProps}/>
    </svg>
  );
}

function SvgPhotoFrame({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 90" fill="none" className={className} aria-hidden="true">
      <rect x="4"  y="4"  width="92" height="82" stroke={C} strokeWidth="1.5" fill={CF} {...nsProps}/>
      <rect x="14" y="13" width="72" height="64" stroke={C} strokeWidth="0.7" strokeOpacity="0.55" {...nsProps}/>
      <line x1="38" y1="13" x2="38" y2="77" stroke={C} strokeWidth="0.4" strokeOpacity="0.35" {...nsProps}/>
      <line x1="62" y1="13" x2="62" y2="77" stroke={C} strokeWidth="0.4" strokeOpacity="0.35" {...nsProps}/>
      <line x1="14" y1="35" x2="86" y2="35" stroke={C} strokeWidth="0.4" strokeOpacity="0.35" {...nsProps}/>
      <line x1="14" y1="55" x2="86" y2="55" stroke={C} strokeWidth="0.4" strokeOpacity="0.35" {...nsProps}/>
      <circle cx="50" cy="45" r="6" stroke={C} strokeWidth="0.9" strokeOpacity="0.7" {...nsProps}/>
      <circle cx="50" cy="45" r="2" fill={C} opacity="0.5"/>
      {[[14,13],[86,13],[14,77],[86,77]].map(([x,y],i) => {
        const dx = i<2?6:-6, dy = i%2===0?6:-6;
        return <g key={i}>
          <line x1={x} y1={y} x2={x+dx} y2={y}  stroke={C} strokeWidth="1.1" strokeOpacity="0.8" {...nsProps}/>
          <line x1={x} y1={y} x2={x}    y2={y+dy} stroke={C} strokeWidth="1.1" strokeOpacity="0.8" {...nsProps}/>
        </g>;
      })}
    </svg>
  );
}

function SvgWaveFilm({ className }: { className?: string }) {
  const bars = [28,42,58,35,65,48,72,38,55,44,62,30];
  return (
    <svg viewBox="0 0 120 80" fill="none" className={className} aria-hidden="true">
      {bars.map((h,i) => (
        <rect key={i} x={4+i*4.8} y={(80-h)/2} width="3" height={h}
              rx="1.5" fill={C} opacity={0.55+i*0.01} {...nsProps}/>
      ))}
      <line x1="62" y1="4" x2="62" y2="76" stroke={C} strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="3 3" {...nsProps}/>
      <rect x="64" y="6" width="52" height="68" stroke={C} strokeWidth="1.1" fill={CF} {...nsProps}/>
      <rect x="64" y="6"  width="52" height="10" fill="rgba(212,160,23,0.14)"/>
      <rect x="64" y="64" width="52" height="10" fill="rgba(212,160,23,0.14)"/>
      {[68,76,84,92,100,108].map(x => (
        <g key={x}>
          <rect x={x-2} y={7}  width="4" height="8" rx="0.5" fill="rgba(0,14,44,0.9)" stroke={C} strokeWidth="0.4" {...nsProps}/>
          <rect x={x-2} y={65} width="4" height="8" rx="0.5" fill="rgba(0,14,44,0.9)" stroke={C} strokeWidth="0.4" {...nsProps}/>
        </g>
      ))}
      {[22,36,50].map(y => (
        <line key={y} x1="68" y1={y} x2="112" y2={y} stroke={C} strokeWidth="0.5" strokeOpacity="0.35" {...nsProps}/>
      ))}
    </svg>
  );
}

function SvgDesk({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 80" fill="none" className={className} aria-hidden="true">
      <rect x="10" y="58" width="80" height="6" rx="2" stroke={C} strokeWidth="1.1" fill={CF} {...nsProps}/>
      <line x1="10" y1="64" x2="10" y2="74" stroke={C} strokeWidth="0.8" strokeOpacity="0.5" {...nsProps}/>
      <line x1="90" y1="64" x2="90" y2="74" stroke={C} strokeWidth="0.8" strokeOpacity="0.5" {...nsProps}/>
      <path d="M32 28 Q50 12 68 28" stroke={C} strokeWidth="1.4" fill="none" strokeLinecap="round" {...nsProps}/>
      <rect x="27" y="27" width="8" height="12" rx="3" stroke={C} strokeWidth="1.1" fill={CF} {...nsProps}/>
      <rect x="65" y="27" width="8" height="12" rx="3" stroke={C} strokeWidth="1.1" fill={CF} {...nsProps}/>
      <path d="M69 34 Q74 38 70 44" stroke={C} strokeWidth="1" fill="none" strokeLinecap="round" {...nsProps}/>
      <circle cx="50" cy="42" r="5"   stroke={C} strokeWidth="1" fill={CF} {...nsProps}/>
      <path d="M38 58 Q50 50 62 58"   stroke={C} strokeWidth="1" fill="none" {...nsProps}/>
      <path d="M62 18 L78 18 L78 30 L70 30 L67 34 L67 30 L62 30 Z" stroke={C} strokeWidth="0.8" fill={CF} {...nsProps}/>
      <line x1="66" y1="23" x2="74" y2="23" stroke={C} strokeWidth="0.6" strokeOpacity="0.6" {...nsProps}/>
      <line x1="66" y1="27" x2="72" y2="27" stroke={C} strokeWidth="0.6" strokeOpacity="0.6" {...nsProps}/>
    </svg>
  );
}

function SvgIntakeForm({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 100" fill="none" className={className} aria-hidden="true">
      <rect x="4" y="4" width="72" height="92" stroke={C} strokeWidth="1.1" fill={CF} {...nsProps}/>
      <rect x="4" y="4" width="72" height="16" fill="rgba(212,160,23,0.14)"/>
      <text x="40" y="16" textAnchor="middle" fill={C} fontSize="6" fontWeight="800" letterSpacing="2"
        fontFamily="Plus Jakarta Sans,sans-serif" opacity="0.8">INTAKE FORM</text>
      {Array.from({length:9},(_,i)=>28+i*8).map(y => (
        <line key={y} x1="12" y1={y} x2="68" y2={y} stroke={C} strokeWidth="0.7" strokeOpacity="0.45" {...nsProps}/>
      ))}
      {Array.from({length:5},(_,i)=>28+i*8).map((y, i) => (
        <text key={y} x="12" y={y-2} fill={C} fontSize="4.5" opacity="0.4"
          fontFamily="Plus Jakarta Sans,sans-serif">
          {["Name","Title","Category","Description","Contact"][i]}
        </text>
      ))}
    </svg>
  );
}

function SvgReviewFrame({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 80" fill="none" className={className} aria-hidden="true">
      <path d="M8 40 Q50 5 92 40 Q50 75 8 40 Z" stroke={C} strokeWidth="1.3" fill={CF} {...nsProps}/>
      <circle cx="50" cy="40" r="12" stroke={C} strokeWidth="1.1" fill="rgba(212,160,23,0.08)" {...nsProps}/>
      <circle cx="50" cy="40" r="5"  stroke={C} strokeWidth="0.8" fill="rgba(212,160,23,0.2)"  {...nsProps}/>
      {[28,36,44,52].map(y => (
        <line key={y} x1="20" y1={y} x2="80" y2={y} stroke={C} strokeWidth="0.5" strokeOpacity="0.28" {...nsProps}/>
      ))}
      <g stroke={C} strokeWidth="1.0" strokeOpacity="0.7">
        <polyline points="12,16 12,22 18,22" {...nsProps}/>
        <polyline points="88,16 88,22 82,22" {...nsProps}/>
        <polyline points="12,64 12,58 18,58" {...nsProps}/>
        <polyline points="88,64 88,58 82,58" {...nsProps}/>
      </g>
    </svg>
  );
}

function SvgOutcome({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 90" fill="none" className={className} aria-hidden="true">
      <path d="M50 8 L80 20 L80 52 Q80 72 50 82 Q20 72 20 52 L20 20 Z"
            stroke={C} strokeWidth="1.3" fill={CF} {...nsProps}/>
      <path d="M50 18 L70 28 L70 50 Q70 64 50 72 Q30 64 30 50 L30 28 Z"
            stroke={C} strokeWidth="0.7" strokeOpacity="0.5" fill="none" {...nsProps}/>
      <polyline points="36,48 46,58 64,36" stroke={C} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...nsProps}/>
      {[14,10,6].map((r,i) => (
        <path key={i} d={`M${50-r*3.5},${85+i*5} Q50,${72+i*5} ${50+r*3.5},${85+i*5}`}
              stroke={C} strokeWidth="0.6" strokeOpacity={0.35-i*0.08} fill="none" {...nsProps}/>
      ))}
    </svg>
  );
}

function DocMarks({ opacity = 0.2 }: { opacity?: number }) {
  const s = 16;
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity }} viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline points={`${s},4 4,4 4,${s}`}         fill="none" stroke="rgba(212,160,23,0.9)" strokeWidth="0.8" vectorEffect="non-scaling-stroke"/>
      <polyline points={`${100-s},4 96,4 96,${s}`}   fill="none" stroke="rgba(212,160,23,0.9)" strokeWidth="0.8" vectorEffect="non-scaling-stroke"/>
      <polyline points={`${s},96 4,96 4,${100-s}`}   fill="none" stroke="rgba(212,160,23,0.9)" strokeWidth="0.8" vectorEffect="non-scaling-stroke"/>
      <polyline points={`${100-s},96 96,96 96,${100-s}`} fill="none" stroke="rgba(212,160,23,0.9)" strokeWidth="0.8" vectorEffect="non-scaling-stroke"/>
    </svg>
  );
}

function SealSVG() {
  return (
    <svg width="130" height="130" viewBox="0 0 130 130" aria-hidden="true">
      <circle cx="65" cy="65" r="60" fill="none" stroke="rgba(212,160,23,0.2)"  strokeWidth="0.6" strokeDasharray="3 5"/>
      <circle cx="65" cy="65" r="54" fill="none" stroke="rgba(212,160,23,0.55)" strokeWidth="1.5"/>
      <circle cx="65" cy="65" r="47" fill="none" stroke="rgba(212,160,23,0.22)" strokeWidth="0.8"/>
      <text x="65" y="57" textAnchor="middle" fill="rgba(212,160,23,0.95)" fontSize="13" fontWeight="800"
        letterSpacing="5" fontFamily="Plus Jakarta Sans, sans-serif">NMF</text>
      <line x1="35" y1="64" x2="95" y2="64" stroke="rgba(212,160,23,0.28)" strokeWidth="0.7"/>
      <text x="65" y="77" textAnchor="middle" fill="rgba(212,160,23,0.75)" fontSize="8.5" fontWeight="700"
        letterSpacing="4" fontFamily="Plus Jakarta Sans, sans-serif">INTAKE</text>
      <text x="65" y="89" textAnchor="middle" fill="rgba(212,160,23,0.6)" fontSize="7" fontWeight="700"
        letterSpacing="3" fontFamily="Plus Jakarta Sans, sans-serif">SYSTEM</text>
      <circle cx="65" cy="101" r="1.5" fill="rgba(212,160,23,0.4)"/>
      <circle cx="59" cy="101" r="1"   fill="rgba(212,160,23,0.25)"/>
      <circle cx="71" cy="101" r="1"   fill="rgba(212,160,23,0.25)"/>
    </svg>
  );
}

function AmbientDots() {
  const dots = [
    { left:"14%", top:"22%", size:3, delay:0,   dur:7   },
    { left:"82%", top:"16%", size:2, delay:1.2, dur:5.5  },
    { left:"8%",  top:"68%", size:2, delay:2.8, dur:6.2  },
    { left:"88%", top:"72%", size:3, delay:0.7, dur:8    },
    { left:"50%", top:"10%", size:2, delay:4.1, dur:5    },
    { left:"72%", top:"48%", size:2, delay:1.9, dur:7.3  },
  ];
  return (
    <>
      {dots.map((d,i) => (
        <span key={i} aria-hidden="true"
          className="pointer-events-none absolute rounded-full bg-[#D4A017]"
          style={{ left:d.left, top:d.top, width:d.size, height:d.size,
                   ["--dot-o" as string]:"0.10",
                   animation:`filmFloat ${d.dur}s ease-in-out ${d.delay}s infinite` }}/>
      ))}
    </>
  );
}

function FilmProgress({ active }: { active: number }) {
  return (
    <div aria-hidden="true"
      className="fixed right-5 top-1/2 z-40 -translate-y-1/2 flex flex-col gap-3">
      {Array.from({length:5}).map((_,i) => (
        <span key={i} className="block rounded-full transition-all duration-500"
          style={{ width: active===i?4:3, height: active===i?4:3,
                   background: active===i?"rgba(212,160,23,0.9)":"rgba(255,255,255,0.2)" }}/>
      ))}
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────

function CompanionBg({ children, size = "min(42vw,370px)" }: { children: ReactNode; size?: string }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: size, height: size, opacity: 0.90 }}>
      {children}
    </div>
  );
}

// ─── Desktop Film ─────────────────────────────────────────────────────────

function Ch2DocumentPaths() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
      fill="none"
    >
      <g stroke="rgba(212,160,23,0.16)" strokeWidth="0.16" strokeLinecap="round" opacity="0.72">
        <path d="M13 34 C28 42 35 50 48 58"/>
        <path d="M22 75 C34 68 40 63 49 58"/>
        <path d="M86 43 C72 47 62 52 51 58"/>
        <path d="M76 70 C66 65 59 61 51 58"/>
      </g>
    </svg>
  );
}

function DesktopFilm({
  setHeaderFaded,
  setActiveChapter,
  webglRef,
}: {
  setHeaderFaded: (v: boolean) => void;
  setActiveChapter: (n: number) => void;
  webglRef: React.RefObject<SubmissionWebGL | null>;
}) {
  const filmRef = useRef<HTMLDivElement>(null);
  const ch0Ref  = useRef<HTMLDivElement>(null);
  const ch1Ref  = useRef<HTMLDivElement>(null);
  const ch2Ref  = useRef<HTMLDivElement>(null);
  const ch3Ref  = useRef<HTMLDivElement>(null);
  const ch4Ref  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const vh = () => window.innerHeight;
    const wgl = () => webglRef.current;

    const ctx = gsap.context(() => {

      // ── Ch 0 ───────────────────────────────────────────────────
      const tl0 = gsap.timeline({
        scrollTrigger: {
          trigger: ch0Ref.current, start: "top top",
          end: () => `+=${vh()*1.2}`, pin: true, scrub: 1.0,
          pinSpacing: true, invalidateOnRefresh: true,
          onEnter:     () => { setHeaderFaded(true);  setActiveChapter(0); wgl()?.setChapter(0); },
          onLeaveBack: () => { setHeaderFaded(false); setActiveChapter(-1); wgl()?.setChapter(-1); },
          onUpdate:    (self) => { wgl()?.setChapterProgress(0, self.progress); },
        },
      });
      tl0
        .fromTo(".c0-t1",  { opacity:0, y:7 }, { opacity:1, y:0, duration:0.22, ease:"power2.out" })
        .to(".c0-t1",      { opacity:1, duration:0.10 })
        .to(".c0-t1",      { opacity:0, y:-5, duration:0.18 })
        .fromTo(".c0-t2",  { opacity:0, y:7 }, { opacity:1, y:0, duration:0.20, ease:"power2.out" }, "-=0.14")
        .to(".c0-t2",      { opacity:1, duration:0.10 })
        .fromTo(".c0-t3",  { opacity:0, y:5 }, { opacity:1, y:0, duration:0.18, ease:"power2.out" }, "-=0.08")
        .to(".c0-t2",      { opacity:0, duration:0.16 }, "-=0.14")
        .to(".c0-hint",    { opacity:0, duration:0.06 }, 0.01);

      // ── Ch 1 ───────────────────────────────────────────────────
      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: ch1Ref.current, start: "top top",
          end: () => `+=${vh()*1.8}`, pin: true, scrub: 1.0,
          pinSpacing: true, invalidateOnRefresh: true,
          onEnter:     () => { setActiveChapter(1); wgl()?.setChapter(1); },
          onLeaveBack: () => { setActiveChapter(0); wgl()?.setChapter(0); },
          onUpdate:    (self) => { wgl()?.setChapterProgress(1, self.progress); },
        },
      });
      tl1.fromTo(".c1-q",     { opacity:0, y:5 }, { opacity:1, y:0, duration:0.05 })
         .to(".c1-q",         { opacity:0, duration:0.04 }, 0.06);
      const FMT_SPAN = 0.09, FMT_IN = 0.03, FMT_OUT = 0.03;
      const numFormats = 7;
      for (let i = 0; i < numFormats; i++) {
        const start  = 0.06 + i * FMT_SPAN;
        const fadeAt = start + FMT_IN + (FMT_SPAN - FMT_IN - FMT_OUT);
        tl1.fromTo(`.c1-f${i}`, { opacity:0, y:8  }, { opacity:1, y:0,  duration:FMT_IN  }, start)
           .to(`.c1-f${i}`,     { opacity:0, y:-5, duration:FMT_OUT }, fadeAt);
      }
      const pivotAt = 0.06 + numFormats * FMT_SPAN + 0.02;
      tl1.fromTo(".c1-pivot",  { opacity:0, y:8 }, { opacity:1, y:0, duration:0.09 }, pivotAt);

      // ── Ch 2 ───────────────────────────────────────────────────
      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: ch2Ref.current, start: "top top",
          end: () => `+=${vh()*1.0}`, pin: true, scrub: 1.0,
          pinSpacing: true, invalidateOnRefresh: true,
          onEnter:     () => { setActiveChapter(2); wgl()?.setChapter(2); },
          onLeaveBack: () => { setActiveChapter(1); wgl()?.setChapter(1); },
          onUpdate:    (self) => { wgl()?.setChapterProgress(2, self.progress); },
        },
      });
      tl2
        .fromTo(".c2-headline", { opacity:0, y:7 }, { opacity:1, y:0, duration:0.24, ease:"power2.out" })
        .fromTo(".c2-sub",      { opacity:0, y:5 }, { opacity:1, y:0, duration:0.18 }, 0.42);

      // ── Ch 3 ───────────────────────────────────────────────────
      const tl3 = gsap.timeline({
        scrollTrigger: {
          trigger: ch3Ref.current, start: "top top",
          end: () => `+=${vh()*1.0}`, pin: true, scrub: 1.0,
          pinSpacing: true, invalidateOnRefresh: true,
          onEnter:     () => { setActiveChapter(3); wgl()?.setChapter(3); },
          onLeaveBack: () => { setActiveChapter(2); wgl()?.setChapter(2); },
          onUpdate:    (self) => { wgl()?.setChapterProgress(3, self.progress); },
        },
      });
      tl3
        .fromTo(".c3-id",  { opacity:0, y:6 }, { opacity:1, y:0, duration:0.18 })
        .fromTo(".c3-sub", { opacity:0, y:4 }, { opacity:1, y:0, duration:0.14 }, 0.14);

      // ── Ch 4 ───────────────────────────────────────────────────
      const tl4 = gsap.timeline({
        scrollTrigger: {
          trigger: ch4Ref.current, start: "top top",
          end: () => `+=${vh()*1.2}`, pin: true, scrub: 1.0,
          pinSpacing: true, invalidateOnRefresh: true,
          onEnter:      () => { setActiveChapter(4); wgl()?.setChapter(4); },
          onLeaveBack:  () => { setActiveChapter(3); wgl()?.setChapter(3); },
          onLeave:      () => { setHeaderFaded(false); setActiveChapter(-1); wgl()?.setChapter(5); },
          onEnterBack:  () => { setHeaderFaded(true);  setActiveChapter(4); wgl()?.setChapter(4); },
          onUpdate:     (self) => { wgl()?.setChapterProgress(4, self.progress); },
        },
      });
      tl4
        .fromTo(".c4-g1",  { opacity:0, y:10 }, { opacity:1, y:0, duration:0.22 }, 0.00)
        .fromTo(".c4-g2",  { opacity:0, y:10 }, { opacity:1, y:0, duration:0.22 }, 0.26)
        .fromTo(".c4-g3",  { opacity:0, y:10 }, { opacity:1, y:0, duration:0.22 }, 0.52)
        .fromTo(".c4-sub", { opacity:0, y:6  }, { opacity:1, y:0, duration:0.18 }, 0.76);

    }, filmRef);
    return () => ctx.revert();
  }, [setHeaderFaded, setActiveChapter, webglRef]);

  const fmtCompanions = [
    <SvgBrowser    key={0} className="h-full w-full"/>,
    <SvgFoldedDoc  key={1} className="h-full w-full"/>,
    <SvgPaper      key={2} className="h-full w-full"/>,
    <SvgSketch     key={3} className="h-full w-full"/>,
    <SvgPhotoFrame key={4} className="h-full w-full"/>,
    <SvgWaveFilm   key={5} className="h-full w-full"/>,
    <SvgDesk       key={6} className="h-full w-full"/>,
  ];

  const fmtSentences = [
    "Is it a form you fill online?",
    "Is it words on paper?",
    "Is it a sketch?",
    "Is it your voice?",
    "Is it a video?",
    "Is it a photograph of what you built?",
    "Is it something you need help filing?",
  ];

  return (
    <div ref={filmRef}>

      {/* ── Chapter 0 ── */}
      <div ref={ch0Ref} className="relative h-screen overflow-hidden bg-transparent">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0"
          style={{ background:"radial-gradient(ellipse 62% 58% at 50% 52%, rgba(212,160,23,0.10) 0%, transparent 65%)",
                   animation:"filmGlowBreath 5s ease-in-out infinite" }}/>
        <div aria-hidden="true"
          className="pointer-events-none absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width:"min(38vw,320px)", height:"min(48vw,400px)",
                   opacity:0.18, animation:"docBreath 6s ease-in-out infinite" }}>
          <SvgDocSilhouette className="h-full w-full"/>
        </div>
        <AmbientDots/>

        <p className="c0-t1 absolute inset-0 z-10 flex items-center justify-center px-8 text-center
                       text-[clamp(2rem,7vw,6rem)] font-black leading-[1.05] tracking-tight text-white"
          style={{ opacity:0 }}>You have an idea.</p>

        <p className="c0-t2 absolute inset-0 z-10 flex items-center justify-center px-8 text-center
                       text-[clamp(2rem,7vw,6rem)] font-black leading-[1.05] tracking-tight text-white"
          style={{ opacity:0 }}>It exists.</p>

        <div className="c0-t3 absolute inset-0 z-10 flex flex-col items-center justify-center px-8 text-center"
          style={{ opacity:0 }}>
          <p className="text-[clamp(2rem,6.5vw,5.5rem)] font-black leading-[1.05] tracking-tight text-white">
            It exists.
          </p>
          <p className="mt-4 text-base font-semibold text-white/45">That's enough to begin.</p>
        </div>

        <p aria-hidden="true"
          className="c0-hint absolute bottom-8 left-0 right-0 z-10 text-center text-[10px] font-black uppercase tracking-[0.22em] text-white/22">
          ↓ scroll
        </p>
      </div>

      {/* ── Chapter 1 ── */}
      <div ref={ch1Ref} className="relative h-screen overflow-hidden bg-transparent">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0"
          style={{ background:"radial-gradient(ellipse 50% 45% at 50% 50%, rgba(212,160,23,0.06) 0%, transparent 60%)" }}/>
        <p className="c1-q absolute left-0 right-0 top-[37%] z-10 text-center
                       text-[10px] font-black uppercase tracking-[0.22em] text-[#D4A017]/60"
          style={{ opacity:0 }}>
          What shape is your idea?
        </p>

        {fmtSentences.map((sentence, i) => (
          <div key={i}
            className={`c1-f${i} absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 px-8 text-center`}
            style={{ opacity:0 }}>
            <CompanionBg size={i===5?"min(52vw,460px)":"min(42vw,370px)"}>
              {fmtCompanions[i]}
            </CompanionBg>
            <p className="relative z-10 text-[clamp(1.9rem,5vw,4.2rem)] font-black leading-[1.1] tracking-tight text-white">
              {sentence}
            </p>
          </div>
        ))}

        <div className="c1-pivot absolute inset-0 z-10 flex items-center justify-center px-8 text-center"
          style={{ opacity:0 }}>
          <div aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width:"min(40vw,340px)", height:"min(50vw,420px)", opacity:0.16 }}>
            <SvgDocSilhouette className="h-full w-full"/>
          </div>
          <p className="relative z-10 text-[clamp(2.2rem,7.5vw,7rem)] font-black leading-[1.02] tracking-tighter text-white">
            It doesn't matter.
          </p>
        </div>
      </div>

      {/* ── Chapter 2 ── */}
      {/* 3D chest model: Wooden Chest Rigged by OozyArtist, CC Attribution */}
      <div ref={ch2Ref} className="relative h-screen overflow-hidden bg-transparent">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0"
          style={{ background:"radial-gradient(ellipse 70% 65% at 50% 58%, rgba(212,160,23,0.09) 0%, transparent 58%)" }}/>
        <Ch2DocumentPaths/>
        <div aria-hidden="true" className="pointer-events-none absolute left-[18%] top-[30%] z-10"
          style={{ width:70, height:88, opacity:0.72, filter:"drop-shadow(0 0 14px rgba(212,160,23,0.22))", animation:"filmDrift1 6s ease-in-out 0s infinite" }}>
          <SvgFoldedDoc className="h-full w-full"/>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute right-[17%] top-[45%] z-10"
          style={{ width:78, height:65, opacity:0.74, filter:"drop-shadow(0 0 14px rgba(212,160,23,0.20))", animation:"filmDrift2 7s ease-in-out 1.4s infinite" }}>
          <SvgWaveFilm className="h-full w-full"/>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute left-[22%] bottom-[24%] z-10"
          style={{ width:64, height:64, opacity:0.70, filter:"drop-shadow(0 0 12px rgba(212,160,23,0.20))", animation:"filmDrift3 5.5s ease-in-out 2.1s infinite" }}>
          <SvgSketch className="h-full w-full"/>
        </div>

        <div className="absolute inset-0 z-10 px-8">
          <p className="c2-headline absolute left-1/2 top-[15%] max-w-2xl -translate-x-1/2 text-center text-[clamp(2rem,4.5vw,3.8rem)] font-black leading-[1.1] tracking-tight text-white"
            style={{ opacity:0 }}>
            Every format enters<br/>the same door.
          </p>
          <p className="c2-sub absolute bottom-[10%] left-0 right-0 text-center text-sm font-semibold tracking-wide text-white/38"
            style={{ opacity:0 }}>
            One system.&ensp;One record.&ensp;One identity.
          </p>
        </div>
      </div>

      {/* ── Chapter 3 ── */}
      <div ref={ch3Ref} className="relative h-screen overflow-hidden bg-transparent">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0"
          style={{ background:"radial-gradient(ellipse 55% 55% at 50% 46%, rgba(212,160,23,0.10) 0%, transparent 56%)" }}/>

        <div aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width:320, height:320, opacity:0.22, filter:"drop-shadow(0 0 20px rgba(212,160,23,0.20))" }}>
          <SealSVG/>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
          <p className="c3-id font-mono text-[clamp(1.3rem,3vw,2.4rem)] font-black tracking-[0.16em] text-[#D4A017]"
            style={{ opacity:0 }}>
            NMF-2025-XXXXXX
          </p>
          <p className="c3-sub text-sm font-semibold text-white/40"
            style={{ opacity:0 }}>
            Every submission receives one. Instantly. No account required.
          </p>
        </div>
      </div>

      {/* ── Chapter 4 ── */}
      <div ref={ch4Ref} className="relative h-screen overflow-hidden bg-transparent">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0"
          style={{ background:"radial-gradient(ellipse 55% 50% at 50% 52%, rgba(212,160,23,0.06) 0%, transparent 58%)" }}/>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0 px-8 text-center">

          <div className="c4-g1 relative" style={{ opacity:0 }}>
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width:"min(32vw,280px)", height:"min(40vw,340px)", opacity:0.18 }}>
              <SvgIntakeForm className="h-full w-full"/>
            </div>
            <p className="relative text-[clamp(2.6rem,10vw,9.5rem)] font-black leading-[0.95] tracking-tight text-[#c8840a]/35">
              INTAKE
            </p>
          </div>

          <div className="c4-g2 relative" style={{ opacity:0 }}>
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width:"min(38vw,320px)", height:"min(30vw,260px)", opacity:0.18 }}>
              <SvgReviewFrame className="h-full w-full"/>
            </div>
            <p className="relative text-[clamp(2.6rem,10vw,9.5rem)] font-black leading-[0.95] tracking-tight text-[#4488cc]/35">
              REVIEW
            </p>
          </div>

          <div className="c4-g3 relative" style={{ opacity:0 }}>
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width:"min(34vw,290px)", height:"min(38vw,320px)", opacity:0.18 }}>
              <SvgOutcome className="h-full w-full"/>
            </div>
            <p className="relative text-[clamp(2.6rem,10vw,9.5rem)] font-black leading-[0.95] tracking-tight text-[#ffd055]/35">
              OUTCOME
            </p>
          </div>

          <p className="c4-sub mt-10 max-w-md text-sm font-semibold leading-7 text-white/38"
            style={{ opacity:0 }}>
            We reach you at every stage.<br/>Your idea never disappears into silence.
          </p>
        </div>
      </div>

    </div>
  );
}

// ─── Mobile Film ──────────────────────────────────────────────────────────────

function MobileFilm() {
  // Refresh ScrollTrigger after window load so whileInView/scroll triggers recalc
  // with final asset-loaded layout. Without this, on slower mobile connections the
  // first scene can fail to fire `whileInView` until the user scrolls a little.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 800);
    return () => {
      window.removeEventListener("load", refresh);
      clearTimeout(t);
    };
  }, []);

  const fmtSentences = [
    "Is it a form you fill online?",
    "Is it words on paper?",
    "Is it a sketch?",
    "Is it your voice?",
    "Is it a video?",
    "Is it a photograph of what you built?",
    "Is it something you need help filing?",
  ];
  const fmtCompanions = [
    <SvgBrowser    key={0} className="h-full w-full"/>,
    <SvgFoldedDoc  key={1} className="h-full w-full"/>,
    <SvgPaper      key={2} className="h-full w-full"/>,
    <SvgSketch     key={3} className="h-full w-full"/>,
    <SvgPhotoFrame key={4} className="h-full w-full"/>,
    <SvgWaveFilm   key={5} className="h-full w-full"/>,
    <SvgDesk       key={6} className="h-full w-full"/>,
  ];

  return (
    <div className="overflow-x-clip">
      <Scene>
        <p className="text-[clamp(2.2rem,11vw,4rem)] font-black leading-[1.05] tracking-tight text-white">
          You have an idea.
        </p>
      </Scene>
      <Scene>
        <p className="text-[clamp(2.2rem,11vw,4rem)] font-black leading-[1.05] tracking-tight text-white">
          It exists.
        </p>
        <p className="mt-3 text-base font-semibold text-white/45">That's enough to begin.</p>
      </Scene>

      <Scene align="left">
        <p className="mb-6 text-[10px] font-black uppercase tracking-[0.22em] text-[#D4A017]/65">
          What shape is your idea?
        </p>
        <div className="flex flex-col gap-6 w-full">
          {fmtSentences.map((sentence, i) => (
            <div key={i} className="relative flex items-center gap-4">
              <div aria-hidden="true" style={{ width:44, height:44, opacity:0.22, flexShrink:0 }}>
                {fmtCompanions[i]}
              </div>
              <p className="text-base font-bold text-white/80">{sentence}</p>
            </div>
          ))}
        </div>
      </Scene>

      <Scene>
        <p className="text-[clamp(2.2rem,11vw,4rem)] font-black leading-[1.02] tracking-tighter text-white">
          It doesn't matter.
        </p>
      </Scene>

      <Scene>
        <p className="mb-6 text-center text-[clamp(1.6rem,7vw,2.6rem)] font-black leading-[1.1] tracking-tight text-white">
          Every format enters<br/>the same door.
        </p>
        <p className="mt-5 text-center text-sm font-semibold text-white/38">
          One system. One record. One identity.
        </p>
      </Scene>

      <Scene>
        <SealSVG/>
        <p className="mt-5 font-mono text-lg font-black tracking-[0.16em] text-[#D4A017]">
          NMF-2025-XXXXXX
        </p>
        <p className="mt-2 text-center text-sm font-semibold text-white/40">
          Every submission receives one. Instantly.
        </p>
      </Scene>

      <Scene>
        <div className="flex flex-col gap-3 text-center w-full">
          {(["INTAKE","REVIEW","OUTCOME"] as const).map((word, i) => {
            const companions = [
              <SvgIntakeForm  key="i" className="h-full w-full"/>,
              <SvgReviewFrame key="r" className="h-full w-full"/>,
              <SvgOutcome     key="o" className="h-full w-full"/>,
            ];
            return (
              <div key={word} className="relative">
                <div aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ width:100, height:80, opacity:0.18 }}>
                  {companions[i]}
                </div>
                <p className="relative text-[clamp(2.6rem,13vw,5.5rem)] font-black leading-[0.95] tracking-tight text-white/22">
                  {word}
                </p>
              </div>
            );
          })}
          <p className="mt-6 text-sm font-semibold leading-7 text-white/38">
            We reach you at every stage.<br/>Your idea never disappears into silence.
          </p>
        </div>
      </Scene>
    </div>
  );
}

function Scene({ children, align = "center" }: { children: ReactNode; align?: "center" | "left" }) {
  return (
    <motion.div
      initial={{ opacity:0, y:22 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:"-60px" }}
      transition={{ duration:0.65, ease:EASE }}
      className={`flex min-h-[82svh] flex-col justify-center overflow-x-clip px-5 py-14 sm:px-7 sm:py-16 ${align==="center"?"items-center text-center":"items-start"}`}
    >
      {children}
    </motion.div>
  );
}

// ─── Chapter 5: CTA scene ────────────────────────────────────────────────────

function CTAScene({ webglRef }: { webglRef: React.RefObject<SubmissionWebGL | null> }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 70%",
      invalidateOnRefresh: true,
      onEnter: () => { webglRef.current?.setChapter(5); },
      onLeaveBack: () => { webglRef.current?.setChapter(-1); },
    });
    return () => trigger.kill();
  }, [webglRef]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-transparent px-5 py-16 sm:px-8 sm:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0"
        style={{ background:`
          radial-gradient(ellipse 75% 65% at 50% 52%, rgba(212,160,23,0.11) 0%, transparent 55%),
          radial-gradient(ellipse 40% 35% at 50% 70%, rgba(180,130,0,0.07) 0%, transparent 50%)
        `}}/>
      <AmbientDots/>

      <motion.div
        initial={{ opacity:0, scale:0.96 }}
        whileInView={{ opacity:1, scale:1 }}
        viewport={{ once:true, margin:"-80px" }}
        transition={{ duration:0.7, ease:EASE }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative" style={{ width:"min(420px,90vw)", height:"min(540px,72vh)" }}>
          <div className="film-rect-glow" style={{
            width:"100%", height:"100%",
            border:"1px solid rgba(212,160,23,0.52)",
            boxShadow:"inset 0 0 80px rgba(0,27,64,0.95), 0 0 100px rgba(212,160,23,0.20)",
            background:"rgba(0,14,44,0.97)",
            borderRadius:"2px",
          }}/>
          <DocMarks opacity={0.28}/>

          <div aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-5 px-10 py-16"
            style={{ opacity:0.10 }}>
            {Array.from({length:8}).map((_,i) => (
              <div key={i} className="h-px w-full bg-[#D4A017]"
                style={{ opacity: 0.8 - i*0.08 }}/>
            ))}
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-8 py-10">
            <motion.p
              initial={{ opacity:0, y:8 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ duration:0.6, delay:0.3, ease:EASE }}
              className="text-center text-[clamp(1.6rem,4vw,2.6rem)] font-black leading-[1.08] tracking-tight text-white"
            >
              Your idea<br/>is ready.
            </motion.p>

            <motion.p
              initial={{ opacity:0, y:5 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ duration:0.5, delay:0.48, ease:EASE }}
              className="text-sm font-semibold text-white/45"
            >
              Choose how you want to begin.
            </motion.p>

            <motion.div
              initial={{ opacity:0, y:8 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ duration:0.5, delay:0.62, ease:EASE }}
              className="flex w-full flex-col gap-3"
            >
              {ctas.map((cta, i) => {
                const Icon = cta.Icon;
                return (
                  <motion.a key={cta.href} href={cta.href}
                    download={cta.download || undefined}
                    whileHover={{ y:-2 }} transition={{ duration:0.16 }}
                    className={
                      i===0
                        ? "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4A017] px-5 py-3.5 text-sm font-black text-[#002B5C] transition hover:bg-[#e0b030]"
                        : "inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/5 px-5 py-3.5 text-sm font-black text-white/75 transition hover:border-[#D4A017]/45 hover:bg-white/8"
                    }
                  >
                    <Icon className="h-4 w-4" aria-hidden="true"/>
                    {cta.label}
                    {i===0 && <ArrowRight className="h-3.5 w-3.5" aria-hidden="true"/>}
                  </motion.a>
                );
              })}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────

export default function SubmissionPage() {
  const prefersReducedMotion              = useReducedMotion();
  // Header fade state retained as a no-op so existing chapter onEnter/onLeave callbacks can fire setHeaderFaded
  // without conditionally re-shaping the timeline. PublicSiteHeader now renders instead of the old FilmHeader.
  const [, setHeaderFaded]                = useState(false);
  const [activeChapter, setActiveChapter] = useState(-1);

  const webglRef  = useRef<SubmissionWebGL | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const grainRef  = useRef<HTMLCanvasElement | null>(null);

  // Normal mobile users get the SAME cinematic WebGL/film experience as desktop —
  // only prefers-reduced-motion users see the simplified MobileFilm narrative fallback.
  // Mobile-specific framing (portrait fov, capped pixel ratio) is handled inside SubmissionWebGL.
  const useMobileLayout = !!prefersReducedMotion;

  // WebGL lifecycle (desktop only)
  useEffect(() => {
    if (useMobileLayout || !canvasRef.current) return;

    const webgl = new SubmissionWebGL();
    webgl.init(canvasRef.current);
    webglRef.current = webgl;

    return () => {
      webgl.dispose();
      webglRef.current = null;
    };
  }, [useMobileLayout]);

  // Film grain overlay (desktop only)
  useEffect(() => {
    if (useMobileLayout || !grainRef.current) return;

    const canvas = grainRef.current;
    canvas.width  = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    let animId = 0;
    let last = 0;

    const render = (ts: number) => {
      animId = requestAnimationFrame(render);
      if (ts - last < 42) return; // ~24 fps
      last = ts;
      const data = ctx.createImageData(256, 256);
      const d = data.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 255;
      }
      ctx.putImageData(data, 0, 0);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [useMobileLayout]);

  // Mouse parallax + scroll velocity (desktop only)
  useEffect(() => {
    if (useMobileLayout) return;

    const onMouse = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth  - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      webglRef.current?.setMouse(nx, ny);
    };

    let lastY = 0;
    const onScroll = () => {
      const vel = window.scrollY - lastY;
      lastY = window.scrollY;
      webglRef.current?.setScrollVelocity(vel);

      const total = document.body.scrollHeight - window.innerHeight;
      if (total > 0) webglRef.current?.setCameraProgress(window.scrollY / total);
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("scroll",    onScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll",    onScroll);
    };
  }, [useMobileLayout]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#04050f] text-white">
      <style>{FILM_STYLES}</style>

      {/* ── WebGL canvas (desktop only, sits behind everything) ── */}
      {!useMobileLayout && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
      )}

      {/* ── Film grain overlay (desktop only) ── */}
      {!useMobileLayout && (
        <canvas
          ref={grainRef}
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 6,
            pointerEvents: "none",
            opacity: 0.035,
            imageRendering: "pixelated",
          }}
        />
      )}

      <PublicSiteHeader currentPath="/submission" />
      <MobileBackButton />

      {!useMobileLayout && activeChapter >= 0 && (
        <FilmProgress active={activeChapter}/>
      )}

      <div className="relative z-10">
        {useMobileLayout
          ? <MobileFilm/>
          : <DesktopFilm
              setHeaderFaded={setHeaderFaded}
              setActiveChapter={setActiveChapter}
              webglRef={webglRef}
            />
        }
        <CTAScene webglRef={webglRef}/>
      </div>
    </main>
  );
}
