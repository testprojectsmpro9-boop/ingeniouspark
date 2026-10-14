import { motion } from "framer-motion";
import { Globe, Printer, Mail, Mic, Video, Camera, Pencil, Download } from "lucide-react";
import { fadeUp, EASE } from "../types";

const METHODS = [
  {
    Icon: Globe,
    title: "Online Form",
    desc: "Fill our simple digital form in a few minutes from any device.",
    iconBg: "bg-[#EAF2FB]",
    iconColor: "text-[#002B5C]",
    border: "border-[#BFD7EA]",
    accent: "bg-[#002B5C]",
  },
  {
    Icon: Printer,
    title: "Offline Printed Form",
    desc: "Download, print, fill by hand, and drop off or mail it to us.",
    iconBg: "bg-[#FFF5D6]",
    iconColor: "text-[#002B5C]",
    border: "border-[#D4A017]/25",
    accent: "bg-[#D4A017]",
  },
  {
    Icon: Mail,
    title: "Letter or Document",
    desc: "Write your idea in your own words — any format, any language.",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-700",
    border: "border-indigo-200",
    accent: "bg-indigo-400",
  },
  {
    Icon: Mic,
    title: "Audio Explanation",
    desc: "Record yourself explaining your idea — we will listen carefully.",
    iconBg: "bg-[#EAF2FB]",
    iconColor: "text-[#003B73]",
    border: "border-[#BFD7EA]",
    accent: "bg-[#003B73]",
  },
  {
    Icon: Video,
    title: "Video Demonstration",
    desc: "Show your idea in action on camera — no studio or editing needed.",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
    border: "border-amber-200",
    accent: "bg-amber-400",
  },
  {
    Icon: Camera,
    title: "Prototype Photos",
    desc: "Send clear photos of your working model or handmade prototype.",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-700",
    border: "border-rose-200",
    accent: "bg-rose-400",
  },
  {
    Icon: Pencil,
    title: "Design Sketches",
    desc: "Hand-drawn sketches and rough diagrams are perfectly welcome.",
    iconBg: "bg-[#FFF5D6]",
    iconColor: "text-[#002B5C]",
    border: "border-[#D4A017]/25",
    accent: "bg-[#D4A017]",
  },
] as const;

export default function SubmitMethods() {
  return (
    <section id="submit-methods" className="bg-[#0a1628] px-6 py-20">
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
            No barriers to entry
          </p>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            Submit in the Way That Is Easiest for You
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            You do not need a computer, a degree, or formal writing skills.
            If you have an idea, there is a way to share it with us.
          </p>
        </motion.div>

        {/* Method cards */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {METHODS.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.42, delay: i * 0.07, ease: EASE }}
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 22 } }}
              className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/8 transition-colors duration-300`}
            >
              {/* Top accent stripe */}
              <div className={`h-1 w-full ${m.accent}`} />
              <div className="p-5">
                <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl ${m.iconBg}`}>
                  <m.Icon className={`h-5 w-5 ${m.iconColor}`} aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold leading-snug text-white">{m.title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-400">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Inclusivity note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
          className="mt-8 text-center text-sm text-slate-400"
        >
          Submissions in Kannada, Hindi, or any regional language are accepted.
          We will reach out to help you if you need assistance.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.35, ease: EASE }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <a
            href="/submit-idea"
            className="magnetic-btn inline-flex items-center gap-2 rounded-xl bg-[#002B5C] px-7 py-3.5 font-semibold text-white shadow-lg transition hover:bg-[#003d82] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002B5C]"
          >
            <Globe className="h-4 w-4" aria-hidden="true" />
            Submit Online
          </a>
          <a
            href="/offline-form.pdf"
            download
            className="magnetic-btn inline-flex items-center gap-2 rounded-xl border border-[#D4A017]/50 bg-white px-7 py-3.5 font-semibold text-[#002B5C] transition hover:border-[#D4A017] hover:bg-[#FFF5D6] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A017]"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download Offline Form
          </a>
        </motion.div>
      </div>
    </section>
  );
}
