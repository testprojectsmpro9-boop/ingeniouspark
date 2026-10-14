import { motion } from "framer-motion";
import PublicSiteHeader from "../components/PublicSiteHeader";
import MobileBackButton from "../components/MobileBackButton";
import PublicSiteFooter from "../components/PublicSiteFooter";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  Download,
  FileText,
  FlaskConical,
  GraduationCap,
  Home,
  Lightbulb,
  Rocket,
  Search,
  ShieldCheck,
  Sprout,
  Users,
  UserPlus,
  Wrench,
} from "lucide-react";
import { EASE, fadeUp } from "../types";
import TypeWriter from "../components/TypeWriter";

const applicantGroups = [
  {
    title: "Students & Learners",
    items: [
      { title: "K-12 students", Icon: GraduationCap },
      { title: "College students", Icon: BookOpen },
    ],
  },
  {
    title: "Public Problem-Solvers",
    items: [
      { title: "Individuals", Icon: Lightbulb },
      { title: "Farmers / rural innovators", Icon: Sprout },
      { title: "Technicians / engineers", Icon: Wrench },
      { title: "Other public innovators", Icon: Users },
    ],
  },
  {
    title: "Educators & Ecosystem",
    items: [
      { title: "Teachers", Icon: Users },
      { title: "Researchers", Icon: FlaskConical },
      { title: "Startups", Icon: Rocket },
      { title: "NGOs / community groups", Icon: Home },
      { title: "Institutions / universities", Icon: Building2 },
    ],
  },
] as const;

const ideaSources = [
  "School or college project",
  "Home or daily-life problem",
  "Farm, workshop, or field idea",
  "Community or institution need",
] as const;

const eligibilityNotes = [
  "Idea can be only a concept, sketch, prototype, or working model.",
  "You can submit online or offline.",
  "Idea submission is open and free.",
  "Membership is optional.",
] as const;

const ctas = [
  { href: "/submit-idea", label: "Submit Idea", Icon: Lightbulb, primary: true, download: false },
  { href: "/track-idea", label: "Track Idea", Icon: Search, primary: false, download: false },
  { href: "/submission", label: "Submission Process", Icon: FileText, primary: false, download: false },
  { href: "/offline-form.pdf", label: "Download Offline Form", Icon: Download, primary: false, download: true },
  { href: "/contact", label: "Register Interest", Icon: UserPlus, primary: false, download: false },
] as const;

function Header() {
  return <PublicSiteHeader currentPath="/who-can-apply" />;
}

function OpenCallPoster() {
  const badges = [
    { label: "Students", Icon: GraduationCap },
    { label: "Rural innovators", Icon: Sprout },
    { label: "Startups", Icon: Rocket },
    { label: "Teachers", Icon: Users },
    { label: "Institutions", Icon: Building2 },
    { label: "Communities", Icon: Home },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
      className="relative min-h-[390px] overflow-hidden rounded-[36px] bg-white/45 p-4 shadow-[0_28px_80px_rgba(0,43,92,0.08)] ring-1 ring-white/70 backdrop-blur-md md:min-h-[410px] md:p-6"
    >
      <img
        src="/images/who-can-apply-open-call-bg.jpeg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-[78%_55%] opacity-[0.5] saturate-[0.98]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.8)_38%,rgba(234,242,251,0.46)_66%,rgba(255,248,230,0.28)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(45,212,191,0.12),transparent_32%),radial-gradient(circle_at_88%_76%,rgba(212,160,23,0.12),transparent_28%)]" />
      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-[#D4A017]/35" aria-hidden="true" />
      <div className="absolute bottom-7 right-8 h-16 w-16 rounded-full bg-[#002B5C]/5" aria-hidden="true" />
      <div className="absolute left-7 top-8 h-20 w-20 rotate-12 rounded-[28px] border border-[#BFD7EA]/80 bg-white/20" aria-hidden="true" />

      <motion.div
        className="relative z-10 flex items-center justify-between gap-4"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.48, delay: 0.22, ease: EASE }}
      >
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D4A017]">Open call</p>
          <p className="mt-1 text-sm font-bold text-[#002B5C]/70">No expert title required</p>
        </div>
        <span className="flex h-20 w-20 rotate-[-10deg] items-center justify-center rounded-full border border-[#D4A017]/70 bg-white/75 text-center text-[10px] font-black uppercase leading-4 tracking-[0.14em] text-[#002B5C] shadow-sm">
          Open to all
        </span>
      </motion.div>

      <motion.div
        className="relative z-10 mt-10 max-w-[28rem]"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.34, ease: EASE }}
      >
        <p className="text-4xl font-black leading-[0.95] tracking-tight text-[#002B5C] md:text-5xl">
          Useful ideas can begin anywhere.
        </p>
        <p className="mt-4 max-w-md text-sm font-semibold leading-7 text-slate-600">
          From school, home, farm, workshop, campus, startup, or community life.
        </p>
      </motion.div>

      <div className="relative z-10 mt-8 grid grid-cols-2 gap-2.5">
        {badges.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.36, delay: 0.46 + index * 0.04, ease: EASE }}
            className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 text-xs font-black text-[#002B5C] shadow-sm ring-1 ring-white/80 backdrop-blur"
          >
            <item.Icon className="h-4 w-4 flex-none text-[#D4A017]" aria-hidden="true" />
            <span className="truncate">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function WhoCanApplyPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-white text-slate-950">
      <Header />
      <MobileBackButton />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#EAF2FB] via-white to-[#FFF5D6] px-6 py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_25%,rgba(45,212,191,0.16),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(212,160,23,0.18),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">
              <TypeWriter text="OPEN CALL FOR INNOVATORS" speed={42} />
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-[#002B5C] md:text-6xl">
              <TypeWriter text="Everyone can apply" delay={0.15} speed={44} />
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700 md:text-xl">
              Students, parents, rural innovators, startups, teachers, institutions, and everyday problem-solvers can share ideas in a simple way.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/submit-idea"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#002B5C] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#002B5C]/20 transition hover:bg-[#003d82]"
              >
                Submit Idea <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="/submission"
                className="inline-flex items-center gap-2 rounded-2xl border border-[#BFD7EA] bg-white/80 px-6 py-3.5 text-sm font-bold text-[#002B5C] transition hover:border-[#D4A017] hover:bg-white"
              >
                Submission Process
              </a>
              <a
                href="/track-idea"
                className="inline-flex items-center gap-2 rounded-2xl border border-[#BFD7EA] bg-white/60 px-6 py-3.5 text-sm font-bold text-[#002B5C] transition hover:border-[#D4A017] hover:bg-white"
              >
                Track Idea
              </a>
            </div>
          </motion.div>

          <OpenCallPoster />
        </div>
      </section>

      <section className="bg-white px-6 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="max-w-3xl"
          >
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">Who this is for</p>
            <h2 className="mt-4 text-3xl font-black text-slate-950 md:text-4xl">
              Practical ideas can come from many places.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              You do not need a company, lab, or polished pitch to begin. A useful idea is enough to start.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            {applicantGroups.map((group, index) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.42, delay: index * 0.06, ease: EASE }}
                className="relative border-l-2 border-[#D4A017] pl-5"
              >
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D4A017]">{group.title}</p>
                <div className="mt-5 space-y-4">
                  {group.items.map((item) => (
                    <div key={item.title} className="group flex items-center gap-3 border-b border-slate-200 pb-3">
                      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#EAF2FB] text-[#002B5C] transition group-hover:bg-[#002B5C] group-hover:text-white">
                        <item.Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <p className="text-sm font-black leading-5 text-slate-800">{item.title}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FFF8E6] px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center"
        >
          <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-white text-[#002B5C] shadow-sm">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#002B5C]">Under 18?</p>
            <p className="mt-2 max-w-4xl text-base font-semibold leading-7 text-slate-800">
              You can submit with parent/guardian details or support from your school or mentor.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="bg-[#F7FBFF] px-6 py-14 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
          >
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">Where ideas begin</p>
            <h2 className="mt-4 text-3xl font-black text-[#002B5C] md:text-4xl">
              You do not need a perfect setup.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Your idea can come from daily life, school, work, farming, teaching, or community experience.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {ideaSources.map((source, index) => (
              <motion.div
                key={source}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.42, delay: index * 0.05, ease: EASE }}
                className="group flex items-center gap-4 border-b border-[#BFD7EA]/70 py-4"
              >
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white text-[#002B5C] shadow-sm transition group-hover:bg-[#FFF5D6]">
                  <CheckCircle2 className="h-4 w-4 text-[#D4A017]" aria-hidden="true" />
                </span>
                <p className="text-sm font-black leading-5 text-slate-800">{source}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
          >
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">Simple eligibility</p>
            <h2 className="mt-4 text-3xl font-black text-[#002B5C] md:text-4xl">
              Start early. Improve later.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              The idea does not need to be perfect. The first step is to share it clearly.
            </p>
          </motion.div>

          <div className="space-y-4">
            {eligibilityNotes.map((note, index) => (
              <motion.div
                key={note}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.42, delay: index * 0.05, ease: EASE }}
                className="flex items-start gap-4 border-b border-slate-200 pb-4"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-[#D4A017]" aria-hidden="true" />
                <p className="text-sm font-semibold leading-6 text-slate-700">{note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#002B5C] px-6 py-14 text-white">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: EASE }}
          className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center"
        >
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">Ready to begin</p>
            <h2 className="mt-3 text-2xl font-black md:text-3xl">If you have an idea, you have a starting point.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100/80">
              Submit online, learn the submission process, download the form, or track an existing Application ID.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[620px]">
            {ctas.map((cta) => (
              <a
                key={cta.href}
                href={cta.href}
                download={cta.download || undefined}
                className={
                  cta.primary
                    ? "inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#002B5C] transition hover:bg-[#FFF5D6]"
                    : "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:border-[#D4A017] hover:bg-white/15"
                }
              >
                <cta.Icon className="h-4 w-4" aria-hidden="true" />
                {cta.label}
              </a>
            ))}
          </div>
        </motion.div>
      </section>
      <PublicSiteFooter />
    </main>
  );
}
