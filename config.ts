// Platform configuration — update these when moving to production.
// Never add database credentials, secret keys, or connection strings here.

// Production portal URL. Override locally via VITE_PORTAL_URL (e.g. http://localhost:5174 for dev).
export const PORTAL_URL: string = (import.meta.env.VITE_PORTAL_URL as string | undefined) || "https://portal.ingeniouspark.in";

// Reads VITE_API_URL from env; falls back to the production backend for release-safe builds.
export const API_BASE_URL: string = (import.meta.env.VITE_API_URL as string | undefined) ?? "https://portalbackend.ingeniouspark.in";

// PROGRAM_TRACK left as default fallback. Ingeniouspark accepts K12 + LOCAL_REGIONAL + NATIONAL_INTERNATIONAL;
// final track is decided per-submission inside getInquiryScope() based on user input. Do NOT hard-lock here.
export const PROGRAM_TRACK = "NATIONAL_INTERNATIONAL";
// Public-facing source domain. Backend may read this — coordinate before production cutover.
export const SOURCE_DOMAIN = "ingeniouspark.in";

export const SUPPORT_EMAIL = "support@ingeniouspark.in";
export const CONTACT_EMAIL = "support@ingeniouspark.in";
export const CONTACT_PHONE = "+91 9731280666";
