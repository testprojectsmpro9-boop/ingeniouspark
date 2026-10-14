type PageCta = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

type PageShellProps = {
  title: string;
  intro: string;
  eyebrow?: string;
  ctas?: PageCta[];
};

const defaultCtas: PageCta[] = [
  { href: "/", label: "Home", variant: "secondary" },
  { href: "/submit-idea", label: "Submit Idea", variant: "primary" },
  { href: "/track-idea", label: "Track Idea", variant: "secondary" },
];

export default function PageShell({ title, intro, eyebrow = "IngeniousPark", ctas = defaultCtas }: PageShellProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#EAF2FB] via-white to-[#FFF5D6] px-6 py-10 text-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col">
        <header className="flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/mnf-logo.png" alt="NMF Logo" className="h-12 w-auto object-contain" />
            <span className="text-sm font-bold tracking-tight text-[#002B5C]">IngeniousPark</span>
          </a>
          <a
            href="/submit-idea"
            className="rounded-xl bg-[#002B5C] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#003d82]"
          >
            Submit Idea
          </a>
        </header>

        <section className="flex flex-1 items-center py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D4A017]">{eyebrow}</p>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-[#002B5C] md:text-6xl">{title}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-700 md:text-lg">{intro}</p>
            <p className="mt-4 text-sm font-semibold text-slate-500">Full page content coming next.</p>

            <div className="mt-9 flex flex-wrap gap-3">
              {ctas.map((cta) => (
                <a
                  key={cta.href}
                  href={cta.href}
                  className={
                    cta.variant === "primary"
                      ? "rounded-2xl bg-[#002B5C] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#002B5C]/20 transition hover:bg-[#003d82]"
                      : "rounded-2xl border border-[#BFD7EA] bg-white/80 px-5 py-3 text-sm font-bold text-[#002B5C] transition hover:border-[#D4A017] hover:bg-[#FFF5D6]"
                  }
                >
                  {cta.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
