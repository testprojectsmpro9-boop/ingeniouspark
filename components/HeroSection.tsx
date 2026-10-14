import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lazy, Suspense } from "react";
import { Sparkles, Lightbulb, Search } from "lucide-react";
import { PORTAL_URL } from "../config";
import HeroGalaxyBackground from "./HeroGalaxyBackground";

const HeroGlobe = lazy(() => import("./HeroGlobe"));

gsap.registerPlugin(ScrollTrigger);

interface Props {
  onScrollTo: (id: string) => void;
  prefersReducedMotion: boolean | null;
}


export default function HeroSection({ onScrollTo: _onScrollTo, prefersReducedMotion }: Props) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 300], [0, prefersReducedMotion ? 0 : 40]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-badge",     { opacity: 0, y: 16, duration: 0.5 }, 0.1)
        .from(".hero-title",     { opacity: 0, y: 32, duration: 0.7 }, 0.25)
        .from(".hero-tagline",   { opacity: 0, y: 16, duration: 0.5 }, 0.5)
        .from(".hero-desc",      { opacity: 0, y: 16, duration: 0.5 }, 0.65)
        .from(".hero-btns > *",  { opacity: 0, y: 16, stagger: 0.12, duration: 0.45 }, 0.8)
        .from(".hero-stats > *", { opacity: 0, y: 12, stagger: 0.1,  duration: 0.4  }, 0.95)
        .from(".hero-orbit",     { opacity: 0, duration: 0.8 }, 1.15);

      gsap.to(".blob-1", { y: 28,  duration: 5,   repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".blob-2", { y: -24, x: 12,  duration: 6.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.8 });
      gsap.to(".blob-3", { y: 18,  x: -10, duration: 4.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.5 });

      gsap.to(".hero-parallax", {
        y: -60,
        ease: "none",
        scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1 },
      });
    }, heroRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="hero" ref={heroRef} className="relative overflow-hidden bg-gradient-to-b from-[#020d18]/85 via-[#031727]/65 to-[#041e35]/70 pb-10 pt-20">
      <HeroGalaxyBackground prefersReducedMotion={prefersReducedMotion} />
      <div className="hero-parallax pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob-1 absolute -left-16 -top-16 h-80 w-80 rounded-full bg-[#06b6d4]/8 blur-3xl" />
        <div className="blob-2 absolute -right-10 top-24 h-72 w-72 rounded-full bg-[#D4A017]/10 blur-3xl" />
        <div className="blob-3 absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#6366f1]/8 blur-3xl" />
      </div>

      <motion.div
        style={{ y: heroY }}
        className="relative mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[1fr_1fr] lg:items-start"
      >
        {/* Left */}
        <div>
          <div className="hero-badge inline-flex flex-wrap items-center gap-2 rounded-full border border-[#D4A017]/30 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 shadow-sm backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#D4A017]" />
            <span>IngeniousPark</span>
            <span className="text-slate-600">•</span>
            <span>NMF</span>
            <span className="text-slate-600">•</span>
            <span>IFIA Bharat</span>
          </div>

          <h1 className="hero-title mt-5 text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-[3rem]">
            India's ideas.{" "}
            <span className="bg-gradient-to-r from-[#D4A017] via-[#f0c040] to-[#D4A017] bg-clip-text text-transparent">
              One innovation gateway.
            </span>
          </h1>

          <p className="hero-tagline mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-[#06b6d4]">
            Think local. Innovate global. Impact forever.
          </p>

          <p className="hero-desc mt-4 max-w-xl text-base leading-7 text-slate-400">
            IngeniousPark is a structured pathway for students, innovators,
            institutions, communities, startups, and problem-solvers — from idea submission to
            expert review, mentorship, collaboration, and local-to-global opportunities.
          </p>

          <div className="hero-btns mt-7 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/submit-idea"
                className="magnetic-btn inline-flex items-center gap-2 rounded-xl bg-[#D4A017] px-7 py-3.5 text-sm font-bold text-[#020d18] shadow-lg shadow-[#D4A017]/20 transition hover:bg-[#f0c040] hover:shadow-xl"
              >
                <Lightbulb className="h-4 w-4" aria-hidden="true" />
                Submit Idea
              </a>
              <a
                href="/track-idea"
                className="magnetic-btn inline-flex items-center gap-2 rounded-xl border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                Track Idea
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              <a
                href={`${PORTAL_URL}/login`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-500 transition hover:text-slate-300"
              >
                Portal Login →
              </a>
              <a href="/who-can-apply" className="text-xs text-slate-500 transition hover:text-slate-300">
                Who Can Apply →
              </a>
            </div>
          </div>

          <div className="hero-stats mt-5 flex flex-wrap gap-x-6 gap-y-2.5">
            {["Open Idea Submission", "Multi-format Intake", "Expert Review Pathway", "Local-to-Global Support"].map((label) => (
              <div key={label} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#D4A017]" />
                <span className="text-xs font-semibold text-slate-300">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: dominant globe + orbit overlay */}
        <div className="relative">
          <Suspense fallback={<div className="h-[520px] lg:h-[680px] rounded-3xl bg-white/3 animate-pulse" />}>
            <HeroGlobe
              prefersReducedMotion={prefersReducedMotion}
              className="relative h-[520px] w-full lg:h-[680px]"
            />
          </Suspense>

          {/* Orbit arcs — Mysuru / India / Global rings */}
          <div className="hero-orbit pointer-events-none absolute inset-0 overflow-hidden opacity-0">
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 400 520"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              {/* Global orbit */}
              <ellipse cx="200" cy="260" rx="188" ry="170" fill="none"
                stroke="#6366f1" strokeOpacity="0.13" strokeWidth="0.8"
                strokeDasharray="3 10" />
              <text x="372" y="158" fill="#6366f1" fillOpacity="0.42"
                fontSize="8" fontFamily="monospace" fontWeight="bold" letterSpacing="1.5">
                GLOBAL
              </text>
              <circle cx="388" cy="260" r="2.5" fill="#6366f1" fillOpacity="0.3" />

              {/* India orbit */}
              <ellipse cx="200" cy="260" rx="148" ry="132" fill="none"
                stroke="#D4A017" strokeOpacity="0.18" strokeWidth="0.8"
                strokeDasharray="2 7" />
              <text x="332" y="198" fill="#D4A017" fillOpacity="0.5"
                fontSize="8" fontFamily="monospace" fontWeight="bold" letterSpacing="1.5">
                INDIA
              </text>
              <circle cx="348" cy="260" r="2.5" fill="#D4A017" fillOpacity="0.4" />

              {/* Mysuru orbit */}
              <ellipse cx="200" cy="260" rx="108" ry="94" fill="none"
                stroke="#06b6d4" strokeOpacity="0.24" strokeWidth="0.8" />
              <text x="292" y="234" fill="#06b6d4" fillOpacity="0.6"
                fontSize="8" fontFamily="monospace" fontWeight="bold" letterSpacing="1.5">
                MYSURU
              </text>
              <circle cx="308" cy="260" r="2.5" fill="#06b6d4" fillOpacity="0.55" />
            </svg>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
