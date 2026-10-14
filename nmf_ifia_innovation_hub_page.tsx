import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, X } from "lucide-react";

import { mobileMenuVariants } from "./types";
import { CONTACT_EMAIL, CONTACT_PHONE, PORTAL_URL } from "./config";

import HeroSection from "./components/HeroSection";
import HomeImmersiveStory from "./components/HomeImmersiveStory";
import { HomepageWebGL } from "./pages/HomepageWebGL";

gsap.registerPlugin(ScrollTrigger);


export default function NmfIfiaInnovationHubPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  const pageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<HomepageWebGL | null>(null);
  const [webglEnabled, setWebglEnabled] = useState(false);
  // Gate WebGL canvas reveal — keeps the gold/cyan first-frame from flashing on refresh.
  // Canvas starts opacity 0; fades in after engine init has had a few frames to render a stable image.
  const [canvasReady, setCanvasReady] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    // Wait for menu exit animation (220ms) before scrolling so layout is stable
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 250);
  };

  // Scroll tracking — RAF-throttled to run at most once per frame
  useEffect(() => {
    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
        setIsNavScrolled(scrollTop > 60);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Track mobile menu open via ref so navbar effect can read without re-subscribing
  const mobileMenuOpenRef = useRef(false);
  useEffect(() => {
    mobileMenuOpenRef.current = mobileMenuOpen;
    if (mobileMenuOpen) setNavVisible(true);
  }, [mobileMenuOpen]);

  // Navbar auto-hide. Desktop: hide between hero + final CTA, reveal on top-hover.
  // Mobile: scroll-direction model — visible at top/hero/final-CTA/scroll-up, hidden scroll-down through cinematic middle. Menu-open forces visible.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mqMobile = window.matchMedia("(max-width: 767px)");
    let cleanup: (() => void) | null = null;

    const setupDesktop = () => {
      let hovering = false;
      let raf = 0;
      const compute = () => {
        const hero = document.getElementById("hero");
        const finalCta = document.getElementById("homepage-final-cta");
        if (!hero || !finalCta) {
          setNavVisible(true);
          return;
        }
        const vh = window.innerHeight;
        const heroRect = hero.getBoundingClientRect();
        const finalRect = finalCta.getBoundingClientRect();
        const heroActive = heroRect.bottom > vh * 0.2;
        const finalActive = finalRect.top < vh * 0.8;
        setNavVisible(heroActive || finalActive || hovering);
      };
      const schedule = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(compute);
      };
      const onMove = (e: MouseEvent) => {
        const next = e.clientY < 110;
        if (next !== hovering) {
          hovering = next;
          schedule();
        }
      };
      compute();
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      window.addEventListener("mousemove", onMove, { passive: true });
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        window.removeEventListener("mousemove", onMove);
      };
    };

    const setupMobile = () => {
      let lastY = window.scrollY;
      let raf = 0;
      const compute = () => {
        const y = window.scrollY;
        const hero = document.getElementById("hero");
        const finalCta = document.getElementById("homepage-final-cta");
        const vh = window.innerHeight;
        const atTop = y < 80;
        const heroActive = hero ? hero.getBoundingClientRect().bottom > vh * 0.3 : false;
        const finalActive = finalCta ? finalCta.getBoundingClientRect().top < vh * 0.85 : false;
        const scrollingUp = y < lastY - 4;
        const scrollingDown = y > lastY + 4;
        if (mobileMenuOpenRef.current || atTop || heroActive || finalActive || scrollingUp) {
          setNavVisible(true);
        } else if (scrollingDown) {
          setNavVisible(false);
        }
        lastY = y;
      };
      const schedule = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(compute);
      };
      compute();
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
      };
    };

    const apply = () => {
      cleanup?.();
      cleanup = mqMobile.matches ? setupMobile() : setupDesktop();
    };
    apply();
    mqMobile.addEventListener("change", apply);
    return () => {
      cleanup?.();
      mqMobile.removeEventListener("change", apply);
    };
  }, []);

  // Global magnetic hover
  useEffect(() => {
    if (prefersReducedMotion) return;
    const btns = document.querySelectorAll<HTMLElement>(".magnetic-btn");
    const cleanups: (() => void)[] = [];
    btns.forEach((btn) => {
      const onMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.18;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.18;
        gsap.to(btn, { x, y, duration: 0.3, ease: "power2.out" });
      };
      const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
      const onClick = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement("span");
        const size = Math.max(rect.width, rect.height);
        Object.assign(ripple.style, {
          position: "absolute",
          left: `${e.clientX - rect.left}px`,
          top: `${e.clientY - rect.top}px`,
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.3)",
          transform: "translate(-50%,-50%) scale(0)",
          pointerEvents: "none",
        });
        btn.style.position = "relative";
        btn.style.overflow = "hidden";
        btn.appendChild(ripple);
        gsap.to(ripple, {
          scale: size / 5,
          opacity: 0,
          duration: 0.55,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        });
      };
      btn.addEventListener("mousemove", onMove);
      btn.addEventListener("mouseleave", onLeave);
      btn.addEventListener("click", onClick);
      cleanups.push(() => {
        btn.removeEventListener("mousemove", onMove);
        btn.removeEventListener("mouseleave", onLeave);
        btn.removeEventListener("click", onClick);
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, [prefersReducedMotion]);

  // GSAP mv-card stagger (lives in ecosystem section but triggered from page level)
  useEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from(".mv-card", {
        opacity: 0, y: 30, stagger: 0.12, duration: 0.55, ease: "power3.out",
        scrollTrigger: { trigger: "#ecosystem", start: "top 68%", once: true },
      });
    }, pageRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Enable homepage WebGL on desktop only. Mobile refresh was showing a gold/cyan first-frame flash
  // from the engine's scene 0 atmosphere; disabling WebGL on phones removes that source entirely.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    setWebglEnabled(!isMobile);
  }, []);

  // After window 'load' (all images/fonts done), refresh ScrollTrigger so pinned sections recalc with final layout.
  // Without this, ScrollTrigger ranges can be off when images haven't loaded yet → sections appear to "start too high".
  // Initial force-top runs ONCE at very first mount (paired with main.tsx scrollRestoration="manual").
  // Subsequent refreshes do NOT yank scroll — guarded by checking that the user hasn't scrolled past the hero.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try { window.scrollTo(0, 0); } catch { /* ignore */ }
    const safeForceTop = () => {
      // Only re-snap to top if we're still effectively at the top (< 50px of scroll).
      // This protects the user if they scrolled before window.load fired.
      if (window.scrollY < 50) {
        try { window.scrollTo(0, 0); } catch { /* ignore */ }
      }
    };
    const refresh = () => {
      safeForceTop();
      ScrollTrigger.refresh();
    };
    window.addEventListener("load", refresh);
    const t = setTimeout(refresh, 800); // delayed refresh as a safety net
    return () => {
      window.removeEventListener("load", refresh);
      clearTimeout(t);
    };
  }, []);

  // Homepage WebGL foundation — init engine, wire scroll camera, parallax, velocity
  useEffect(() => {
    if (!webglEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new HomepageWebGL(canvas);
    engine.setReducedMotion(!!prefersReducedMotion);
    engine.init();
    engineRef.current = engine;

    // Reveal canvas once engine has rendered a stable image (~600ms of frames).
    // Until then the canvas is opacity:0 so the first paint is just the dark page bg + hero.
    const revealTimer = window.setTimeout(() => setCanvasReady(true), 600);

    // Global camera path — smooth across the whole document
    const proxy = { p: 0 };
    const camTween = gsap.to(proxy, {
      p: 1,
      ease: "none",
      scrollTrigger: {
        trigger: pageRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
      },
      onUpdate: () => engine.setCameraProgress(proxy.p),
    });

    // Section-pinned scene progress — one trigger per active scene
    const sceneTriggers = [
      ScrollTrigger.create({
        trigger: "#hero", start: "top top", end: "bottom top", scrub: 1.1,
        onUpdate: (self: ScrollTrigger) => engine.setSceneProgress(0, self.progress),
      }),
      ScrollTrigger.create({
        trigger: "#evaluation", start: "top 80%", end: "bottom 20%", scrub: 1.1,
        onUpdate: (self: ScrollTrigger) => engine.setSceneProgress(3, self.progress),
      }),
      ScrollTrigger.create({
        trigger: "#why-mysuru", start: "top 80%", end: "bottom 20%", scrub: 1.1,
        onUpdate: (self: ScrollTrigger) => engine.setSceneProgress(5, self.progress),
      }),
      ScrollTrigger.create({
        trigger: "#membership", start: "top 80%", end: "bottom 20%", scrub: 1.1,
        onUpdate: (self: ScrollTrigger) => engine.setSceneProgress(6, self.progress),
      }),
      ScrollTrigger.create({
        trigger: "#homepage-final-cta", start: "top 80%", end: "bottom 20%", scrub: 1.1,
        onUpdate: (self: ScrollTrigger) => engine.setSceneProgress(7, self.progress),
      }),
    ];
    ScrollTrigger.refresh();

    // Mouse parallax → normalized −1..1
    const onMouse = (e: MouseEvent) => {
      engine.setMousePosition(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1,
      );
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    // Scroll velocity (RAF-throttled) — disabled under reduced motion
    let lastY = window.scrollY;
    let velRaf = 0;
    const onVel = () => {
      cancelAnimationFrame(velRaf);
      velRaf = requestAnimationFrame(() => {
        const y = window.scrollY;
        engine.setScrollVelocity((y - lastY) / window.innerHeight);
        lastY = y;
      });
    };
    if (!prefersReducedMotion) window.addEventListener("scroll", onVel, { passive: true });

    const onResize = () => engine.resize();
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(revealTimer);
      camTween.scrollTrigger?.kill();
      camTween.kill();
      sceneTriggers.forEach((st) => st.kill());
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onVel);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(velRaf);
      engine.dispose();
      engineRef.current = null;
    };
  }, [webglEnabled, prefersReducedMotion]);

  return (
    <div ref={pageRef} className="min-h-screen bg-[#020b13] text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", overflowX: "clip" }}>

      {/* Homepage WebGL canvas — fixed, behind all content. opacity 0 on first paint to suppress
          gold/cyan first-frame flash; fades in once the engine has rendered a stable image. */}
      {webglEnabled && (
        <canvas
          ref={canvasRef}
          className="pointer-events-none fixed inset-0 transition-opacity duration-700 ease-out"
          style={{ width: "100%", height: "100%", zIndex: 0, opacity: canvasReady ? 1 : 0 }}
          aria-hidden="true"
        />
      )}

      {/* Scroll progress bar — fixed top, 2px cyan→gold */}
      <div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-white/8">
        <div
          className="h-full transition-none"
          style={{ width: `${scrollProgress}%`, background: "linear-gradient(90deg, #06b6d4, #D4A017)" }}
        />
      </div>

      {/* Mobile menu outside-tap overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Navbar */}
      <LayoutGroup>
        <motion.header
          initial={false}
          animate={{
            backgroundColor: isNavScrolled ? "rgba(248,251,255,0.95)" : "rgba(248,251,255,0.82)",
            backdropFilter: isNavScrolled ? "blur(16px)" : "blur(12px)",
            borderBottomColor: isNavScrolled ? "rgba(191,215,234,0.7)" : "rgba(191,215,234,0.5)",
            boxShadow: isNavScrolled ? "0 10px 30px rgba(0,43,92,0.08)" : "none",
            opacity: navVisible ? 1 : 0,
            y: navVisible ? 0 : -12,
            pointerEvents: navVisible ? "auto" : "none",
          }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 top-[2px] z-40 border-b"
        >
          {/* Desktop */}
          <div className="mx-auto hidden max-w-7xl items-center justify-between px-6 py-3 md:flex">
            <div className="flex items-center gap-2.5">
              <img src="/mnf-logo.png" alt="NMF Logo" className="h-10 w-auto object-contain" />
              <span className="text-sm font-bold tracking-tight text-[#002B5C]">IngeniousPark</span>
            </div>
            <nav className="flex items-center gap-1 rounded-full border border-[#BFD7EA]/60 bg-white/40 px-2 py-1.5 backdrop-blur-md">
              {([
                { href: "/track-idea",     label: "Track" },
                { href: "/who-can-apply",  label: "Who Can Apply" },
                { href: "/review-process", label: "Idea to Impact" },
                { href: "/innovation-hub", label: "Innovation Hub" },
                { href: "/membership",     label: "Membership" },
                { href: "/collaboration",  label: "Collaboration" },
                { href: "/submission",     label: "Submission Journey" },
                { href: "/contact",        label: "Contact" },
              ] as const).map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-[#002B5C]/65 transition hover:text-[#D4A017]"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <a
              href="/submit-idea"
              className="magnetic-btn rounded-xl bg-[#D4A017] px-4 py-2 text-xs font-bold text-[#002B5C] transition hover:bg-[#f0c040]"
            >
              Submit Idea
            </a>
          </div>

          {/* Mobile */}
          <div className="flex items-center justify-between px-5 py-3 md:hidden">
            <div className="flex items-center gap-2">
              <img src="/mnf-logo.png" alt="NMF Logo" className="h-9 w-auto object-contain" />
              <span className="text-sm font-bold text-[#002B5C]">IngeniousPark</span>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#BFD7EA] bg-white/70 text-[#002B5C] backdrop-blur-md"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                key="mobile-menu"
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="overflow-hidden border-t border-[#BFD7EA]/60 bg-[#F8FBFF]/95 backdrop-blur-2xl md:hidden"
              >
                <div className="grid gap-1 px-4 py-3">
                  {([
                    { href: "/track-idea",     label: "Track Idea" },
                    { href: "/who-can-apply",  label: "Who Can Apply" },
                    { href: "/review-process", label: "Idea to Impact" },
                    { href: "/innovation-hub", label: "Innovation Hub" },
                    { href: "/membership",     label: "Membership" },
                    { href: "/collaboration",  label: "Collaboration" },
                    { href: "/submission",     label: "Submission Journey" },
                    { href: "/contact",        label: "Contact" },
                  ] as const).map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-[#002B5C]/65 transition hover:bg-[#002B5C]/5 hover:text-[#D4A017]"
                    >
                      {item.label}
                    </a>
                  ))}
                  <a
                    href="/submit-idea"
                    className="mt-1 rounded-xl bg-[#D4A017] px-4 py-2.5 text-left text-sm font-bold text-[#002B5C] transition hover:bg-[#f0c040]"
                  >
                    Submit Idea
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      </LayoutGroup>

      {/* Sections — lifted above the fixed WebGL canvas */}
      <div className="relative z-[1]">
      <HeroSection onScrollTo={scrollToSection} prefersReducedMotion={prefersReducedMotion} />
      <HomeImmersiveStory />

      {/* Footer */}
      <footer className="bg-[#002B5C] px-6 pt-14 pb-8 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">

            {/* Brand col */}
            <div>
              <p className="text-base font-bold tracking-tight">IngeniousPark</p>
              <p className="mt-2 text-xs leading-6 text-slate-400">
                Mysuru-first Innovation Hub connecting local inventors with IFIA Bharat,
                IFIA Global, and ABIPIR (Brazil).
              </p>
              <p className="mt-4 text-[11px] text-[#D4A017]/60">
                NMF × IFIA Bharat × IFIA Global × ABIPIR (Brazil)
              </p>
            </div>

            {/* Submit col */}
            <div>
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#D4A017]">
                Submit
              </p>
              <ul className="space-y-2.5">
                <li>
                  <a href="/submit-idea" className="text-sm text-slate-400 transition hover:text-white">
                    Submit an Idea
                  </a>
                </li>
                <li>
                  <a href="/track-idea" className="text-sm text-slate-400 transition hover:text-white">
                    Track My Idea
                  </a>
                </li>
                <li>
                  <a href="/offline-form.pdf" download className="text-sm text-slate-400 transition hover:text-white">
                    Download Offline Form
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect col */}
            <div>
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#D4A017]">
                Connect
              </p>
              <ul className="space-y-2.5">
                <li>
                  <button
                    type="button"
                    onClick={() => document.getElementById("register-interest")?.scrollIntoView({ behavior: "smooth" })}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    Become a Member
                  </button>
                </li>
                <li>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-slate-400 transition hover:text-white">
                    Email: {CONTACT_EMAIL}
                  </a>
                </li>
                <li>
                  <a href="tel:+919071620909" className="text-sm text-slate-400 transition hover:text-white">
                    Phone: {CONTACT_PHONE}
                  </a>
                </li>
              </ul>
            </div>

            {/* Account col */}
            <div>
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#D4A017]">
                Account
              </p>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href={`${PORTAL_URL}/login`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    Portal Login
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
            <p className="text-xs text-blue-200/50">
              © {new Date().getFullYear()} IngeniousPark Innovation Hub. All rights reserved.
            </p>
            <a
              href="https://mpro9.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-blue-200/45 transition hover:text-blue-100/80"
            >
              Powered by M PRO9 Pvt Ltd
            </a>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
