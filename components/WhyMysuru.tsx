import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle2 } from "lucide-react";
import { fadeUp, EASE } from "../types";
import { mysuruEcosystem, mysuruStats, whyMysuruReasons } from "../data";

gsap.registerPlugin(ScrollTrigger);

const ECOSYSTEM_IMAGES = [
  "https://images.pexels.com/photos/37145891/pexels-photo-37145891.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/8533094/pexels-photo-8533094.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/73871/rocket-launch-rocket-take-off-nasa-73871.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/6804612/pexels-photo-6804612.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/34548994/pexels-photo-34548994.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/6876942/pexels-photo-6876942.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
];

const ECO_BACK_BORDER = [
  "border-[#BFD7EA]", "border-[#D4A017]/30", "border-indigo-200",
  "border-[#BFD7EA]", "border-amber-200", "border-rose-200",
];

const REASON_BG     = ["#EAF2FB","#FFF5D6","#EAF2FB","#eef2ff","#EAF2FB","#fffbeb"];
const REASON_BORDER = ["#BFD7EA","#D4A017","#BFD7EA","#a5b4fc","#BFD7EA","#fcd34d"];
const REASON_NUM_BG = ["#EAF2FB","#FFF5D6","#EAF2FB","#c7d2fe","#EAF2FB","#fde68a"];
const REASON_NUM_TX = ["#002B5C","#002B5C","#002B5C","#3730a3","#002B5C","#78350f"];

const STAT_ARCS = [
  { pct: 0.72, color: "#002B5C" },
  { pct: 0.58, color: "#D4A017" },
  { pct: 0.78, color: "#003B73" },
  { pct: 0.88, color: "#f59e0b" },
];

function StatArc({ pct, color, delay }: { pct: number; color: string; delay: number }) {
  const arcRef = useRef<SVGCircleElement>(null);
  const r = 22;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    const el = arcRef.current;
    if (!el) return;
    gsap.set(el, { strokeDasharray: circ, strokeDashoffset: circ });
    const trigger = ScrollTrigger.create({
      trigger: "#why-mysuru",
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(el, { strokeDashoffset: circ * (1 - pct), duration: 1.4, delay, ease: "power2.out" });
      },
    });
    return () => trigger.kill();
  }, [circ, pct, delay]);

  return (
    <svg width={56} height={56} viewBox="0 0 60 60" className="absolute right-3 top-3 opacity-60">
      <circle cx="30" cy="30" r={r} fill="none" stroke="#f1f5f9" strokeWidth="4.5" />
      <circle ref={arcRef} cx="30" cy="30" r={r} fill="none" stroke={color} strokeWidth="4.5" strokeLinecap="round" transform="rotate(-90 30 30)" />
    </svg>
  );
}

function CountUp({ target, suffix, duration = 1.8 }: { target: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => {
        if (started.current) return;
        started.current = true;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration,
          ease: "power2.out",
          onUpdate: () => setCount(Math.round(obj.val)),
          onComplete: () => {
            gsap.timeline()
              .to(ref.current, { scale: 1.2, color: "#10b981", duration: 0.18, ease: "power2.out" })
              .to(ref.current, { scale: 1, color: "#0f172a", duration: 0.4, ease: "elastic.out(1, 0.5)" });
          },
        });
      },
    });
    return () => trigger.kill();
  }, [target, duration]);

  return <span ref={ref} style={{ display: "inline-block" }}>{count}{suffix}</span>;
}

interface Props {
  onScrollTo: (id: string) => void;
}

export default function WhyMysuru({ onScrollTo }: Props) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
  );
  // Desktop hover state
  const [ecoHovered, setEcoHovered] = useState<number | null>(null);
  const [reasonHovered, setReasonHovered] = useState<number | null>(null);
  // Mobile scroll-triggered — only ONE card active at a time
  const [activeEcoIdx, setActiveEcoIdx] = useState<number | null>(null);
  const [activeReasonIdx, setActiveReasonIdx] = useState<number | null>(null);
  // Refs to all card elements
  const ecoCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reasonCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Respond to viewport width changes
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const h = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      if (!e.matches) {
        setActiveEcoIdx(null);
        setActiveReasonIdx(null);
      }
    };
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // Mobile: narrow ScrollTrigger per eco card — only card centered in viewport flips
  useEffect(() => {
    if (!isMobile) return;
    const triggers: ScrollTrigger[] = [];
    ecoCardRefs.current.forEach((el, i) => {
      if (!el) return;
      const t = ScrollTrigger.create({
        trigger: el,
        start: "center 65%",
        end: "center 35%",
        onEnter: () => setActiveEcoIdx(i),
        onLeave: () => setActiveEcoIdx((p) => (p === i ? null : p)),
        onEnterBack: () => setActiveEcoIdx(i),
        onLeaveBack: () => setActiveEcoIdx((p) => (p === i ? null : p)),
      });
      triggers.push(t);
    });
    return () => { triggers.forEach((t) => t.kill()); };
  }, [isMobile]);

  // Mobile: narrow ScrollTrigger per reason card — only centered card colors
  useEffect(() => {
    if (!isMobile) return;
    const triggers: ScrollTrigger[] = [];
    reasonCardRefs.current.forEach((el, i) => {
      if (!el) return;
      const t = ScrollTrigger.create({
        trigger: el,
        start: "center 65%",
        end: "center 35%",
        onEnter: () => setActiveReasonIdx(i),
        onLeave: () => setActiveReasonIdx((p) => (p === i ? null : p)),
        onEnterBack: () => setActiveReasonIdx(i),
        onLeaveBack: () => setActiveReasonIdx((p) => (p === i ? null : p)),
      });
      triggers.push(t);
    });
    return () => { triggers.forEach((t) => t.kill()); };
  }, [isMobile]);

  const isEcoFlipped = (i: number) => (isMobile ? activeEcoIdx === i : ecoHovered === i);
  const isReasonColored = (i: number) => (isMobile ? activeReasonIdx === i : reasonHovered === i);

  return (
    <section id="why-mysuru" className="relative px-6 py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-[#06b6d4] opacity-5 blur-2xl" />
        <div className="absolute -right-10 bottom-0 h-80 w-80 rounded-full bg-[#D4A017] opacity-5 blur-2xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-900 opacity-10 blur-2xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#06b6d4]">
            Why Mysuru Region first
          </p>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            A city with depth, talent, and untapped reach
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Mysuru Region is not just a heritage city — it is home to world-class research institutes, premier
            universities, India&apos;s space program, and a thriving tech industry. The ingredients for
            innovation are already here. NMF connects them.
          </p>
        </motion.div>

        {/* Stats row */}
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {mysuruStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: EASE }}
              className="relative rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-center shadow-sm"
            >
              <StatArc pct={STAT_ARCS[i].pct} color={STAT_ARCS[i].color} delay={i * 0.12} />
              <div className="text-3xl font-extrabold text-white">
                <CountUp target={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-xs font-semibold text-slate-400">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Ecosystem flip cards — hover on desktop, scroll on mobile */}
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {mysuruEcosystem.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: isMobile ? 0 : i * 0.08, ease: EASE }}
              ref={(el) => { ecoCardRefs.current[i] = el; }}
              data-eco-idx={String(i)}
              style={{ perspective: "900px", willChange: "transform" }}
              className="h-[240px] cursor-pointer"
              onMouseEnter={() => !isMobile && setEcoHovered(i)}
              onMouseLeave={() => !isMobile && setEcoHovered(null)}
            >
              <motion.div
                animate={{ rotateY: isEcoFlipped(i) ? 180 : 0 }}
                transition={{ duration: 0.75, ease: EASE }}
                style={{
                  transformStyle: "preserve-3d",
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  willChange: "transform",
                }}
              >
                {/* Front: image */}
                <div
                  style={{ backfaceVisibility: "hidden" }}
                  className="absolute inset-0 overflow-hidden rounded-3xl shadow-md"
                >
                  <img
                    src={ECOSYSTEM_IMAGES[i]}
                    alt={item.label}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onLoad={(e) => (e.currentTarget as HTMLImageElement).classList.add("loaded")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/88 via-slate-900/30 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <div className={`mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg}`}>
                      <item.Icon className={`h-5 w-5 ${item.iconColor}`} />
                    </div>
                    <div className="text-2xl font-extrabold text-white">{item.value}</div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-white/80">{item.label}</div>
                    <div className="mt-1 text-[10px] text-white/50">
                      {isMobile ? "Scroll to explore" : "Hover to explore"} →
                    </div>
                  </div>
                </div>

                {/* Back: description */}
                <div
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                  className={`absolute inset-0 flex flex-col overflow-hidden rounded-3xl border-2 bg-white p-5 shadow-sm ${ECO_BACK_BORDER[i]}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg}`}>
                      <item.Icon className={`h-5 w-5 ${item.iconColor}`} />
                    </div>
                    <div>
                      <div className="text-lg font-extrabold text-slate-900">{item.value}</div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{item.label}</div>
                    </div>
                  </div>
                  <p className="mt-3 flex-1 overflow-y-auto text-sm leading-6 text-slate-600">{item.desc}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-14 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-slate-400">
            So why does NMF exist?
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Why reasons — color+zoom on hover (desktop) or scroll (mobile) */}
        <div className="grid gap-5 md:grid-cols-3">
          {whyMysuruReasons.map((item, i) => {
            const colored = isReasonColored(i);
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={isMobile ? undefined : { y: -4 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: isMobile ? 0 : i * 0.07, ease: EASE }}
                ref={(el) => { reasonCardRefs.current[i] = el; }}
                data-reason-idx={String(i)}
                onMouseEnter={() => !isMobile && setReasonHovered(i)}
                onMouseLeave={() => !isMobile && setReasonHovered(null)}
                className="cursor-pointer rounded-3xl border-2 p-6 shadow-sm"
                style={{
                  backgroundColor: colored ? REASON_BG[i] : item.featured ? "#f0fdf4" : "#ffffff",
                  borderColor: colored ? REASON_BORDER[i] : item.featured ? "#bbf7d0" : "#e2e8f0",
                  boxShadow: colored ? `0 8px 30px ${REASON_BORDER[i]}55` : undefined,
                  transform: colored && isMobile ? "scale(1.03) translateY(-4px)" : undefined,
                  transition: "background-color 0.35s ease, border-color 0.35s ease, box-shadow 0.3s ease, transform 0.35s ease",
                  willChange: "transform",
                }}
              >
                <div
                  className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    backgroundColor: colored ? REASON_NUM_BG[i] : item.featured ? "#EAF2FB" : "#f1f5f9",
                    color: colored ? REASON_NUM_TX[i] : item.featured ? "#002B5C" : "#475569",
                    transition: "background-color 0.35s ease, color 0.35s ease",
                  }}
                >
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.text}</p>
                {item.featured && (
                  <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#002B5C]">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>This is where NMF comes in</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => onScrollTo("register-interest")}
            className="magnetic-btn rounded-xl border border-[#BFD7EA] bg-white px-6 py-3 text-sm font-semibold text-[#002B5C] transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Start your journey →
          </button>
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-12 text-center"
        >
          <div className="inline-block rounded-full border border-white/15 bg-white/5 px-6 py-3 text-lg font-semibold text-white shadow-sm">
            Mysuru Region is not the limitation — it is the starting point.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
