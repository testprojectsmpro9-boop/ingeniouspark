import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/submit-idea",    label: "Submit Idea",       primary: true  },
  { href: "/track-idea",     label: "Track Idea",        primary: false },
  { href: "/who-can-apply",  label: "Who Can Apply",     primary: false },
  { href: "/review-process", label: "Idea to Impact",    primary: false },
  { href: "/innovation-hub", label: "Innovation Hub",    primary: false },
  { href: "/membership",     label: "Membership",        primary: false },
  { href: "/collaboration",  label: "Collaboration",     primary: false },
  { href: "/submission",     label: "Submission Journey", primary: false },
  { href: "/contact",        label: "Contact",           primary: false },
] as const;

interface PublicSiteHeaderProps {
  currentPath?: string;
}

export default function PublicSiteHeader({ currentPath }: PublicSiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const activePath = currentPath ?? (typeof window !== "undefined" ? window.location.pathname : "/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: scrolled ? "rgba(248,251,255,0.96)" : "rgba(248,251,255,0.88)",
          backdropFilter: scrolled ? "blur(16px)" : "blur(12px)",
          borderBottomColor: scrolled ? "rgba(191,215,234,0.7)" : "rgba(191,215,234,0.5)",
          boxShadow: scrolled ? "0 10px 30px rgba(0,43,92,0.08)" : "none",
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-40 border-b"
      >
        {/* Desktop */}
        <div className="mx-auto hidden max-w-7xl items-center justify-between gap-4 px-6 py-3 lg:flex">
          <a href="/" className="flex shrink-0 items-center gap-2.5">
            <img src="/mnf-logo.png" alt="NMF Logo" className="h-9 w-auto object-contain" />
            <span className="text-sm font-bold tracking-tight text-[#002B5C]">IngeniousPark</span>
          </a>
          <nav className="flex flex-1 items-center justify-center gap-1 overflow-x-auto rounded-full border border-[#BFD7EA]/60 bg-white/40 px-2 py-1.5 backdrop-blur-md">
            {NAV_LINKS.filter((l) => !l.primary).map((item) => {
              const active = activePath === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    active ? "bg-[#002B5C]/10 text-[#D4A017]" : "text-[#002B5C]/65 hover:text-[#D4A017]"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
          <a
            href="/submit-idea"
            className="shrink-0 rounded-xl bg-[#D4A017] px-4 py-2 text-xs font-bold text-[#002B5C] transition hover:bg-[#f0c040]"
          >
            Submit Idea
          </a>
        </div>

        {/* Mobile / tablet */}
        <div className="flex items-center justify-between px-4 py-3 lg:hidden">
          <a href="/" className="flex items-center gap-2">
            <img src="/mnf-logo.png" alt="NMF Logo" className="h-8 w-auto object-contain" />
            <span className="text-sm font-bold text-[#002B5C]">IngeniousPark</span>
          </a>
          <div className="flex items-center gap-2">
            <a
              href="/submit-idea"
              className="rounded-lg bg-[#D4A017] px-3 py-1.5 text-[11px] font-bold text-[#002B5C] transition hover:bg-[#f0c040]"
            >
              Submit
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#BFD7EA] bg-white/70 text-[#002B5C] backdrop-blur-md"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu sheet — outside the header so it can overlay other content cleanly */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="public-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-30 bg-[#002B5C]/30 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              key="public-menu-sheet"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-2 top-[60px] z-40 max-h-[80vh] overflow-y-auto rounded-2xl border border-[#BFD7EA]/60 bg-[#F8FBFF]/97 p-3 shadow-2xl backdrop-blur-2xl lg:hidden"
            >
              <div className="grid gap-1">
                {NAV_LINKS.map((item) => {
                  const active = activePath === item.href;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={
                        item.primary
                          ? "rounded-xl bg-[#D4A017] px-4 py-2.5 text-left text-sm font-bold text-[#002B5C] transition hover:bg-[#f0c040]"
                          : `rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition ${
                              active ? "bg-[#002B5C]/8 text-[#D4A017]" : "text-[#002B5C]/70 hover:bg-[#002B5C]/5 hover:text-[#D4A017]"
                            }`
                      }
                    >
                      {item.label}
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
