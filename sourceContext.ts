export type PublicSourcePlatform = "ingeniouspark" | "sirmv-idea";

export interface PublicSourceContext {
  sourcePlatform: PublicSourcePlatform;
  label: string;
  tagline: string | null;
  logo: string;
  homeUrl: string;
  submitUrl: string;
  trackUrl: string;
  isExternalHome: boolean;
}

const DEFAULT_SOURCE: PublicSourceContext = {
  sourcePlatform: "ingeniouspark",
  label: "Ingeniouspark",
  tagline: null,
  logo: "/mnf-logo.png",
  homeUrl: "/",
  submitUrl: "/submit-idea",
  trackUrl: "/track-idea",
  isExternalHome: false,
};

const SOURCE_CONTEXTS: Record<PublicSourcePlatform, PublicSourceContext> = {
  ingeniouspark: DEFAULT_SOURCE,
  "sirmv-idea": {
    sourcePlatform: "sirmv-idea",
    label: "SIR MV Idea",
    tagline: "Bharat Ratna Sir M. Visvesvaraya Tribute",
    logo: "/sirmv-logo.png",
    homeUrl: "https://sirmv-idea.org",
    submitUrl: "/sirmv-submit-idea",
    trackUrl: "/sirmv-track-idea",
    isExternalHome: true,
  },
};

const SOURCE_STORAGE_KEY = "ingeniouspark-source-platform";

export function normalizePublicSource(value: string | null | undefined): PublicSourcePlatform {
  const cleaned = value?.toLowerCase().trim();
  if (
    cleaned === "sirmv-idea" ||
    cleaned === "sirmv" ||
    cleaned === "sir-mv" ||
    cleaned === "sir_mv" ||
    cleaned === "smv" ||
    cleaned === "sirmv-idea.org"
  ) return "sirmv-idea";
  if (cleaned === "ingeniouspark") return "ingeniouspark";
  return "ingeniouspark";
}

export function getPublicSourceContext(sourcePlatform: string | null | undefined): PublicSourceContext {
  return SOURCE_CONTEXTS[normalizePublicSource(sourcePlatform)];
}

function getSourceParam(params: URLSearchParams): string | null {
  return (
    params.get("source") ||
    params.get("source_platform") ||
    params.get("partner") ||
    params.get("ref")
  );
}

function hasExplicitSourceParam(params: URLSearchParams): boolean {
  return (
    params.has("source") ||
    params.has("source_platform") ||
    params.has("partner") ||
    params.has("ref")
  );
}

function getSourceFromReferrer(referrer: string | null | undefined): PublicSourcePlatform | null {
  if (!referrer) return null;
  const normalizedReferrer = referrer.toLowerCase();
  if (normalizedReferrer.includes("sirmv-idea.org")) return "sirmv-idea";
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (host === "sirmv-idea.org" || host.endsWith(".sirmv-idea.org")) return "sirmv-idea";
  } catch {
    return null;
  }
  return null;
}

function getSourceFromPath(pathname: string | null | undefined): PublicSourcePlatform | null {
  const normalized = pathname?.toLowerCase().replace(/\/$/, "");
  if (normalized === "/sirmv-submit-idea" || normalized === "/sirmv-track-idea") return "sirmv-idea";
  return null;
}

function canUseStoredSource(pathname: string | null | undefined): boolean {
  const normalized = pathname?.toLowerCase().replace(/\/$/, "");
  return (
    normalized === "/submit-idea" ||
    normalized === "/track-idea" ||
    normalized === "/sirmv-submit-idea" ||
    normalized === "/sirmv-track-idea"
  );
}

function readStoredSource(pathname: string | null | undefined): PublicSourcePlatform | null {
  if (!canUseStoredSource(pathname)) return null;
  if (typeof window === "undefined") return null;
  try {
    const stored = window.sessionStorage.getItem(SOURCE_STORAGE_KEY);
    return stored === "sirmv-idea" ? "sirmv-idea" : null;
  } catch {
    return null;
  }
}

function writeStoredSource(source: PublicSourcePlatform | null): void {
  if (typeof window === "undefined") return;
  try {
    if (source === "sirmv-idea") {
      window.sessionStorage.setItem(SOURCE_STORAGE_KEY, source);
    }
  } catch {
    // Ignore storage failures; source detection still works for the current load.
  }
}

function clearStoredSource(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(SOURCE_STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}

export function getPublicSourceContextFromSearch(
  search: string,
  referrer?: string | null,
  pathname?: string | null,
): PublicSourceContext {
  const params = new URLSearchParams(search);
  const sourceParam = getSourceParam(params);
  const pathSource = getSourceFromPath(pathname);
  const referrerSource = getSourceFromReferrer(referrer);
  const storedSource = readStoredSource(pathname);
  const source = sourceParam ? normalizePublicSource(sourceParam) : (pathSource ?? referrerSource ?? storedSource);

  if (referrerSource === "sirmv-idea" || pathSource === "sirmv-idea" || source === "sirmv-idea") {
    writeStoredSource("sirmv-idea");
  } else if (hasExplicitSourceParam(params) && source === "ingeniouspark") {
    clearStoredSource();
  }

  return getPublicSourceContext(source);
}
