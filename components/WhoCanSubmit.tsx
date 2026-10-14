import { motion } from "framer-motion";
import {
  GraduationCap, Sprout, Wheat, BookOpen, Wrench,
  FlaskConical, Rocket, Star, Home, Users,
} from "lucide-react";
import { fadeUp, EASE } from "../types";

const WHO_CARDS = [
  {
    Icon: GraduationCap,
    title: "Students",
    desc: "School, college & university innovators with fresh ideas worth exploring.",
    iconBg: "bg-[#EAF2FB]", iconColor: "text-[#002B5C]", border: "border-[#BFD7EA]",
  },
  {
    Icon: Sprout,
    title: "Grassroot Innovators",
    desc: "Local problem-solvers creating real solutions without formal resources.",
    iconBg: "bg-[#FFF5D6]", iconColor: "text-[#002B5C]", border: "border-[#D4A017]/25",
  },
  {
    Icon: Wheat,
    title: "Farmers",
    desc: "Agricultural innovators with on-the-ground knowledge and urgent need.",
    iconBg: "bg-amber-100", iconColor: "text-amber-700", border: "border-amber-200",
  },
  {
    Icon: BookOpen,
    title: "Teachers",
    desc: "Educators turning classroom challenges into practical, scalable solutions.",
    iconBg: "bg-indigo-100", iconColor: "text-indigo-700", border: "border-indigo-200",
  },
  {
    Icon: Wrench,
    title: "Technicians",
    desc: "Skilled workers applying hands-on expertise to persistent real-world problems.",
    iconBg: "bg-[#EAF2FB]", iconColor: "text-[#002B5C]", border: "border-[#BFD7EA]",
  },
  {
    Icon: FlaskConical,
    title: "Researchers",
    desc: "Academic and independent researchers with novel, applicable findings.",
    iconBg: "bg-[#EAF2FB]", iconColor: "text-[#003B73]", border: "border-[#BFD7EA]",
  },
  {
    Icon: Rocket,
    title: "Startups",
    desc: "Early-stage ventures seeking ecosystem visibility and community support.",
    iconBg: "bg-rose-100", iconColor: "text-rose-700", border: "border-rose-200",
  },
  {
    Icon: Star,
    title: "Women Innovators",
    desc: "Women-led ideas that deserve recognition, platform access, and amplification.",
    iconBg: "bg-[#FFF5D6]", iconColor: "text-[#002B5C]", border: "border-[#D4A017]/25",
  },
  {
    Icon: Home,
    title: "Rural Innovators",
    desc: "Village and small-town inventors solving hyperlocal, high-impact challenges.",
    iconBg: "bg-orange-100", iconColor: "text-orange-700", border: "border-orange-200",
  },
  {
    Icon: Users,
    title: "Community Problem-Solvers",
    desc: "Anyone with a practical solution to a shared challenge in their community.",
    iconBg: "bg-slate-100", iconColor: "text-slate-700", border: "border-slate-300",
  },
] as const;

export default function WhoCanSubmit() {
  return (
    <section id="who-can-submit" className="bg-[#0a1628] px-6 py-20">
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
            Open to all
          </p>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            Who Can Submit an Idea?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Open for innovators, students, researchers, grassroots problem-solvers,
            and anyone with a practical solution.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {WHO_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: i * 0.055, ease: EASE }}
              whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              className={`rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/8 transition-colors duration-300`}
            >
              <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg}`}>
                <card.Icon className={`h-5 w-5 ${card.iconColor}`} aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold leading-snug text-white">{card.title}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-400">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
          className="mt-10 text-center"
        >
          <a
            href="/submit-idea"
            className="magnetic-btn inline-flex items-center gap-2 rounded-xl bg-[#002B5C] px-7 py-3.5 font-semibold text-white shadow-lg transition hover:bg-[#003d82] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002B5C]"
          >
            Submit Your Idea →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
