import { useState, type ReactNode } from "react";

interface PhotoPlaceholderProps {
  src: string;
  alt: string;
  accent: string;            // hex color for the gradient placeholder
  icon?: ReactNode;          // lucide icon for placeholder card
  label?: string;            // small label on placeholder
  aspect?: "portrait" | "landscape" | "square" | "wide";
  rounded?: string;          // tailwind rounded class
  className?: string;
  priority?: boolean;        // disable lazy on hero
}

// Renders a <img> when src loads. While loading or on error, falls back
// to a CSS-gradient card sized at the chosen aspect ratio so the layout
// never shifts. Real photos can be dropped into the predicted path later
// and the swap is automatic.
export default function PhotoPlaceholder({
  src,
  alt,
  accent,
  icon,
  label,
  aspect = "portrait",
  rounded = "rounded-2xl",
  className = "",
  priority = false,
}: PhotoPlaceholderProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const aspectClass =
    aspect === "portrait" ? "aspect-[3/4]"
    : aspect === "landscape" ? "aspect-[4/3]"
    : aspect === "wide" ? "aspect-[16/9]"
    : "aspect-square";

  const showPlaceholder = !loaded || errored;

  return (
    <div className={`relative isolate overflow-hidden ${aspectClass} ${rounded} ${className}`}>
      {/* Placeholder layer — always rendered behind the image so no flash */}
      <div
        aria-hidden={loaded && !errored ? "true" : undefined}
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${accent}1f 0%, ${accent}0a 55%, rgba(2,11,19,0.18) 100%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${accent}33 0%, transparent 45%)`,
        }}
      />

      {showPlaceholder && (icon || label) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
          {icon && (
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: `${accent}22`, color: accent }}
            >
              {icon}
            </div>
          )}
          {label && (
            <p
              className="text-[10px] font-black uppercase tracking-[0.16em]"
              style={{ color: accent }}
            >
              {label}
            </p>
          )}
        </div>
      )}

      {/* Real photo — fades in once loaded */}
      {!errored && (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={`relative h-full w-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}

      {/* Bottom shadow gradient for caption readability */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#020b13]/70 to-transparent"
      />
    </div>
  );
}
