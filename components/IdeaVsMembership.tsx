import { motion } from "framer-motion";
import {
  Lightbulb, Users, CheckCircle2, ArrowRight,
} from "lucide-react";
import { fadeUp, EASE } from "../types";

const SUBMIT_POINTS = [
  "No account or login required",
  "No membership needed at any stage",
  "Any format — form, letter, audio, video, sketch",
  "Open to everyone — students, farmers, anyone",
  "Completely free, now and always",
];

const MEMBER_POINTS = [
  "Community updates and announcements",
  "Priority access to NMF events and workshops",
  "Mentorship and peer networking opportunities",
  "Pathways to IFIA Bharat ecosystem programs",
  "Recognition within the wider innovation community",
];

export default function IdeaVsMembership() {
  return (
    <section id="idea-vs-membership" className="bg-[#02111f] px-6 py-16">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#06b6d4]">
            Know the difference
          </p>
          <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">
            Submitting an idea is free and separate from membership
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            You do not need to be a member to submit an idea. Membership is an
            optional next step for those who want ongoing community access.
          </p>
        </motion.div>

        {/* Comparison cards */}
        <div className="mt-10 grid gap-5 md:grid-cols-2">

          {/* Submit card — primary, emerald */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, delay: 0, ease: EASE }}
            className="relative overflow-hidden rounded-3xl border border-[#06b6d4]/20 bg-white/5 shadow-md"
          >
            {/* Accent top */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#002B5C] to-[#D4A017]" />

            <div className="p-7">
              {/* Badge */}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF2FB] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#002B5C]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#002B5C]" />
                Free &amp; Open — No Membership Needed
              </span>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF2FB]">
                  <Lightbulb className="h-6 w-6 text-[#002B5C]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Submit Your Idea</h3>
                  <p className="text-sm text-slate-400">Free for all innovators</p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                Anyone with an idea can submit — no cost, no membership, no barrier.
                Your idea will be reviewed fairly and you will receive honest feedback.
              </p>

              <ul className="mt-5 space-y-2.5">
                {SUBMIT_POINTS.map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#002B5C]" aria-hidden="true" />
                    <span className="text-sm text-slate-300">{pt}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <a
                  href="/submit-idea"
                  className="magnetic-btn inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#002B5C] px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-[#003d82] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002B5C]"
                >
                  Submit Your Idea
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Membership card — secondary, slate */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
            className="relative overflow-hidden rounded-3xl border border-[#D4A017]/20 bg-white/5 shadow-sm"
          >
            {/* Accent top */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#D4A017] to-[#002B5C]" />

            <div className="p-7">
              {/* Badge */}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF5D6] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#002B5C]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4A017]" />
                Optional — Ecosystem Access
              </span>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF5D6]">
                  <Users className="h-6 w-6 text-[#002B5C]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Become a Member</h3>
                  <p className="text-sm text-slate-400">Optional community membership</p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                Membership is for those who want to stay connected, attend events, access
                mentorship, and grow within the NMF and IFIA ecosystem — independently of
                whether you submit an idea.
              </p>

              <ul className="mt-5 space-y-2.5">
                {MEMBER_POINTS.map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D4A017]" aria-hidden="true" />
                    <span className="text-sm text-slate-300">{pt}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <p className="rounded-xl border border-[#06b6d4]/20 bg-[#06b6d4]/5 px-4 py-3 text-center text-sm font-semibold text-[#06b6d4]">
                  Membership details below ↓
                </p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Clarification note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
          className="mt-6 text-center text-sm text-slate-400"
        >
          Idea submission and membership are two independent paths. You can do one, both, or neither.
        </motion.p>

      </div>
    </section>
  );
}
