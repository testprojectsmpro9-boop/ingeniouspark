import { motion } from "framer-motion";
import { Lightbulb, Search } from "lucide-react";
import { EASE } from "../types";

export default function FinalCTASection() {
  return (
    <section id="homepage-final-cta" className="relative overflow-hidden bg-[#031727] px-5 py-20 sm:px-6 sm:py-28 md:py-36">
      {/* Subtle showcase image — robust bg-image, sits over WebGL, under content */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.22]"
        style={{ backgroundImage: 'url("/homepage-visuals/12.jpeg")' }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020b13]/90 via-[#020b13]/55 to-[#020b13]/72" />
      {/* convergence glow + arrival rings */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(212,160,23,0.24), rgba(6,182,212,0.06) 45%, transparent 70%)" }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 hidden aspect-square w-[46vh] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4A017]/12 md:block" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 hidden aspect-square w-[64vh] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#06b6d4]/10 md:block" />

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: EASE }}
          className="text-sm font-semibold uppercase tracking-[0.22em] text-[#D4A017]"
        >
          Open to everyone
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="mt-4 leading-[0.95] tracking-tight text-white"
          style={{ fontSize: "clamp(2.75rem, 9vw, 8rem)", fontWeight: 900 }}
        >
          Your idea is ready.
          <br />
          <span style={{ color: "#D4A017" }}>Bring it on.</span>
        </motion.h2>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.48, delay: 0.26, ease: EASE }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="/submit-idea"
            className="magnetic-btn inline-flex items-center gap-2.5 rounded-2xl bg-[#D4A017] px-9 py-4 text-sm font-bold text-[#020b13] shadow-xl shadow-[#D4A017]/20 transition hover:bg-[#f0c040] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A017]"
          >
            <Lightbulb className="h-5 w-5" aria-hidden="true" />
            Submit Idea
          </a>
          <a
            href="/track-idea"
            className="magnetic-btn inline-flex items-center gap-2.5 rounded-2xl border-2 border-white/30 px-9 py-4 text-sm font-bold text-white backdrop-blur-sm transition hover:border-white/60 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
            Track Idea
          </a>
        </motion.div>

        {/* Trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.34, ease: EASE }}
          className="mt-7 text-xs text-[#D4A017]/70"
        >
          Free now and always · Any format accepted · Kannada, Hindi & regional languages welcome
        </motion.p>
      </div>
    </section>
  );
}
