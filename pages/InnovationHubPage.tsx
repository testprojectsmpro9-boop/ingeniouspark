import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  FileText,
  Folder,
  GraduationCap,
  Handshake,
  Image as ImageIcon,
  Lightbulb,
  Mic,
  Network,
  Pencil,
  Phone,
  Rocket,
  School,
  ShieldCheck,
  Sparkles,
  Sprout,
  Trophy,
  Users,
  Video,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import PublicSiteHeader from "../components/PublicSiteHeader";
import MobileBackButton from "../components/MobileBackButton";
import PublicSiteFooter from "../components/PublicSiteFooter";
import LivingMedia from "../components/innovation-hub/LivingMedia";
import { EASE } from "../types";
import {
  audienceList,
  formatList,
  pillarList,
  wodeyarTimeline,
} from "../data";

gsap.registerPlugin(ScrollTrigger);

const ENABLE_INNOVATION_SCROLL_TRIGGER = false;
const ENABLE_INK_DROP_SCROLL_TRIGGER = true;
const ENABLE_SUPPORT_MEDIA_OBSERVER = true;

// ─── Section 1 — Hero ─────────────────────────────────────────────────────
function HeroLegacy() {
  const ref = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Parallax — gentle scroll-linked depth on the gold thread
  const { scrollY } = useScroll();
  const goldThreadY = useTransform(scrollY, [0, 600], [0, prefersReducedMotion ? 0 : 40]);

  useEffect(() => {
    if (!ENABLE_INNOVATION_SCROLL_TRIGGER || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      const len = lineRef.current?.getTotalLength() ?? 0;
      if (lineRef.current && len > 0) {
        gsap.set(lineRef.current, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: 1 },
        });
      }
    }, ref);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden bg-[#FFF5D6]"
      style={{ backgroundImage: "url('/innovation-hub/parchment-texture.svg')", backgroundSize: "640px 640px" }}
    >
      {/* Layer 1 — heritage cinematic backdrop. Video preferred; falls back to duotone JPG; final fallback mood gradient. */}
      <div className="absolute inset-0">
        <LivingMedia
          imageSrc="/innovation-hub/hero-palace-duotone.jpg"
          videoSrc="/innovation-hub/video/hero-legacy-loop.mp4"
          alt="Mysuru heritage cinematic loop"
          accent="#D4A017"
          mood="heritage"
          aspect="auto"
          rounded="rounded-none"
          priority
          className="h-full w-full"
        />
      </div>

      {/* Layer 2 — cream tonal wash so type always reads. Stronger top + bottom anchor, lighter middle so palace video can breathe */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#FFF5D6]/85 via-[#FFF5D6]/20 to-[#FFF5D6]/95" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#FFF5D6] via-[#FFF5D6]/85 to-transparent" />

      {/* (palace silhouette sketch removed — hero uses real video/image as visual atmosphere only) */}

      {/* Layer 5 — gold thread tracing line (history opening into future) */}
      <motion.svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[14%] mx-auto block h-28 w-[80vw] max-w-[1100px]"
        viewBox="0 0 1100 100"
        preserveAspectRatio="none"
        style={{ y: goldThreadY }}
      >
        <path
          ref={lineRef}
          d="M 20 78 Q 280 -8 550 52 T 1080 28"
          stroke="#D4A017"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Star at the leading edge — subtle pulse */}
        <motion.circle
          cx="1080"
          cy="28"
          r="4"
          fill="#D4A017"
          animate={prefersReducedMotion ? {} : { r: [3, 6, 3], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.svg>

      {/* Hero content — pt-28 lg:pt-32 anchors headline below the sticky PublicSiteHeader (≈56–64px) */}
      <div className="relative mx-auto flex min-h-[78svh] max-w-5xl flex-col items-center justify-center px-6 pb-24 pt-28 text-center md:pb-32 lg:pt-32">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="rounded-full border border-[#D4A017]/35 bg-white/55 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.32em] text-[#D4A017] backdrop-blur-sm"
        >
          Innovation Hub · IngeniousPark
        </motion.p>

        {/* Split headline reveal — sized so both lines fit inside first viewport without clipping */}
        <h1
          className="mt-7 max-w-4xl font-black leading-[1.02] tracking-[-0.015em] text-[#002B5C]"
          style={{
            fontSize: "clamp(2.2rem, 6.4vw, 5rem)",
            textShadow: "0 3px 14px rgba(255,255,255,0.24), 0 1px 2px rgba(255,255,255,0.16)",
          }}
        >
          <motion.span
            initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.18, ease: EASE }}
            className="block"
          >
            Mysuru built ideas before.
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.95, delay: 0.5, ease: EASE }}
            className="block"
            style={{ color: "#D4A017" }}
          >
            Mysuru still does.
          </motion.span>
        </h1>

        {/* Subtitle wrapped in a soft cream glass card so it always reads over the palace video */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
          className="mt-8 max-w-2xl rounded-2xl border border-[#002B5C]/10 bg-[#FFF5D6]/80 px-6 py-5 backdrop-blur-md shadow-[0_10px_30px_rgba(0,43,92,0.10)]"
        >
          <p className="text-base font-medium leading-7 text-[#002B5C] md:text-lg md:leading-8">
            The Innovation Hub continues a Mysuru-region tradition of vision, engineering, and public good — now open to every Indian innovator.
          </p>
          <p className="mt-4 text-[11px] font-black uppercase tracking-[0.32em] text-[#D4A017]">
            A continuation, not a launch.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.75, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3, ease: EASE }}
          className="mt-14 flex flex-col items-center gap-2 text-[#002B5C]/70"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.24em]">Scroll the story</span>
          <motion.span
            animate={prefersReducedMotion ? {} : { y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="block h-6 w-px bg-[#D4A017]"
          />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Section 2 — Mysuru as a City of Vision ──────────────────────────────
function CityOfVision() {
  return (
    <section
      className="relative bg-[#FFF5D6] px-6 py-24 md:py-32"
      style={{ backgroundImage: "url('/innovation-hub/parchment-texture.svg')", backgroundSize: "640px 640px" }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#D4A017]">Chapter one · Mysuru Region</p>
          <h2 className="mt-4 font-black leading-[1.05] tracking-tight text-[#002B5C]" style={{ fontSize: "clamp(2rem, 4.5vw, 3.6rem)" }}>
            A region built by people who planned far ahead.
          </h2>
          <div className="mt-3 h-[2px] w-24 bg-[#D4A017]" />
          <p className="mt-7 max-w-xl text-base leading-8 text-[#002B5C]/85 md:text-[17px]">
            Long before "innovation" became a word people put on slides, the Mysuru region was already building it. Streets were planned. Universities were funded. Dams, silk mills, sandalwood factories, and research institutes were given time to mature.
          </p>
          <p className="mt-5 max-w-xl text-base leading-8 text-[#002B5C]/85">
            This is not only a heritage city — it is a region that links research (CFTRI · ISRO LPSC), education (University of Mysore · NIT-Mysuru · JSS), industry, and agriculture into one fabric. A strong local base. A natural launchpad for ideas that travel further.
          </p>
          <p className="mt-5 max-w-xl text-base leading-8 text-[#002B5C]/85">
            The Wodeyar kings asked one question of every idea:{" "}
            <em className="font-semibold text-[#D4A017]">Will this serve the public good?</em>{" "}
            That question still defines this place.
          </p>

          {/* Region credibility chips */}
          <div className="mt-7 flex flex-wrap gap-2">
            {[
              "University of Mysore · 1916",
              "CFTRI",
              "ISRO LPSC",
              "JSS Institutions",
              "Silk · Sandalwood",
              "Hebbal IT Park",
            ].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-[#002B5C]/10 bg-white/70 px-3 py-1 text-[11px] font-bold tracking-wide text-[#002B5C]/80 backdrop-blur-sm"
              >
                {chip}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Heritage archive wall — main heritage image opens through a vertical mask,
            supporting images settle around it like archive cards. Gold edges keep the tone editorial. */}
        <div className="relative">
          <div className="grid grid-cols-6 gap-3">
            {/* Main image — vertical mask reveal (slice → full frame) + slow drift inside */}
            <motion.div
              initial={{ clipPath: "inset(0 50% 0 50%)", opacity: 0.4 }}
              whileInView={{ clipPath: "inset(0 0% 0 0%)", opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.4, ease: [0.7, 0, 0.2, 1] }}
              className="col-span-4 relative"
            >
              <LivingMedia
                imageSrc="/innovation-hub/heritage/1.jpg"
                alt="Mysuru heritage architecture"
                accent="#D4A017"
                mood="heritage"
                aspect="landscape"
                rounded="rounded-3xl"
                icon={<BookOpen className="h-5 w-5" />}
                caption="Mysuru heritage"
                className="border border-[#002B5C]/10 shadow-[0_30px_70px_rgba(0,43,92,0.18)]"
              />
              {/* Gold edge highlight — top/bottom hairlines like an archive plate */}
              <motion.span
                aria-hidden="true"
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1, delay: 0.7, ease: EASE }}
                className="pointer-events-none absolute inset-x-4 top-3 h-px origin-left bg-gradient-to-r from-transparent via-[#D4A017]/85 to-transparent"
              />
              <motion.span
                aria-hidden="true"
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1, delay: 0.85, ease: EASE }}
                className="pointer-events-none absolute inset-x-4 bottom-3 h-px origin-right bg-gradient-to-r from-transparent via-[#D4A017]/65 to-transparent"
              />
              {/* Slow gold light sweep across the heritage frame */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
                initial={false}
              >
                <motion.div
                  className="absolute inset-y-0 w-[60%]"
                  style={{
                    background: "linear-gradient(100deg, transparent 0%, rgba(255,246,218,0.18) 50%, transparent 100%)",
                    mixBlendMode: "screen",
                  }}
                  initial={{ x: "-120%" }}
                  whileInView={{ x: "190%" }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 2.2, delay: 1.1, ease: "easeOut" }}
                />
              </motion.div>
            </motion.div>

            {/* Supporting archive card — Public institutions. Slides in from right + slight rotate */}
            <motion.div
              initial={{ opacity: 0, x: 40, rotate: 2 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.95, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-2 relative"
            >
              <LivingMedia
                imageSrc="/innovation-hub/heritage/2.jpg"
                alt="Public institutions"
                accent="#06b6d4"
                mood="cool"
                aspect="portrait"
                rounded="rounded-3xl"
                icon={<School className="h-4 w-4" />}
                className="border border-[#002B5C]/10 shadow-[0_20px_40px_rgba(0,43,92,0.14)]"
              />
              <motion.span
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
                className="pointer-events-none absolute inset-x-3 top-3 h-px origin-left bg-gradient-to-r from-transparent via-[#06b6d4]/65 to-transparent"
              />
            </motion.div>

            {/* Supporting archive card — Engineering legacy. Slides up + slight counter-rotate */}
            <motion.div
              initial={{ opacity: 0, y: 40, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.95, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-2 relative"
            >
              <LivingMedia
                imageSrc="/innovation-hub/heritage/3.jpg"
                alt="Engineering legacy"
                accent="#10b981"
                mood="emerald"
                aspect="portrait"
                rounded="rounded-3xl"
                icon={<Sparkles className="h-4 w-4" />}
                className="border border-[#002B5C]/10 shadow-[0_20px_40px_rgba(0,43,92,0.14)]"
              />
              <motion.span
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: 1.35, ease: EASE }}
                className="pointer-events-none absolute inset-x-3 top-3 h-px origin-left bg-gradient-to-r from-transparent via-[#10b981]/65 to-transparent"
              />
            </motion.div>

            {/* Heritage tone callout — fades in last */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 1.1, ease: EASE }}
              className="col-span-4 self-end"
            >
              <div className="rounded-3xl border border-[#002B5C]/10 bg-white/65 p-5 backdrop-blur-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#D4A017]">Heritage tone</p>
                <p className="mt-2 text-sm leading-6 text-[#002B5C]/80">
                  Palace city, planning region, scholar's belt. The same instinct now meets a modern open intake.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 3 — Wodeyar Vision ───────────────────────────────────────────
function WodeyarVision() {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!ENABLE_INNOVATION_SCROLL_TRIGGER || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      // Timeline beats activate AFTER the Wodeyar image has opened (door reveal ~1.8s).
      // Start trigger lowered so beats stagger in only when image is mostly visible.
      gsap.from(".wodeyar-beat", {
        opacity: 0,
        y: 28,
        duration: 0.7,
        stagger: 0.18,
        ease: "expo.out",
        delay: 1.4,
        scrollTrigger: { trigger: ref.current, start: "top 55%", once: true },
      });
      const line = ref.current?.querySelector<SVGPathElement>(".wodeyar-line");
      if (line) {
        const len = line.getTotalLength();
        gsap.fromTo(
          line,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top 55%", end: "bottom 40%", scrub: 1 },
          },
        );
      }
    }, ref);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={ref}
      className="relative bg-[#FFF5D6] px-6 py-24 md:py-32"
      style={{ backgroundImage: "url('/innovation-hub/parchment-texture.svg')", backgroundSize: "640px 640px" }}
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="max-w-3xl"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#D4A017]">Chapter two</p>
          <h2 className="mt-4 font-black leading-[1.05] tracking-tight text-[#002B5C]" style={{ fontSize: "clamp(2rem, 4.5vw, 3.6rem)" }}>
            The vision that planned this region.
          </h2>
          <div className="mt-3 h-[2px] w-24 bg-[#D4A017]" />
          <p className="mt-7 max-w-2xl text-base leading-8 text-[#002B5C]/85 md:text-[17px]">
            The Wodeyars believed institutions outlive rulers. They built them with patience.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          {/* Photo-led Wodeyar heritage visual — opens like a heritage folio / palace door.
              Vertical curtain reveal (narrow slice → full frame), gold edge line travels after,
              warm light sweeps across the photo. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.1, ease: EASE }}
            className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-[#002B5C]/12 shadow-[0_30px_80px_rgba(0,43,92,0.22)]"
          >
            {/* Inner clip-path wrapper — opens horizontally from center like a palace door */}
            <motion.div
              initial={{ clipPath: "inset(0 48% 0 48%)" }}
              whileInView={{ clipPath: "inset(0 0% 0 0%)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1.6, delay: 0.15, ease: [0.7, 0, 0.18, 1] }}
              className="absolute inset-0"
            >
              <LivingMedia
                imageSrc="/innovation-hub/wodeyar-vision-legacy.jpg"
                alt="Wodeyar planning and public institution-building"
                accent="#D4A017"
                mood="heritage"
                aspect="auto"
                rounded="rounded-[28px]"
                kenBurns
                sweep={false}
                className="h-full w-full"
              />
            </motion.div>

            {/* Vertical gold seam at the centre — flashes while the door opens, then fades */}
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, scaleY: 0 }}
              whileInView={{ opacity: [0, 1, 1, 0], scaleY: [0, 1, 1, 1] }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1.8, delay: 0.1, times: [0, 0.2, 0.65, 1], ease: "easeInOut" }}
              className="pointer-events-none absolute inset-y-0 left-1/2 w-px origin-center -translate-x-1/2"
              style={{ background: "linear-gradient(180deg, transparent, #D4A017, transparent)", boxShadow: "0 0 18px rgba(212,160,23,0.85)" }}
            />

            {/* Gold line traces the top-left edge after the door opens */}
            <motion.svg
              aria-hidden="true"
              viewBox="0 0 200 60"
              preserveAspectRatio="none"
              className="pointer-events-none absolute left-6 top-6 h-8 w-32"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.85 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 1.4, ease: EASE }}
            >
              <motion.path
                d="M 0 30 Q 60 0 120 24 T 200 16"
                stroke="#D4A017"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 1.2, delay: 1.4, ease: "easeOut" }}
              />
            </motion.svg>

            {/* Warm light sweep across the photo — picks up after the door opens */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <motion.div
                className="absolute inset-y-0 w-[55%]"
                style={{
                  background: "linear-gradient(100deg, transparent 0%, rgba(255,246,218,0.25) 50%, transparent 100%)",
                  mixBlendMode: "screen",
                }}
                initial={{ left: "-70%" }}
                whileInView={{ left: "120%" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 2.5, delay: 1.6, ease: "easeOut" }}
              />
            </motion.div>

            {/* Caption chip — appears after image is open */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 1.8, ease: EASE }}
              className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#002B5C]/60 px-3 py-1.5 backdrop-blur-sm"
            >
              <span className="block h-1.5 w-1.5 rounded-full bg-[#D4A017]" />
              <span className="text-[10px] font-black uppercase tracking-[0.24em] text-white/90">Planning · Institutions</span>
            </motion.div>
          </motion.div>

          {/* Timeline */}
          <div className="relative pl-6 md:pl-12">
            <svg className="pointer-events-none absolute left-2 top-2 h-full w-[2px]" aria-hidden="true" viewBox="0 0 2 100" preserveAspectRatio="none">
              <line className="wodeyar-line" x1="1" y1="0" x2="1" y2="100" stroke="#D4A017" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
            </svg>

            <ol className="space-y-12">
              {wodeyarTimeline.map((beat) => (
                <li key={beat.year} className="wodeyar-beat relative">
                  <span className="absolute -left-7 top-1 flex h-4 w-4 items-center justify-center md:-left-12">
                    <span className="absolute inset-0 rounded-full bg-[#D4A017]/25" />
                    <span className="relative h-2.5 w-2.5 rounded-full bg-[#D4A017]" />
                  </span>
                  <time dateTime={String(beat.year)} className="text-[12px] font-black uppercase tracking-[0.28em] text-[#D4A017]">
                    {beat.year}
                  </time>
                  <h3 className="mt-2 text-xl font-black leading-tight text-[#002B5C] md:text-2xl">
                    {beat.title}
                  </h3>
                  <p className="mt-2 max-w-lg text-sm leading-7 text-[#002B5C]/75 md:text-base">
                    {beat.caption}
                  </p>
                </li>
              ))}
            </ol>

            <p className="mt-12 max-w-lg text-sm italic leading-7 text-[#002B5C]/75 md:text-base">
              Each decision was about systems, not personality. That is the inheritance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 4 — Sir M. Visvesvaraya ──────────────────────────────────────
function MVBlueprint() {
  return (
    <section
      className="relative isolate overflow-hidden bg-[#FFF5D6] px-6 py-24 md:py-32"
      style={{ backgroundImage: "url('/innovation-hub/parchment-texture.svg')", backgroundSize: "640px 640px" }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#D4A017]">Chapter three</p>
          <h2 className="mt-4 font-black leading-[1.05] tracking-tight text-[#002B5C]" style={{ fontSize: "clamp(2rem, 4.5vw, 3.6rem)" }}>
            The engineer who never stopped planning.
          </h2>
          <div className="mt-3 h-[2px] w-24 bg-[#D4A017]" />
          <p className="mt-7 text-base leading-8 text-[#002B5C]/85 md:text-[17px]">
            Sir M. Visvesvaraya — born in this region, served as Diwan of Mysore — believed engineering was a form of public service.
          </p>
          <p className="mt-5 text-base leading-8 text-[#002B5C]/85">
            He designed water systems that still work today. He drafted economic plans decades before India had a planning body. He pushed industries forward with a single line that became a national posture:
          </p>

          <motion.blockquote
            initial={{ opacity: 0, x: -24, borderLeftWidth: 0 }}
            whileInView={{ opacity: 1, x: 0, borderLeftWidth: 4 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="mt-8 rounded-2xl border-l-4 border-[#D4A017] bg-white/55 px-6 py-5 backdrop-blur-sm"
          >
            <motion.p
              initial={{ opacity: 0, filter: "blur(8px)", y: 14 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1.1, delay: 0.25, ease: EASE }}
              className="font-black italic text-[#002B5C]"
              style={{ fontSize: "clamp(1.5rem, 3.2vw, 2.4rem)" }}
            >
              "Industrialise <span className="text-[#D4A017]">or perish.</span>"
            </motion.p>
            <motion.cite
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
              className="mt-2 block text-[11px] font-black uppercase tracking-[0.24em] text-[#002B5C]/55 not-italic"
            >
              Sir M. Visvesvaraya
            </motion.cite>
          </motion.blockquote>

          <p className="mt-7 max-w-xl text-base leading-8 text-[#002B5C]/80">
            The same conviction now shapes how IngeniousPark treats every idea — as something that should be built, not merely admired.
          </p>
        </motion.div>

        {/* Photo-led Sir MV media — full bleed inside card, subtle gold shimmer crossing the dam */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: EASE, delay: 0.1 }}
          className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-[#002B5C]/12 shadow-[0_28px_70px_rgba(0,43,92,0.18)]"
        >
          <LivingMedia
            imageSrc="/innovation-hub/sir-mv-engineering-legacy.jpg"
            alt="Sir M. Visvesvaraya engineering legacy"
            accent="#D4A017"
            mood="amber"
            aspect="auto"
            rounded="rounded-[28px]"
            kenBurns
            sweep={false}
            className="h-full w-full"
          />

          {/* River-flow zone — bottom 45% of image. Multiple slow horizontal highlight bands +
              ripple shimmer give a believable moving water feel without any fluid simulation. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(180deg, transparent 0%, rgba(6,182,212,0.18) 50%, rgba(6,182,212,0.32) 100%)",
                mixBlendMode: "screen",
              }}
            />
            <motion.div
              className="absolute inset-x-0 top-[24%] h-[2px]"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.78), transparent)",
                filter: "blur(1.2px)",
              }}
              animate={{ x: ["-35%", "35%", "-35%"] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-x-0 top-[44%] h-[2px]"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.85), transparent)",
                filter: "blur(1.4px)",
              }}
              animate={{ x: ["35%", "-35%", "35%"] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-x-0 top-[64%] h-[3px]"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,246,218,0.55), transparent)",
                filter: "blur(1.8px)",
              }}
              animate={{ x: ["-22%", "22%", "-22%"], opacity: [0.55, 0.95, 0.55] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            />
            <motion.div
              className="absolute inset-x-0 top-[82%] h-[2px]"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.65), transparent)",
                filter: "blur(1.5px)",
              }}
              animate={{ x: ["22%", "-22%", "22%"], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            />
          </div>

          {/* Blueprint scan — vertical pin-line drifts across the entire frame */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 w-[2px]"
            style={{
              background: "linear-gradient(180deg, transparent 0%, rgba(255,246,218,0.55) 50%, transparent 100%)",
              boxShadow: "0 0 14px rgba(6,182,212,0.45)",
              filter: "blur(0.5px)",
            }}
            initial={{ x: "-2vw", opacity: 0 }}
            animate={{ x: ["-2vw", "102vw"], opacity: [0, 0.9, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
          />

          {/* Subtle gold shimmer across the dam — slow horizontal sweep */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: "linear-gradient(100deg, transparent 0%, rgba(255,246,218,0.0) 35%, rgba(212,160,23,0.32) 50%, rgba(255,246,218,0.0) 65%, transparent 100%)",
              mixBlendMode: "screen",
            }}
            initial={{ x: "-120%" }}
            animate={{ x: "120%" }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", repeatDelay: 3.5 }}
          />

          {/* Caption chip on the photo */}
          <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#002B5C]/60 px-3 py-1.5 backdrop-blur-sm">
            <span className="block h-1.5 w-1.5 rounded-full bg-[#D4A017]" />
            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-white/90">Engineer · Planner</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// (HeritageToModernTransition removed — superseded by CinematicSceneHandoff at major boundaries.)

// ─── Generic scene divider (narrow, gold seam) — used between minor handoffs ──
function SceneSeam({ accent = "#D4A017", label }: { accent?: string; label?: string }) {
  return (
    <div aria-hidden="true" className="relative h-16 w-full overflow-hidden bg-gradient-to-b from-transparent via-transparent to-transparent md:h-20">
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.2, ease: EASE }}
        className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-px w-[58vw] origin-left -translate-y-1/2"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}b3, transparent)` }}
      />
      {label && (
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 0.6, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
          className="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#020b13]/55 px-3 py-1 text-[9px] font-black uppercase tracking-[0.24em] text-white/80 backdrop-blur-sm"
          style={{ color: accent }}
        >
          {label}
        </motion.span>
      )}
    </div>
  );
}

function RecoverySeparator({ tone = "navy" }: { tone?: "cream" | "creamToNavy" | "navy" }) {
  const className =
    tone === "cream"
      ? "h-16 bg-[#FFF5D6]"
      : tone === "creamToNavy"
        ? "h-16 bg-gradient-to-b from-[#FFF5D6] to-[#020b13]"
        : "h-16 bg-[#020b13]";

  return <div aria-hidden="true" className={className} />;
}

// ─── Section 5 — Ingeniouspark intro (Chapter Four · The Pathway) ─────────
function HubIntro() {
  const statements = [
    "Open to K-12 · Local · National",
    "Paper · Online · Voice · Video",
    "NMF · IFIA · ABIPIR",
  ];

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };
  const heading = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#020b13] px-6 py-24 text-white md:py-28">
      <div className="relative mx-auto max-w-5xl">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col items-center"
        >
          <motion.p
            variants={item}
            className="text-center uppercase"
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              color: "#D4A017",
              marginBottom: "1.5rem",
              fontWeight: 800,
            }}
          >
            CHAPTER FOUR · THE PATHWAY
          </motion.p>

          <motion.h2
            variants={heading}
            className="text-center text-white"
            style={{
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              fontWeight: 800,
              lineHeight: 1.0,
            }}
          >
            Every format enters
            <br />
            the same door.
          </motion.h2>

          <motion.p
            variants={item}
            className="text-center"
            style={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.5)",
              maxWidth: "540px",
              margin: "1.5rem auto 0 auto",
              lineHeight: 1.6,
            }}
          >
            From a sketch on paper to a recorded voice — every format reaches the same review table.
          </motion.p>

          <div className="mt-12 flex w-full max-w-[700px] flex-col items-center">
            {statements.map((statement) => (
              <motion.p
                key={statement}
                variants={item}
                className="w-full text-center uppercase"
                style={{
                  fontSize: "clamp(1.1rem, 2.2vw, 1.8rem)",
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.55)",
                  letterSpacing: "0.06em",
                  padding: "1.4rem 0",
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                  margin: "0 auto",
                }}
              >
                {statement}
              </motion.p>
            ))}
          </div>

          <motion.a
            variants={item}
            href="/review-process"
            className="inline-flex items-center gap-2 transition hover:underline"
            style={{
              color: "#D4A017",
              fontSize: "0.85rem",
              marginTop: "2.5rem",
              fontWeight: 700,
            }}
          >
            See the full review pathway <ArrowRight className="h-4 w-4" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Signature Transition — Time Tunnel ──────────────────────────────────
function TimeTunnelTransition() {
  const prefersReducedMotion = useReducedMotion();
  const milestones = [
    "Ancient — Knowledge & temple heritage",
    "Mysuru State — Planned public systems",
    "1912 — Palace reconstruction completed",
    "1950 — Food technology research base",
    "1966 — Communication sciences institute",
    "2005 — Global education campus",
  ];
  const landingBeats = [
    ["Today", "Makers, students & startups"],
    ["2026", "IngeniousPark pathway"],
    ["Present", "Your idea enters"],
  ];

  return (
    <section aria-label="Time tunnel from engineering legacy to modern pathway" className="relative isolate overflow-hidden bg-[#020b13] px-6 py-24 text-white md:min-h-[112vh] md:py-28">
      <style>{`
        @keyframes temporal-ring-drift {
          0% { transform: scale(0.74) rotate(0deg); opacity: 0.12; }
          42% { opacity: 0.48; }
          100% { transform: scale(1.35) rotate(18deg); opacity: 0.08; }
        }
        @keyframes temporal-counter-ring {
          0% { transform: scale(0.82) rotate(0deg); opacity: 0.1; }
          50% { opacity: 0.36; }
          100% { transform: scale(1.22) rotate(-16deg); opacity: 0.08; }
        }
        @keyframes temporal-streak-pulse {
          0% { transform: scaleX(0.22) translateX(-18%); opacity: 0; }
          32% { opacity: 0.72; }
          100% { transform: scaleX(1.1) translateX(20%); opacity: 0; }
        }
        @keyframes temporal-beam-open {
          0%, 20% { transform: translateX(-50%) scaleY(0.12); opacity: 0; }
          55% { opacity: 0.68; }
          100% { transform: translateX(-50%) scaleY(1); opacity: 0.24; }
        }
        @media (prefers-reduced-motion: reduce) {
          .temporal-ring,
          .temporal-streak,
          .temporal-beam {
            animation: none !important;
          }
        }
      `}</style>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(212,160,23,0.22),transparent_28%),radial-gradient(circle_at_54%_42%,rgba(6,182,212,0.16),transparent_36%),linear-gradient(180deg,#241805_0%,#020b13_24%,#020b13_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#FFF5D6] to-transparent opacity-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#020b13] to-transparent" />

      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease: EASE }}
          className="text-center lg:text-left"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[#D4A017]">Temporal Launch Chamber</p>
          <h2 className="mt-5 font-black leading-[1.02] tracking-tight text-[#FFF5D6]" style={{ fontSize: "clamp(2.4rem, 5.5vw, 5rem)" }}>
            Legacy compresses into a corridor of time.
          </h2>
          <div className="mx-auto mt-6 h-[2px] w-24 bg-[#D4A017] lg:mx-0" />
          <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-white/58 lg:mx-0 md:text-[17px]">
            Milestones accelerate through the chamber, then settle into the present pathway.
          </p>
        </motion.div>

        <div className="relative mx-auto flex min-h-[640px] w-full max-w-2xl items-center justify-center overflow-hidden rounded-[32px] border border-[#D4A017]/18 bg-white/[0.025] px-5 py-10 shadow-[0_30px_100px_rgba(0,0,0,0.42)] md:min-h-[720px]">
          <div className="pointer-events-none absolute inset-0 [perspective:900px]">
            <div className="absolute left-1/2 top-[35%] h-[72vw] max-h-[620px] min-h-[300px] w-[72vw] min-w-[300px] max-w-[620px] -translate-x-1/2 -translate-y-1/2">
              {Array.from({ length: 8 }).map((_, i) => (
                <span
                  key={`temporal-ring-${i}`}
                  aria-hidden="true"
                  className="temporal-ring absolute inset-0 rounded-full will-change-transform"
                  style={{
                    border: `1px solid ${i % 3 === 0 ? "rgba(6,182,212,0.35)" : "rgba(212,160,23,0.34)"}`,
                    boxShadow: i % 3 === 0
                      ? "0 0 38px rgba(6,182,212,0.14), inset 0 0 24px rgba(6,182,212,0.08)"
                      : "0 0 42px rgba(212,160,23,0.16), inset 0 0 26px rgba(212,160,23,0.1)",
                    animation: `${i % 2 === 0 ? "temporal-ring-drift" : "temporal-counter-ring"} ${5.6 + i * 0.42}s ease-in-out ${i * 0.18}s infinite alternate`,
                    transform: `scale(${0.48 + i * 0.09})`,
                  }}
                />
              ))}
              {Array.from({ length: 14 }).map((_, i) => (
                <span
                  key={`temporal-streak-${i}`}
                  aria-hidden="true"
                  className="temporal-streak absolute left-1/2 top-1/2 h-px w-[48vw] max-w-[470px] origin-left will-change-transform"
                  style={{
                    background: i % 4 === 0
                      ? "linear-gradient(90deg, rgba(6,182,212,0.65), transparent)"
                      : "linear-gradient(90deg, rgba(212,160,23,0.72), transparent)",
                    transform: `rotate(${i * 25.7}deg)`,
                    animation: `temporal-streak-pulse ${2.4 + (i % 5) * 0.28}s ease-in-out ${i * 0.12}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>

          <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[35%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4A017] shadow-[0_0_42px_rgba(212,160,23,0.9)]" />
          <span
            aria-hidden="true"
            className="temporal-beam pointer-events-none absolute left-1/2 top-[40%] h-[70%] w-28 origin-top -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(212,160,23,0.36),rgba(212,160,23,0.1)_42%,transparent_72%)] blur-lg will-change-transform"
            style={{ animation: "temporal-beam-open 3.2s ease-out 1.2s infinite alternate" }}
          />

          <div className="relative z-10 w-full">
            <div className="mx-auto max-w-xl pt-3">
              {milestones.map((item, i) => (
                <motion.p
                  key={item}
                  initial={prefersReducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9, filter: "blur(3px)" }}
                  whileInView={prefersReducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: [0, 1, 0.72], y: [30, 0, -18], scale: [0.9, 1.02, 1.08], filter: ["blur(3px)", "blur(0px)", "blur(0px)"] }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 1.05, delay: 0.18 + i * 0.16, ease: EASE }}
                  className="transform-gpu border-t border-white/[0.08] py-3 text-center text-sm font-semibold uppercase tracking-[0.14em] text-white/70 [text-shadow:0_0_18px_rgba(212,160,23,0.18)] will-change-[opacity,transform] md:text-base"
                >
                  {item}
                </motion.p>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.95, delay: 1.1, ease: EASE }}
              className="relative mx-auto mt-10 max-w-lg transform-gpu overflow-hidden rounded-[28px] border border-[#D4A017]/35 bg-[#020b13]/86 px-6 py-7 text-center shadow-[0_0_75px_rgba(212,160,23,0.22)] backdrop-blur-sm will-change-[opacity,transform]"
            >
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(212,160,23,0.18),transparent_52%)]" />
              <div className="mx-auto mb-6 h-px w-40 bg-gradient-to-r from-transparent via-[#D4A017] to-transparent" />
              {landingBeats.map(([title, caption], i) => (
                <div key={title} className={`relative py-3 ${i > 0 ? "border-t border-[#D4A017]/20" : ""}`}>
                  <p
                    className={`text-2xl font-black uppercase leading-none tracking-[0.14em] text-white md:text-4xl ${
                      title === "2026" ? "text-[#FFF5D6] drop-shadow-[0_0_18px_rgba(212,160,23,0.75)]" : ""
                    }`}
                  >
                    {title}
                  </p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-[#D4A017] md:text-sm">{caption}</p>
                </div>
              ))}
              <div className="mx-auto mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#D4A017] to-transparent" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
// ─── Section 6 — People of Innovation cinematic scene ────────────────────
const AUDIENCE_ICON_MAP: Record<string, ReactNode> = {
  students: <GraduationCap className="h-5 w-5" />,
  farmers: <Sprout className="h-5 w-5" />,
  makers: <Lightbulb className="h-5 w-5" />,
  researchers: <BookOpen className="h-5 w-5" />,
  startups: <Rocket className="h-5 w-5" />,
  teachers: <School className="h-5 w-5" />,
  grassroots: <Users className="h-5 w-5" />,
  ngos: <Handshake className="h-5 w-5" />,
};

// Innovation Door panel — one cinematic portrait with parallax y based on shared scroll.
// Panels are arranged around the centered headline like doors / film-wall frames.
function InnovationDoor({
  card,
  scrollYProgress,
  pyFrom,
  pyTo,
  scale,
  delay,
}: {
  card: typeof audienceList[number];
  scrollYProgress: import("framer-motion").MotionValue<number>;
  pyFrom: number;
  pyTo: number;
  scale: number;
  delay: number;
}) {
  const y = useTransform(scrollYProgress, [0, 1], [pyFrom, pyTo]);
  return (
    <motion.a
      href="/submit-idea"
      style={{ y }}
      initial={{ opacity: 0, scale: scale * 0.94 }}
      whileInView={{ opacity: 1, scale }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: scale * 1.04, transition: { duration: 0.4, ease: EASE } }}
      className="group relative block aspect-[3/4] overflow-hidden rounded-[18px] border border-white/12 shadow-[0_24px_50px_rgba(0,0,0,0.55)]"
    >
      <LivingMedia
        imageSrc={card.imagePath}
        videoSrc={card.videoSrc}
        alt={card.title}
        accent={card.accent}
        mood={card.mood}
        aspect="auto"
        rounded="rounded-[18px]"
        icon={AUDIENCE_ICON_MAP[card.key]}
        kenBurns
        sweep
        className="h-full w-full"
      />
      {/* Gold door edge accent — top and bottom */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4A017] to-transparent opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D4A017] to-transparent opacity-30 transition-opacity duration-500 group-hover:opacity-90" />
      {/* Darken non-hovered panels slightly */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#020b13]/30 transition-opacity duration-500 group-hover:opacity-0" />
      {/* Label chip */}
      <span
        className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border bg-[#020b13]/75 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] backdrop-blur-sm"
        style={{ borderColor: `${card.accent}55`, color: card.accent }}
      >
        <span className="block h-1.5 w-1.5 rounded-full" style={{ background: card.accent }} />
        {card.title}
      </span>
    </motion.a>
  );
}

// Section 6 — "People of Innovation" cinematic scene.
// Center: headline + subtitle. Around it: 8 portrait doors arranged in two
// flanking columns with depth (alternating scale + parallax y). No grid feel.
function AudienceBento() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Left and right columns — each holds 4 doors with subtle depth variation.
  const leftDoors  = audienceList.slice(0, 4);  // students, farmers, makers, researchers
  const rightDoors = audienceList.slice(4, 8);  // startups, teachers, grassroots, ngos

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-[#020b13] text-white"
    >
      {/* Atmospheric backdrop — film grain + radial gold light from center */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-soft-light"
        style={{ backgroundImage: "url('/innovation-hub/parchment-texture.svg')", backgroundSize: "320px 320px" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(212,160,23,0.32) 0%, rgba(212,160,23,0.10) 35%, transparent 70%)" }}
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 2.2, ease: EASE }}
      />

      {/* Desktop cinematic stage — flanking columns + centered headline */}
      <div className="relative mx-auto hidden min-h-[100svh] max-w-7xl items-center justify-center px-8 py-24 lg:flex lg:py-32">
        {/* Left column of doors */}
        <div className="relative z-10 flex w-[26%] flex-col gap-5">
          {leftDoors.map((a, i) => {
            // Alternating depth: even = closer (scale 1), odd = farther (scale 0.92).
            const isCloser = i % 2 === 0;
            return (
              <div key={a.key} className={isCloser ? "" : "self-end w-[88%]"}>
                <InnovationDoor
                  card={a}
                  scrollYProgress={scrollYProgress}
                  pyFrom={i % 2 === 0 ? -40 : 40}
                  pyTo={i % 2 === 0 ? 30 : -30}
                  scale={isCloser ? 1 : 0.92}
                  delay={0.15 + i * 0.12}
                />
              </div>
            );
          })}
        </div>

        {/* Centered headline panel */}
        <div className="relative z-20 mx-10 flex max-w-[420px] flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-[#D4A017]/40 bg-[#020b13]/65 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.32em] text-[#D4A017] backdrop-blur-sm"
          >
            <span className="block h-1.5 w-1.5 rounded-full bg-[#D4A017]" />
            Open to all innovators
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, delay: 0.15, ease: EASE }}
            className="mt-6 font-black leading-[1.02] tracking-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)" }}
          >
            Eight doors.
            <br />
            <span className="text-[#D4A017]">One innovation pathway.</span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, delay: 0.4, ease: EASE }}
            className="mx-auto mt-4 h-[2px] w-20 origin-left bg-[#D4A017]"
          />
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
            className="mt-6 max-w-md text-sm leading-7 text-blue-100/80 md:text-[15px]"
          >
            Students, farmers, makers, researchers, startups, teachers, grassroots innovators, and community groups — every idea can enter.
          </motion.p>
          <motion.a
            href="/submit-idea"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#D4A017] px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-[#020b13] transition hover:bg-[#f0c040]"
          >
            Enter the hub <ArrowRight className="h-3.5 w-3.5" />
          </motion.a>
        </div>

        {/* Right column of doors */}
        <div className="relative z-10 flex w-[26%] flex-col gap-5">
          {rightDoors.map((a, i) => {
            const isCloser = i % 2 === 0;
            return (
              <div key={a.key} className={isCloser ? "" : "w-[88%]"}>
                <InnovationDoor
                  card={a}
                  scrollYProgress={scrollYProgress}
                  pyFrom={i % 2 === 0 ? 40 : -40}
                  pyTo={i % 2 === 0 ? -30 : 30}
                  scale={isCloser ? 1 : 0.92}
                  delay={0.2 + i * 0.12}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile fallback — vertical cinematic stack */}
      <div className="block px-6 py-24 lg:hidden">
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#D4A017]/40 bg-[#020b13]/65 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.32em] text-[#D4A017] backdrop-blur-sm">
            <span className="block h-1.5 w-1.5 rounded-full bg-[#D4A017]" />
            Open to all innovators
          </span>
          <h2 className="mt-6 font-black leading-[1.02] tracking-tight" style={{ fontSize: "clamp(2rem, 7vw, 3rem)" }}>
            Eight doors.
            <br />
            <span className="text-[#D4A017]">One innovation pathway.</span>
          </h2>
          <div className="mx-auto mt-4 h-[2px] w-20 bg-[#D4A017]" />
          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-blue-100/80">
            Students, farmers, makers, researchers, startups, teachers, grassroots innovators, and community groups — every idea can enter.
          </p>
        </div>
        <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-4">
          {audienceList.map((a, i) => (
            <motion.a
              key={a.key}
              href="/submit-idea"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: i * 0.06, ease: EASE }}
              className="relative block aspect-[16/9] overflow-hidden rounded-[18px] border border-white/12"
            >
              <LivingMedia
                imageSrc={a.imagePath}
                videoSrc={a.videoSrc}
                alt={a.title}
                accent={a.accent}
                mood={a.mood}
                aspect="auto"
                rounded="rounded-[18px]"
                icon={AUDIENCE_ICON_MAP[a.key]}
                className="h-full w-full"
              />
              <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4A017] to-transparent" />
              <span
                className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border bg-[#020b13]/75 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] backdrop-blur-sm"
                style={{ borderColor: `${a.accent}55`, color: a.accent }}
              >
                <span className="block h-1.5 w-1.5 rounded-full" style={{ background: a.accent }} />
                {a.title}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 7 — Idea formats ─────────────────────────────────────────────
function FormatGrid() {
  const glyphMap: Record<string, ReactNode> = {
    online: <Folder className="h-6 w-6" />,
    pdf: <FileText className="h-6 w-6" />,
    sketch: <Pencil className="h-6 w-6" />,
    voice: <Mic className="h-6 w-6" />,
    video: <Video className="h-6 w-6" />,
    photo: <ImageIcon className="h-6 w-6" />,
    offline: <ClipboardCheck className="h-6 w-6" />,
    walkin: <Phone className="h-6 w-6" />,
  };

  return (
    <section className="relative bg-[#FFF5D6] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="max-w-3xl"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#D4A017]">Chapter six</p>
          <h2 className="mt-4 font-black leading-[1.04] tracking-tight text-[#002B5C]" style={{ fontSize: "clamp(2rem, 4.5vw, 3.6rem)" }}>
            Bring it in whatever shape it is.
          </h2>
          <div className="mt-3 h-[2px] w-24 bg-[#D4A017]" />
          <p className="mt-7 max-w-2xl text-base leading-8 text-[#002B5C]/85 md:text-[17px]">
            IngeniousPark accepts every format. The hub adapts to the idea — not the other way around.
          </p>
        </motion.div>

        {/* Intake lane — horizontal feeder line behind the grid, pulses to suggest flow */}
        <div className="relative mt-12">
          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.2, ease: EASE }}
            className="pointer-events-none absolute left-0 right-0 top-1/2 h-px origin-left -translate-y-1/2 bg-gradient-to-r from-transparent via-[#D4A017]/55 to-transparent md:top-[42%]"
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full md:top-[42%]"
            style={{ background: "#D4A017", boxShadow: "0 0 12px rgba(212,160,23,0.75)" }}
            initial={{ x: "-2vw", opacity: 0 }}
            whileInView={{ x: "102vw", opacity: [0, 1, 1, 0] }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 2.4, ease: "easeInOut", delay: 0.4 }}
          />

          {/* Cards in an intake spectrum — each enters as a sheet folding in,
              alternating from above/below the feeder line so it reads like flow */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 [perspective:1200px]">
            {formatList.map((f, i) => {
              const fromAbove = i % 2 === 0;
              return (
                <motion.div
                  key={f.key}
                  initial={{
                    opacity: 0,
                    y: fromAbove ? -38 : 38,
                    rotateX: fromAbove ? 14 : -14,
                    scale: 0.94,
                  }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.7, delay: 0.25 + i * 0.085, ease: EASE }}
                  whileHover={{
                    y: -8,
                    scale: 1.04,
                    boxShadow: "0 22px 44px rgba(0,43,92,0.14)",
                    transition: { duration: 0.3, ease: EASE },
                  }}
                  className="group relative flex flex-col items-center gap-3 rounded-2xl border border-[#002B5C]/10 bg-white/65 p-5 text-center backdrop-blur-sm [transform-style:preserve-3d]"
                >
                  {/* Sequence index — reads like an intake number */}
                  <span className="absolute right-3 top-3 text-[9px] font-black tabular-nums tracking-[0.18em] text-[#002B5C]/35">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF5D6] text-[#D4A017] ring-1 ring-[#D4A017]/25 transition group-hover:bg-[#D4A017] group-hover:text-white">
                    {glyphMap[f.key]}
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[#002B5C]">{f.label}</p>
                  {/* Connector tick to the feeder line */}
                  <motion.span
                    aria-hidden="true"
                    initial={{ scaleY: 0, opacity: 0 }}
                    whileInView={{ scaleY: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: 0.45 + i * 0.085, ease: EASE }}
                    className={`absolute left-1/2 block h-3 w-px -translate-x-1/2 origin-top bg-[#D4A017]/55 ${
                      fromAbove ? "-bottom-3" : "-top-3 origin-bottom"
                    }`}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
          className="mt-14 rounded-3xl bg-[#002B5C] px-6 py-5 text-center text-white"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#D4A017]">Categories don't gatekeep</p>
          <p className="mt-2 text-xs font-bold tracking-[0.18em] text-white/85 sm:text-sm">
            AGRICULTURE · EDUCATION · ENERGY · HEALTH · CIVIC · MATERIALS · SOFTWARE · HARDWARE
          </p>
        </motion.div>

        <div className="mt-10 text-center">
          <a
            href="/offline-form.pdf"
            download
            className="inline-flex items-center gap-2 text-sm font-bold text-[#002B5C] underline decoration-[#D4A017] underline-offset-4 transition hover:text-[#D4A017]"
          >
            Download offline form <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Section 8 — Support magazine sticky-scroll ──────────────────────────
function SupportMagazine() {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [activePillar, setActivePillar] = useState(0);

  useEffect(() => {
    if (!ENABLE_SUPPORT_MEDIA_OBSERVER) return;

    try {
      const section = ref.current;
      if (!section || typeof window === "undefined" || !("IntersectionObserver" in window)) return;

      const mediaQuery = window.matchMedia("(min-width: 1024px)");
      if (!mediaQuery.matches) return;

      const texts = Array.from(section.querySelectorAll<HTMLElement>(".pillar-text"));
      if (texts.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const visibleEntry = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          const nextIndex = visibleEntry ? texts.indexOf(visibleEntry.target as HTMLElement) : -1;
          if (nextIndex >= 0) {
            setActivePillar((current) => (current === nextIndex ? current : nextIndex));
          }
        },
        {
          root: null,
          rootMargin: "-35% 0px -35% 0px",
          threshold: prefersReducedMotion ? [0.1] : [0.1, 0.35, 0.6, 0.85],
        },
      );

      texts.forEach((text) => observer.observe(text));
      return () => observer.disconnect();
    } catch (error) {
      console.error("InnovationHubPage Support media observer disabled after setup error", error);
      return undefined;
    }
  }, [prefersReducedMotion]);

  const iconMap: Record<string, ReactNode> = {
    mentorship: <Handshake className="h-5 w-5" />,
    prototype: <Lightbulb className="h-5 w-5" />,
    review: <ShieldCheck className="h-5 w-5" />,
    ip: <BookOpen className="h-5 w-5" />,
    exhibition: <Trophy className="h-5 w-5" />,
    collaboration: <Network className="h-5 w-5" />,
  };
  const activeSupportPillar = pillarList[activePillar] ?? pillarList[0];

  return (
    <section ref={ref} className="relative bg-[#031727] px-6 py-24 text-white md:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="max-w-3xl"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#D4A017]">Chapter seven</p>
          <h2 className="mt-4 font-black leading-[1.04] tracking-tight" style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)" }}>
            Submission is the start. <span className="text-[#D4A017]">Support is the rest.</span>
          </h2>
          <div className="mt-3 h-[2px] w-24 bg-[#D4A017]" />
          <p className="mt-7 max-w-2xl text-base leading-8 text-blue-100/80 md:text-[17px]">
            Six pillars travel with your idea once it enters the hub.
          </p>
        </motion.div>

        {/* Compact top progress dots — replaces the bulky left pillar list */}
        <div className="mt-10 hidden lg:flex items-center justify-center gap-2">
          {pillarList.map((p, i) => {
            const active = i === activePillar;
            return (
              <motion.span
                key={p.key}
                animate={{
                  width: active ? 28 : 8,
                  backgroundColor: active ? p.accent : "rgba(255,255,255,0.22)",
                  boxShadow: active ? `0 0 12px ${p.accent}66` : "none",
                }}
                transition={{ duration: 0.35, ease: EASE }}
                className="block h-2 rounded-full"
              />
            );
          })}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.05fr]">
          {/* Sticky image column — desktop only */}
          <div className="relative hidden lg:block">
            <div className="sticky top-24">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04]">
                <motion.div
                  key={activeSupportPillar.key}
                  initial={{ opacity: 0, scale: 1.025 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="pillar-photo absolute inset-0 h-full w-full transform-gpu will-change-[opacity,transform]"
                >
                  <LivingMedia
                    imageSrc={activeSupportPillar.imagePath}
                    videoSrc={activeSupportPillar.videoSrc}
                    alt={activeSupportPillar.title}
                    accent={activeSupportPillar.accent}
                    mood={activeSupportPillar.mood}
                    aspect="auto"
                    rounded="rounded-[32px]"
                    icon={iconMap[activeSupportPillar.key]}
                    className="h-full w-full border-0"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/85 drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">{activeSupportPillar.title}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Text column — each pillar gets a full viewport-tall scroll stage on desktop so every
              pillar (including Collaboration, the last one) gets a complete viewing beat. */}
          <ol className="space-y-12 lg:space-y-0">
            {pillarList.map((p, i) => (
              <motion.li
                key={p.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: EASE }}
                className="pillar-text lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:py-8"
              >
                <p className="text-[11px] font-black uppercase tracking-[0.24em]" style={{ color: p.accent }}>
                  Pillar {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-black leading-tight" style={{ fontSize: "clamp(1.5rem, 3.2vw, 2.2rem)" }}>
                  {p.title}
                </h3>
                <p className="mt-3 max-w-xl text-base italic leading-7 text-blue-100/80">
                  {p.tagline}
                </p>
                <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100/65 md:text-base">
                  {p.body}
                </p>

                {/* Mobile image — below text */}
                <div className="mt-6 lg:hidden">
                  <LivingMedia
                    imageSrc={p.imagePath}
                    videoSrc={p.videoSrc}
                    alt={p.title}
                    accent={p.accent}
                    mood={p.mood}
                    aspect="landscape"
                    rounded="rounded-2xl"
                    icon={iconMap[p.key]}
                    caption={p.title}
                    className="border border-white/10"
                  />
                </div>
              </motion.li>
            ))}
            {/* Final Collaboration hold — extra ~60vh of scroll so the last pillar stays visible
                cleanly before the next chapter takes over. Desktop only. */}
            <li aria-hidden="true" className="hidden lg:block" style={{ minHeight: "60vh" }} />
          </ol>
        </div>

        <div className="mt-16 text-center lg:text-left">
          <a
            href="/collaboration"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#D4A017] transition hover:gap-3 hover:text-[#f0c040]"
          >
            Innovation Hub partners <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Signature Transition — Ink Drop ─────────────────────────────────────
function InkDropTransition() {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!ENABLE_INK_DROP_SCROLL_TRIGGER || prefersReducedMotion) return;

    try {
      const ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add("(min-width: 768px)", () => {
          const section = ref.current;
          const stage = stageRef.current;
          if (!section || !stage) return undefined;

          const point = stage.querySelector<HTMLElement>(".ink-drop-point");
          const ink = stage.querySelector<HTMLElement>(".ink-drop-gold");
          const blobs = gsap.utils.toArray<HTMLElement>(".ink-drop-blob", stage);
          const sweep = stage.querySelector<HTMLElement>(".ink-drop-sweep");
          if (!point || !ink || !sweep || blobs.length === 0) return undefined;

          gsap.set(point, { opacity: 0, scale: 0.3 });
          gsap.set(ink, { opacity: 0, scale: 0.02, transformOrigin: "50% 42%" });
          gsap.set(blobs, { opacity: 0, scale: 0.08, transformOrigin: "50% 50%" });
          gsap.set(sweep, { opacity: 0, x: "-120%" });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=95%",
              scrub: 1,
              pin: stage,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          tl.to(point, { opacity: 1, scale: 1, duration: 0.12, ease: "power2.out" }, 0)
            .to(ink, { opacity: 0.9, scale: 1, duration: 0.34, ease: "power2.inOut" }, 0.08)
            .to(blobs, { opacity: 0.72, scale: (i) => 1.15 + i * 0.12, duration: 0.34, stagger: 0.025, ease: "power2.out" }, 0.1)
            .to(sweep, { opacity: 1, x: "120%", duration: 0.32, ease: "power2.inOut" }, 0.32)
            .to([ink, blobs, point], { opacity: 0, scale: "+=0.18", duration: 0.24, ease: "power2.out" }, 0.62);

          return () => tl.scrollTrigger?.kill();
        });
        return () => mm.revert();
      }, ref);
      return () => ctx.revert();
    } catch (error) {
      console.error("InnovationHubPage InkDropTransition disabled after setup error", error);
      return undefined;
    }
  }, [prefersReducedMotion]);

  return (
    <section ref={ref} aria-label="Gold ink transition into local-to-world video" className="relative overflow-hidden bg-[#020b13] md:h-[95vh]">
      <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0">
        <filter id="innovation-ink-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.034" numOctaves="3" seed="8" />
          <feDisplacementMap in="SourceGraphic" scale="28" />
          <feGaussianBlur stdDeviation="0.4" />
        </filter>
      </svg>

      <div className="md:hidden relative overflow-hidden bg-[#020b13] px-6 py-16">
        <div className="relative mx-auto h-24 max-w-3xl overflow-hidden rounded-[24px] border border-[#D4A017]/20 bg-[#020b13]">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4A017] shadow-[0_0_42px_rgba(212,160,23,0.9)]" />
          <motion.div
            aria-hidden="true"
            initial={{ x: "-110%", opacity: 0 }}
            whileInView={{ x: "110%", opacity: [0, 1, 0] }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.35, ease: "easeInOut" }}
            className="pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-[#D4A017]/50 to-transparent"
          />
        </div>
      </div>

      <div ref={stageRef} className="hidden h-screen overflow-hidden bg-[#020b13] md:block">
        <div className="pointer-events-none absolute inset-0 bg-[#020b13]" />
        <div
          aria-hidden="true"
          className="ink-drop-gold pointer-events-none absolute left-1/2 top-[42%] h-[62vmax] w-[62vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4A017]"
          style={{ filter: "url(#innovation-ink-filter)", willChange: "transform, opacity" }}
        />
        {[
          ["left-[45%]", "top-[34%]", "h-[22vmax]", "w-[24vmax]"],
          ["left-[58%]", "top-[47%]", "h-[28vmax]", "w-[23vmax]"],
          ["left-[38%]", "top-[53%]", "h-[20vmax]", "w-[28vmax]"],
        ].map(([left, top, height, width], i) => (
          <span
            key={`ink-blob-${i}`}
            aria-hidden="true"
            className={`ink-drop-blob pointer-events-none absolute ${left} ${top} ${height} ${width} -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4A017]/85 blur-lg`}
            style={{ willChange: "transform, opacity" }}
          />
        ))}
        <div className="ink-drop-point pointer-events-none absolute left-1/2 top-[42%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4A017] shadow-[0_0_42px_rgba(212,160,23,0.9)]" />
        <div className="ink-drop-sweep pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#FFF5D6]/45 to-transparent" />
      </div>
    </section>
  );
}

// ─── Section 9 — Mysuru to the world — VIDEO-LED ONLY ────────────────────
function ArcMap() {
  return (
    <section className="relative isolate overflow-hidden bg-[#02111f] px-6 py-24 text-white md:py-32">
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#D4A017]">Chapter eight</p>
          <h2 className="mt-4 font-black leading-[1.04] tracking-tight" style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)" }}>
            From Mysuru. <span className="text-[#06b6d4]">To Bharat.</span> To the world.
          </h2>
          <div className="mx-auto mt-3 h-[2px] w-24 bg-gradient-to-r from-[#D4A017] to-[#06b6d4]" />
          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-blue-100/80 md:text-[17px]">
            A local idea, properly supported, can travel further than its origin imagined.
          </p>
        </motion.div>

        {/* Cinematic video frame — lift-off curtain reveal. Black panels split horizontally
            and slide outward, revealing the looping pathway video underneath. */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: EASE }}
          className="relative mt-14 overflow-hidden rounded-[28px] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
        >
          <video
            src="/innovation-hub/video/local-to-global-loop.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="From Mysuru to Bharat to the world — cinematic pathway loop"
            className="block aspect-[16/9] w-full object-cover"
          />
          {/* Curtain panels — left half */}
          <motion.div
            aria-hidden="true"
            initial={{ x: 0 }}
            whileInView={{ x: "-101%" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.7, 0, 0.3, 1] }}
            className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-[#02111f]"
          />
          <motion.div
            aria-hidden="true"
            initial={{ x: 0 }}
            whileInView={{ x: "101%" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.7, 0, 0.3, 1] }}
            className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[#02111f]"
          />
          {/* Gold seam at the meeting line, fades out as curtains part */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0.9, scaleY: 1 }}
            whileInView={{ opacity: 0, scaleY: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.4, delay: 0.2, ease: EASE }}
            className="pointer-events-none absolute inset-y-0 left-1/2 w-px"
            style={{ background: "linear-gradient(180deg, transparent, #D4A017, transparent)", boxShadow: "0 0 16px rgba(212,160,23,0.7)" }}
          />
          {/* Very light cinematic vignette — does not hide the video */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_55%,rgba(2,11,19,0.45)_100%)]" />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Section 10 — Final CTA ───────────────────────────────────────────────
function FinalCTA() {
  const ease = [0.16, 1, 0.3, 1] as const;
  return (
    <section className="relative isolate overflow-hidden bg-[#020b13] px-6 py-20 text-white md:py-28">
      <div className="relative mx-auto max-w-3xl text-center">
        <div className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden">
          {/* Subtle gold radial glow behind the closing statement */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: "600px",
              height: "300px",
              background:
                "radial-gradient(ellipse, rgba(212,160,23,0.07) 0%, transparent 70%)",
              zIndex: 0,
            }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease }}
            className="relative z-[1] uppercase"
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.25em",
              color: "rgba(212,160,23,0.6)",
              marginBottom: "2rem",
              fontWeight: 800,
            }}
          >
            INGENIOUSPARK · MYSURU
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease }}
            className="relative z-[1] font-black leading-[0.95] text-white"
            style={{ fontSize: "clamp(3rem, 7vw, 6.5rem)", fontWeight: 900 }}
          >
            The tradition continues.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.15, ease }}
            className="relative z-[1] font-black leading-[0.95] text-[#D4A017]"
            style={{
              fontSize: "clamp(3rem, 7vw, 6.5rem)",
              fontWeight: 900,
              marginTop: "0.2rem",
            }}
          >
            Your idea is next.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.35, ease }}
            className="relative z-[1] uppercase"
            style={{
              fontSize: "0.95rem",
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.1em",
              marginTop: "2.5rem",
            }}
          >
            Where Mysuru's legacy meets your future.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.4, ease: EASE }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="/submit-idea"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#D4A017] px-7 py-3.5 text-sm font-black text-[#020b13] shadow-xl shadow-[#D4A017]/25 transition hover:bg-[#f0c040]"
          >
            <Lightbulb className="h-4 w-4" /> Submit Idea
          </a>
          <a
            href="/track-idea"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/25 px-7 py-3.5 text-sm font-black text-white transition hover:border-white/55 hover:bg-white/5"
          >
            Track Idea
          </a>
          <a
            href="/membership"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-7 py-3.5 text-sm font-black text-white/85 transition hover:border-white/45 hover:bg-white/5"
          >
            Become a Member
          </a>
          <a
            href="/collaboration"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-7 py-3.5 text-sm font-black text-white/85 transition hover:border-white/45 hover:bg-white/5"
          >
            Collaborate
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
          className="mt-7 text-xs text-[#D4A017]/75"
        >
          Free to submit · Any format accepted · Kannada, Hindi, and regional languages welcome
        </motion.p>
      </div>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────
export default function InnovationHubPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#FFF5D6] text-slate-950">
      <PublicSiteHeader currentPath="/innovation-hub" />
      <MobileBackButton />

      <HeroLegacy />
      <RecoverySeparator tone="cream" />
      <CityOfVision />
      <SceneSeam label="Wodeyar Vision" accent="#D4A017" />
      <WodeyarVision />
      <SceneSeam label="Sir M. Visvesvaraya" accent="#D4A017" />
      <MVBlueprint />
      <TimeTunnelTransition />
      <HubIntro />
      <RecoverySeparator tone="navy" />
      <AudienceBento />
      <SceneSeam label="Intake spectrum" accent="#D4A017" />
      <FormatGrid />
      <RecoverySeparator tone="creamToNavy" />
      <SupportMagazine />
      <InkDropTransition />
      <ArcMap />
      <FinalCTA />

      <PublicSiteFooter />
    </main>
  );
}
