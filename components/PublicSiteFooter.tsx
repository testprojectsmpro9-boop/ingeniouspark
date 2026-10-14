import { CONTACT_EMAIL, CONTACT_PHONE, PORTAL_URL } from "../config";

// Shared public footer for inner pages. Homepage uses its own inline footer
// (kept untouched). This component matches the homepage footer structure so
// users get the same anchor points across the public site.
export default function PublicSiteFooter() {
  return (
    <footer className="bg-[#002B5C] px-6 pt-14 pb-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="text-base font-bold tracking-tight">IngeniousPark</p>
            <p className="mt-2 text-xs leading-6 text-slate-400">
              Mysuru-first Innovation Hub connecting local inventors with IFIA Bharat, IFIA Global, and ABIPIR (Brazil).
            </p>
            <p className="mt-4 text-[11px] text-[#D4A017]/60">
              NMF × IFIA Bharat × IFIA Global × ABIPIR (Brazil)
            </p>
          </div>

          <div>
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#D4A017]">Submit</p>
            <ul className="space-y-2.5">
              <li><a href="/submit-idea" className="text-sm text-slate-400 transition hover:text-white">Submit an Idea</a></li>
              <li><a href="/track-idea" className="text-sm text-slate-400 transition hover:text-white">Track My Idea</a></li>
              <li><a href="/offline-form.pdf" download className="text-sm text-slate-400 transition hover:text-white">Download Offline Form</a></li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#D4A017]">Connect</p>
            <ul className="space-y-2.5">
              <li><a href="/contact" className="text-sm text-slate-400 transition hover:text-white">Contact</a></li>
              <li><a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-slate-400 transition hover:text-white">Email: {CONTACT_EMAIL}</a></li>
              <li><a href={`tel:${CONTACT_PHONE.replace(/\s+/g, "")}`} className="text-sm text-slate-400 transition hover:text-white">Phone: {CONTACT_PHONE}</a></li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#D4A017]">Account</p>
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
  );
}
