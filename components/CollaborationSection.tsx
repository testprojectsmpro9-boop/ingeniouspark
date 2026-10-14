import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, CheckCircle2, X } from "lucide-react";
import { fadeUp, springModal } from "../types";
import type { CollaborationCard } from "../types";
import { collaborationCards } from "../data";
import BrandImage from "./BrandImage";

gsap.registerPlugin(ScrollTrigger);

export default function CollaborationSection() {
  const [selectedEntity, setSelectedEntity] = useState<CollaborationCard | null>(null);

  useEffect(() => {
    if (!selectedEntity) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedEntity(null); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKeyDown); };
  }, [selectedEntity]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".collab-card", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.55,
        ease: "power3.out",
        scrollTrigger: { trigger: "#collaboration", start: "top 68%", once: true },
      });
    });
    const cards = document.querySelectorAll<HTMLElement>(".collab-card");
    const cleanups: (() => void)[] = [];
    cards.forEach((card) => {
      const onEnter = () => gsap.to(card, { y: -8, scale: 1.02, duration: 0.3, ease: "power2.out" });
      const onLeave = () => gsap.to(card, { y: 0, scale: 1, duration: 0.4, ease: "elastic.out(1, 0.6)" });
      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);
      cleanups.push(() => { card.removeEventListener("mouseenter", onEnter); card.removeEventListener("mouseleave", onLeave); });
    });
    return () => { ctx.revert(); cleanups.forEach((fn) => fn()); };
  }, []);

  return (
    <section id="collaboration" className="mx-auto max-w-7xl px-6 py-20">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-lg md:p-10"
      >
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#06b6d4]">
            A global collaboration
          </p>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            NMF, IFIA Bharat, Pratyagra Foundation, IFIA Global, ABIPIR (Brazil), and Akshaya Ahara Foundation
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            This initiative is built by NMF in collaboration with IFIA Bharat and Pratyagra
            Foundation, aligned with IFIA Global, and strengthened through association with ABIPIR
            (Brazil) and Akshaya Ahara Foundation.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-6">
          {collaborationCards.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => {
                if (item.directWebsite && item.website !== "#") {
                  window.open(item.website, "_blank", "noopener,noreferrer");
                  return;
                }
                setSelectedEntity(item);
              }}
              className={`collab-card group relative flex min-h-[220px] flex-col items-center justify-center overflow-hidden rounded-3xl border bg-white/5 p-6 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4A017] hover:bg-white/8 ${
                item.title === "NMF" ? "border-[#06b6d4]/30" : "border-white/10"
              }`}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#002B5C] via-[#D4A017] to-[#003B73] opacity-0 transition group-hover:opacity-100" />
              <BrandImage src={item.image} alt={item.alt} label={item.title} />
              <h3 className="mt-5 text-lg font-bold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{item.subtitle}</p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#06b6d4] opacity-70 transition group-hover:opacity-100">
                <span>Explore</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </button>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedEntity && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-md"
              onClick={() => setSelectedEntity(null)}
            >
              <motion.div
                variants={springModal}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="entity-title"
                className="relative w-full max-w-2xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl"
              >
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#002B5C] via-[#D4A017] to-[#003B73]" />
                <button
                  type="button"
                  onClick={() => setSelectedEntity(null)}
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="grid gap-8 p-8 md:grid-cols-[0.85fr_1.15fr] md:p-10">
                  <div className="flex flex-col items-center justify-center rounded-3xl bg-slate-50 p-6 text-center">
                    <BrandImage src={selectedEntity.image} alt={selectedEntity.alt} label={selectedEntity.title} className="h-24 max-w-full object-contain" />
                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#002B5C]">Collaboration entity</p>
                    <h3 id="entity-title" className="mt-2 text-2xl font-bold text-slate-900">{selectedEntity.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{selectedEntity.subtitle}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#002B5C]">Brief overview</p>
                    <p className="mt-4 text-base leading-8 text-slate-600">{selectedEntity.description}</p>
                    <div className="mt-6 grid gap-3">
                      {selectedEntity.highlights.map((h) => (
                        <div key={h} className="flex items-start gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#002B5C]" />
                          {h}
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 flex flex-wrap gap-3">
                      {selectedEntity.website !== "#" ? (
                        <a href={selectedEntity.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]">
                          {selectedEntity.websiteLabel}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <span className="inline-flex items-center rounded-xl border border-slate-300 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-500">{selectedEntity.websiteLabel}</span>
                      )}
                      <button type="button" onClick={() => setSelectedEntity(null)} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 text-center">
          <p className="text-sm text-slate-400">Bridging Mysuru Region with national and international innovation ecosystems</p>
        </div>
      </motion.div>
    </section>
  );
}
