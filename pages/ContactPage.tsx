import { motion } from "framer-motion";
import PublicSiteHeader from "../components/PublicSiteHeader";
import MobileBackButton from "../components/MobileBackButton";
import PublicSiteFooter from "../components/PublicSiteFooter";
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  Handshake,
  HelpCircle,
  Lightbulb,
  Mail,
  MessageCircle,
  Phone,
  Scale,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import RegisterSection from "../components/RegisterSection";
import TypeWriter from "../components/TypeWriter";
import { CONTACT_EMAIL, CONTACT_PHONE, PORTAL_URL } from "../config";
import { EASE, fadeUp } from "../types";

const contactOptions = [
  {
    title: "Email Team",
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
    Icon: Mail,
    external: false,
  },
  {
    title: "Call / Phone",
    value: CONTACT_PHONE,
    href: "tel:+919071620909",
    Icon: Phone,
    external: false,
  },
  {
    title: "Submit Idea",
    value: "Share a new innovation idea",
    href: "/submit-idea",
    Icon: Lightbulb,
    external: false,
  },
  {
    title: "Track Idea",
    value: "Check application status",
    href: "/track-idea",
    Icon: MessageCircle,
    external: false,
  },
  {
    title: "Portal Login",
    value: "Open the review/admin portal",
    href: `${PORTAL_URL}/login`,
    Icon: ShieldCheck,
    external: true,
  },
] as const;

const inquiryTypes = [
  { title: "Collaboration", Icon: Handshake },
  { title: "Membership", Icon: UserPlus },
  { title: "School partnership", Icon: GraduationCap },
  { title: "Mentorship / Review support", Icon: Scale },
  { title: "Sponsorship / CSR", Icon: BriefcaseBusiness },
  { title: "General questions", Icon: HelpCircle },
] as const;

const ctas = [
  { href: "/#register-interest", label: "Register Interest", Icon: UserPlus, primary: true },
  { href: "/submit-idea", label: "Submit Idea", Icon: Lightbulb, primary: true },
  { href: "/track-idea", label: "Track Idea", Icon: MessageCircle, primary: false },
  { href: "/collaboration", label: "Collaboration", Icon: Handshake, primary: false },
  { href: "/membership", label: "Membership", Icon: Users, primary: false },
] as const;

const commandRows = [
  { label: "Idea Support", detail: "Submission help and next steps", Icon: Lightbulb },
  { label: "Collaboration", detail: "Schools, NGOs, partners, programs", Icon: Handshake },
  { label: "Membership", detail: "Community updates and participation", Icon: UserPlus },
  { label: "Review Support", detail: "Mentors, experts, guidance", Icon: Scale },
  { label: "School Programs", detail: "Workshops and student activities", Icon: GraduationCap },
  { label: "General Questions", detail: "Quick direction from the team", Icon: HelpCircle },
] as const;

function Header() {
  return <PublicSiteHeader currentPath="/contact" />;
}

export default function ContactPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-white text-slate-950">
      <Header />
      <MobileBackButton />

      <section className="relative overflow-hidden bg-[#03101f] px-6 py-[4.5rem] text-white md:py-[5.5rem]">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#03101f_0%,#05243d_48%,#020914_100%)]" />
        <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(191,215,234,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(191,215,234,0.08)_1px,transparent_1px)] [background-size:54px_54px]" />
        <div className="absolute left-1/2 top-0 h-72 w-[760px] -translate-x-1/2 rounded-full bg-cyan-300/12 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#D4A017]/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D4A017]/50 to-transparent" />
        <div className="relative mx-auto max-w-7xl">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-5xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">
              <TypeWriter text="CONTACT & INQUIRIES" speed={44} />
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-white md:text-6xl">
              Let&apos;s connect your idea, question, or partnership
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100/80 md:text-xl">
              Reach the IngeniousPark team for idea submission support, collaboration,
              membership, mentorship or review support, sponsorship, school programs, and general questions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/#register-interest"
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
              <a
                href="/track-idea"
                className="inline-flex items-center gap-2 rounded-2xl border border-[#D4A017]/45 bg-[#D4A017]/10 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#D4A017]/18"
              >
                Track Idea
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.16, ease: EASE }}
            className="relative mt-14 overflow-hidden border-y border-white/12 py-6"
          >
            <motion.div
              className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-cyan-300/18 to-transparent"
              animate={{ x: ["-20%", "1120%"], opacity: [0, 0.65, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />
            <div className="grid gap-5 lg:grid-cols-[1.05fr_0.55fr] lg:items-stretch">
              <div className="grid gap-2">
                {commandRows.map((row, index) => (
                  <motion.div
                    key={row.label}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.42, delay: 0.26 + index * 0.05, ease: EASE }}
                    className="group grid gap-3 border-l border-white/12 bg-white/[0.045] px-4 py-3 backdrop-blur sm:grid-cols-[auto_1fr_auto] sm:items-center"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-200/10 text-cyan-100 ring-1 ring-cyan-100/15">
                      <row.Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-black text-white">{row.label}</p>
                      <p className="mt-1 text-xs font-semibold text-blue-100/62">{row.detail}</p>
                    </div>
                    <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#D4A017]">
                      <span className="h-2 w-2 rounded-full bg-[#D4A017] shadow-[0_0_16px_rgba(212,160,23,0.8)]" />
                      Routed
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="relative flex min-h-[260px] flex-col justify-between border border-white/12 bg-[#020914]/55 p-5">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#D4A017]">IngeniousPark Desk</p>
                  <h2 className="mt-4 text-2xl font-black leading-tight text-white">Inquiry routing console</h2>
                  <p className="mt-3 text-sm font-semibold leading-6 text-blue-100/70">
                    Messages are guided toward the right team path: ideas, status, programs, partners, or membership.
                  </p>
                </div>
                <div className="mt-8 space-y-3">
                  {["Open", "Read", "Reply"].map((status, index) => (
                    <motion.div
                      key={status}
                      className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-bold text-blue-100/72"
                      animate={{ opacity: [0.52, 1, 0.52] }}
                      transition={{ duration: 2.4, delay: index * 0.28, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <span>{status}</span>
                      <span className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                        <motion.span
                          className="block h-full rounded-full bg-gradient-to-r from-cyan-200 to-[#D4A017]"
                          animate={{ x: ["-100%", "110%"] }}
                          transition={{ duration: 1.8, delay: index * 0.32, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#F7FBFF] px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
          >
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">Reach us</p>
            <h2 className="mt-4 text-3xl font-black text-[#002B5C] md:text-4xl">
              Choose the fastest route to the team.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Use email or phone for direct help, or use the right public route for ideas, tracking, and portal access.
            </p>
          </motion.div>

          <div className="divide-y divide-[#BFD7EA] border-y border-[#BFD7EA]">
            {contactOptions.map((card, index) => (
              <motion.a
                key={card.title}
                href={card.href}
                target={card.external ? "_blank" : undefined}
                rel={card.external ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: index * 0.05, ease: EASE }}
                className="group grid gap-4 py-5 transition hover:bg-white/70 sm:grid-cols-[auto_1fr_auto] sm:items-center"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#002B5C] shadow-sm transition group-hover:bg-[#002B5C] group-hover:text-white">
                  <card.Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-950">{card.title}</h3>
                  <p className="mt-1 break-words text-sm font-semibold leading-5 text-slate-600">{card.value}</p>
                </div>
                <ArrowRight className="hidden h-4 w-4 text-[#D4A017] transition group-hover:translate-x-1 sm:block" aria-hidden="true" />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
          >
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">Inquiry types</p>
            <h2 className="mt-4 text-3xl font-black text-[#002B5C] md:text-4xl">
              Many questions can start here.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Use the register-interest form for partnership, membership, mentorship, sponsorship, and general program questions.
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-3">
            {inquiryTypes.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: EASE }}
                className="flex items-center gap-3 rounded-full border border-[#BFD7EA] bg-[#F7FBFF] px-5 py-3"
              >
                <item.Icon className="h-5 w-5 flex-none text-[#D4A017]" aria-hidden="true" />
                <p className="text-sm font-semibold leading-6 text-slate-700">{item.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#002B5C] px-6 py-14 text-white">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: EASE }}
          className="mx-auto max-w-7xl"
        >
          <div className="grid gap-8 border-y border-white/15 py-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">Helpful links</p>
              <h2 className="mt-3 text-2xl font-black md:text-3xl">Use the right path for the right request.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100/80">
                Idea submissions and application status checks have dedicated routes. General inquiries can use the form below.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:max-w-[620px] lg:justify-end">
              {ctas.map((cta) => (
                <a
                  key={cta.href}
                  href={cta.href}
                  className={
                    cta.primary
                      ? "inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[#002B5C] transition hover:bg-[#FFF5D6]"
                      : "inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:border-[#D4A017] hover:bg-white/15"
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

      <RegisterSection />
      <PublicSiteFooter />
    </main>
  );
}
