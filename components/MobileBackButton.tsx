import { ArrowLeft } from "lucide-react";

// Dynamic back button for inner public pages — mobile only.
// Uses history.back() when there's history, falls back to homepage.
// Renders fixed top-left below the sticky header so it doesn't cover content.
export default function MobileBackButton() {
  const onClick = () => {
    if (typeof window === "undefined") return;
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Go back"
      className="fixed left-3 top-[68px] z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#BFD7EA]/70 bg-white/85 text-[#002B5C] shadow-sm backdrop-blur-md transition active:scale-95 lg:hidden"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
