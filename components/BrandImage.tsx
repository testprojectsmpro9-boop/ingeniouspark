import { useEffect, useMemo, useState } from "react";

const placeholderSvg = (label: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="160" viewBox="0 0 320 160"><rect width="320" height="160" rx="24" fill="#F8FAFC" stroke="#CBD5E1" stroke-dasharray="7 7"/><text x="160" y="76" text-anchor="middle" font-family="Plus Jakarta Sans,sans-serif" font-size="18" fill="#475569">${label}</text><text x="160" y="102" text-anchor="middle" font-family="Plus Jakarta Sans,sans-serif" font-size="12" fill="#94A3B8">Logo placeholder</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

interface Props {
  src: string | null;
  alt: string;
  label: string;
  className?: string;
}

export default function BrandImage({ src, alt, label, className = "h-20 max-w-full object-contain" }: Props) {
  const fallback = useMemo(() => placeholderSvg(label), [label]);
  const [imgSrc, setImgSrc] = useState<string>(src || fallback);

  useEffect(() => {
    setImgSrc(src || fallback);
  }, [src, fallback]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      onError={() => setImgSrc(fallback)}
      onLoad={(e) => (e.currentTarget as HTMLImageElement).classList.add("loaded")}
    />
  );
}
