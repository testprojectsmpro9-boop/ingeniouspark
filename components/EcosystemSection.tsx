import { lazy, Suspense, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, CheckCircle2 } from "lucide-react";
import { fadeUp } from "../types";
import { missionVision, ifiaOfferings, invHighlights } from "../data";
import BrandImage from "./BrandImage";

const EcosystemDiagram = lazy(() => import("./EcosystemDiagram"));

interface Props {
  prefersReducedMotion: boolean | null;
}

export default function EcosystemSection({ prefersReducedMotion }: Props) {
  const [showAll, setShowAll] = useState(false);
  const [showInvDetails, setShowInvDetails] = useState(false);
  const visibleOfferings = showAll ? ifiaOfferings : ifiaOfferings.slice(0, 4);

  return (
    <section id="ecosystem" className="bg-[#020b13] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#06b6d4]">
            How NMF connects Mysuru Region to the IFIA ecosystem
          </p>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            Bringing larger innovation opportunities closer to Mysuru Region
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            IFIA Bharat represents a broader innovation ecosystem shaped by programs, events, recognition pathways, exposure, and meaningful connections.
          </p>
        </motion.div>

        {/* New connected ecosystem diagram — lazy loaded */}
        <div className="mt-4 rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-sm" style={{ minHeight: 360 }}>
          <Suspense fallback={<div className="flex h-[340px] items-center justify-center text-sm text-slate-400">Loading diagram…</div>}>
            <EcosystemDiagram prefersReducedMotion={prefersReducedMotion} />
          </Suspense>
        </div>

        {/* Mission / Vision */}
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {missionVision.map((item) => (
            <div key={item.title} className={`mv-card rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm`}>
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 shadow-sm ${item.color}`}>
                <item.Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.text}</p>
            </div>
          ))}
        </div>

        {/* NMF + Offerings panels */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="rounded-[32px] border border-[#06b6d4]/20 bg-[#06b6d4]/5 p-8 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <BrandImage src="/mnf-logo.png" alt="NMF logo" label="NMF" className="h-14 w-14 rounded-full object-cover" />
              <div>
                <p className="text-sm font-medium text-[#06b6d4]">Why this begins with NMF</p>
                <h3 className="text-xl font-bold text-white">How NMF makes this ecosystem accessible locally</h3>
              </div>
            </div>
            <p className="mt-6 text-sm leading-7 text-slate-300">
              NMF is the local access point that brings this ecosystem within reach for Mysuru Region. By creating participation,
              simplifying access, and building trusted local engagement, NMF helps individuals and institutions step into
              larger innovation opportunities.
            </p>
            <div className="mt-6 rounded-2xl bg-white/5 p-4 text-sm leading-7 text-slate-300">
              From local events and community engagement to access to innovation platforms, workshops, mentorship pathways,
              and global ecosystem connections — NMF makes these feel accessible.
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-sm"
          >
            <h3 className="text-xl font-bold text-white">Access to facilities and opportunities through NMF</h3>
            <p className="mt-4 text-slate-300">Through NMF, people in Mysuru Region can connect to a wider innovation ecosystem.</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={showAll ? "expanded" : "collapsed"}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28 }}
                className="overflow-hidden"
              >
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {visibleOfferings.map((item) => (
                    <div key={item} className="flex items-start gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm leading-6 text-slate-300">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#06b6d4]" />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="mt-6 text-center">
              <button type="button" onClick={() => setShowAll((v) => !v)} className="text-sm font-semibold text-[#002B5C] hover:underline">
                {showAll ? "Show less ↑" : "Show all offerings ↓"}
              </button>
            </div>
          </motion.div>
        </div>

        {/* INV Title */}
        <div className="mt-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="rounded-[32px] border border-indigo-400/20 bg-indigo-950/30 p-8 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100">
                <Award className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="inline-flex rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
                IFIA Bharat recognition pathway
              </div>
            </div>
            <h3 className="mt-4 text-2xl font-bold text-white">INV Title</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              A distinguished recognition for inventors and innovators, acknowledging genuine inventive contribution and professional standing.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {invHighlights.map((item) => (
                <div key={item} className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                  {item}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setShowInvDetails((v) => !v)} className="mt-6 text-sm font-semibold text-indigo-700 hover:underline">
              {showInvDetails ? "Show less about INV Title ↑" : "Know more about INV Title →"}
            </button>
            <AnimatePresence initial={false}>
              {showInvDetails && (
                <motion.div
                  initial={{ opacity: 0, y: 16, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: 8, height: 0 }}
                  transition={{ duration: 0.28 }}
                  className="mt-6 overflow-hidden rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm"
                >
                  <h4 className="text-lg font-bold text-slate-900">About the INV Title</h4>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    The INV title is presented by IFIA Bharat as a formal recognition pathway for inventors and innovators.
                    It acknowledges genuine inventive contribution, professional standing, and participation in a larger global
                    recognition ecosystem.
                  </p>
                  <div className="mt-5 grid gap-3">
                    {[
                      "Applications are processed through IFIA Bharat, while final approval rests with the IFIA Global Executive Council.",
                      "Eligibility may include holding a patent, receiving an IFIA-patronized invention award, or an official recommendation.",
                      "Benefits can include recognition, exhibition-related support, ecosystem visibility, and networking through the wider IFIA framework.",
                    ].map((text) => (
                      <div key={text} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">{text}</div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
