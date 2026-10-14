import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RegisterSection from "./RegisterSection";
import FinalCTASection from "./FinalCTASection";

gsap.registerPlugin(ScrollTrigger);

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Robust scene image — inline background-image, always visible ───
function SceneImage({
  src,
  label,
  className,
  overlay = "bottom",
  zoom = false,
  children,
}: {
  src: string;
  label: string;
  className?: string;
  overlay?: "bottom" | "full" | "none";
  zoom?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative isolate overflow-hidden bg-[#0a1626] ${className ?? ""}`}>
      <div
        role="img"
        aria-label={label}
        className={`absolute inset-0 bg-cover bg-center ${zoom ? "transition-transform duration-[1200ms] ease-out group-hover:scale-110" : ""}`}
        style={{ backgroundImage: `url("${src}")` }}
      />
      {overlay === "bottom" && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020b13]/85 via-[#020b13]/5 to-transparent" />
      )}
      {overlay === "full" && <div className="pointer-events-none absolute inset-0 bg-[#020b13]/40" />}
      {children}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-white/20 bg-black/45 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md">
      {children}
    </span>
  );
}

// Per-element directional entry (data-enter on [data-ch="stage"]) — with depth
function enterVars(el: Element): gsap.TweenVars {
  switch ((el as HTMLElement).dataset.enter) {
    case "left":  return { x: -150, rotate: -5, filter: "blur(6px)" };
    case "right": return { x: 150, rotate: 5, filter: "blur(6px)" };
    case "top":   return { y: -130, filter: "blur(6px)" };
    case "bottom": return { y: 130, filter: "blur(6px)" };
    case "scale": return { scale: 0.45, filter: "blur(8px)" };
    default:      return { y: 70, filter: "blur(4px)" };
  }
}

// ─── Pinned cinematic chapter with light-orb handoffs ─────────
// Desktop (no reduced-motion): tall section + sticky viewport + scrubbed
// entry → hold → compress-exit. Enter orb blooms in, exit orb collapses the
// scene into a glowing point that the next chapter blooms out of.
// Mobile / reduced-motion: static, full content (no gating).
function CinematicChapter({
  id,
  heightVh = 230,
  bg,
  accent = "#06b6d4",
  children,
}: {
  id?: string;
  heightVh?: number;
  bg?: string;
  accent?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    // DESKTOP — pinned sticky composition with slow scrub
    mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
      gsap.set(el, { height: `${heightVh}vh` });
      const q = gsap.utils.selector(el);
      const content = q("[data-ch='content']")[0];
      const stages = q("[data-ch='stage']") as unknown as Element[];
      const orbEnter = q("[data-orb='enter']")[0];
      const orbExit = q("[data-orb='exit']")[0];
      const flash = q("[data-orb='flash']")[0];

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 1.5, invalidateOnRefresh: true },
      });

      if (orbEnter) {
        tl.fromTo(orbEnter, { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1.1, ease: "expo.out", duration: 0.3 }, 0)
          .to(orbEnter, { autoAlpha: 0, scale: 2.4, ease: "power2.in", duration: 0.4 }, 0.22);
      }
      if (content) tl.from(content, { autoAlpha: 0, y: 22, ease: "expo.out", duration: 0.55 }, 0.04);
      stages.forEach((s, i) => {
        tl.from(s, { autoAlpha: 0, ...enterVars(s), ease: "expo.out", duration: 0.95 }, 0.25 + i * 0.22);
      });

      tl.to({}, { duration: 4.5 });

      if (content) tl.to(content, { autoAlpha: 0, y: -130, scale: 0.97, filter: "blur(6px)", ease: "power2.inOut", duration: 0.45 });
      if (orbExit) {
        tl.fromTo(orbExit, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1.4, ease: "power2.out", duration: 0.3 }, "<")
          .to(orbExit, { autoAlpha: 0, scale: 3, ease: "power2.in", duration: 0.3 });
      }
      if (flash) {
        tl.fromTo(flash, { autoAlpha: 0 }, { autoAlpha: 0.5, ease: "power2.in", duration: 0.2 }, "<")
          .to(flash, { autoAlpha: 0, ease: "power2.out", duration: 0.35 });
      }

      return () => {
        gsap.set(el, { clearProps: "height" });
      };
    });

    // MOBILE — let section keep its NATURAL height (no forced heightVh). Overriding height with vh
    // values created an "inside a tunnel" feeling and pushed inner content above the safe viewport
    // band on portrait phones (top would get cropped behind the navbar).
    mm.add("(prefers-reduced-motion: no-preference) and (max-width: 767px)", () => {
      const q = gsap.utils.selector(el);
      const content = q("[data-ch='content']")[0];
      const stages = q("[data-ch='stage']") as unknown as Element[];

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 40%", scrub: 1.4, invalidateOnRefresh: true },
      });

      if (content) tl.from(content, { autoAlpha: 0, y: 18, ease: "expo.out", duration: 0.5 }, 0);
      // Simpler mobile entrance: gentle directional fade, NO blur, much smaller translate.
      // The blur+large translate combo (enterVars) produced a "zoom-in tunnel" feel + cropping on mobile.
      stages.forEach((s, i) => {
        const dir = (s as HTMLElement).dataset.enter;
        const vars: gsap.TweenVars =
          dir === "left"  ? { x: -28 } :
          dir === "right" ? { x: 28 }  :
          dir === "top"   ? { y: -22 } :
          dir === "bottom"? { y: 22 }  :
          dir === "scale" ? { scale: 0.94 } :
                            { y: 18 };
        tl.from(s, { autoAlpha: 0, ...vars, ease: "expo.out", duration: 0.9 }, 0.08 + i * 0.20);
      });
      // Hold so cards remain readable before section exits viewport
      tl.to({}, { duration: 1.6 });
    });

    ScrollTrigger.refresh();
    return () => mm.revert();
  }, [heightVh]);

  return (
    <section ref={ref} id={id} className={`relative ${bg ?? ""}`}>
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-20 md:sticky md:top-0 md:h-screen md:min-h-0 md:py-0">
        <div
          data-orb="flash"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden opacity-0 md:block"
          style={{ background: `radial-gradient(circle at 50% 60%, ${accent}55, transparent 60%)` }}
        />
        <div
          data-orb="enter"
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[12%] hidden h-56 w-56 -translate-x-1/2 rounded-full opacity-0 blur-xl md:block"
          style={{ background: `radial-gradient(circle, ${accent}, transparent 68%)` }}
        />
        <div
          data-orb="exit"
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[6%] left-1/2 hidden h-56 w-56 -translate-x-1/2 rounded-full opacity-0 blur-xl md:block"
          style={{ background: `radial-gradient(circle, ${accent}, transparent 68%)` }}
        />
        <div data-ch="content" className="relative z-10 mx-auto w-full max-w-6xl">
          {children}
        </div>
      </div>
    </section>
  );
}

// ═══ CHAPTER 1 · IDEA SIGNAL IGNITION ════════════════════════
// Hall of Innovators — wall-focus sequence (R, L, R, L, R, L, R, L)
const HALL_FRAMES = [
  { title: "Farmers",               image: "/homepage-visuals/30.jpeg", side: "right" }, // Phase A
  { title: "Students",              image: "/homepage-visuals/26.jpeg", side: "left"  }, // Phase B
  { title: "Researchers",           image: "/homepage-visuals/28.jpeg", side: "right" }, // Phase C
  { title: "Makers",                image: "/homepage-visuals/27.jpeg", side: "left"  }, // Phase D
  { title: "Grassroots Innovators", image: "/homepage-visuals/31.jpeg", side: "right" }, // Phase E
  { title: "Startups",              image: "/homepage-visuals/25.jpeg", side: "left"  }, // Phase F
  { title: "Community Leaders",     image: "/homepage-visuals/32.jpeg", side: "right" }, // Phase G
  { title: "Teachers",              image: "/homepage-visuals/26.jpeg", side: "left"  }, // Phase H
] as const;

// ═══ HALL OF INNOVATORS · combined door → corridor → prism scene ═══
function HallOfInnovatorsScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const animRef = useRef<HTMLDivElement>(null);
  const staticRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const animEl = animRef.current;
    const staticEl = staticRef.current;
    if (!animEl || !staticEl) return;

    // Reduced-motion: swap to static stack (desktop + mobile)
    const noRM = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    if (!noRM) {
      animEl.style.display = "none";
      staticEl.style.display = "block";
      return;
    }

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(animEl);
      const leftDoor = q(".hall-left-door")[0];
      const rightDoor = q(".hall-right-door")[0];
      const seam = q(".hall-seam")[0];
      const corridor = q(".hall-corridor")[0];
      const titleHall = q(".hall-title-1")[0];
      const titleWho = q(".hall-title-2")[0];
      const frames = q(".hall-frame") as unknown as HTMLElement[];
      const farGlow = q(".hall-far-glow")[0];
      const prism = q(".hall-prism")[0];
      const hallCore = q(".hall-core")[0];
      const coreFloat = q(".hall-core-float")[0];
      const hallRig = q(".hall-rig")[0];
      const spotLeft = q(".hall-spot-left")[0];
      const spotRight = q(".hall-spot-right")[0];
      const finalText = q(".hall-final")[0];

      gsap.set(corridor, { autoAlpha: 0, scale: 1 });
      gsap.set(prism, { autoAlpha: 0, scale: 1.1 });
      gsap.set(hallCore, { autoAlpha: 0, scale: 0.78 });
      gsap.set(hallRig, { xPercent: 0, rotation: 0 });
      gsap.set([spotLeft, spotRight], { autoAlpha: 0 });
      gsap.set(titleWho, { autoAlpha: 0, y: 40 });
      gsap.set(finalText, { autoAlpha: 0, y: 30 });
      gsap.set(seam, { autoAlpha: 0, scaleY: 0.4 });
      gsap.set(farGlow, { autoAlpha: 0 });
      frames.forEach((f) => {
        const side = f.dataset.side;
        gsap.set(f, {
          autoAlpha: 0,
          scale: 0.85,
          x: side === "left" ? -160 : 160,
          rotationY: side === "left" ? 16 : -16,
          transformPerspective: 1200,
          filter: "blur(3px)",
        });
      });

      // Subtle float drift on the core (independent of scrub)
      gsap.to(coreFloat, { y: -8, scale: 1.04, repeat: -1, yoyo: true, ease: "sine.inOut", duration: 2.6 });

      const isMobileHall = window.matchMedia("(max-width: 767px)").matches;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: animEl,
          start: "top top",
          end: isMobileHall ? "+=220%" : "+=320%",
          scrub: isMobileHall ? 1.3 : 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 0.00–0.12 — door hold ("Hall of Innovators" readable)
      tl.to({}, { duration: 0.12 });

      // 0.12–0.28 — doors open from center, corridor reveals (seam stays HIDDEN)
      tl.to(leftDoor, { xPercent: -60, rotateY: -26, ease: "power2.inOut", duration: 0.16 }, 0.12);
      tl.to(rightDoor, { xPercent: 60, rotateY: 26, ease: "power2.inOut", duration: 0.16 }, 0.12);
      tl.to(corridor, { autoAlpha: 1, duration: 0.16 }, 0.14);
      tl.to(titleHall, { autoAlpha: 0, y: -30, duration: 0.1 }, 0.2);

      // 0.28–0.38 — "Who can submit?" + corridor peek
      tl.to(titleWho, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.28);
      tl.to(corridor, { scale: 1.06, duration: 0.1 }, 0.28);

      // 0.34–0.84 — corridor walk + 8 single-frame wall-focus phases + camera look toward wall
      tl.to(titleWho, { autoAlpha: 0, y: -30, duration: 0.06 }, 0.34);
      tl.to(corridor, { scale: 1.22, duration: 0.46 }, 0.36);
      tl.to([leftDoor, rightDoor], { autoAlpha: 0, duration: 0.08 }, 0.36);

      // 8 phases A..H at 0.06 each: enter → focus (dominant) → pass. Single frame at a time.
      frames.forEach((f, i) => {
        const side = f.dataset.side;
        const phaseStart = 0.36 + i * 0.06;
        const enterAt = phaseStart;
        const focusAt = phaseStart + 0.018;
        const passAt  = phaseStart + 0.045;
        const restRot  = side === "left" ? 16 : -16;
        const focusRot = side === "left" ? 5  : -5;
        const passRot  = side === "left" ? 14 : -14;
        // 1) enter — slide from outside into wall bay (mounted angle, slightly dim)
        tl.to(f, { autoAlpha: 1, scale: 1, x: 0, rotationY: restRot, filter: "brightness(0.95) blur(1px)", ease: "power2.out", duration: 0.02 }, enterAt);
        // 2) focus — rotate toward viewer, MUCH bigger, brighter, sharpened
        tl.to(f, { rotationY: focusRot, scale: 1.55, filter: "brightness(1.2) blur(0px)", ease: "power2.out", duration: 0.022 }, focusAt);
        // 3) pass — fade, scale up further, slide outward
        tl.to(f, { autoAlpha: 0, scale: 1.75, x: side === "left" ? -260 : 260, rotationY: passRot, filter: "brightness(0.9) blur(5px)", ease: "power2.in", duration: 0.022 }, passAt);
      });

      // Camera rig + side spotlight — clearly look toward the active wall
      for (let i = 0; i < 8; i++) {
        const phaseStart = 0.36 + i * 0.06;
        const isRight = HALL_FRAMES[i].side === "right";
        const rigX  = isRight ? -7 : 7;
        const rigRot = isRight ? -0.6 : 0.6;
        const activeSpot = isRight ? spotRight : spotLeft;
        const dimSpot   = isRight ? spotLeft  : spotRight;
        // look toward wall
        tl.to(hallRig, { xPercent: rigX, rotation: rigRot, scale: 1.02, ease: "power2.inOut", duration: 0.025 }, phaseStart + 0.005);
        tl.to(activeSpot, { autoAlpha: 1, ease: "power2.out", duration: 0.025 }, phaseStart + 0.005);
        tl.to(dimSpot, { autoAlpha: 0.15, ease: "power2.out", duration: 0.025 }, phaseStart + 0.005);
        // return through center
        tl.to(hallRig, { xPercent: 0, rotation: 0, scale: 1, ease: "power2.inOut", duration: 0.02 }, phaseStart + 0.048);
        tl.to([activeSpot, dimSpot], { autoAlpha: 0, ease: "power2.in", duration: 0.02 }, phaseStart + 0.048);
      }

      // 0.82–0.86 — far-end glow starts rising (subtle), corridor dims
      tl.to(farGlow, { autoAlpha: 0.6, duration: 0.04 }, 0.82);
      tl.to(corridor, { scale: 1.42, autoAlpha: 0.5, duration: 0.06 }, 0.82);

      // 0.86–0.90 — floating destination core fades in SOFTLY (later than before — gives frames full focus)
      tl.to(hallCore, { autoAlpha: 0.7, scale: 1, ease: "power2.out", duration: 0.04 }, 0.86);
      // 0.86–0.90 — seam glow reveals SOFTLY (dim, behind quote) — only here, never earlier
      tl.to(seam, { autoAlpha: 0.5, scaleY: 1, ease: "power2.out", duration: 0.04 }, 0.86);

      // 0.88–0.91 — prism chamber DIM takeover (low alpha so final quote can read clearly)
      tl.to(prism, { autoAlpha: 0.28, scale: 1, ease: "power2.out", duration: 0.03 }, 0.88);
      tl.to(corridor, { autoAlpha: 0, duration: 0.03 }, 0.88);

      // 0.91–0.93 — final heading + quote reveal (prism + core + seam all dim further behind quote)
      tl.to(prism, { autoAlpha: 0.18, duration: 0.02 }, 0.91);
      tl.to(hallCore, { autoAlpha: 0.35, duration: 0.02 }, 0.91);
      tl.to(farGlow, { autoAlpha: 0.25, duration: 0.02 }, 0.91);
      tl.to(seam, { autoAlpha: 0.22, duration: 0.02 }, 0.91);
      tl.to(finalText, { autoAlpha: 1, y: 0, duration: 0.02 }, 0.91);

      // 0.93–0.985 — LONG HOLD: quote readable, prism + core dim, no zoom, no flare yet
      tl.to({}, { duration: 0.055 });

      // 0.985–1.00 — zoom into "spark." → fills viewport with gold flare for handoff
      const sparkWord  = q(".hall-spark-word")[0];
      const sparkPre   = q(".hall-spark-pre")[0];
      const sparkQuote = q(".hall-spark-quote")[0];
      const sparkPanel = q(".hall-spark-panel")[0];
      const hallFlare  = q(".hall-flare")[0];
      if (sparkWord) gsap.set(sparkWord, { transformOrigin: "50% 50%" });
      tl.to([sparkPre, sparkQuote, sparkPanel], { autoAlpha: 0, ease: "power2.in", duration: 0.015 }, 0.985);
      tl.to(sparkWord, { scale: 22, autoAlpha: 0, ease: "power2.in", duration: 0.015 }, 0.985);
      tl.to(hallFlare, { autoAlpha: 1, ease: "power2.in", duration: 0.015 }, 0.985);
    });
    ScrollTrigger.refresh();
    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="hall-of-innovators" className="relative isolate bg-[#020b13]">
      {/* DESKTOP pinned cinematic scene — visible on md+; JS hides on reduced-motion desktop */}
      <div ref={animRef} className="relative block h-[100svh] w-full overflow-hidden" style={{ perspective: "1400px" }}>
        {/* CAMERA RIG — corridor + far-glow + wall frames; gentle tilt on look left/right */}
        <div className="hall-rig absolute inset-0">
          {/* corridor far-end glow */}
          <div className="hall-far-glow pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgba(212,160,23,0.35), rgba(6,182,212,0.06) 45%, transparent 70%)" }} />

          {/* corridor background (33.jpeg) */}
          <div className="hall-corridor absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/homepage-visuals/33.jpeg")' }} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#020b13]/30 via-transparent to-[#020b13]/55" />

          {/* Side-wall spotlights — fade in on the active side, dim on the other */}
          <div className="hall-spot-left pointer-events-none absolute inset-y-0 left-0 w-2/5" style={{ background: "radial-gradient(ellipse at 12% 50%, rgba(212,160,23,0.22), rgba(6,182,212,0.10) 32%, transparent 65%)" }} />
          <div className="hall-spot-right pointer-events-none absolute inset-y-0 right-0 w-2/5" style={{ background: "radial-gradient(ellipse at 88% 50%, rgba(212,160,23,0.22), rgba(6,182,212,0.10) 32%, transparent 65%)" }} />

          {/* Wall-mounted frames — one focused frame at a time, embedded into corridor wall bays */}
          {HALL_FRAMES.map((f, i) => {
            const sideClass = f.side === "left" ? "left-[5%]" : "right-[5%]";
            return (
              <figure
                key={`${f.title}-${i}`}
                className={`hall-frame absolute ${sideClass} h-[42svh] w-[52vw] overflow-hidden rounded-md md:h-[38vh] md:w-[16vw]`}
                data-side={f.side}
                data-phase={i}
                style={{
                  top: "26%",
                  transformOrigin: f.side === "left" ? "left center" : "right center",
                  transformStyle: "preserve-3d",
                  border: "1px solid rgba(212,160,23,0.55)",
                  boxShadow: "0 0 26px rgba(6,182,212,0.25), inset 0 0 0 1px rgba(212,160,23,0.4), inset 0 0 24px rgba(0,0,0,0.6), 0 14px 38px rgba(0,0,0,0.6)",
                }}
              >
                <div className="absolute inset-0 bg-cover" style={{ backgroundImage: `url("${f.image}")`, backgroundPosition: "center", transform: "scale(1.1)", transformOrigin: "top left" }} />
                {/* dark fade + wall-mount label strip */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#020b13]/95 via-[#020b13]/40 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-[#D4A017]/45 bg-[#020b13]/85 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                  <span>{f.title}</span>
                  <span className="h-[2px] w-6 rounded-full bg-[#D4A017]/70" />
                </figcaption>
              </figure>
            );
          })}
        </div>

        {/* prism chamber (24.jpeg) — takes over at corridor end */}
        <div className="hall-prism absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/homepage-visuals/24.jpeg")' }} />

        {/* Floating destination core — corridor's focal point */}
        <div className="hall-core pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="hall-core-float relative h-44 w-44 md:h-60 md:w-60">
            {/* outer halo */}
            <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, rgba(212,160,23,0.4), rgba(6,182,212,0.14) 42%, transparent 70%)" }} />
            {/* pulsing aura */}
            <div className="absolute inset-[12%] animate-pulse rounded-full border border-[#D4A017]/30" style={{ animationDuration: "3s" }} />
            {/* vertical hexagonal core */}
            <div
              className="absolute left-1/2 top-1/2 h-32 w-14 -translate-x-1/2 -translate-y-1/2"
              style={{
                clipPath: "polygon(50% 0, 100% 26%, 100% 74%, 50% 100%, 0 74%, 0 26%)",
                background: "linear-gradient(155deg, #fff6da 0%, #f0c040 34%, #D4A017 60%, #06b6d4 100%)",
                boxShadow: "0 0 60px 8px rgba(212,160,23,0.55), 0 0 28px rgba(6,182,212,0.45)",
              }}
            />
            {/* inner highlight */}
            <div className="absolute left-1/2 top-1/2 h-32 w-[2px] -translate-x-1/2 -translate-y-1/2 bg-white/80 blur-[1px]" />
          </div>
        </div>

        {/* door panels — top of stack, both halves of 21.jpeg */}
        <div className="hall-left-door absolute left-0 top-0 h-full w-1/2 bg-no-repeat" style={{ backgroundImage: 'url("/homepage-visuals/21.jpeg")', backgroundSize: "200% 100%", backgroundPosition: "left center", transformStyle: "preserve-3d", transformOrigin: "left center" }} />
        <div className="hall-right-door absolute right-0 top-0 h-full w-1/2 bg-no-repeat" style={{ backgroundImage: 'url("/homepage-visuals/21.jpeg")', backgroundSize: "200% 100%", backgroundPosition: "right center", transformStyle: "preserve-3d", transformOrigin: "right center" }} />

        {/* Bottom-right cinematic vignette — hides asset corner mark, reads as intentional */}
        <div className="pointer-events-none absolute bottom-0 right-0 z-20 h-48 w-72 md:h-64 md:w-96" style={{ background: "radial-gradient(circle at 92% 92%, rgba(2,11,19,0.95) 0%, rgba(2,11,19,0.6) 38%, transparent 78%)" }} />
        <div className="pointer-events-none absolute bottom-10 right-10 z-20 h-14 w-14 rounded-full" style={{ background: "radial-gradient(circle, rgba(212,160,23,0.22), transparent 70%)" }} />
        <div className="pointer-events-none absolute bottom-10 right-10 z-20 h-10 w-10 rounded-full" style={{ background: "radial-gradient(circle, rgba(6,182,212,0.16), transparent 65%)" }} />

        {/* center seam glow — invisible from frame 1, GSAP reveals it ONLY during prism phase */}
        <div className="hall-seam pointer-events-none absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2" style={{ background: "linear-gradient(to bottom, transparent, #D4A017 50%, transparent)", boxShadow: "0 0 30px rgba(212,160,23,0.7)", opacity: 0, visibility: "hidden" }} />

        {/* text overlays */}
        <div className="hall-title-1 pointer-events-none absolute inset-0 flex items-center justify-center text-center">
          <h2 className="px-6 font-bold tracking-tight text-white" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", textShadow: "0 4px 30px rgba(0,0,0,0.85)" }}>
            Hall of Innovators
          </h2>
        </div>
        <div className="hall-title-2 pointer-events-none absolute inset-0 flex items-center justify-center text-center">
          <h2 className="px-6 font-bold tracking-tight text-white" style={{ fontSize: "clamp(2rem, 5vw, 4rem)", textShadow: "0 4px 28px rgba(0,0,0,0.85)" }}>
            Who can submit?
          </h2>
        </div>
        <div className="hall-final pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-6">
          {/* Localized dark radial suppressor — pushes prism/core/farGlow behind the panel so quote is always the strongest element */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[110vh] w-[110vw] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(2,11,19,0.92) 0%, rgba(2,11,19,0.78) 18%, rgba(2,11,19,0.45) 36%, transparent 60%)",
            }}
          />
          <div
            className="hall-spark-panel relative mx-auto max-w-[92vw] rounded-[24px] border border-white/18 px-5 py-7 text-center sm:max-w-md sm:rounded-[28px] sm:px-8 sm:py-10 md:max-w-3xl md:px-14 md:py-14"
            style={{
              background: "rgba(2,11,19,0.78)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              boxShadow: "0 0 120px rgba(2,11,19,0.85), 0 0 60px rgba(2,11,19,0.7), inset 0 0 40px rgba(2,11,19,0.5)",
            }}
          >
            <h2 className="font-bold tracking-tight text-white" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", textShadow: "0 4px 36px rgba(0,0,0,0.95)" }}>
              <span className="hall-spark-pre">Every idea begins as{" "}</span>
              <span
                className="hall-spark-word inline-block"
                style={{ color: "#D4A017", textShadow: "0 4px 22px rgba(212,160,23,0.5)" }}
              >
                a spark.
              </span>
            </h2>
            <p className="hall-spark-quote mx-auto mt-5 max-w-xl" style={{ color: "rgba(255,255,255,0.88)", fontSize: "clamp(1rem, 1.6vw, 1.25rem)", textShadow: "0 2px 16px rgba(0,0,0,0.85)" }}>
              Your idea belongs here too.
            </p>
          </div>
        </div>

        {/* Gold/cyan transition flare — fills viewport at end, hands off to Spark Bridge */}
        <div
          className="hall-flare pointer-events-none absolute inset-0 z-40"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(255,246,218,0.6) 0%, rgba(240,192,64,0.4) 16%, rgba(212,160,23,0.22) 38%, transparent 62%)",
            opacity: 0,
          }}
          aria-hidden="true"
        />
      </div>

      {/* MOBILE / reduced-motion simplified stack */}
      <div ref={staticRef} className="hidden">
        <div className="aspect-[4/3] w-full bg-cover bg-center" style={{ backgroundImage: 'url("/homepage-visuals/21.jpeg")' }} />
        <div className="px-6 py-10 text-center">
          <h2 className="text-4xl font-bold text-white">Hall of Innovators</h2>
          <p className="mt-4 text-lg text-slate-300">Who can submit?</p>
        </div>
        <div className="grid grid-cols-2 gap-3 px-6">
          {HALL_FRAMES.map((f, i) => (
            <figure key={`${f.title}-${i}`} className="relative aspect-[3/4] overflow-hidden rounded-md border border-[#D4A017]/40">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${f.image}")` }} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020b13]/85 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white">{f.title}</figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-10 aspect-[4/3] w-full bg-cover bg-center" style={{ backgroundImage: 'url("/homepage-visuals/24.jpeg")' }} />
        <div className="px-6 py-12">
          <div
            className="mx-auto max-w-md rounded-3xl border border-white/10 px-6 py-8 text-center"
            style={{ background: "rgba(2,11,19,0.55)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", boxShadow: "0 0 60px rgba(2,11,19,0.55)" }}
          >
            <h2 className="text-3xl font-bold text-white" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.85)" }}>
              Every idea begins as <span style={{ color: "#D4A017", textShadow: "0 2px 14px rgba(212,160,23,0.45)" }}>a spark.</span>
            </h2>
            <p className="mt-4 text-base" style={{ color: "rgba(255,255,255,0.88)" }}>Your idea belongs here too.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══ CHAPTER 3 · SPARK TO OPPORTUNITY BRIDGE ═══════════════════════
const SPARK_STAGES = [
  { n: "01", label: "Raw Thought",    color: "#D4A017", t: 0.05 },
  { n: "02", label: "Application ID", color: "#06b6d4", t: 0.23 },
  { n: "03", label: "Review",         color: "#6366f1", t: 0.42 },
  { n: "04", label: "Expert / Jury",  color: "#D4A017", t: 0.60 },
  { n: "05", label: "Support",        color: "#10b981", t: 0.78 },
  { n: "06", label: "Opportunity",    color: "#f0c040", t: 0.95 },
] as const;
const SPARK_PATH_D = "M 60 240 C 210 60, 360 360, 500 200 S 780 260, 940 100";
// Portrait path for mobile — smooth S-curve through fixed checkpoint coordinates below.
// Final segment (05→06) uses control points (150, 675) and (205, 725) so the route
// flows smoothly diagonal from Support (105, 615) into Opportunity (255, 760), ending
// EXACTLY on node 06 center.
const SPARK_PATH_D_MOBILE = "M 105 95 C 285 95, 295 165, 295 225 C 295 295, 105 285, 105 355 C 105 425, 295 425, 295 485 C 295 555, 105 545, 105 615 C 150 675, 205 725, 255 760";
const SPARK_VIEWBOX_DESKTOP = "0 0 1000 360";
const SPARK_VIEWBOX_MOBILE = "0 0 400 880";

// Mobile checkpoint placements — exact (x,y) on the curve above, with label side rules
const SPARK_STAGES_MOBILE = [
  { n: "01", label: "Raw Thought",    labelLines: ["RAW THOUGHT"],    color: "#D4A017", x: 105, y: 95,  side: "right" as const, t: 0.05 },
  { n: "02", label: "Application ID", labelLines: ["APPLICATION", "ID"], color: "#06b6d4", x: 295, y: 225, side: "left"  as const, t: 0.23 },
  { n: "03", label: "Review",         labelLines: ["REVIEW"],         color: "#6366f1", x: 105, y: 355, side: "right" as const, t: 0.42 },
  { n: "04", label: "Expert / Jury",  labelLines: ["EXPERT", "/ JURY"], color: "#D4A017", x: 295, y: 485, side: "left"  as const, t: 0.60 },
  { n: "05", label: "Support",        labelLines: ["SUPPORT"],        color: "#10b981", x: 105, y: 615, side: "right" as const, t: 0.78 },
  { n: "06", label: "Opportunity",    labelLines: ["OPPORTUNITY"],    color: "#f0c040", x: 255, y: 760, side: "below" as const, t: 0.95 },
];

function SparkBridgeChapter() {
  const sectionRef = useRef<HTMLElement>(null);
  const animRef = useRef<HTMLDivElement>(null);
  const staticRef = useRef<HTMLDivElement>(null);
  // CRITICAL: lazy initializer so first render already has correct path/viewBox.
  // If this defaulted to false, first render would render the DESKTOP path d,
  // GSAP setup useEffect would read pathLength from the desktop geometry,
  // then React would re-render with mobile path d — but GSAP keeps stale length.
  // Result: strokeDashoffset reaches 0 before the mobile path is fully drawn,
  // so the last segment (05→06) appears disconnected on mobile.
  const [isMobileSpark, setIsMobileSpark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767px)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = (e: MediaQueryListEvent) => setIsMobileSpark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const animEl = animRef.current;
    const staticEl = staticRef.current;
    if (!animEl || !staticEl) return;

    const noRM = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    if (!noRM) {
      animEl.style.display = "none";
      staticEl.style.display = "block";
      return;
    }

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(animEl);
      const eyebrow = q(".spark-eyebrow")[0];
      const heading = q(".spark-heading")[0];
      const subline = q(".spark-sub")[0];
      const pathMain = q(".spark-path-main")[0] as unknown as SVGPathElement;
      const pathGlow = q(".spark-path-glow")[0] as unknown as SVGPathElement;
      const spark = q(".spark-orb")[0] as unknown as SVGElement;
      const sparkTrail = q(".spark-trail")[0] as unknown as SVGElement;
      const sparkOrigin = q(".spark-origin")[0];
      const checkpoints = q(".spark-checkpoint") as unknown as SVGGElement[];
      const checkpointInners = q(".spark-checkpoint-inner") as unknown as SVGGElement[];
      const cta = q(".spark-cta")[0];
      const introFlare = q(".spark-intro-flare")[0];
      const bgImage = q(".spark-bg-image")[0];

      const pathLength = pathMain.getTotalLength();
      gsap.set([pathMain, pathGlow], { strokeDasharray: pathLength, strokeDashoffset: pathLength });
      gsap.set([spark, sparkTrail], { autoAlpha: 0 });
      gsap.set(cta, { autoAlpha: 0, y: 20 });
      gsap.set(introFlare, { autoAlpha: 1 });
      gsap.set(bgImage, { scale: 1.05, autoAlpha: 0.6, filter: "blur(3px)" });

      const isMobileLayout = window.matchMedia("(max-width: 767px)").matches;
      SPARK_STAGES.forEach((s, i) => {
        if (isMobileLayout) {
          // Fixed mobile coordinates — clean even spacing, no overlap
          const m = SPARK_STAGES_MOBILE[i];
          checkpoints[i].setAttribute("transform", `translate(${m.x}, ${m.y})`);
        } else {
          const pt = pathMain.getPointAtLength(pathLength * s.t);
          checkpoints[i].setAttribute("transform", `translate(${pt.x}, ${pt.y})`);
        }
        gsap.set(checkpointInners[i], { autoAlpha: 0.25, scale: 0.7, transformOrigin: "center" });
      });

      const startPt = pathMain.getPointAtLength(0);
      spark.setAttribute("cx", String(startPt.x));
      spark.setAttribute("cy", String(startPt.y));
      sparkTrail.setAttribute("cx", String(startPt.x));
      sparkTrail.setAttribute("cy", String(startPt.y));

      const sparkProgress = { p: 0 };
      const updateSpark = () => {
        const pt = pathMain.getPointAtLength(pathLength * sparkProgress.p);
        spark.setAttribute("cx", String(pt.x));
        spark.setAttribute("cy", String(pt.y));
        const trailT = Math.max(sparkProgress.p - 0.03, 0);
        const tpt = pathMain.getPointAtLength(pathLength * trailT);
        sparkTrail.setAttribute("cx", String(tpt.x));
        sparkTrail.setAttribute("cy", String(tpt.y));
      };

      const isMobileBridge = window.matchMedia("(max-width: 767px)").matches;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: animEl,
          start: "top top",
          end: isMobileBridge ? "+=210%" : "+=300%",
          scrub: isMobileBridge ? 1.3 : 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 0.00–0.08 — intro flare dominates (continues Hall handoff), bg image emerges underneath
      tl.to(bgImage, { autoAlpha: 1, filter: "blur(0px)", ease: "power2.out", duration: 0.08 }, 0);
      tl.to(introFlare, { autoAlpha: 0, ease: "power2.in", duration: 0.10 }, 0.04);

      // Subtle bg parallax across the whole scroll
      tl.to(bgImage, { scale: 1.16, ease: "none", duration: 0.92 }, 0.08);

      // 0.06–0.16 — heading + subline + spark origin reveal as flare recedes
      tl.from(eyebrow, { autoAlpha: 0, y: 12, duration: 0.05, ease: "expo.out" }, 0.08);
      tl.from(heading, { autoAlpha: 0, y: 30, duration: 0.07, ease: "expo.out" }, 0.10);
      tl.from(subline, { autoAlpha: 0, y: 16, duration: 0.06, ease: "expo.out" }, 0.14);
      tl.fromTo(sparkOrigin, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 0.9, scale: 1, duration: 0.06, ease: "expo.out" }, 0.08);
      tl.to(spark, { autoAlpha: 1, duration: 0.04 }, 0.14);
      tl.to(sparkTrail, { autoAlpha: 0.55, duration: 0.04 }, 0.14);

      // 0.16–0.92 — path draws + spark travels (after intro flare clears)
      tl.to([pathMain, pathGlow], { strokeDashoffset: 0, ease: "none", duration: 0.76 }, 0.16);
      tl.to(sparkProgress, { p: 1, ease: "none", duration: 0.76, onUpdate: updateSpark }, 0.16);
      tl.to(sparkOrigin, { autoAlpha: 0, duration: 0.08 }, 0.22);

      // 0.92–0.96 — spark arrives at node 06 (Opportunity) and fades out cleanly.
      // Without this, the spark + its trail + glow filter linger on top of node 06 and read as a "bottom star/glow"
      // that makes the path look like it continues past Opportunity.
      tl.to([spark, sparkTrail], { autoAlpha: 0, ease: "power2.in", duration: 0.05 }, 0.92);

      // Checkpoint activations (spark arrives at each station)
      const stageThresholds = [0.18, 0.30, 0.42, 0.56, 0.70, 0.82];
      checkpointInners.forEach((cp, i) => {
        tl.to(cp, { autoAlpha: 1, scale: 1.18, duration: 0.06, ease: "expo.out" }, stageThresholds[i]);
        tl.to(cp, { scale: 1, duration: 0.05, ease: "power2.inOut" }, stageThresholds[i] + 0.05);
      });

      // 0.94–1.00 — CTA reveals after final stage
      tl.to(cta, { autoAlpha: 1, y: 0, duration: 0.06, ease: "expo.out" }, 0.94);
    });
    ScrollTrigger.refresh();
    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="evaluation" className="relative isolate bg-[#020b13]">
      {/* DESKTOP pinned cinematic bridge */}
      <div ref={animRef} className="relative block h-[100svh] w-full overflow-hidden">
        {/* Atmosphere photo bg (34.jpeg) — subtle parallax scale during scroll */}
        <div className="spark-bg-image absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/homepage-visuals/34.jpeg")', opacity: 0.34 }} aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(2,11,19,0.55) 0%, rgba(2,11,19,0.35) 45%, rgba(2,11,19,0.75) 100%)" }} aria-hidden="true" />

        {/* background — soft dot grid + radial halo + vignette */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <svg className="absolute inset-0 h-full w-full opacity-30">
            <defs>
              <pattern id="spark-grid" x="0" y="0" width="42" height="42" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="#06b6d4" fillOpacity="0.14" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#spark-grid)" />
          </svg>
          {/* Center radial halo — gold tinted on desktop, hidden on mobile so it doesn't read like a decorative glow extending below node 06 */}
          <div className="absolute left-1/2 top-1/2 hidden h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full md:block" style={{ background: "radial-gradient(ellipse, rgba(212,160,23,0.10), rgba(6,182,212,0.06) 45%, transparent 70%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(2,11,19,0.5) 100%)" }} />
        </div>

        {/* Intro flare — continues from Hall spark zoom; recedes during the opening */}
        <div
          className="spark-intro-flare pointer-events-none absolute inset-0 z-40"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(255,246,218,0.9) 0%, rgba(240,192,64,0.65) 18%, rgba(212,160,23,0.4) 40%, transparent 72%)",
          }}
          aria-hidden="true"
        />

        {/* heading band */}
        <div className="absolute inset-x-0 top-[7vh] z-20 px-8 text-center">
          <p className="spark-eyebrow text-[11px] font-black uppercase tracking-[0.32em] text-[#D4A017]/70">Spark to opportunity</p>
          <h2 className="spark-heading mx-auto mt-3 max-w-3xl font-bold leading-[1.05] tracking-tight text-white" style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.8rem)" }}>
            From raw thought
            <br />
            <span className="bg-gradient-to-r from-[#06b6d4] to-[#D4A017] bg-clip-text text-transparent">to real opportunity.</span>
          </h2>
          <p className="spark-sub mx-auto mt-4 max-w-2xl text-sm text-slate-400 md:text-base">
            Every spark moves through a pathway — registered, reviewed, guided, and opened toward the right opportunity.
          </p>
        </div>

        {/* bridge SVG — portrait on mobile, landscape on desktop */}
        <div className="absolute inset-x-0 top-[23vh] z-10 md:top-1/2 md:-translate-y-1/2">
          <svg
            viewBox={isMobileSpark ? SPARK_VIEWBOX_MOBILE : SPARK_VIEWBOX_DESKTOP}
            className={
              isMobileSpark
                ? "mx-auto block h-[64svh] w-[92vw] max-w-md"
                : "mx-auto block h-[42vh] w-[92vw] max-w-6xl"
            }
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="spark-path-grad" x1="0%" y1="0%" x2={isMobileSpark ? "0%" : "100%"} y2={isMobileSpark ? "100%" : "0%"}>
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="55%" stopColor="#f0c040" />
                <stop offset="100%" stopColor="#D4A017" />
              </linearGradient>
              <filter id="spark-glow"><feGaussianBlur stdDeviation="6" /></filter>
            </defs>
            {/* spark origin glow — continues from Hall prism */}
            <circle className="spark-origin" cx={isMobileSpark ? 105 : 60} cy={isMobileSpark ? 95 : 240} r="38" fill="url(#spark-path-grad)" opacity="0" filter="url(#spark-glow)" />

            {/* glow stroke */}
            <path className="spark-path-glow" d={isMobileSpark ? SPARK_PATH_D_MOBILE : SPARK_PATH_D} fill="none" stroke="url(#spark-path-grad)" strokeWidth={isMobileSpark ? 9 : 8} strokeOpacity="0.5" filter="url(#spark-glow)" strokeLinecap="round" />
            {/* main stroke */}
            <path className="spark-path-main" d={isMobileSpark ? SPARK_PATH_D_MOBILE : SPARK_PATH_D} fill="none" stroke="url(#spark-path-grad)" strokeWidth={isMobileSpark ? 3 : 2.6} strokeLinecap="round" />

            {/* moving trail behind spark */}
            <circle className="spark-trail" cx={isMobileSpark ? 105 : 60} cy={isMobileSpark ? 95 : 240} r={isMobileSpark ? 7 : 6} fill="#06b6d4" opacity="0.5" filter="url(#spark-glow)" />
            {/* moving spark */}
            <circle className="spark-orb" cx={isMobileSpark ? 105 : 60} cy={isMobileSpark ? 95 : 240} r={isMobileSpark ? 8 : 7} fill="#fff6da">
              <animate attributeName="r" values={isMobileSpark ? "7;10;7" : "6;9;6"} dur="1.6s" repeatCount="indefinite" />
            </circle>

            {/* checkpoints — translate set by JS to exact path points (mobile uses fixed coords) */}
            {SPARK_STAGES.map((s, i) => {
              const m = SPARK_STAGES_MOBILE[i];
              const labelStyle = {
                paintOrder: "stroke" as const,
                stroke: "rgba(2,11,19,0.92)",
                strokeWidth: 4,
                strokeLinejoin: "round" as const,
                fill: "#ffffff",
              };
              return (
                <g key={s.n} className="spark-checkpoint">
                  <g className="spark-checkpoint-inner">
                    {/* outer halo */}
                    <circle r={isMobileSpark ? 30 : 28} fill={s.color} fillOpacity="0.10" />
                    {/* main node */}
                    <circle r={isMobileSpark ? 20 : 20} fill="rgba(2,11,19,0.9)" stroke={s.color} strokeWidth="2.2" />
                    {/* number */}
                    <text textAnchor="middle" dy="6" fontSize={isMobileSpark ? 16 : 16} fontWeight="800" fill={s.color}>{s.n}</text>
                    {/* label — desktop alternates above/below; mobile uses per-stage side rules */}
                    {isMobileSpark ? (
                      m.side === "below" ? (
                        // Below node — centered, single line; safe inside viewBox
                        m.labelLines.map((line, li) => (
                          <text
                            key={li}
                            textAnchor="middle"
                            x={0}
                            y={48 + li * 20}
                            fontSize="16"
                            fontWeight="700"
                            letterSpacing="2"
                            style={labelStyle}
                          >
                            {line}
                          </text>
                        ))
                      ) : m.side === "right" ? (
                        // Right of node — left-anchored
                        m.labelLines.map((line, li) => (
                          <text
                            key={li}
                            textAnchor="start"
                            x={42}
                            y={6 + (li - (m.labelLines.length - 1) / 2) * 20}
                            fontSize="16"
                            fontWeight="700"
                            letterSpacing="2"
                            style={labelStyle}
                          >
                            {line}
                          </text>
                        ))
                      ) : (
                        // Left of node — right-anchored
                        m.labelLines.map((line, li) => (
                          <text
                            key={li}
                            textAnchor="end"
                            x={-42}
                            y={6 + (li - (m.labelLines.length - 1) / 2) * 20}
                            fontSize="16"
                            fontWeight="700"
                            letterSpacing="2"
                            style={labelStyle}
                          >
                            {line}
                          </text>
                        ))
                      )
                    ) : (
                      <text textAnchor="middle" dy={i % 2 === 0 ? -40 : 54} fontSize="14" fontWeight="700" letterSpacing="2" fill="#ffffff">
                        {s.label.toUpperCase()}
                      </text>
                    )}
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* CTA */}
        <div className="absolute inset-x-0 bottom-[7vh] z-30 flex justify-center">
          <a
            href="/review-process"
            className="spark-cta pointer-events-auto inline-flex items-center gap-2 rounded-xl border border-[#D4A017]/45 bg-gradient-to-r from-[#D4A017]/15 to-[#06b6d4]/15 px-6 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white backdrop-blur-md transition hover:from-[#D4A017]/25 hover:to-[#06b6d4]/25"
            style={{ boxShadow: "0 0 30px rgba(212,160,23,0.28)" }}
          >
            See the full pathway <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* MOBILE / reduced-motion — vertical spark pathway */}
      <div ref={staticRef} className="relative hidden">
        <div className="pointer-events-none absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/homepage-visuals/34.jpeg")', opacity: 0.22 }} aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(2,11,19,0.82), rgba(2,11,19,0.5) 45%, rgba(2,11,19,0.88))" }} aria-hidden="true" />
        <div className="relative z-10 px-6 pt-16 pb-8 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[#D4A017]/70">Spark to opportunity</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-white">
            From raw thought
            <br />
            <span className="bg-gradient-to-r from-[#06b6d4] to-[#D4A017] bg-clip-text text-transparent">to real opportunity.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-slate-400">
            Every spark moves through a pathway — registered, reviewed, guided, and opened toward the right opportunity.
          </p>
        </div>
        <div className="relative z-10 mx-auto max-w-md px-6 pb-12">
          <div className="absolute bottom-12 left-[2.4rem] top-2 w-[2px] bg-gradient-to-b from-[#06b6d4] via-[#D4A017] to-transparent opacity-70" />
          {SPARK_STAGES.map((s) => (
            <div key={s.n} className="relative mb-7 flex items-center gap-4">
              <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 bg-[#020b13]" style={{ borderColor: s.color, boxShadow: `0 0 20px ${s.color}55` }}>
                <span className="text-[12px] font-bold tabular-nums" style={{ color: s.color }}>{s.n}</span>
              </div>
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-white">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="relative z-10 px-6 pb-16 text-center">
          <a href="/review-process" className="inline-flex items-center gap-2 rounded-xl border border-[#D4A017]/45 bg-[#D4A017]/12 px-6 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white">
            See the full pathway <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

// ═══ CHAPTER 4 · ECOSYSTEM (orbit around "Your Idea") ════════
const ORBIT = [
  { src: "/homepage-visuals/10.jpeg", label: "Mentorship",     pos: "lg:left-[4%] lg:top-[5%]",     enter: "left" },
  { src: "/homepage-visuals/8.jpeg",  label: "Expert Review",  pos: "lg:right-[4%] lg:top-[5%]",    enter: "top" },
  { src: "/homepage-visuals/11.jpeg", label: "Co-creation",    pos: "lg:left-[4%] lg:bottom-[5%]",  enter: "bottom" },
  { src: "/homepage-visuals/9.jpeg",  label: "Global Network", pos: "lg:right-[4%] lg:bottom-[5%]", enter: "right" },
];

function EcosystemChapter() {
  return (
    <CinematicChapter id="why-mysuru" heightVh={260} bg="bg-[#031727]/72" accent="#D4A017">
      <div className="text-center">
        <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[#D4A017]">Around every idea</p>
        <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl">
          You are surrounded by support.
        </h2>
      </div>

      <div className="relative mx-auto mt-10 max-w-4xl lg:h-[58vh]">
        {/* orbit ring + connection lines (desktop) */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden aspect-square w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 lg:block" />
        <svg className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[[24, 26], [76, 26], [24, 74], [76, 74]].map(([x, y], i) => (
            <line key={i} x1="50" y1="50" x2={x} y2={y} stroke="#D4A017" strokeOpacity="0.32" strokeWidth="0.7" />
          ))}
        </svg>

        {/* center node */}
        <div className="mb-3 flex items-center justify-center lg:absolute lg:left-1/2 lg:top-1/2 lg:z-20 lg:mb-0 lg:-translate-x-1/2 lg:-translate-y-1/2">
          <div
            className="flex h-32 w-32 flex-col items-center justify-center rounded-full border border-[#D4A017]/50 bg-[#020b13]/85 text-center backdrop-blur-md md:h-44 md:w-44"
            style={{ boxShadow: "0 0 60px 6px rgba(212,160,23,0.28), inset 0 0 30px rgba(240,192,64,0.12)" }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4A017]">Your</span>
            <span className="text-xl font-bold text-white">Idea</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:block">
          {ORBIT.map((o) => (
            <div key={o.label} data-ch="stage" data-enter={o.enter} className={`lg:absolute lg:z-10 lg:w-[42%] ${o.pos}`}>
              <SceneImage
                src={o.src}
                label={o.label}
                overlay="bottom"
                className="h-[22vh] w-full rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.4)] lg:h-[26vh]"
              >
                <div className="absolute left-3 top-3"><Chip>{o.label}</Chip></div>
              </SceneImage>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 flex justify-center gap-3">
        <a
          href="/innovation-hub"
          className="inline-flex items-center gap-2 rounded-xl border border-[#D4A017]/28 bg-[#D4A017]/8 px-5 py-2.5 text-sm font-semibold text-[#D4A017] transition hover:bg-[#D4A017]/16"
        >
          Innovation Hub <ArrowRight className="h-3.5 w-3.5" />
        </a>
        <a
          href="/collaboration"
          className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
        >
          Collaboration <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </CinematicChapter>
  );
}

// ═══ CHAPTER 5 · TWO PATHS (split world) ═════════════════════
function SplitPath({
  src, alt, eyebrow, title, copy, href, cta, accent,
}: {
  src: string; alt: string; eyebrow: string; title: string; copy: string; href: string; cta: string; accent: string;
}) {
  return (
    <a href={href} className="group relative block overflow-hidden rounded-[2.5rem] border border-white/10">
      <SceneImage src={src} label={alt} overlay="none" zoom className="h-[56vh] w-full md:h-[70vh]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: `linear-gradient(to top, #020b13 2%, rgba(2,11,19,0.18) 40%, ${accent}2e 100%)` }}
        />
        <div className="absolute inset-x-0 bottom-0 p-7 md:p-10">
          <p className="text-[11px] font-black uppercase tracking-[0.28em]" style={{ color: accent }}>{eyebrow}</p>
          <h3 className="mt-3 text-2xl font-bold leading-[1.05] text-white md:text-4xl">{title}</h3>
          <p className="mt-3 max-w-sm text-sm leading-7 text-slate-200">{copy}</p>
          <span
            className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-[#020b13] transition group-hover:gap-3"
            style={{ background: accent }}
          >
            {cta} <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </SceneImage>
    </a>
  );
}

function TwoPathsChapter() {
  return (
    <CinematicChapter id="membership" heightVh={260} bg="bg-[#0a1628]/72" accent="#f0c040">
      <div className="text-center">
        <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[#06b6d4]">Community &amp; collaboration</p>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-6xl">Two paths. Both open.</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-slate-400">
          Idea submission is open to everyone — membership is optional.
        </p>
      </div>

      <div className="relative mt-10 grid gap-5 lg:grid-cols-2">
        {/* central glowing divider */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 bottom-0 hidden w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#06b6d4]/70 to-[#D4A017]/70 lg:block"
          style={{ boxShadow: "0 0 22px rgba(6,182,212,0.45)" }}
        />
        <div data-ch="stage" data-enter="left">
          <SplitPath
            src="/homepage-visuals/11.jpeg"
            alt="Co-creation hub"
            eyebrow="Optional"
            title="Join the innovation community"
            copy="Early updates, gatherings, and connections across the network."
            href="/membership"
            cta="Join Community"
            accent="#06b6d4"
          />
        </div>
        <div data-ch="stage" data-enter="right">
          <SplitPath
            src="/homepage-visuals/9.jpeg"
            alt="Strategic partnership"
            eyebrow="Institutions & partners"
            title="Partner with the hub"
            copy="For institutions, partners, mentors, sponsors, and ecosystem builders."
            href="/collaboration"
            cta="Partner with Hub"
            accent="#D4A017"
          />
        </div>
      </div>
    </CinematicChapter>
  );
}

// ═══ ACTION LANES — full-width numbered "Where do you begin?" ═
const ACTION_LANES = [
  { n: "01", label: "I have an idea",              href: "/submit-idea" },
  { n: "02", label: "I already submitted",         href: "/track-idea" },
  { n: "03", label: "I want to learn the pathway", href: "/review-process" },
  { n: "04", label: "I want to collaborate",       href: "/collaboration" },
];

function ActionLanesSection() {
  return (
    <section className="relative overflow-hidden bg-[#020b13]/72 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[#D4A017]/70">Choose your path</p>
        <h2 className="mt-4 font-bold leading-[1.02] tracking-tight text-white" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
          Where do you begin?
        </h2>

        <div className="mt-12 border-y border-white/10">
          {ACTION_LANES.map((l, i) => (
            <motion.a
              key={l.n}
              href={l.href}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 1.0, delay: i * 0.22, ease: E }}
              className={`group flex items-center gap-6 py-7 transition-colors duration-300 hover:bg-[#D4A017]/[0.05] md:gap-10 md:py-9 ${i < ACTION_LANES.length - 1 ? "border-b border-white/10" : ""}`}
            >
              <span className="font-black tabular-nums text-white/15 transition-colors duration-300 group-hover:text-[#D4A017]/70" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                {l.n}
              </span>
              <span className="font-bold text-white transition-colors duration-300 group-hover:text-[#D4A017]" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                {l.label}
              </span>
              <ArrowRight className="ml-auto h-6 w-6 text-slate-400 transition-all duration-300 group-hover:translate-x-2 group-hover:text-[#D4A017] md:h-7 md:w-7" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══ HANDOFF FLARE — fixed gold flare bridging Hall pin end → Spark Bridge pin start ═══
function HandoffFlare() {
  const flareRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = flareRef.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const hall = document.getElementById("hall-of-innovators");
      const spark = document.getElementById("evaluation");
      if (!hall || !spark) return;
      gsap.set(el, { autoAlpha: 0 });
      // Flare reaches full opacity well BEFORE Hall pin ends → holds through unpin gap
      ScrollTrigger.create({
        trigger: hall,
        start: "bottom-=4% bottom",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => gsap.set(el, { autoAlpha: self.progress }),
      });
      // Flare recedes only AFTER Spark Bridge has pinned (first ~22% of its pin)
      ScrollTrigger.create({
        trigger: spark,
        start: "top top",
        end: "top+=22% top",
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => gsap.set(el, { autoAlpha: 1 - self.progress }),
      });
      ScrollTrigger.refresh();
    });
    return () => mm.revert();
  }, []);
  return (
    <div
      ref={flareRef}
      className="pointer-events-none fixed inset-0 z-[60]"
      aria-hidden="true"
      // CRITICAL: gold radial children must be invisible from frame 1.
      // Without this, on refresh/first-paint the fixed inset-0 gold radial paints
      // BEFORE the gsap.set(el, { autoAlpha: 0 }) effect runs → user sees
      // a full-screen gold flash on every page load. GSAP later raises opacity
      // via ScrollTrigger when Hall→Spark handoff actually happens.
      style={{ opacity: 0, visibility: "hidden" }}
    >
      {/* Solid gold backing — guarantees full viewport coverage, no transparent corners */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #fff6da 0%, #f0c040 12%, rgba(212,160,23,0.55) 32%, rgba(2,11,19,0.94) 70%, #020b13 100%)",
        }}
      />
      {/* Bright center bloom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.55) 0%, rgba(255,246,218,0.25) 22%, transparent 55%)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}

// ─── ROOT ────────────────────────────────────────────────────
export default function HomeImmersiveStory() {
  return (
    <>
      <HallOfInnovatorsScene />
      <HandoffFlare />
      <SparkBridgeChapter />
      <EcosystemChapter />
      <TwoPathsChapter />
      <ActionLanesSection />
      <RegisterSection />
      <FinalCTASection />
    </>
  );
}
