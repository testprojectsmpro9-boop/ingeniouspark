import { useState, useEffect, FormEvent, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, CheckCircle2, Clock, AlertCircle, Loader2,
  MessageSquare, Zap, Send, Globe, Scale, Wrench, Building2, Trophy,
  Sparkles, Info, Wifi, WifiOff,
} from "lucide-react";
import { EASE } from "./types";
import { API_BASE_URL, SUPPORT_EMAIL } from "./config";
import FocusedHeader from "./components/FocusedHeader";
import MobileBackButton from "./components/MobileBackButton";
import PublicSiteFooter from "./components/PublicSiteFooter";
import { getPublicSourceContextFromSearch } from "./sourceContext";

// ─── Phase definitions ─────────────────────────────────────────────────────

const PHASES = [
  { label: "Submitted",              short: "Submitted",    Icon: Send,      color: "navy"    },
  { label: "Under Verification",     short: "Verification", Icon: Clock,     color: "gold"    },
  { label: "Public Domain Review",   short: "Domain Review",Icon: Globe,     color: "indigo"  },
  { label: "Field Jury Review",      short: "Jury Review",  Icon: Scale,     color: "navy2"   },
  { label: "Prototype & Mentorship", short: "Mentorship",   Icon: Wrench,    color: "amber"   },
  { label: "Incubation",             short: "Incubation",   Icon: Building2, color: "orange"  },
  { label: "Exhibition Pathway",     short: "Exhibition",   Icon: Trophy,    color: "rose"    },
] as const;

const PHASE_COLORS: Record<string, { ring: string; bg: string; text: string; line: string; badge: string }> = {
  navy:    { ring: "ring-[#002B5C]",   bg: "bg-[#002B5C]",   text: "text-[#002B5C]",   line: "bg-[#002B5C]",   badge: "bg-[#EAF2FB] text-[#002B5C] border-[#BFD7EA]"  },
  gold:    { ring: "ring-[#D4A017]",   bg: "bg-[#D4A017]",   text: "text-[#002B5C]",   line: "bg-[#D4A017]",   badge: "bg-[#FFF5D6] text-[#002B5C] border-[#D4A017]/30" },
  navy2:   { ring: "ring-[#003B73]",   bg: "bg-[#003B73]",   text: "text-[#003B73]",   line: "bg-[#003B73]",   badge: "bg-[#EAF2FB] text-[#003B73] border-[#BFD7EA]"  },
  indigo:  { ring: "ring-indigo-400",  bg: "bg-indigo-500",  text: "text-indigo-700",  line: "bg-indigo-400",  badge: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  amber:   { ring: "ring-amber-400",   bg: "bg-amber-500",   text: "text-amber-700",   line: "bg-amber-400",   badge: "bg-amber-100 text-amber-700 border-amber-200"   },
  orange:  { ring: "ring-orange-400",  bg: "bg-orange-500",  text: "text-orange-700",  line: "bg-orange-400",  badge: "bg-orange-100 text-orange-700 border-orange-200" },
  rose:    { ring: "ring-rose-400",    bg: "bg-rose-500",    text: "text-rose-700",    line: "bg-rose-400",    badge: "bg-rose-100 text-rose-700 border-rose-200"    },
};

// ─── Types ─────────────────────────────────────────────────────────────────

type PhaseStatus = "processing" | "in_review" | "action_required" | "on_hold";
type BackendStatus = "checking" | "online" | "offline";

interface ApiTimelineItem {
  phase: number;
  label: string;
  status: "completed" | "current" | "upcoming";
  date?: string;
}

interface TrackResult {
  appId: string;
  applicantName: string;
  ideaTitle: string;
  category: string;
  submittedDate: string;
  lastUpdated: string;
  currentPhase: number;
  phaseStatus: PhaseStatus;
  adminMessage: string;
  nextAction: string;
  estimatedNextUpdate?: string;
  timeline?: ApiTimelineItem[];
}

// ─── API response → TrackResult ────────────────────────────────────────────

const VALID_STATUSES: PhaseStatus[] = ["processing", "in_review", "action_required", "on_hold"];

function toPhaseStatus(s: unknown): PhaseStatus {
  if (typeof s === "string" && VALID_STATUSES.includes(s as PhaseStatus)) return s as PhaseStatus;
  return "processing";
}

function mapApiResponse(data: Record<string, unknown>): TrackResult {
  return {
    appId:                String(data.application_id ?? ""),
    applicantName:        String(data.applicant_name ?? ""),
    ideaTitle:            String(data.idea_title ?? ""),
    category:             String(data.category ?? ""),
    submittedDate:        String(data.submitted_at ?? "—"),
    lastUpdated:          String(data.last_updated ?? "—"),
    currentPhase:         typeof data.current_phase === "number" ? data.current_phase : 0,
    phaseStatus:          toPhaseStatus(data.phase_status),
    adminMessage:         String(data.admin_message ?? ""),
    nextAction:           String(data.next_action ?? ""),
    estimatedNextUpdate:  data.estimated_next_update ? String(data.estimated_next_update) : undefined,
    timeline:             Array.isArray(data.timeline) ? (data.timeline as ApiTimelineItem[]) : undefined,
  };
}

// ─── Demo IDs (for UX example only) ───────────────────────────────────────

function normaliseId(raw: string) {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

// ─── Status badge config ───────────────────────────────────────────────────

const STATUS_CONFIG: Record<PhaseStatus, { label: string; cls: string; Icon: typeof AlertCircle }> = {
  processing:       { label: "Processing",       cls: "bg-amber-100 text-amber-700 border-amber-200",  Icon: Loader2       },
  in_review:        { label: "In Review",         cls: "bg-[#EAF2FB] text-[#002B5C] border-[#BFD7EA]", Icon: Search        },
  action_required:  { label: "Action Required",   cls: "bg-rose-100 text-rose-700 border-rose-200",    Icon: AlertCircle   },
  on_hold:          { label: "On Hold",            cls: "bg-slate-100 text-slate-600 border-slate-200", Icon: Clock         },
};

// ─── Sub-components ────────────────────────────────────────────────────────

function PhaseStepper({ currentPhase }: { currentPhase: number }) {
  return (
    <>
      {/* Desktop: horizontal */}
      <div className="relative hidden lg:block">
        <div
          className="absolute top-5 h-0.5 bg-slate-200"
          style={{ left: "calc(7.14% + 20px)", right: "calc(7.14% + 20px)" }}
        />
        <div
          className="absolute top-5 h-0.5 bg-gradient-to-r from-[#002B5C] to-[#D4A017] transition-all duration-700"
          style={{
            left: "calc(7.14% + 20px)",
            width: currentPhase === 0
              ? "0%"
              : `calc(${(currentPhase / 6) * 100}% - ${(currentPhase / 6) * 40}px)`,
          }}
        />
        <div className="relative grid grid-cols-7">
          {PHASES.map((ph, i) => {
            const done    = i < currentPhase;
            const current = i === currentPhase;
            const col     = PHASE_COLORS[ph.color];
            return (
              <div key={ph.label} className="flex flex-col items-center gap-2">
                <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  done    ? `${col.bg} border-transparent` :
                  current ? `bg-white ${col.ring} ring-2 ring-offset-1` :
                            "border-slate-200 bg-white"
                }`}>
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 text-white" aria-hidden="true" />
                  ) : (
                    <ph.Icon className={`h-4 w-4 ${current ? col.text : "text-slate-300"}`} aria-hidden="true" />
                  )}
                  {current && (
                    <span className={`absolute -inset-1.5 animate-ping rounded-full opacity-20 ${col.bg}`} />
                  )}
                </div>
                <span className={`text-center text-[10px] font-bold leading-tight ${
                  done ? "text-slate-500" : current ? col.text : "text-slate-300"
                }`}>
                  {ph.short}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: vertical */}
      <div className="flex flex-col gap-0 lg:hidden">
        {PHASES.map((ph, i) => {
          const done    = i < currentPhase;
          const current = i === currentPhase;
          const last    = i === PHASES.length - 1;
          const col     = PHASE_COLORS[ph.color];
          return (
            <div key={ph.label} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                  done    ? `${col.bg} border-transparent` :
                  current ? `bg-white ${col.ring} ring-2 ring-offset-1` :
                            "border-slate-200 bg-white"
                }`}>
                  {done ? (
                    <CheckCircle2 className="h-4 w-4 text-white" aria-hidden="true" />
                  ) : (
                    <ph.Icon className={`h-4 w-4 ${current ? col.text : "text-slate-300"}`} aria-hidden="true" />
                  )}
                  {current && <span className={`absolute -inset-1.5 animate-ping rounded-full opacity-20 ${col.bg}`} />}
                </div>
                {!last && <div className={`w-0.5 flex-1 my-1 ${done ? col.line : "bg-slate-200"}`} style={{ minHeight: "24px" }} />}
              </div>
              <div className={`pb-5 pt-1.5 ${last ? "" : ""}`}>
                <p className={`text-sm font-bold leading-tight ${current ? col.text : done ? "text-slate-500" : "text-slate-300"}`}>
                  {ph.label}
                  {current && <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-black ${col.badge} border`}>Current</span>}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: PhaseStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${cfg.cls}`}>
      <cfg.Icon className={`h-3.5 w-3.5 ${status === "processing" ? "animate-spin" : ""}`} aria-hidden="true" />
      {cfg.label}
    </span>
  );
}

function TimelineSection({ timeline }: { timeline: ApiTimelineItem[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-5 text-base font-bold text-slate-900">Activity Timeline</h3>
      <div className="space-y-3">
        {timeline.map((item) => {
          const phase   = PHASES[item.phase] as (typeof PHASES)[number] | undefined;
          const color   = phase?.color ?? "navy";
          const col     = PHASE_COLORS[color];
          const isDone  = item.status === "completed";
          const isCur   = item.status === "current";
          const PhIcon  = phase?.Icon ?? Clock;
          return (
            <div key={item.phase} className="flex items-start gap-3">
              <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all ${
                isDone ? `${col.bg}` : isCur ? `bg-white ring-2 ${col.ring}` : "bg-slate-100"
              }`}>
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-white" aria-hidden="true" />
                ) : (
                  <PhIcon className={`h-3.5 w-3.5 ${isCur ? col.text : "text-slate-300"}`} aria-hidden="true" />
                )}
              </div>
              <div className="flex flex-1 items-start justify-between gap-3">
                <div>
                  <p className={`text-sm font-semibold ${isDone ? "text-slate-600" : isCur ? col.text : "text-slate-300"}`}>
                    {item.label}
                  </p>
                  {isCur && (
                    <span className={`text-[11px] font-semibold ${col.text}`}>Current stage</span>
                  )}
                </div>
                {item.date && (
                  <span className="shrink-0 text-xs text-slate-400">{item.date}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BackendBadge({ status }: { status: BackendStatus }) {
  if (status === "checking") return null;
  if (status === "offline") return (
    <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
      <WifiOff className="h-3 w-3" aria-hidden="true" />
      Offline mode
    </span>
  );
  return (
    <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#BFD7EA] bg-[#EAF2FB] px-2.5 py-1 text-xs font-medium text-[#002B5C]">
      <Wifi className="h-3 w-3" aria-hidden="true" />
      Connected
    </span>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────

export default function TrackIdeaPage() {
  const [appId, setAppId]               = useState("");
  const [contact, setContact]           = useState("");
  const [loading, setLoading]           = useState(false);
  const [result, setResult]             = useState<TrackResult | "not_found" | null>(null);
  const [error, setError]               = useState("");
  const [backendStatus, setBackendStatus] = useState<BackendStatus>("checking");
  const sourceContext = useMemo(
    () => getPublicSourceContextFromSearch(window.location.search, document.referrer, window.location.pathname),
    [],
  );

  // Health check on mount
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/health`, { signal: controller.signal })
      .then((r) => setBackendStatus(r.ok ? "online" : "offline"))
      .catch(() => setBackendStatus("offline"));
    return () => controller.abort();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!appId.trim()) { setError("Please enter your Application ID"); return; }
    if (!contact.trim()) { setError("Please enter your phone number or email"); return; }
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_id: normaliseId(appId),
          phone_or_email: contact.trim(),
        }),
      });

      if (res.status === 404) {
        setResult("not_found");
      } else if (!res.ok) {
        const data = await res.json().catch(() => ({})) as Record<string, unknown>;
        const detail = data?.detail ?? data?.message;
        const msg =
          typeof detail === "string"
            ? detail
            : Array.isArray(detail)
            ? (detail as Array<{ msg?: string }>).map((d) => d?.msg ?? "").join("; ")
            : `Server error (${res.status}). Please try again.`;
        setError(msg);
      } else {
        const data = await res.json() as Record<string, unknown>;
        setResult(mapApiResponse(data));
      }
    } catch {
      setError("Could not reach the server. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentPhase = result && result !== "not_found" ? result.currentPhase : 0;
  const phaseLabel   = result && result !== "not_found" ? PHASES[result.currentPhase]?.label ?? "" : "";
  const isSirmvSource = sourceContext.sourcePlatform === "sirmv-idea";
  const trackTitle = isSirmvSource ? "Track Your SIR MV Idea" : "Track Your Idea";
  const trackIntro = isSirmvSource
    ? "Enter your Application ID to check the current status of your submitted idea under the SIR M. Visvesvaraya Idea Bank."
    : "Enter your Application ID and the phone number or email you registered with. We will show you the current review status.";

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      <FocusedHeader source={sourceContext} cta={{ href: sourceContext.submitUrl, label: "Submit Idea" }} />
      <MobileBackButton />

      <main className="mx-auto max-w-3xl px-4 pb-20 pt-6">
        <div className="mb-4 flex items-center justify-end gap-2">
          <BackendBadge status={backendStatus} />
        </div>

        {/* Hero */}
        <div className="mb-8 rounded-3xl border border-[#BFD7EA] bg-gradient-to-r from-[#EAF2FB] to-[#FFF5D6] p-6">
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">{trackTitle}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {trackIntro}
          </p>
        </div>

        {/* Lookup form */}
        <form
          onSubmit={onSubmit}
          noValidate
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Application ID <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              <input
                type="text"
                value={appId}
                onChange={(e) => { setAppId(e.target.value); setError(""); }}
                placeholder="e.g. IDEA-0001"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm uppercase tracking-wider text-slate-900 placeholder-slate-400 transition focus:border-[#D4A017] focus:outline-none focus:ring-2 focus:ring-[#D4A017]/20"
                autoComplete="off"
                spellCheck={false}
              />
              <p className="mt-1 text-xs text-slate-400">
                You received this ID on your submission confirmation screen.
              </p>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Registered Phone or Email <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => { setContact(e.target.value); setError(""); }}
                placeholder="Phone number or email address"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition focus:border-[#D4A017] focus:outline-none focus:ring-2 focus:ring-[#D4A017]/20"
              />
            </div>
          </div>

          {error && (
            <p className="mt-3 flex items-center gap-1.5 text-sm text-rose-600">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#002B5C] py-3.5 font-semibold text-white shadow-lg transition hover:bg-[#003d82] hover:shadow-xl disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002B5C]"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Looking up your idea…</>
            ) : (
              <><Search className="h-4 w-4" aria-hidden="true" /> Track My Idea</>
            )}
          </button>

          {/* Format hint */}
          <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Info className="h-3.5 w-3.5" aria-hidden="true" />
              Example format: <span className="font-mono text-slate-700">IDEA-0001</span>
            </p>
            <p className="mt-2 text-[11px] text-slate-400">
              Enter the exact ID from your submission confirmation.
            </p>
          </div>
        </form>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result === "not_found" && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center"
            >
              <AlertCircle className="mx-auto h-10 w-10 text-rose-400" aria-hidden="true" />
              <h2 className="mt-3 text-lg font-bold text-slate-900">Application ID not found</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                We could not find a submission matching that ID and contact. Please check:
              </p>
              <ul className="mt-3 space-y-1 text-sm text-slate-600">
                <li>• The Application ID is copied exactly as shown (e.g. IDEA-0001)</li>
                <li>• The phone or email matches what you submitted</li>
                <li>• If you submitted recently, please allow up to 24 hours</li>
              </ul>
              <p className="mt-4 text-sm text-slate-500">
                Need help? Contact us at{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-[#002B5C] underline">
                  {SUPPORT_EMAIL}
                </a>
              </p>
            </motion.div>
          )}

          {result && result !== "not_found" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="mt-6 space-y-5"
            >
              {/* Summary card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#002B5C]">
                      Application ID
                    </p>
                    <p className="mt-0.5 font-mono text-xl font-black tracking-wide text-slate-900">
                      {result.appId}
                    </p>
                  </div>
                  <StatusBadge status={result.phaseStatus} />
                </div>

                <div className="mt-4 border-t border-slate-100 pt-4">
                  <h2 className="text-lg font-bold text-slate-900">{result.ideaTitle}</h2>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-semibold">
                      {result.category}
                    </span>
                    <span>Submitted: {result.submittedDate}</span>
                    <span>Last updated: {result.lastUpdated}</span>
                  </div>
                </div>
              </div>

              {/* Phase stepper */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#D4A017]" aria-hidden="true" />
                  <h3 className="text-base font-bold text-slate-900">Review Progress</h3>
                  <span className={`ml-auto rounded-full border px-3 py-0.5 text-xs font-bold ${PHASE_COLORS[PHASES[currentPhase]?.color ?? "navy"].badge}`}>
                    {phaseLabel}
                  </span>
                </div>
                <PhaseStepper currentPhase={currentPhase} />
              </div>

              {/* Backend timeline — rendered if provided */}
              {result.timeline && result.timeline.length > 0 && (
                <TimelineSection timeline={result.timeline} />
              )}

              {/* Admin message */}
              {result.adminMessage && (
                <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100">
                      <MessageSquare className="h-4 w-4 text-indigo-700" aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Message from NMF Team</h3>
                  </div>
                  <blockquote className="rounded-2xl border border-indigo-100 bg-white p-4 text-sm leading-7 text-slate-700">
                    {result.adminMessage}
                  </blockquote>
                  {result.estimatedNextUpdate && (
                    <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                      Expected next update: <strong className="text-slate-700">{result.estimatedNextUpdate}</strong>
                    </p>
                  )}
                </div>
              )}

              {/* Next action */}
              {result.nextAction && (
                <div className={`rounded-3xl border-2 p-6 shadow-sm ${
                  result.phaseStatus === "action_required"
                    ? "border-rose-300 bg-rose-50"
                    : "border-[#BFD7EA] bg-[#EAF2FB]"
                }`}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                      result.phaseStatus === "action_required" ? "bg-rose-100" : "bg-[#EAF2FB]"
                    }`}>
                      <Zap className={`h-4 w-4 ${
                        result.phaseStatus === "action_required" ? "text-rose-700" : "text-[#002B5C]"
                      }`} aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {result.phaseStatus === "action_required" ? "Action Required from You" : "Your Next Step"}
                    </h3>
                    {result.phaseStatus === "action_required" && (
                      <span className="ml-auto rounded-full border border-rose-300 bg-rose-100 px-2.5 py-0.5 text-xs font-black text-rose-700">
                        Needs Response
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-7 text-slate-700">{result.nextAction}</p>
                </div>
              )}

              {/* What happens next */}
              {currentPhase < PHASES.length - 1 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-base font-bold text-slate-900">Coming Up Next</h3>
                  <div className="space-y-2">
                    {PHASES.slice(currentPhase + 1).map((ph, i) => (
                      <div key={ph.label} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-black text-slate-500">
                          {currentPhase + i + 2}
                        </span>
                        <span className="text-sm text-slate-500">{ph.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentPhase === PHASES.length - 1 && (
                <div className="rounded-3xl border border-[#D4A017]/40 bg-gradient-to-r from-[#FFF5D6] to-[#EAF2FB] p-6 text-center shadow-sm">
                  <Trophy className="mx-auto h-10 w-10 text-[#D4A017]" aria-hidden="true" />
                  <h3 className="mt-3 text-lg font-bold text-slate-900">Exhibition Pathway Reached!</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Your idea has reached the final stage. Our team will coordinate exhibition and recognition opportunities with you directly.
                  </p>
                </div>
              )}

              {/* Contact note */}
              <p className="text-center text-xs text-slate-400">
                Questions about your submission? Email{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-[#002B5C] underline">
                  {SUPPORT_EMAIL}
                </a>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <PublicSiteFooter />
    </div>
  );
}
