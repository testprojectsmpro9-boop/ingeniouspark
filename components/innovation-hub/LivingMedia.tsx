import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type MediaMood = "heritage" | "modern" | "warm" | "cool" | "indigo" | "emerald" | "rose" | "amber";

interface LivingMediaProps {
  imageSrc?: string;
  videoSrc?: string;            // optional — only mounted if defined
  alt: string;
  accent: string;               // hex
  mood?: MediaMood;             // controls overlay grain / glow tint
  icon?: ReactNode;
  caption?: string;
  aspect?: "portrait" | "landscape" | "square" | "wide" | "tall" | "auto";
  rounded?: string;
  className?: string;
  priority?: boolean;
  /** Enable slow Ken Burns when image loads. Disabled for reduced-motion users. */
  kenBurns?: boolean;
  /** Subtle light sweep across the surface. Disabled for reduced-motion users. */
  sweep?: boolean;
}

// Living cinematic media tile.
// - When videoSrc provided: <video muted loop playsInline preload="metadata"> on top.
// - When imageSrc provided: <img loading="lazy" decoding="async"> with optional Ken Burns.
// - Always renders an animated gradient + grain + glow fallback behind the media,
//   so the tile feels alive whether or not real media is present.
// - Caption + icon overlay show only while real media has not loaded
//   (icon stays visible as an editorial chip in the corner if `caption` is omitted).
export default function LivingMedia({
  imageSrc,
  videoSrc,
  alt,
  accent,
  mood = "warm",
  icon,
  caption,
  aspect = "portrait",
  rounded = "rounded-2xl",
  className = "",
  priority = false,
  kenBurns = true,
  sweep = true,
}: LivingMediaProps) {
  const prefersReducedMotion = useReducedMotion();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgErrored, setImgErrored] = useState(false);

  const aspectClass =
    aspect === "auto" ? ""
    : aspect === "portrait" ? "aspect-[3/4]"
    : aspect === "landscape" ? "aspect-[4/3]"
    : aspect === "wide" ? "aspect-[16/9]"
    : aspect === "tall" ? "aspect-[2/3]"
    : "aspect-square";

  // Mood-aware backdrop layers.
  const moodOverlay = (() => {
    switch (mood) {
      case "heritage":
        return "radial-gradient(circle at 28% 30%, rgba(255,246,218,0.45) 0%, transparent 55%), radial-gradient(circle at 80% 70%, rgba(212,160,23,0.18) 0%, transparent 60%)";
      case "modern":
        return "radial-gradient(circle at 25% 28%, rgba(6,182,212,0.22) 0%, transparent 55%), radial-gradient(circle at 78% 78%, rgba(212,160,23,0.16) 0%, transparent 55%)";
      case "warm":
        return "radial-gradient(circle at 32% 32%, rgba(240,192,64,0.22) 0%, transparent 58%), radial-gradient(circle at 82% 76%, rgba(2,11,19,0.35) 0%, transparent 60%)";
      case "cool":
        return "radial-gradient(circle at 28% 28%, rgba(45,212,191,0.22) 0%, transparent 55%), radial-gradient(circle at 80% 80%, rgba(2,11,19,0.45) 0%, transparent 60%)";
      case "indigo":
        return "radial-gradient(circle at 32% 28%, rgba(99,102,241,0.22) 0%, transparent 55%), radial-gradient(circle at 80% 80%, rgba(167,139,250,0.18) 0%, transparent 55%)";
      case "emerald":
        return "radial-gradient(circle at 30% 32%, rgba(16,185,129,0.22) 0%, transparent 55%), radial-gradient(circle at 80% 78%, rgba(45,212,191,0.18) 0%, transparent 58%)";
      case "rose":
        return "radial-gradient(circle at 32% 30%, rgba(251,113,133,0.22) 0%, transparent 55%), radial-gradient(circle at 78% 80%, rgba(240,192,64,0.16) 0%, transparent 58%)";
      case "amber":
        return "radial-gradient(circle at 30% 30%, rgba(251,191,36,0.24) 0%, transparent 55%), radial-gradient(circle at 80% 78%, rgba(212,160,23,0.18) 0%, transparent 60%)";
    }
  })();

  const showFallback = (!imageSrc && !videoSrc) || (imageSrc && !imgLoaded) || imgErrored;
  const allowMotion = !prefersReducedMotion;
  const enableKen = kenBurns && allowMotion && imgLoaded && !imgErrored;

  return (
    <div className={`relative isolate overflow-hidden ${aspectClass} ${rounded} ${className}`}>
      {/* Layer 1 — base accent block */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${accent}26 0%, ${accent}0d 55%, rgba(2,11,19,0.32) 100%)`,
        }}
      />

      {/* Layer 2 — mood radial wash */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: moodOverlay }} />

      {/* Layer 3 — animated soft glow drift */}
      {allowMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(circle at 50% 50%, ${accent}38 0%, transparent 55%)` }}
          animate={{ x: ["-12%", "10%", "-12%"], y: ["-8%", "10%", "-8%"], opacity: [0.6, 0.95, 0.6] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Layer 4 — grain texture (parchment SVG used as repeating filter overlay) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-40"
        style={{
          backgroundImage: "url('/innovation-hub/parchment-texture.svg')",
          backgroundSize: "240px 240px",
        }}
      />

      {/* Layer 5 — light sweep */}
      {sweep && allowMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px"
          style={{
            background: "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)",
          }}
          initial={{ x: "-110%" }}
          animate={{ x: "110%" }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "linear", repeatDelay: 2.5 }}
        />
      )}

      {/* Fallback icon / caption (visible while no real media has loaded) */}
      {showFallback && (icon || caption) && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 p-4 text-center">
          {icon && (
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: `${accent}26`, color: accent }}
            >
              {icon}
            </div>
          )}
          {caption && (
            <p
              className="text-[10px] font-black uppercase tracking-[0.18em]"
              style={{ color: accent }}
            >
              {caption}
            </p>
          )}
        </div>
      )}

      {/* Real video (optional — mounted only if videoSrc provided) */}
      {videoSrc && (
        <video
          src={videoSrc}
          autoPlay={allowMotion}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={alt}
          className="relative h-full w-full object-cover"
        />
      )}

      {/* Real image (only mounted if imageSrc provided) */}
      {!videoSrc && imageSrc && !imgErrored && (
        <motion.img
          src={imageSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgErrored(true)}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={imgLoaded ? { opacity: 1, scale: enableKen ? 1.16 : 1 } : { opacity: 0, scale: 1.08 }}
          transition={enableKen
            ? { opacity: { duration: 0.7, ease: "easeOut" }, scale: { duration: 14, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" } }
            : { duration: 0.55, ease: "easeOut" }
          }
          className="relative h-full w-full object-cover"
        />
      )}

      {/* Bottom shadow for caption legibility on real images */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#020b13]/75 via-[#020b13]/30 to-transparent"
      />
    </div>
  );
}
