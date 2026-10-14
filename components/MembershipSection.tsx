import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { CheckCircle2 } from "lucide-react";
import { fadeUp, slideRight, EASE } from "../types";
import { membershipTypes, benefits } from "../data";

type MemberType = typeof membershipTypes[number];

function MemberCard({ m, i }: { m: MemberType; i: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(el, {
      rotateY: x * 22,
      rotateX: -y * 22,
      transformPerspective: 800,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const onLeave = () => {
    const el = wrapRef.current;
    if (!el) return;
    gsap.to(el, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.65,
      ease: "elastic.out(1, 0.45)",
    });
  };

  return (
    // Outer div: GSAP controls rotateX/rotateY (transform)
    // Inner motion.div: Framer Motion controls opacity + y (separate from GSAP's transform)
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
        className="group cursor-pointer rounded-3xl border border-white/10 bg-white/5 p-6 transition-colors duration-300 hover:bg-white/8"
      >
        <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${m.iconBg} shadow-sm transition duration-300 group-hover:scale-110`}>
          <m.Icon className={`h-7 w-7 ${m.iconColor}`} />
        </div>
        <h3 className="text-lg font-bold text-white">{m.title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-300">{m.desc}</p>
      </motion.div>
    </div>
  );
}

export default function MembershipSection() {
  return (
    <section id="membership" className="bg-[#0a1628] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideRight}
          className="max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#06b6d4]">
            Membership
          </p>
          <h2 className="mt-4 text-3xl font-bold text-white">
            Join the early community
          </h2>
          <p className="mt-6 text-lg text-slate-300">
            We are creating a membership-based community for Mysuru Region, supported by our collaboration
            with IFIA Bharat and our wider international association ecosystem.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {membershipTypes.map((m, i) => (
            <MemberCard key={m.title} m={m} i={i} />
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-12 rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">What members can expect</h3>
            <span className="rounded-full bg-[#06b6d4]/10 px-3 py-1 text-sm font-semibold text-[#06b6d4]">
              {benefits.length} benefits
            </span>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {benefits.map((b, i) => (
              <motion.li
                key={b}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-slate-300"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#002B5C]" />
                {b}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
