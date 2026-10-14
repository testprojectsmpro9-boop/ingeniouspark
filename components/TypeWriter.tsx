import { useEffect, useRef } from "react";

interface Props {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}

export default function TypeWriter({ text, className = "", delay = 0, speed = 36 }: Props) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chars = el.querySelectorAll<HTMLSpanElement>(".tw-c");

    // Skip animation if reduced-motion or no chars
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      chars.forEach((c) => (c.style.opacity = "1"));
      return;
    }

    // Faster on mobile to avoid sluggish feel
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const effectiveSpeed = isMobile ? Math.max(Math.round(speed * 0.55), 16) : speed;

    const timers: ReturnType<typeof setTimeout>[] = [];

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        chars.forEach((char, i) => {
          const t = setTimeout(() => {
            char.style.opacity = "1";
          }, delay * 1000 + i * effectiveSpeed);
          timers.push(t);
        });
      },
      { threshold: 0.1, rootMargin: "-40px 0px" }
    );

    obs.observe(el);
    return () => {
      obs.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [text, delay, speed]);

  return (
    <span ref={containerRef} className={className} aria-label={text}>
      {Array.from(text).map((char, i) => (
        <span key={i} className="tw-c" aria-hidden="true" style={{ opacity: 0 }}>
          {char}
        </span>
      ))}
    </span>
  );
}
