import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const HOMEPAGE_IMAGE_PRELOAD = [
  "/mnf-logo.png",
  "/homepage-visuals/21.jpeg",
  "/homepage-visuals/33.jpeg",
  "/homepage-visuals/24.jpeg",
  "/homepage-visuals/34.jpeg",
  "/homepage-visuals/18.jpeg",
  "/homepage-visuals/26.jpeg",
  "/homepage-visuals/9.jpeg",
  "/homepage-visuals/11.jpeg",
  "/homepage-visuals/12.jpeg",
];

const HOMEPAGE_FETCH_PRELOAD = [
  "/models/earth.glb",
];

const PREWARM_PATHS = [
  "/submit-idea",
  "/track-idea",
  "/review-process",
  "/who-can-apply",
  "/submission",
  "/innovation-hub",
  "/membership",
  "/collaboration",
  "/contact",
];

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

type Phase = "loading" | "dark" | "iris" | "done";

const LOADER_KEY = "ingeniouspark-loader-shown";
const LOADER_VALUE = "1";
const FONT_LINK_ID = "site-loader-fonts";

// display=block — fallback text held invisible while Google Fonts download,
// then swapped in directly. Prevents bold-to-thin flash on first paint.
const FONT_LINK_HREF =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300&family=Montserrat:wght@300&display=block";

// Hard ceiling for waiting on fonts before showing loader content anyway.
const FONT_READY_MAX_WAIT_MS = 1500;

function resolveInitialShow(): boolean {
  if (typeof window === "undefined") return false;
  if (import.meta.env.DEV) {
    const params = new URLSearchParams(window.location.search);
    if (params.get("resetLoader") === "1") {
      try { sessionStorage.removeItem(LOADER_KEY); } catch { /* ignore */ }
      return true;
    }
    if (params.get("loader") === "1") return true;
  }
  try {
    return sessionStorage.getItem(LOADER_KEY) !== LOADER_VALUE;
  } catch {
    return true;
  }
}

interface SiteLoaderProps {
  isHome?: boolean;
}

export default function SiteLoader({ isHome = false }: SiteLoaderProps) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState<boolean>(() => resolveInitialShow());
  const [phase, setPhase] = useState<Phase>("loading");
  const [progress, setProgress] = useState<number>(0);
  const [irisShrink, setIrisShrink] = useState<boolean>(false);
  const [fontsReady, setFontsReady] = useState<boolean>(false);

  const timersRef = useRef<number[]>([]);
  const finishedRef = useRef<boolean>(false);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  // Hard unmount: write sessionStorage, stop every timer, gate render to null.
  // Idempotent — safe to call from any timeline, fallback, or unmount path.
  const finishLoader = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    try { sessionStorage.setItem(LOADER_KEY, LOADER_VALUE); } catch { /* ignore */ }
    clearAllTimers();
    setMounted(false);
  }, [clearAllTimers]);

  // Inject Google Fonts and wait for document.fonts.ready before revealing content.
  // display=block keeps fallback invisible during download, then the real fonts
  // appear directly — no fallback-weight flash.
  useEffect(() => {
    if (!mounted) return;
    if (typeof document === "undefined") return;

    let cancelled = false;
    let existingLink = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
    if (!existingLink) {
      existingLink = document.createElement("link");
      existingLink.id = FONT_LINK_ID;
      existingLink.rel = "stylesheet";
      existingLink.href = FONT_LINK_HREF;
      document.head.appendChild(existingLink);
    }

    type DocWithFonts = Document & { fonts?: { ready?: Promise<unknown>; load?: (font: string) => Promise<unknown> } };
    const docFonts = (document as DocWithFonts).fonts;

    const markReady = () => {
      if (cancelled) return;
      setFontsReady(true);
    };

    // Explicitly request the exact faces, then wait on fonts.ready.
    const loads: Promise<unknown>[] = [];
    if (docFonts?.load) {
      loads.push(
        docFonts.load("300 18px Montserrat").catch(() => undefined),
        docFonts.load("italic 300 52px 'Cormorant Garamond'").catch(() => undefined),
      );
    }
    const ready = docFonts?.ready ? Promise.resolve(docFonts.ready) : Promise.resolve();
    Promise.all([...loads, ready]).then(markReady).catch(markReady);

    // Safety fallback — if fonts never resolve, reveal content anyway after ceiling.
    const fallback = window.setTimeout(markReady, FONT_READY_MAX_WAIT_MS);
    timersRef.current.push(fallback);

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
    };
  }, [mounted]);

  // Preload + progress ramp. Preserves original totalMs timing + asset preload list.
  useEffect(() => {
    if (!mounted) return;

    const totalMs = prefersReducedMotion ? 500 : 3000;
    const imageList = isHome ? HOMEPAGE_IMAGE_PRELOAD : ["/mnf-logo.png"];
    const fetchList = isHome ? HOMEPAGE_FETCH_PRELOAD : [];

    Promise.all(imageList.map(preloadImage)).catch(() => undefined);
    Promise.all(
      fetchList.map((url) =>
        fetch(url, { cache: "force-cache" }).then(() => undefined).catch(() => undefined),
      ),
    ).catch(() => undefined);

    // Ramp progress 0 -> 100 over totalMs via rAF (wires hairline bar fill).
    const startTs = typeof performance !== "undefined" ? performance.now() : Date.now();
    let raf = 0;
    let cancelled = false;
    const tick = (now: number) => {
      if (cancelled) return;
      const elapsed = now - startTs;
      const pct = Math.min(100, (elapsed / totalMs) * 100);
      setProgress(pct);
      if (pct < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [mounted, isHome, prefersReducedMotion]);

  // Exit sequence triggered when progress reaches 100.
  // isHome: 400ms dark -> 1600ms iris -> 2500ms done -> 2700ms finishLoader.
  // Safety fallback: 3500ms force finishLoader regardless.
  // Non-home / reduced-motion: 220ms done -> 380ms finishLoader (+ 3500ms safety).
  useEffect(() => {
    if (!mounted) return;
    if (progress < 100) return;
    if (phase !== "loading") return;

    const schedule = (ms: number, fn: () => void) => {
      const id = window.setTimeout(fn, ms);
      timersRef.current.push(id);
    };

    if (!isHome || prefersReducedMotion) {
      schedule(220, () => setPhase("done"));
      schedule(380, () => finishLoader());
      schedule(3500, () => finishLoader());
      return;
    }

    schedule(400, () => setPhase("dark"));
    schedule(1600, () => setPhase("iris"));
    schedule(2500, () => setPhase("done"));
    schedule(2700, () => finishLoader());
    schedule(3500, () => finishLoader());
  }, [progress, phase, mounted, isHome, prefersReducedMotion, finishLoader]);

  // Trigger iris shrink AFTER React commits the iris mount at scale(1).
  // Without this delay, scale(1) and scale(0.001) collapse into one paint
  // and the CSS transition never starts.
  useEffect(() => {
    if (phase !== "iris") return;
    const id = window.setTimeout(() => setIrisShrink(true), 30);
    timersRef.current.push(id);
    return () => window.clearTimeout(id);
  }, [phase]);

  // Prefetch other public routes after the loader retires (unchanged behavior).
  useEffect(() => {
    if (mounted) return;
    type Win = Window & { requestIdleCallback?: (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number };
    const w = window as Win;
    const idle = (cb: () => void) => {
      if (w.requestIdleCallback) w.requestIdleCallback(() => cb(), { timeout: 2500 });
      else setTimeout(cb, 600);
    };
    PREWARM_PATHS.forEach((path, i) => {
      idle(() => {
        setTimeout(() => {
          const link = document.createElement("link");
          link.rel = "prefetch";
          link.href = path;
          link.as = "document";
          document.head.appendChild(link);
        }, i * 120);
      });
    });
  }, [mounted]);

  useEffect(() => clearAllTimers, [clearAllTimers]);

  if (!mounted) return null;

  const isDark = phase === "dark" || phase === "iris" || phase === "done";
  const irisVisible = phase === "iris" || phase === "done";
  const irisStage = phase === "iris" || phase === "done";

  // During iris/done, loader bg goes transparent so the homepage becomes visible
  // as the dark iris circle shrinks. The dark iris matches the dark loader bg
  // (no white flash on entry).
  const loaderBg = irisStage ? "transparent" : (isDark ? "#060604" : "#ffffff");

  const colors = {
    wordmark: isDark ? "#c8c4b8" : "#111108",
    rule: isDark ? "#2a3018" : "#c8c2b4",
    headline: isDark ? "#e8e4da" : "#1a1a14",
    headlineAccent: isDark ? "#b8cc88" : "#3d5c18",
    track: isDark ? "#1e1e1a" : "#e0dbd2",
  };

  // Center content hidden until fonts loaded (prevents fallback-weight flash),
  // and hidden again during iris/done. Bar still hidden with the rest — clean
  // single fade-in once Montserrat + Cormorant are both ready.
  const centerOpacity = irisStage ? 0 : (fontsReady ? 1 : 0);

  return (
    <motion.div
      key="site-loader"
      initial={false}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      role="status"
      aria-label="Preparing IngeniousPark"
      style={{
        backgroundColor: loaderBg,
        transition: "background-color 800ms ease",
        pointerEvents: irisStage ? "none" : "auto",
      }}
    >
      {/* Center stack — logo, wordmark, rule, headline, progress bar */}
      <div
        className="relative z-10 flex flex-col items-center"
        style={{
          opacity: centerOpacity,
          transition: "opacity 220ms ease",
          pointerEvents: irisStage ? "none" : "auto",
        }}
      >
        {/* Inline logo mark — olive concentric/leaf insignia */}
        <svg
          width="52"
          height="52"
          viewBox="0 0 52 52"
          aria-hidden="true"
          style={{ display: "block" }}
        >
          <circle cx="26" cy="26" r="24" fill="none" stroke="#8aaa5a" strokeWidth="0.75" />
          <circle
            cx="26"
            cy="26"
            r="18"
            fill="none"
            stroke="#6a8a3a"
            strokeWidth="0.5"
            strokeDasharray="1.5 2.5"
          />
          <line x1="26" y1="4" x2="26" y2="48" stroke="#6a8a3a" strokeWidth="0.5" opacity="0.6" />
          <line x1="4" y1="26" x2="48" y2="26" stroke="#6a8a3a" strokeWidth="0.5" opacity="0.6" />
          <path
            d="M26 12 C 33 17, 34 24, 26 32 C 22 26, 22 18, 26 12 Z"
            fill="#6a8a3a"
            opacity="0.8"
          />
          <circle cx="26" cy="30" r="3" fill="#8aaa5a" />
        </svg>

        {/* Wordmark — Montserrat 300, synthesis off, antialiased */}
        <div
          style={{
            marginTop: 26,
            fontFamily: "'Montserrat', Arial, sans-serif",
            fontWeight: 300,
            fontSize: 18,
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: colors.wordmark,
            fontSynthesis: "none",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
            textRendering: "geometricPrecision",
            transition: "color 800ms ease",
          }}
        >
          INGENIOUSPARK
        </div>

        {/* Hairline rule */}
        <div
          style={{
            marginTop: 30,
            width: 36,
            height: 1,
            backgroundColor: colors.rule,
            transition: "background-color 800ms ease",
          }}
        />

        {/* Headline — Cormorant Garamond italic 300, synthesis off, antialiased */}
        <div
          style={{
            marginTop: 30,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: 52,
            lineHeight: 0.98,
            color: colors.headline,
            textAlign: "center",
            fontSynthesis: "none",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
            transition: "color 800ms ease",
          }}
        >
          Where ideas
          <br />
          take{" "}
          <span
            style={{
              color: colors.headlineAccent,
              transition: "color 800ms ease",
            }}
          >
            root.
          </span>
        </div>

        {/* Hairline progress bar wired to ramp state */}
        <div
          style={{
            marginTop: 38,
            width: 200,
            height: 1,
            backgroundColor: colors.track,
            position: "relative",
            overflow: "hidden",
            transition: "background-color 800ms ease",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${progress}%`,
              background: "linear-gradient(90deg, #3d6018, #82aa40)",
              transition: "width 80ms linear",
            }}
          />
        </div>
      </div>

      {/* Homepage iris — dark circle covers screen at scale(1) (matches dark loader bg
          so there is no flash on entry), then shrinks to reveal homepage.
          Visible during iris + done phases. scale(1) at mount, scale(0.001) after
          irisShrink toggle (deferred one render tick). Opacity drops to 0 at done. */}
      {isHome && !prefersReducedMotion && irisVisible && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            left: "50%",
            top: "50%",
            width: "150vmax",
            height: "150vmax",
            borderRadius: "50%",
            backgroundColor: "#060604",
            transformOrigin: "center center",
            transform: irisShrink
              ? "translate(-50%, -50%) scale(0.001)"
              : "translate(-50%, -50%) scale(1)",
            opacity: phase === "done" ? 0 : 1,
            transition:
              "transform 900ms cubic-bezier(0.76, 0, 0.24, 1), opacity 150ms ease",
            zIndex: 20,
            pointerEvents: "none",
          }}
        />
      )}
    </motion.div>
  );
}
