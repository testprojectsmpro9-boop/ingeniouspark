import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import NmfIfiaInnovationHubPage from "./nmf_ifia_innovation_hub_page";
import SubmitIdeaPage from "./submit_idea_page";
import TrackIdeaPage from "./track_idea_page";
import CollaborationPage from "./pages/CollaborationPage";
import ContactPage from "./pages/ContactPage";
import InnovationHubPage from "./pages/InnovationHubPage";
import MembershipPage from "./pages/MembershipPage";
import ReviewProcessPage from "./pages/ReviewProcessPage";
import SubmissionPage from "./pages/SubmissionPage";
import WhoCanApplyPage from "./pages/WhoCanApplyPage";
import SiteLoader from "./components/SiteLoader";
import { getPublicSourceContextFromSearch } from "./sourceContext";

// On full page load/refresh, ALWAYS open at top. Without this, the browser restores the previous
// scroll position on reload, which can drop the user into the middle of Hall/SparkBridge — landing
// directly inside a gold prism/path glow that reads as "gold glow on refresh".
if (typeof window !== "undefined") {
  if ("scrollRestoration" in window.history) {
    try { window.history.scrollRestoration = "manual"; } catch { /* ignore */ }
  }
  // Force top immediately, before React mounts and before any anchor logic runs.
  try { window.scrollTo(0, 0); } catch { /* ignore */ }
  // pageshow fires for both normal loads AND bfcache restores (back/forward). On bfcache restore
  // the browser would otherwise show the previous scroll position + cached DOM glow state.
  window.addEventListener("pageshow", (event) => {
    if ((event as PageTransitionEvent).persisted) {
      try { window.scrollTo(0, 0); } catch { /* ignore */ }
    }
  });
}

const path = window.location.pathname;
const routeMap = [
  { match: (value: string) => value.startsWith("/sirmv-submit-idea"), element: <SubmitIdeaPage /> },
  { match: (value: string) => value.startsWith("/sirmv-track-idea"), element: <TrackIdeaPage /> },
  { match: (value: string) => value.startsWith("/submit-idea"), element: <SubmitIdeaPage /> },
  { match: (value: string) => value.startsWith("/track-idea"), element: <TrackIdeaPage /> },
  { match: (value: string) => value === "/who-can-apply", element: <WhoCanApplyPage /> },
  { match: (value: string) => value === "/submission", element: <SubmissionPage /> },
  { match: (value: string) => value === "/review-process", element: <ReviewProcessPage /> },
  { match: (value: string) => value === "/innovation-hub", element: <InnovationHubPage /> },
  { match: (value: string) => value === "/membership", element: <MembershipPage /> },
  { match: (value: string) => value === "/collaboration", element: <CollaborationPage /> },
  { match: (value: string) => value === "/contact", element: <ContactPage /> },
];

function resolveRoute(pathname: string) {
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  const match = routeMap.find((route) => route.match(normalizedPath));
  return { element: match?.element ?? <NmfIfiaInnovationHubPage />, isHome: !match };
}

const { element, isHome } = resolveRoute(path);
const normalizedPath = path.length > 1 ? path.replace(/\/$/, "") : path;
const sourceContext = getPublicSourceContextFromSearch(window.location.search, document.referrer, path);
const skipLoader =
  sourceContext.sourcePlatform === "sirmv-idea" &&
  (
    normalizedPath === "/submit-idea" ||
    normalizedPath === "/track-idea" ||
    normalizedPath === "/sirmv-submit-idea" ||
    normalizedPath === "/sirmv-track-idea"
  );

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Site-wide loader: runs once per browser session across any public page.
        Homepage gets shooting-star transition into hero globe; other pages get a clean fade. */}
    {!skipLoader && <SiteLoader isHome={isHome} />}
    {element}
  </StrictMode>
);
