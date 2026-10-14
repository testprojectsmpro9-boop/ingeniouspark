import { motion } from "framer-motion";
import PublicSiteHeader from "../components/PublicSiteHeader";
import MobileBackButton from "../components/MobileBackButton";
import PublicSiteFooter from "../components/PublicSiteFooter";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Globe2,
  Handshake,
  HeartHandshake,
  Lightbulb,
  MessageCircle,
  Network,
  Rocket,
  Scale,
  Sparkles,
  Users,
} from "lucide-react";
import RegisterSection from "../components/RegisterSection";
import TypeWriter from "../components/TypeWriter";
import { EASE, fadeUp } from "../types";

const joinerGroups = [
  {
    title: "Learners",
    Icon: BookOpen,
    items: ["Students", "Young innovators"],
  },
  {
    title: "Innovators",
    Icon: Lightbulb,
    items: ["Individual inventors", "Startups", "Grassroots innovators"],
  },
  {
    title: "Guides",
    Icon: HeartHandshake,
    items: ["Teachers", "Mentors", "Review experts"],
  },
  {
    title: "Institutions & Partners",
    Icon: Building2,
    items: ["Schools / colleges", "NGOs / communities", "Industry / startup partners"],
  },
] as const;

const benefits = [
  { title: "Event and workshop updates", Icon: CalendarDays },
  { title: "Mentorship opportunities", Icon: HeartHandshake },
  { title: "Networking with innovators", Icon: Network },
  { title: "Collaboration opportunities", Icon: Handshake },
  { title: "Expert/review participation", Icon: Scale },
  { title: "Local to national/international exposure", Icon: Globe2 },
] as const;

const communityNodes = [
  { label: "Events", Icon: CalendarDays, className: "left-[7%] top-[16%]" },
  { label: "Mentors", Icon: HeartHandshake, className: "right-[8%] top-[17%]" },
  { label: "Innovators", Icon: Lightbulb, className: "left-[6%] bottom-[24%]" },
  { label: "Institutions", Icon: Building2, className: "right-[7%] bottom-[24%]" },
  { label: "Startups", Icon: BriefcaseBusiness, className: "left-[38%] top-[7%]" },
  { label: "Workshops", Icon: CalendarDays, className: "left-[37%] bottom-[8%]" },
] as const;

const pulseItems = [
  { title: "Events", Icon: CalendarDays },
  { title: "Mentorship", Icon: HeartHandshake },
  { title: "Workshops", Icon: BookOpen },
  { title: "Collaborations", Icon: Handshake },
  { title: "Expert sessions", Icon: Scale },
  { title: "Innovation exposure", Icon: Globe2 },
] as const;

const pulsePositions = [
  "left-[4%] top-[43%]",
  "left-[20%] top-[11%]",
  "left-[37%] top-[60%]",
  "left-[53%] top-[27%]",
  "left-[68%] top-[48%]",
  "right-[2%] top-[9%]",
] as const;

const ctas = [
  { href: "/#register-interest", label: "Register Interest", Icon: Users, primary: true },
  { href: "/submit-idea", label: "Submit Idea", Icon: Lightbulb, primary: false },
  { href: "/track-idea", label: "Track Idea", Icon: Rocket, primary: false },
  { href: "/collaboration", label: "Collaboration", Icon: Handshake, primary: false },
  { href: "/contact", label: "Contact", Icon: MessageCircle, primary: false },
] as const;

function Header() {
  return <PublicSiteHeader currentPath="/membership" />;
}

function CommunityVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.72, delay: 0.12, ease: EASE }}
      className="relative min-h-[430px] overflow-hidden rounded-[38px] bg-[#021526] p-6 shadow-[0_34px_110px_rgba(0,43,92,0.28)] ring-1 ring-white/10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_22%,rgba(45,212,191,0.22),transparent_32%),radial-gradient(circle_at_78%_70%,rgba(212,160,23,0.2),transparent_30%),linear-gradient(135deg,#031b31_0%,#010c18_100%)]" />
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 620 420" aria-hidden="true">
        <defs>
          <linearGradient id="memberNetworkLine" x1="0" x2="1">
            <stop stopColor="#2dd4bf" />
            <stop offset="0.5" stopColor="#D4A017" />
            <stop offset="1" stopColor="#7FB3D5" />
          </linearGradient>
        </defs>
        <path
          d="M122 116 C216 52, 398 54, 492 118 C570 172, 558 282, 482 330 C374 398, 220 382, 122 308 C48 252, 52 164, 122 116Z"
          fill="none"
          stroke="url(#memberNetworkLine)"
          strokeOpacity="0.5"
          strokeWidth="2"
          strokeDasharray="8 12"
        />
        <path
          d="M176 210 C244 148, 386 150, 446 214 C376 278, 244 278, 176 210Z"
          fill="none"
          stroke="url(#memberNetworkLine)"
          strokeOpacity="0.34"
          strokeWidth="2"
        />
        <path d="M172 210 L310 210 L448 210 M310 112 L310 306 M150 126 L470 298 M470 126 L150 300" stroke="url(#memberNetworkLine)" strokeOpacity="0.18" strokeWidth="1.5" />
      </svg>

      <motion.div
        className="absolute left-1/2 top-1/2 z-10 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2dd4bf]/10 blur-2xl"
        animate={{ scale: [0.92, 1.12, 0.92], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      <motion.div
        className="relative z-10 mx-auto mt-24 flex h-44 w-44 flex-col items-center justify-center rounded-full border border-[#D4A017]/45 bg-white/8 text-center text-white shadow-[0_0_60px_rgba(45,212,191,0.18)] backdrop-blur"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="h-8 w-8 text-[#D4A017]" aria-hidden="true" />
        <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-[#D4A017]">Community</p>
        <p className="mt-2 max-w-[8.5rem] text-sm font-bold leading-5">Innovation Network</p>
      </motion.div>

      {communityNodes.map((node, index) => (
        <motion.div
          key={node.label}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: [0, index % 2 === 0 ? -6 : 6, 0] }}
          whileHover={{ y: -3 }}
          transition={{ duration: 4.2 + index * 0.2, delay: 0.26 + index * 0.08, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute z-10 flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black text-white shadow-[0_12px_34px_rgba(0,0,0,0.2)] backdrop-blur ${node.className}`}
        >
          <node.Icon className="h-4 w-4 text-[#D4A017]" aria-hidden="true" />
          {node.label}
        </motion.div>
      ))}

      <motion.div
        className="absolute bottom-7 left-7 right-7 z-10 flex items-center gap-3 border-t border-white/10 pt-5"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.62, ease: EASE }}
      >
        <CheckCircle2 className="h-5 w-5 flex-none text-[#D4A017]" aria-hidden="true" />
        <p className="text-sm font-bold leading-6 text-blue-100/90">
          Idea submission remains free and open. Membership is only for staying connected.
        </p>
      </motion.div>
    </motion.div>
  );
}

function CommunityPulse() {
  return (
    <section className="relative overflow-hidden bg-[#020D1B] px-6 py-16 text-white md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_32%,rgba(45,212,191,0.18),transparent_30%),radial-gradient(circle_at_82%_64%,rgba(212,160,23,0.18),transparent_28%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
        >
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">Community Pulse</p>
          <h2 className="mt-4 text-3xl font-black md:text-4xl">A network of opportunities around you.</h2>
          <p className="mt-4 text-base leading-7 text-blue-100/75">
            Membership keeps you close to people, programs, and moments that help ideas move forward.
          </p>
        </motion.div>

        <div className="relative min-h-[330px]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 760 330" aria-hidden="true">
            <defs>
              <linearGradient id="pulseRail" x1="0" x2="1">
                <stop stopColor="#2dd4bf" />
                <stop offset="0.52" stopColor="#D4A017" />
                <stop offset="1" stopColor="#7FB3D5" />
              </linearGradient>
            </defs>
            <path d="M54 168 C180 42, 308 286, 430 162 C542 48, 626 118, 710 62" fill="none" stroke="url(#pulseRail)" strokeOpacity="0.42" strokeWidth="2" />
            <path d="M72 238 C202 144, 306 92, 434 210 C532 300, 632 248, 706 184" fill="none" stroke="url(#pulseRail)" strokeOpacity="0.24" strokeWidth="2" strokeDasharray="9 12" />
          </svg>

          {pulseItems.map((item, index) => {
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.88 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                animate={{ y: [0, index % 2 === 0 ? -7 : 7, 0] }}
                transition={{ duration: 4.6, delay: index * 0.08, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute ${pulsePositions[index]} flex min-w-[9.5rem] items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm font-black text-white shadow-[0_18px_46px_rgba(0,0,0,0.22)] backdrop-blur`}
              >
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#D4A017]/15 text-[#D4A017]">
                  <item.Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {item.title}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function MembershipPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-white text-slate-950">
      <Header />
      <MobileBackButton />

      <section className="relative overflow-hidden bg-[#061B31] px-6 py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_25%,rgba(45,212,191,0.2),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(212,160,23,0.18),transparent_28%),linear-gradient(135deg,#08233d_0%,#020b16_100%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">
              <TypeWriter text="INNOVATION COMMUNITY" speed={44} />
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-white md:text-6xl">
              <TypeWriter text="Join the innovation community" delay={0.15} speed={42} />
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100/80 md:text-xl">
              Membership helps people stay connected with events, mentorship, collaboration, expert sessions, and
              innovation opportunities.
            </p>
            <p className="mt-4 max-w-2xl text-base font-bold leading-7 text-[#DFF8FF]">
              Idea submission is free and open. Membership is optional.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/#register-interest"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-[#002B5C] shadow-lg shadow-black/20 transition hover:bg-[#FFF5D6]"
              >
                Register Interest <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="/submit-idea"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:border-[#D4A017] hover:bg-white/15"
              >
                Submit Idea
              </a>
            </div>
          </motion.div>

          <CommunityVisual />
        </div>
      </section>

      <section className="bg-white px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="grid gap-6 border-y border-[#BFD7EA] py-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center"
          >
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D4A017]">Submit Idea</p>
              <h2 className="mt-2 text-2xl font-black text-[#002B5C]">Share an innovation idea.</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Free, open, and separate from membership.</p>
            </div>
            <div className="hidden h-20 w-px bg-[#BFD7EA] lg:block" aria-hidden="true" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D4A017]">Join Community</p>
              <h2 className="mt-2 text-2xl font-black text-[#002B5C]">Stay connected and participate.</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">For updates, events, mentorship, and collaboration.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <CommunityPulse />

      <section className="bg-[#F7FBFF] px-6 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="max-w-3xl"
          >
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">Who can join</p>
            <h2 className="mt-4 text-3xl font-black text-slate-950 md:text-4xl">
              A community for learners, builders, guides, and partners.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              You can join as a person, mentor, school, community group, institution, or partner.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-8 lg:grid-cols-4">
            {joinerGroups.map((group, index) => (
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
                  <h3 className="text-sm font-black uppercase tracking-[0.16em] text-[#002B5C]">{group.title}</h3>
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
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
          >
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">Community benefits</p>
            <h2 className="mt-4 text-3xl font-black text-[#002B5C] md:text-4xl">
              Stay close to people and opportunities.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Membership is about connection: learning, meeting people, helping others, and finding the next opportunity.
            </p>
          </motion.div>

          <div className="space-y-1">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.42, delay: index * 0.045, ease: EASE }}
                className="group grid gap-4 border-b border-slate-200 py-4 sm:grid-cols-[auto_1fr]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF2FB] text-[#002B5C] transition group-hover:bg-[#002B5C] group-hover:text-white">
                  <benefit.Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-base font-black text-slate-900">{benefit.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">Simple ways to stay active in the innovation ecosystem.</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFC] px-6 py-14">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto max-w-7xl"
        >
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">Know the difference</p>
          <div className="mt-5 grid gap-6 border-y border-[#BFD7EA] py-7 lg:grid-cols-2">
            <div className="flex gap-4">
              <Lightbulb className="mt-1 h-6 w-6 flex-none text-[#D4A017]" aria-hidden="true" />
              <div>
                <h2 className="text-xl font-black text-[#002B5C]">Submitting an idea is free.</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  You do not need membership to send an idea or receive an Application ID.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Users className="mt-1 h-6 w-6 flex-none text-[#D4A017]" aria-hidden="true" />
              <div>
                <h2 className="text-xl font-black text-[#002B5C]">Membership keeps you connected.</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Join if you want updates, events, mentorship, volunteering, or collaboration opportunities.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
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
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">Join or participate</p>
            <h2 className="mt-3 text-2xl font-black md:text-3xl">Choose how you want to stay involved.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100/80">
              Register interest, submit an idea, track an idea, collaborate, or contact the team.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[620px]">
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
        </motion.div>
      </section>

      <RegisterSection />
      <PublicSiteFooter />
    </main>
  );
}
