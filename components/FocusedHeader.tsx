import type { PublicSourceContext } from "../sourceContext";

interface FocusedHeaderProps {
  cta: { href: string; label: string };
  source?: PublicSourceContext;
}

// Minimal task-focused header for form pages (/submit-idea, /track-idea).
// Logo + brand on left, single CTA on right. No full navbar.
export default function FocusedHeader({ cta, source }: FocusedHeaderProps) {
  const isSirmv = source?.sourcePlatform === "sirmv-idea";
  const brand = source ?? {
    label: "IngeniousPark",
    tagline: null,
    logo: "/mnf-logo.png",
    homeUrl: "/",
    isExternalHome: false,
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#BFD7EA]/60 bg-[#F8FBFF]/95 px-4 py-3 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
        <a
          href={brand.homeUrl}
          target={brand.isExternalHome ? "_blank" : undefined}
          rel={brand.isExternalHome ? "noopener noreferrer" : undefined}
          className="flex min-w-0 shrink items-center gap-2 sm:gap-2.5"
        >
          <img
            src={brand.logo}
            alt={`${brand.label} logo`}
            className={`h-9 w-auto shrink-0 object-contain ${
              isSirmv ? "max-w-[118px] sm:h-12 sm:max-w-[160px]" : "max-w-[96px] sm:h-10 sm:max-w-[120px]"
            }`}
          />
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold tracking-tight text-[#002B5C]">
              {brand.label}
            </span>
            {brand.tagline && (
              <span className="block max-w-[180px] truncate text-[10px] font-semibold leading-3 text-slate-500 sm:max-w-[260px] sm:text-xs">
                {brand.tagline}
              </span>
            )}
          </span>
        </a>
        <a
          href={cta.href}
          className="shrink-0 rounded-xl bg-[#D4A017] px-3 py-2 text-xs font-bold text-[#002B5C] transition hover:bg-[#f0c040] sm:px-4"
        >
          {cta.label}
        </a>
      </div>
    </header>
  );
}
