import { motion } from "framer-motion";
import {
  ClipboardCheck, Globe, Scale,
  Sparkles, TrendingUp, CheckCircle2,
  Layers, Wrench, Heart, Info,
} from "lucide-react";
import { fadeUp, EASE } from "../types";

const LEVELS = [
  {
    num: 1,
    Icon: ClipboardCheck,
    title: "Submission Completeness Check",
    who: "NMF Admin Team",
    desc: "Every submission is first reviewed by our team to confirm it includes enough information to proceed — name, contact, idea description, and field. Incomplete submissions are returned with guidance, not rejected.",
    note: "You will hear back within 7 working days.",
    iconBg: "bg-[#EAF2FB]",
    iconColor: "text-[#002B5C]",
    numBg: "bg-[#002B5C]",
    cardBg: "bg-[#EAF2FB]",
    border: "border-[#BFD7EA]",
    accentBar: "bg-[#002B5C]",
  },
  {
    num: 2,
    Icon: Globe,
    title: "Public Domain Knowledge Review",
    who: "NMF Research Desk",
    desc: "Your idea is cross-checked against publicly available knowledge — patents, research papers, existing products, and prior art. This step ensures we are evaluating genuinely new contributions, and helps us give you honest feedback.",
    note: "This is not elimination — it is due diligence.",
    iconBg: "bg-[#FFF5D6]",
    iconColor: "text-[#002B5C]",
    numBg: "bg-[#D4A017]",
    cardBg: "bg-[#FFF5D6]",
    border: "border-[#D4A017]/30",
    accentBar: "bg-[#D4A017]",
  },
  {
    num: 3,
    Icon: Scale,
    title: "Field-Specific Jury Evaluation",
    who: "Domain Experts",
    desc: "Ideas that clear the first two levels are sent to one to three jury members with expertise in the relevant field — medical, agriculture, AI, environment, education, engineering, social innovation, and others. Jury members evaluate using published, fair criteria.",
    note: "All jury decisions are documented and available on request.",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-700",
    numBg: "bg-indigo-500",
    cardBg: "bg-indigo-50",
    border: "border-indigo-200",
    accentBar: "bg-indigo-400",
  },
] as const;

const CRITERIA = [
  {
    Icon: Sparkles,
    title: "Originality",
    desc: "Is the idea new, or does it meaningfully improve on what already exists?",
    iconBg: "bg-[#EAF2FB]",
    iconColor: "text-[#002B5C]",
    border: "border-[#BFD7EA]",
  },
  {
    Icon: TrendingUp,
    title: "Impact",
    desc: "Does it solve a real problem and improve lives in a measurable way?",
    iconBg: "bg-[#FFF5D6]",
    iconColor: "text-[#002B5C]",
    border: "border-[#D4A017]/25",
  },
  {
    Icon: CheckCircle2,
    title: "Feasibility",
    desc: "Can it actually be built or implemented with available resources?",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-700",
    border: "border-indigo-200",
  },
  {
    Icon: Layers,
    title: "Scalability",
    desc: "Can this idea grow beyond one person, one village, or one use case?",
    iconBg: "bg-[#EAF2FB]",
    iconColor: "text-[#003B73]",
    border: "border-[#BFD7EA]",
  },
  {
    Icon: Wrench,
    title: "Prototype Readiness",
    desc: "Has any part of this idea been tried, built, or tested — even roughly?",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
    border: "border-amber-200",
  },
  {
    Icon: Heart,
    title: "Practical Usefulness",
    desc: "Will real people benefit from this in everyday life, work, or community?",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-700",
    border: "border-rose-200",
  },
] as const;

const JURY_FIELDS = [
  "Medical & Health", "Agriculture", "Education", "Artificial Intelligence",
  "Environment", "Engineering", "Social Innovation", "Rural Development",
  "Water & Sanitation", "Renewable Energy",
];

export default function EvaluationProcess() {
  return (
    <section id="evaluation" className="bg-[#031727] px-6 py-20">
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
            Fair, transparent, and field-specific
          </p>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            Evaluation Process
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Every idea goes through a clear, structured review. You will always
            know where your idea stands and why.
          </p>
        </motion.div>

        {/* 3 Level cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {LEVELS.map((lv, i) => (
            <motion.div
              key={lv.num}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: EASE }}
              className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-sm`}
            >
              {/* Top accent */}
              <div className={`h-1.5 w-full ${lv.accentBar}`} />

              <div className="p-6">
                {/* Level badge + icon */}
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black text-white shadow-sm ${lv.numBg}`}
                  >
                    L{lv.num}
                  </span>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${lv.iconBg}`}>
                    <lv.Icon className={`h-5 w-5 ${lv.iconColor}`} aria-hidden="true" />
                  </div>
                </div>

                {/* Titles */}
                <p className={`mt-4 text-[10px] font-black uppercase tracking-[0.2em] ${lv.iconColor}`}>
                  Level {lv.num} · {lv.who}
                </p>
                <h3 className="mt-1 text-lg font-bold text-white">{lv.title}</h3>

                {/* Description */}
                <p className="mt-3 text-sm leading-7 text-slate-300">{lv.desc}</p>

                {/* Note callout */}
                <div className={`mt-4 flex items-start gap-2 rounded-xl border border-white/10 p-3 bg-white/5`}>
                  <Info className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${lv.iconColor}`} aria-hidden="true" />
                  <span className="text-xs leading-5 text-slate-400">{lv.note}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop connector arrows between levels */}
        <div className="mt-2 hidden items-center justify-center gap-3 md:flex">
          <span className="text-xs font-semibold text-[#06b6d4]">Completeness</span>
          <span className="text-slate-500">→</span>
          <span className="text-xs font-semibold text-[#D4A017]">Domain Check</span>
          <span className="text-slate-500">→</span>
          <span className="text-xs font-semibold text-indigo-400">Jury Evaluation</span>
        </div>

        {/* Jury composition note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
          className="mt-14 rounded-[32px] border border-indigo-400/20 bg-indigo-950/30 p-8 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-100">
              <Scale className="h-5 w-5 text-indigo-700" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">
                About the Jury
              </p>
              <h3 className="mt-1 text-xl font-bold text-white">
                1 to 3 Experts, Matched to Your Field
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Depending on the nature of your idea, one to three jury members from the
                relevant field will evaluate it. A medical idea goes to medical experts.
                An agriculture idea goes to agriculture specialists. This ensures that every
                idea is judged by someone who truly understands the problem it is solving.
              </p>

              {/* Field tags */}
              <div className="mt-5 flex flex-wrap gap-2">
                {JURY_FIELDS.map((field) => (
                  <span
                    key={field}
                    className="rounded-full border border-indigo-400/30 bg-indigo-950/40 px-3 py-1 text-xs font-semibold text-indigo-300"
                  >
                    {field}
                  </span>
                ))}
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-400">
                  + more fields
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="my-14 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-slate-400">
            What jury members look for
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Evaluation criteria cards */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {CRITERIA.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.42, delay: i * 0.08, ease: EASE }}
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 22 } }}
              className={`rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/8 transition-colors duration-300`}
            >
              <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${c.iconBg}`}>
                <c.Icon className={`h-5 w-5 ${c.iconColor}`} aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-white">{c.title}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-400">{c.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Trust note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
          className="mt-10 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-center"
        >
          <p className="text-sm leading-7 text-slate-300">
            <span className="font-semibold text-white">All evaluations are confidential.</span>{" "}
            Your idea will not be shared publicly without your explicit permission.
            We follow a documented, fair process — and you can request feedback at any stage.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
