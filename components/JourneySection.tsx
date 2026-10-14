import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fadeUp, EASE } from "../types";
import { journeySteps } from "../data";
import { lazy, Suspense } from "react";

const JourneySpline = lazy(() => import("./JourneySpline"));

gsap.registerPlugin(ScrollTrigger);

const STEP_ACCENTS = [
  "bg-gradient-to-r from-[#002B5C] to-[#003B73]",
  "bg-gradient-to-r from-[#D4A017] to-[#b8870f]",
  "bg-gradient-to-r from-indigo-400 to-indigo-600",
];
const STEP_BADGES = ["bg-[#002B5C]", "bg-[#D4A017]", "bg-indigo-500"];

type JourneyStep = (typeof journeySteps)[number];

interface StepIconProps {
  item: JourneyStep;
  index: number;
  activeStep: number | null;
  setActiveStep: (i: number | null) => void;
  onIconEnter: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onIconLeave: (e: React.MouseEvent<HTMLButtonElement>, active: boolean) => void;
  prefersReducedMotion: boolean | null;
}

function StepIcon({ item, index: i, activeStep, setActiveStep, onIconEnter, onIconLeave, prefersReducedMotion }: StepIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px 0px" });

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 md:gap-3">
      <motion.button
        type="button"
        onClick={() => setActiveStep(activeStep === i ? null : i)}
        onMouseEnter={onIconEnter}
        onMouseLeave={(e) => onIconLeave(e, activeStep === i)}
        animate={inView && !prefersReducedMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: prefersReducedMotion ? 1 : 0, scale: prefersReducedMotion ? 1 : 0.7, y: prefersReducedMotion ? 0 : 12 }}
        transition={{ type: "spring", stiffness: 320, damping: 22, delay: i * 0.13 }}
        className={`relative flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-2xl shadow-lg transition-shadow duration-300 ${item.iconBg} ${
          activeStep === i ? "shadow-xl" : "hover:shadow-xl"
        }`}
        style={activeStep === i ? { boxShadow: `0 0 28px ${item.glowColor}` } : undefined}
      >
        <item.Icon className={`h-6 w-6 md:h-8 md:w-8 ${item.iconColor}`} />
        <span className={`absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black text-white shadow-sm ${STEP_BADGES[i]}`}>
          {i + 1}
        </span>
      </motion.button>
      <div className="text-center">
        <span className={`block text-[9px] md:text-[11px] font-black uppercase tracking-[0.18em] md:tracking-[0.22em] ${item.iconColor}`}>
          Step {item.step}
        </span>
        <span className="block text-xs md:text-sm font-semibold text-white leading-tight">{item.title}</span>
      </div>
    </div>
  );
}

interface Props {
  onScrollTo: (id: string) => void;
  prefersReducedMotion: boolean | null;
}

export default function JourneySection({ onScrollTo, prefersReducedMotion }: Props) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const splineProgress = useRef(0);
  const [visibleLine, setVisibleLine] = useState(0);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisibleLine(100);
      splineProgress.current = 1;
      return;
    }
    const trigger = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top 68%",
      end: "bottom 72%",
      scrub: 0.5,
      onUpdate: (self) => {
        splineProgress.current = self.progress;
        setVisibleLine(self.progress * 100);
      },
    });
    return () => trigger.kill();
  }, [prefersReducedMotion]);

  const onIconEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion) return;
    gsap.to(e.currentTarget, { scale: 1.18, duration: 0.22, ease: "back.out(2.5)" });
  };
  const onIconLeave = (e: React.MouseEvent<HTMLButtonElement>, active: boolean) => {
    gsap.to(e.currentTarget, { scale: active ? 1.08 : 1, duration: 0.3, ease: "power2.out" });
  };

  return (
    <section id="journey" className="bg-[#031727] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-sm md:p-12"
        >
          {/* Header */}
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#06b6d4]">
              How it moves forward
            </p>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
              A simple journey from local connection to wider opportunity
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              You do not need to understand the full ecosystem on day one — begin locally,
              stay engaged, and grow into larger opportunities over time.
            </p>
          </div>

          {/* 3D spline — lazy loaded */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/3">
            <Suspense fallback={<div className="h-[130px] flex items-center justify-center text-sm text-slate-400">Loading…</div>}>
              <JourneySpline progressRef={splineProgress} prefersReducedMotion={prefersReducedMotion} />
            </Suspense>
          </div>

          {/* Icon stepper row + animated connector line — all screen sizes */}
          <div ref={triggerRef} className="relative mt-10">
            {/* Track line */}
            <div
              className="absolute top-7 md:top-8 h-[3px] rounded-full bg-slate-200"
              style={{ left: "16.66%", right: "16.66%" }}
            >
              {/* Animated fill */}
              <div
                className="h-full origin-left rounded-full bg-gradient-to-r from-[#002B5C] via-[#D4A017] to-indigo-500 transition-none"
                style={{ width: `${visibleLine}%` }}
              />
              {/* Glowing leading dot */}
              <div
                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-md ring-2 ring-[#D4A017] transition-none"
                style={{ left: `calc(${visibleLine}% - 6px)` }}
              />
            </div>

            {/* Step icons */}
            <div className="relative grid grid-cols-3">
              {journeySteps.map((item, i) => (
                <StepIcon
                  key={item.step}
                  item={item}
                  index={i}
                  activeStep={activeStep}
                  setActiveStep={setActiveStep}
                  onIconEnter={onIconEnter}
                  onIconLeave={onIconLeave}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </div>
          </div>

          {/* Step cards */}
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {journeySteps.map((item, i) => (
              // Outer: entrance animation
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.13, ease: EASE }}
              >
                {/* Inner: hover spring animation */}
                <motion.div
                  whileHover={{ scale: 1.025, y: -6 }}
                  transition={{ type: "spring", stiffness: 280, damping: 20 }}
                  className={`relative overflow-hidden rounded-3xl border bg-white/5 cursor-pointer transition-colors duration-300 hover:bg-white/8 ${
                    activeStep === i ? item.border : "border-white/10"
                  }`}
                >
                  {/* Colored top accent bar */}
                  <div className={`h-1.5 w-full ${STEP_ACCENTS[i]}`} />

                  <div className="relative p-6">
                    {/* Ghost step number */}
                    <span className="pointer-events-none absolute right-4 top-0 select-none text-[96px] font-black leading-none text-slate-900 opacity-[0.05]">
                      {item.step}
                    </span>

                    {/* Step badge — visible on mobile (desktop has icon row) */}
                    <div className="mb-4 md:hidden">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-white ${STEP_BADGES[i]}`}>
                        Step {item.step}
                      </span>
                    </div>

                    {/* Desktop: compact step label */}
                    <p className={`hidden text-[11px] font-black uppercase tracking-[0.22em] md:block ${item.iconColor}`}>
                      Step {item.step}
                    </p>

                    <h3 className="mt-2 text-xl font-bold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{item.text}</p>

                    <AnimatePresence>
                      {activeStep === i && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.28, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <div className={`mt-4 rounded-2xl border ${item.border} bg-white/5 p-4 text-sm leading-7 text-slate-300`}>
                            {item.detail}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      type="button"
                      onClick={() => setActiveStep(activeStep === i ? null : i)}
                      className={`mt-4 text-xs font-semibold transition hover:underline ${item.iconColor}`}
                    >
                      {activeStep === i ? "Show less ↑" : "Learn more ↓"}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Flow arrow labels between cards (desktop) */}
          <div className="mt-4 hidden items-center justify-center gap-4 md:flex">
            <span className="text-xs font-semibold text-slate-500">Register your interest</span>
            <span className="text-slate-600">→</span>
            <span className="text-xs font-semibold text-slate-500">Connect locally</span>
            <span className="text-slate-600">→</span>
            <span className="text-xs font-semibold text-slate-500">Grow into wider pathways</span>
          </div>

          {/* CTA */}
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => onScrollTo("register-interest")}
              className="magnetic-btn rounded-xl bg-slate-950 px-7 py-3.5 font-semibold text-white shadow-lg transition hover:shadow-xl"
            >
              Begin Step 01 →
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
