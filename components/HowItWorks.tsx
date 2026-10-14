import { motion } from "framer-motion";
import { Send, ClipboardCheck, Search, Scale, Zap, Trophy } from "lucide-react";
import { fadeUp, EASE } from "../types";

const STEPS = [
  {
    num: 1,
    Icon: Send,
    title: "Submit Idea",
    desc: "Fill a simple online or offline form to share your idea with us.",
    iconBg: "bg-[#EAF2FB]",
    iconColor: "text-[#002B5C]",
    numBg: "bg-[#002B5C]",
    cardBorder: "border-[#BFD7EA]",
    accentBar: "bg-[#002B5C]",
  },
  {
    num: 2,
    Icon: ClipboardCheck,
    title: "Admin Verification",
    desc: "Our team checks your submission for completeness and basic eligibility.",
    iconBg: "bg-[#FFF5D6]",
    iconColor: "text-[#002B5C]",
    numBg: "bg-[#D4A017]",
    cardBorder: "border-[#D4A017]/30",
    accentBar: "bg-[#D4A017]",
  },
  {
    num: 3,
    Icon: Search,
    title: "Public Domain Check",
    desc: "The idea is reviewed against publicly known knowledge to confirm originality.",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-700",
    numBg: "bg-indigo-500",
    cardBorder: "border-indigo-200",
    accentBar: "bg-indigo-400",
  },
  {
    num: 4,
    Icon: Scale,
    title: "Jury Review",
    desc: "Field-specific experts evaluate impact, originality, and real-world feasibility.",
    iconBg: "bg-[#EAF2FB]",
    iconColor: "text-[#003B73]",
    numBg: "bg-[#003B73]",
    cardBorder: "border-[#BFD7EA]",
    accentBar: "bg-[#003B73]",
  },
  {
    num: 5,
    Icon: Zap,
    title: "Prototype & Mentorship",
    desc: "Selected ideas receive expert mentorship, incubation support, and prototyping help.",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
    numBg: "bg-amber-500",
    cardBorder: "border-amber-200",
    accentBar: "bg-amber-400",
  },
  {
    num: 6,
    Icon: Trophy,
    title: "Wider Opportunities",
    desc: "Top ideas access local, national, and international recognition and innovation platforms.",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-700",
    numBg: "bg-rose-500",
    cardBorder: "border-rose-200",
    accentBar: "bg-rose-400",
  },
] as const;

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#02111f] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#06b6d4]">
            Simple and transparent
          </p>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            How This Platform Works
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            A clear, step-by-step path from submitting your idea to reaching wider
            innovation opportunities — no technical background needed.
          </p>
        </motion.div>

        {/* ── Desktop: horizontal stepper ──────────────────────────────── */}
        <div className="relative mt-14 hidden lg:block">
          {/* Track line */}
          <div
            className="absolute h-0.5 rounded-full bg-white/10"
            style={{ top: "28px", left: "calc(8.33% + 28px)", right: "calc(8.33% + 28px)" }}
          />
          {/* Animated gradient fill */}
          <motion.div
            className="absolute h-0.5 rounded-full bg-gradient-to-r from-[#002B5C] via-[#D4A017] to-[#003B73]"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
            style={{
              top: "28px",
              left: "calc(8.33% + 28px)",
              right: "calc(8.33% + 28px)",
              transformOrigin: "left center",
            }}
          />

          {/* Icon row */}
          <div className="relative grid grid-cols-6">
            {STEPS.map((step, i) => (
              <div key={step.num} className="flex flex-col items-center gap-3">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 260, damping: 22 }}
                  className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl shadow-md ${step.iconBg}`}
                >
                  <step.Icon className={`h-6 w-6 ${step.iconColor}`} aria-hidden="true" />
                  <span
                    className={`absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black text-white shadow-sm ${step.numBg}`}
                  >
                    {step.num}
                  </span>
                </motion.div>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${step.iconColor}`}>
                  Step {step.num}
                </span>
              </div>
            ))}
          </div>

          {/* Description cards — 2 rows of 3 to keep text readable */}
          <div className="mt-8 grid grid-cols-3 gap-5">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.08, ease: EASE }}
                whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 22 } }}
                className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 ${step.cardBorder}`}
              >
                <div className={`absolute left-0 top-0 h-1 w-full ${step.accentBar}`} />
                <div className="flex items-center gap-2.5 pt-1">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${step.iconBg}`}>
                    <step.Icon className={`h-4 w-4 ${step.iconColor}`} aria-hidden="true" />
                  </div>
                  <h3 className="text-sm font-bold text-white">{step.title}</h3>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Mobile / tablet: vertical stacked steps ──────────────────── */}
        <div className="mt-10 flex flex-col lg:hidden">
          {STEPS.map((step, i) => (
            <div key={step.num}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.42, delay: i * 0.07, ease: EASE }}
                className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 ${step.cardBorder}`}
              >
                {/* Colored left accent */}
                <div className={`absolute bottom-0 left-0 top-0 w-1 ${step.accentBar}`} />
                <div className="flex items-start gap-4 pl-3">
                  <div className={`relative shrink-0 flex h-12 w-12 items-center justify-center rounded-xl ${step.iconBg}`}>
                    <step.Icon className={`h-5 w-5 ${step.iconColor}`} aria-hidden="true" />
                    <span
                      className={`absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black text-white shadow-sm ${step.numBg}`}
                    >
                      {step.num}
                    </span>
                  </div>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${step.iconColor}`}>
                      Step {step.num}
                    </p>
                    <h3 className="mt-0.5 text-sm font-bold text-white">{step.title}</h3>
                    <p className="mt-1.5 text-xs leading-5 text-slate-400">{step.desc}</p>
                  </div>
                </div>
              </motion.div>

              {/* Connector arrow between steps */}
              {i < STEPS.length - 1 && (
                <div className="flex items-center justify-center py-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-sm text-slate-400">
                    ↓
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Flow summary — desktop only */}
        <div className="mt-6 hidden items-center justify-center gap-2 lg:flex flex-wrap">
          {STEPS.map((step, i) => (
            <div key={step.num} className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${step.iconColor}`}>{step.title}</span>
              {i < STEPS.length - 1 && <span className="text-slate-300 text-sm">→</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
