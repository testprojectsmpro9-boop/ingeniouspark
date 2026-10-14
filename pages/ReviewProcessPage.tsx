import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PublicSiteHeader from "../components/PublicSiteHeader";
import MobileBackButton from "../components/MobileBackButton";
import PublicSiteFooter from "../components/PublicSiteFooter";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ClipboardCheck,
  Download,
  Eye,
  FileSearch,
  FlaskConical,
  HelpCircle,
  Layers,
  Lightbulb,
  MessageSquare,
  Scale,
  Search,
  Sparkles,
  TrendingUp,
  Wrench,
  XCircle,
} from "lucide-react";
import { EASE, fadeUp } from "../types";
import TypeWriter from "../components/TypeWriter";

gsap.registerPlugin(ScrollTrigger);

const stages = [
  {
    title: "Idea Submission",
    Icon: Lightbulb,
    desc: "Your idea reaches the NMF-IFIA team through the online form or offline submission.",
    hint: "Application ID created",
  },
  {
    title: "Admin Verification",
    Icon: ClipboardCheck,
    desc: "The team checks contact details, idea clarity, applicant type, and basic completeness.",
    hint: "Details verified",
  },
  {
    title: "Public Domain Knowledge Review",
    Icon: FileSearch,
    desc: "The idea is compared with known information so its originality and value are clearer.",
    hint: "Knowledge check",
  },
  {
    title: "Jury Evaluation",
    Icon: Scale,
    desc: "Reviewers evaluate usefulness, feasibility, impact, readiness, and potential reach.",
    hint: "Evaluation stage",
  },
  {
    title: "Mentorship / Prototype Support",
    Icon: Wrench,
    desc: "Promising ideas may receive guidance to improve sketches, models, prototypes, or plans.",
    hint: "Support pathway",
  },
  {
    title: "Recognition / Exhibition / Funding / Patent / Commercialization",
    Icon: Award,
    desc: "Strong ideas can move toward showcases, recognition, funding guidance, protection, or wider opportunities.",
    hint: "Impact pathway",
  },
] as const;

const criteria = [
  { title: "Clear problem", level: 88, Icon: Eye },
  { title: "New or different", level: 82, Icon: Sparkles },
  { title: "Useful in real life", level: 86, Icon: Wrench },
  { title: "Proof of idea", level: 70, Icon: FlaskConical },
  { title: "Can grow", level: 74, Icon: Layers },
  { title: "Helps people", level: 91, Icon: TrendingUp },
  { title: "Can be built", level: 78, Icon: CheckCircle2 },
] as const;

const outcomes = [
  { title: "Selected for next step", Icon: CheckCircle2 },
  { title: "More details needed", Icon: HelpCircle },
  { title: "Prototype requested", Icon: Wrench },
  { title: "Improve and resubmit", Icon: TrendingUp },
  { title: "Not selected", Icon: XCircle },
  { title: "Support or showcase opportunity", Icon: Award },
] as const;

const communications = [
  { title: "Track using Application ID", Icon: Search },
  { title: "Admin may request more information", Icon: MessageSquare },
  { title: "Inventor portal supports messages/uploads after login", Icon: Layers },
  { title: "Final status is visible in tracking", Icon: CheckCircle2 },
] as const;

const ctas = [
  { href: "/submit-idea", label: "Submit Idea", Icon: Lightbulb, primary: true },
  { href: "/track-idea", label: "Track Idea", Icon: Search, primary: false },
  { href: "/offline-form.pdf", label: "Download Form", Icon: Download, primary: false },
] as const;

function Header() {
  return <PublicSiteHeader currentPath="/review-process" />;
}

function HeroJourneyVisual() {
  const heroLabels = [
    { label: "Submission", Icon: Lightbulb, className: "left-0 top-[18%]" },
    { label: "Verification", Icon: ClipboardCheck, className: "right-0 top-[22%]" },
    { label: "Knowledge Review", Icon: FileSearch, className: "left-0 bottom-[22%]" },
    { label: "Recognition Pathway", Icon: Award, className: "right-0 bottom-[18%]" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
      className="relative min-h-[420px] overflow-hidden lg:min-h-[500px]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_48%,rgba(45,212,191,0.2),transparent_32%),radial-gradient(circle_at_58%_52%,rgba(212,160,23,0.16),transparent_26%)] blur-xl" />
      <div className="absolute inset-x-4 top-12 h-px bg-gradient-to-r from-transparent via-teal-200/50 to-transparent" />
      <div className="absolute inset-y-12 left-10 w-px bg-gradient-to-b from-transparent via-teal-200/35 to-transparent" />
      <div className="absolute inset-y-10 right-10 w-px bg-gradient-to-b from-transparent via-[#D4A017]/35 to-transparent" />

      <motion.div
        aria-hidden="true"
        className="absolute left-[16%] top-[14%] h-[72%] w-px bg-gradient-to-b from-transparent via-teal-200/75 to-transparent shadow-[0_0_28px_rgba(45,212,191,0.8)]"
        animate={{ left: ["16%", "48%", "78%", "48%", "16%"], opacity: [0.35, 1, 0.45, 1, 0.35] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal-200/20"
        animate={{ scale: [0.92, 1.08, 0.92], opacity: [0.35, 0.75, 0.35] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4A017]/15"
        animate={{ scale: [1.05, 0.95, 1.05], opacity: [0.18, 0.5, 0.18] }}
        transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, rotateX: 12 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
        className="absolute left-1/2 top-1/2 w-[min(78vw,360px)] -translate-x-1/2 -translate-y-1/2 rounded-[30px] bg-white/[0.09] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] ring-1 ring-white/15 backdrop-blur"
      >
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#002B5C]">
            <Lightbulb className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="rounded-full bg-[#D4A017]/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#D4A017]">
            Idea Review
          </div>
        </div>
        <div className="mt-7 space-y-3">
          <div className="h-2 w-5/6 rounded-full bg-white/55" />
          <div className="h-2 w-2/3 rounded-full bg-white/25" />
          <div className="h-2 w-4/5 rounded-full bg-white/25" />
        </div>
        <div className="mt-8 grid grid-cols-3 gap-3">
          {["Check", "Review", "Next Step"].map((label, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 0.45 + index * 0.08, ease: EASE }}
              className="rounded-2xl bg-white/[0.08] px-3 py-4 text-center"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-teal-100">{label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {heroLabels.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.32 + index * 0.08, ease: EASE }}
          className={`absolute flex max-w-[11rem] items-center gap-2 rounded-full bg-white/[0.075] px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white ring-1 ring-white/10 backdrop-blur ${item.className}`}
        >
          <item.Icon className="h-4 w-4 text-[#D4A017]" aria-hidden="true" />
          {item.label}
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function ReviewProcessPage() {
  const prefersReducedMotion = useReducedMotion();
  const journeyRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion || !journeyRef.current) return;

    const ctx = gsap.context(() => {
      const path = journeyRef.current?.querySelector<SVGPathElement>(".review-journey-path");
      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: journeyRef.current,
            start: "top 70%",
            end: "bottom 55%",
            scrub: 1,
          },
        });
      }

      gsap.fromTo(
        ".review-rail-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: journeyRef.current,
            start: "top 70%",
            end: "bottom 55%",
            scrub: 1,
          },
        },
      );
    }, journeyRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <main className="min-h-screen overflow-x-clip bg-white text-slate-950">
      <Header />
      <MobileBackButton />

      <section className="relative overflow-hidden bg-[#031727] px-6 py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(45,212,191,0.22),transparent_34%),radial-gradient(circle_at_78%_18%,rgba(212,160,23,0.2),transparent_30%),linear-gradient(135deg,#031727_0%,#062940_55%,#02111f_100%)]" />
        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-14 h-[1px] w-[72vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-teal-200/45 to-transparent"
          animate={{ opacity: [0.25, 0.75, 0.25], scaleX: [0.78, 1, 0.78] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#D4A017]">
              <TypeWriter text="Idea to Impact journey" speed={44} />
            </p>
            <h1 className="mt-5 text-5xl font-black tracking-tight text-white md:text-7xl">
              <TypeWriter text="Idea to Impact" delay={0.18} speed={58} />
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100/85 md:text-xl">
              <TypeWriter
                text="See how an idea moves from submission to admin verification, knowledge review, jury evaluation, prototype support, recognition, and wider opportunities."
                delay={0.55}
                speed={18}
              />
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {ctas.map((cta) => (
                <a
                  key={cta.href}
                  href={cta.href}
                  className={
                    cta.primary
                      ? "inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-[#002B5C] shadow-lg shadow-cyan-950/30 transition hover:bg-[#FFF5D6]"
                      : "inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 py-3.5 text-sm font-black text-white backdrop-blur transition hover:border-[#D4A017] hover:bg-white/15"
                  }
                >
                  {cta.label}
                  {cta.primary ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : <cta.Icon className="h-4 w-4" aria-hidden="true" />}
                </a>
              ))}
            </div>
          </motion.div>

          <HeroJourneyVisual />
        </div>
      </section>

      <section ref={journeyRef} className="relative bg-[#F6FAFD] px-6 py-16 text-slate-950 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.14),transparent_28%),radial-gradient(circle_at_82%_28%,rgba(212,160,23,0.12),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="max-w-3xl"
          >
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">Idea journey</p>
            <h2 className="mt-4 text-3xl font-black text-[#002B5C] md:text-5xl">
              <TypeWriter text="A stage-gate journey from idea to impact." speed={34} />
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Each gate keeps the process understandable: submit, verify, review knowledge, evaluate with experts, strengthen the idea, then move toward recognition and support.
            </p>
          </motion.div>

          <div className="relative mt-14">
            <div className="absolute left-5 top-0 h-full w-px bg-[#002B5C]/10 lg:hidden">
              <div className="review-rail-fill h-full origin-top bg-gradient-to-b from-teal-300 via-[#D4A017] to-sky-300" />
            </div>

            <motion.div
              aria-hidden="true"
              className="absolute left-5 top-8 h-5 w-5 -translate-x-1/2 rounded-full bg-[#D4A017] shadow-[0_0_28px_rgba(212,160,23,0.9)] lg:hidden"
              animate={{ top: ["2rem", "96%"], opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="hidden lg:block">
              <div className="relative rounded-[38px] bg-white/55 px-8 py-10 shadow-[0_28px_90px_rgba(0,43,92,0.08)] ring-1 ring-[#BFD7EA] backdrop-blur">
                <svg className="pointer-events-none absolute inset-x-10 top-1/2 h-24 w-[calc(100%-5rem)] -translate-y-1/2" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
                  <path
                    className="review-journey-path"
                    d="M 18 64 C 130 12, 210 112, 330 62 S 535 18, 650 64 S 835 110, 982 56"
                    fill="none"
                    stroke="url(#reviewPathGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="reviewPathGradient" x1="0" x2="1">
                      <stop stopColor="#2dd4bf" />
                      <stop offset="0.5" stopColor="#D4A017" />
                      <stop offset="1" stopColor="#60a5fa" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="grid grid-cols-6 gap-4">
                  {stages.map((stage, index) => (
                    <motion.article
                      key={stage.title}
                      initial={{ opacity: 0, y: index % 2 === 0 ? 28 : -28, scale: 0.96 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.48, delay: index * 0.055, ease: EASE }}
                      className={`relative ${index % 2 === 0 ? "pt-20" : "pb-20"}`}
                    >
                      <div className={`absolute left-1/2 z-10 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-[#031727] text-white shadow-[0_0_32px_rgba(45,212,191,0.32)] ring-4 ring-white ${index % 2 === 0 ? "top-[1.35rem]" : "bottom-[1.35rem]"}`}>
                        <stage.Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="min-h-[268px] rounded-[30px] bg-white/90 p-5 shadow-[0_18px_50px_rgba(0,43,92,0.08)] ring-1 ring-[#BFD7EA] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,43,92,0.12)]">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#D4A017]">
                          Gate {String(index + 1).padStart(2, "0")}
                        </p>
                        <h3 className="mt-3 text-base font-black leading-6 text-[#002B5C]">{stage.title}</h3>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{stage.desc}</p>
                        <p className="mt-4 inline-flex rounded-full bg-[#EAF2FB] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#002B5C]">
                          {stage.hint}
                        </p>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:hidden">
              {stages.map((stage, index) => (
                <motion.article
                  key={stage.title}
                  initial={{ opacity: 0, y: 26, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.48, delay: index * 0.045, ease: EASE }}
                  className="relative grid grid-cols-[auto_1fr] gap-4"
                >
                  <motion.div
                    className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#002B5C] shadow-[0_0_26px_rgba(45,212,191,0.25)] ring-4 ring-[#D4A017]/20"
                    animate={{ boxShadow: ["0 0 18px rgba(45,212,191,0.18)", "0 0 34px rgba(212,160,23,0.38)", "0 0 18px rgba(45,212,191,0.18)"] }}
                    transition={{ duration: 3.2, repeat: Infinity, delay: index * 0.18, ease: "easeInOut" }}
                  >
                    <stage.Icon className="h-5 w-5" aria-hidden="true" />
                  </motion.div>

                  <div className="relative rounded-[28px] bg-white/90 px-5 py-5 shadow-[0_18px_50px_rgba(0,43,92,0.08)] ring-1 ring-[#BFD7EA] backdrop-blur">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#D4A017]">
                      Gate {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1 text-base font-black leading-6 text-[#002B5C]">{stage.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{stage.desc}</p>
                    <p className="mt-3 inline-flex rounded-full bg-[#EAF2FB] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#002B5C]">
                      {stage.hint}
                    </p>
                  </div>

                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-slate-50 px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
          >
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">Review criteria</p>
            <h2 className="mt-4 text-3xl font-black text-[#002B5C] md:text-4xl">What makes an idea strong</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              We look for clarity, usefulness, originality, impact, and readiness to move forward.
            </p>
          </motion.div>

          <div className="relative">
            <div className="relative mx-auto hidden h-[560px] max-w-[760px] lg:block">
              <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#BFD7EA] bg-white/45 shadow-[0_0_70px_rgba(0,43,92,0.08)]" />
              <div className="absolute left-1/2 top-1/2 h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4A017]/30" />
              <div className="absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#002B5C] text-center text-xs font-black uppercase tracking-[0.18em] text-white shadow-2xl shadow-[#002B5C]/20">
                Fair check
              </div>
              {criteria.map((item, index) => {
                const positions = [
                  { left: "50%", top: "8%" },
                  { left: "84%", top: "17%" },
                  { left: "92%", top: "56%" },
                  { left: "68%", top: "90%" },
                  { left: "32%", top: "90%" },
                  { left: "8%", top: "56%" },
                  { left: "16%", top: "17%" },
                ];
                return (
                  <motion.article
                    key={item.title}
                    initial={{ opacity: 0, scale: 0.92 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.42, delay: index * 0.045, ease: EASE }}
                    className="absolute w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 px-4 py-3 shadow-[0_14px_36px_rgba(0,43,92,0.08)] ring-1 ring-[#BFD7EA] backdrop-blur"
                    style={positions[index]}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#EAF2FB] text-[#002B5C]">
                        <item.Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-black leading-5 text-slate-950">{item.title}</h3>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.12 + index * 0.04, ease: EASE }}
                            className="h-full rounded-full bg-gradient-to-r from-[#2dd4bf] to-[#D4A017]"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
              {criteria.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: index * 0.04, ease: EASE }}
                  className="rounded-[22px] bg-white/90 p-4 shadow-sm ring-1 ring-[#BFD7EA]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#EAF2FB] text-[#002B5C]">
                      <item.Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <h3 className="text-sm font-black leading-5 text-slate-950">{item.title}</h3>
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.75, delay: 0.1 + index * 0.04, ease: EASE }}
                      className="h-full rounded-full bg-gradient-to-r from-[#2dd4bf] to-[#D4A017]"
                    />
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-[#031727] px-6 py-16 text-white md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(212,160,23,0.14),transparent_32%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
          >
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">Possible outcomes</p>
            <h2 className="mt-4 text-3xl font-black md:text-4xl">Every idea gets a clear next step.</h2>
            <p className="mt-4 text-base leading-7 text-blue-100/75">
              Outcomes show whether the idea should move forward, improve, add information, or close with a final status.
            </p>
          </motion.div>

          <div className="relative grid gap-3 lg:block lg:min-h-[480px]">
            <div className="absolute left-1/2 top-1/2 hidden h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#D4A017]/40 bg-white/[0.06] text-center text-[10px] font-black uppercase tracking-[0.18em] text-[#D4A017] backdrop-blur lg:flex">
              Next step
            </div>
            <svg className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" viewBox="0 0 760 480" aria-hidden="true">
              <path d="M380 240 L164 88" stroke="#2dd4bf" strokeOpacity="0.24" />
              <path d="M380 240 L596 88" stroke="#D4A017" strokeOpacity="0.24" />
              <path d="M380 240 L654 240" stroke="#60a5fa" strokeOpacity="0.18" />
              <path d="M380 240 L596 392" stroke="#D4A017" strokeOpacity="0.2" />
              <path d="M380 240 L164 392" stroke="#ffffff" strokeOpacity="0.16" />
              <path d="M380 240 L106 240" stroke="#2dd4bf" strokeOpacity="0.2" />
            </svg>
            {outcomes.map((outcome, index) => (
              <motion.article
                key={outcome.title}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.44, delay: index * 0.055, ease: EASE }}
                whileHover={{ scale: 1.03, transition: { type: "spring", stiffness: 280, damping: 22 } }}
                className={[
                  "relative flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.055] px-4 py-3 text-left backdrop-blur transition hover:border-[#D4A017]/45",
                  "lg:absolute lg:w-[235px]",
                  [
                    "lg:left-[4%] lg:top-[12%]",
                    "lg:right-[4%] lg:top-[12%]",
                    "lg:right-0 lg:top-1/2 lg:-translate-y-1/2",
                    "lg:right-[4%] lg:bottom-[12%]",
                    "lg:left-[4%] lg:bottom-[12%]",
                    "lg:left-0 lg:top-1/2 lg:-translate-y-1/2",
                  ][index],
                ].join(" ")}
              >
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white text-[#002B5C] shadow-[0_0_22px_rgba(45,212,191,0.18)]">
                  <outcome.Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <p className="text-sm font-black leading-5 text-white">{outcome.title}</p>
              </motion.article>
            ))}
          </div>
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
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">Applicant communication</p>
            <h2 className="mt-4 text-3xl font-black text-[#002B5C] md:text-4xl">Status stays visible after submission.</h2>
          </motion.div>

          <div className="mt-10 grid gap-3 md:grid-cols-4">
            {communications.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: EASE }}
                className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#EAF2FB] to-white p-5"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#2dd4bf] to-[#D4A017]" />
                <item.Icon className="h-5 w-5 text-[#002B5C]" aria-hidden="true" />
                <p className="mt-4 text-sm font-black leading-6 text-slate-800">{item.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#002B5C] px-6 py-16 text-white">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: EASE }}
          className="mx-auto max-w-7xl overflow-hidden rounded-[34px] bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.2),transparent_30%),rgba(255,255,255,0.06)] p-6 md:p-8"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">Next step</p>
              <h2 className="mt-3 text-2xl font-black md:text-3xl">Submit a new idea or track an existing one.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100/80">
                The Application ID is the key reference for checking progress and responding to follow-up.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[480px]">
              {ctas.map((cta) => (
                <a
                  key={cta.href}
                  href={cta.href}
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
          </div>
        </motion.div>
      </section>
      <PublicSiteFooter />
    </main>
  );
}
