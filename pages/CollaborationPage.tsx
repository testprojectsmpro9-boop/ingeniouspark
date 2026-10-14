import { motion } from "framer-motion";
import PublicSiteHeader from "../components/PublicSiteHeader";
import {
  ArrowRight,
  Award,
  BookOpen,
  Cpu,
  GraduationCap,
  Handshake,
  Lightbulb,
  Mail,
  Megaphone,
  Network,
  Phone,
  Rocket,
  Scale,
  School,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import CollaborationSection from "../components/CollaborationSection";
import TypeWriter from "../components/TypeWriter";
import { EASE, fadeUp } from "../types";
import { CONTACT_EMAIL } from "../config";
import MobileBackButton from "../components/MobileBackButton";
import PublicSiteFooter from "../components/PublicSiteFooter";

const partnerGroups = [
  {
    title: "Education Partners",
    Icon: GraduationCap,
    items: ["Schools", "Colleges / universities", "Research institutions"],
  },
  {
    title: "Community Partners",
    Icon: Users,
    items: ["NGOs", "Community organizations", "Local bodies"],
  },
  {
    title: "Innovation & Industry Partners",
    Icon: Cpu,
    items: ["Startups", "Incubators", "Industry partners", "Technology partners"],
  },
  {
    title: "Experts & Support Partners",
    Icon: Handshake,
    items: ["Mentors", "Review experts", "Sponsors / CSR partners", "Government support bodies"],
  },
] as const;

const opportunityBlocks = [
  { title: "School programs", Icon: School, group: "Main focus", size: "lg:col-span-2 lg:row-span-2", dark: true, warm: false },
  { title: "Ideathons", Icon: Lightbulb, group: "Main focus", size: "", dark: false, warm: false },
  { title: "Workshops", Icon: Megaphone, group: "Main focus", size: "", dark: false, warm: false },
  { title: "Mentor / review support", Icon: Scale, group: "Support focus", size: "", dark: false, warm: true },
  { title: "Prototype support", Icon: Wrench, group: "Support focus", size: "", dark: false, warm: false },
  { title: "Incubation", Icon: Rocket, group: "Support focus", size: "", dark: false, warm: false },
  { title: "Exhibitions", Icon: Sparkles, group: "Growth focus", size: "", dark: false, warm: false },
  { title: "CSR / funding", Icon: Award, group: "Growth focus", size: "", dark: false, warm: false },
  { title: "Local-to-global pathway", Icon: Network, group: "Growth focus", size: "lg:col-span-2", dark: false, warm: false },
] as const;

const partnerRoles = [
  "Knowledge Partner",
  "Innovation Partner",
  "Outreach Partner",
  "Technical Partner",
  "Mentorship Partner",
  "Sponsorship Partner",
  "Institutional Partner",
] as const;

const collaborationFlow = [
  { title: "Share interest", text: "Tell us what kind of support or partnership you want to explore." },
  { title: "Explore fit", text: "We discuss the right program area, audience, and possible format." },
  { title: "Plan support", text: "Together we decide activities, responsibilities, and simple next steps." },
  { title: "Run collaboration", text: "The program, session, support activity, or partnership goes live." },
  { title: "Review outcomes", text: "We look at impact, learning, and what should happen next." },
] as const;

const contactCtas = [
  { href: "/contact", label: "Register Interest", Icon: Users, primary: true },
  { href: `mailto:${CONTACT_EMAIL}`, label: "Email", Icon: Mail, primary: false },
  { href: "tel:+919071620909", label: "Phone", Icon: Phone, primary: false },
  { href: "/submit-idea", label: "Submit Idea", Icon: Lightbulb, primary: false },
  { href: "/membership", label: "Membership", Icon: BookOpen, primary: false },
] as const;

function Header() {
  return <PublicSiteHeader currentPath="/collaboration" />;
}

export default function CollaborationPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-white text-slate-950">
      <Header />
      <MobileBackButton />

      <section className="relative min-h-[500px] overflow-hidden bg-[#041526] px-6 pb-3 pt-10 text-white md:pb-6 md:pt-14">
        <motion.img
          src="/images/collaboration-partnership-bridge-bg.jpeg"
          alt=""
          aria-hidden="true"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="absolute inset-0 h-full w-full object-cover object-[68%_50%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,12,24,0.96)_0%,rgba(3,22,39,0.88)_33%,rgba(4,33,58,0.54)_58%,rgba(4,18,31,0.22)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_30%,rgba(45,212,191,0.18),transparent_32%),radial-gradient(circle_at_78%_72%,rgba(212,160,23,0.16),transparent_30%)]" />
        <motion.div
          className="absolute bottom-12 right-10 hidden h-40 w-40 rounded-full bg-[#D4A017]/10 blur-3xl lg:block"
          animate={{ opacity: [0.35, 0.75, 0.35], scale: [0.96, 1.08, 0.96] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />

        <div className="relative mx-auto flex min-h-[440px] max-w-7xl items-start pt-0 md:pt-0">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">
              <TypeWriter text="COLLABORATION NETWORK" speed={44} />
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-white md:text-6xl">
              Build innovation partnerships that create impact
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100/80 md:text-xl">
              IngeniousPark welcomes schools, colleges, NGOs, industry partners, mentors, sponsors,
              innovation bodies, and institutions to collaborate on programs, mentorship, events, incubation,
              exhibitions, and local-to-global innovation pathways.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-[#002B5C] shadow-lg shadow-black/20 transition hover:bg-[#FFF5D6]"
              >
                Register Interest <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:border-[#D4A017] hover:bg-white/15"
              >
                Email Team
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#F7FBFF] px-6 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="max-w-3xl"
          >
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">Who can collaborate</p>
            <h2 className="mt-4 text-3xl font-black text-slate-950 md:text-4xl">
              Partners across education, community, industry, and support systems.
            </h2>
          </motion.div>

          <div className="mt-10 grid gap-8 lg:grid-cols-4">
            {partnerGroups.map((group, index) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.42, delay: index * 0.06, ease: EASE }}
                className="border-l-2 border-[#D4A017] pl-5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white text-[#002B5C] shadow-sm">
                    <group.Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="text-sm font-black uppercase tracking-[0.14em] text-[#002B5C]">{group.title}</h3>
                </div>
                <div className="mt-5 space-y-3">
                  {group.items.map((item) => (
                    <p key={item} className="border-b border-[#BFD7EA]/70 pb-3 text-sm font-bold leading-5 text-slate-700">
                      {item}
                    </p>
                  ))}
                </div>
              </motion.div>
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
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">Collaboration opportunities</p>
            <h2 className="mt-4 text-3xl font-black text-[#002B5C] md:text-4xl">
              Programs can be shaped around your strength.
            </h2>
          </motion.div>

          <div className="mt-10 grid auto-rows-[minmax(132px,auto)] gap-4 lg:grid-cols-4">
            {opportunityBlocks.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.42, delay: index * 0.04, ease: EASE }}
                className={`relative overflow-hidden rounded-[26px] p-5 ${
                  item.size || ""
                } ${
                  item.dark
                    ? "bg-[#061B31] text-white shadow-[0_26px_70px_rgba(0,43,92,0.18)]"
                    : item.warm
                      ? "bg-[#FFF5D6] text-slate-950"
                      : "bg-[#F7FBFF] text-slate-950"
                }`}
              >
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#D4A017]/15" aria-hidden="true" />
                <div className="relative z-10 flex h-full flex-col justify-between gap-5">
                  <div>
                    <p className={`text-xs font-black uppercase tracking-[0.18em] ${item.dark ? "text-[#D4A017]" : "text-[#002B5C]/60"}`}>
                      {item.group}
                    </p>
                    <h3 className={`mt-3 font-black leading-tight ${item.dark ? "text-3xl text-white" : "text-xl text-[#002B5C]"}`}>
                      {item.title}
                    </h3>
                  </div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-full ${item.dark ? "bg-white/10 text-[#D4A017]" : "bg-white text-[#002B5C]"}`}>
                    <item.Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFC] px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
          >
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">Partner roles</p>
            <h2 className="mt-4 text-3xl font-black text-slate-950 md:text-4xl">
              Choose the role that fits your contribution.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Collaboration can support knowledge, outreach, technology, mentorship, sponsorship, or institution-level programs.
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-3">
            {partnerRoles.map((role, index) => (
              <motion.span
                key={role}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.36, delay: index * 0.04, ease: EASE }}
                className="inline-flex items-center gap-2 rounded-full border border-[#BFD7EA] bg-white px-4 py-2 text-sm font-black text-[#002B5C] shadow-sm"
              >
                <ShieldCheck className="h-4 w-4 text-[#D4A017]" aria-hidden="true" />
                {role}
              </motion.span>
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
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">How collaboration works</p>
            <h2 className="mt-4 text-3xl font-black text-[#002B5C] md:text-4xl">
              From first conversation to clear next steps.
            </h2>
          </motion.div>

          <div className="mt-10 overflow-hidden rounded-[28px] border border-[#BFD7EA] bg-gradient-to-br from-white to-[#EAF2FB]/55">
            <div className="grid lg:grid-cols-5">
              {collaborationFlow.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.42, delay: index * 0.05, ease: EASE }}
                  className="relative min-h-[190px] border-b border-[#BFD7EA] p-5 lg:border-b-0 lg:border-r last:border-b-0 lg:last:border-r-0"
                >
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-[#D4A017]">
                    Step {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-lg font-black leading-6 text-[#002B5C]">{step.title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{step.text}</p>
                  {index < collaborationFlow.length - 1 && (
                    <span className="absolute right-4 top-5 hidden text-[#D4A017] lg:block" aria-hidden="true">
                      /
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
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
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">Collaboration inquiry</p>
            <h2 className="mt-3 text-2xl font-black md:text-3xl">Start with a short conversation.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100/80">
              Register interest, email the team, call directly, submit an idea, or explore membership.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[680px]">
            {contactCtas.map((cta) => (
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
        </motion.div>
      </section>

      <CollaborationSection />
      <PublicSiteFooter />
    </main>
  );
}
