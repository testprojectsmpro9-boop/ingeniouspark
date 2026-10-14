import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Shield,
  Lock,
  Paperclip,
  Users,
  Wifi,
  WifiOff,
  X,
  UserCheck,
} from "lucide-react";
import { EASE } from "./types";
import { API_BASE_URL, SOURCE_DOMAIN } from "./config";
import FocusedHeader from "./components/FocusedHeader";
import MobileBackButton from "./components/MobileBackButton";
import PublicSiteFooter from "./components/PublicSiteFooter";
import { getPublicSourceContextFromSearch } from "./sourceContext";

// ─── input CSS constants ───────────────────────────────────────────────────
const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition focus:border-[#D4A017] focus:outline-none focus:ring-2 focus:ring-[#D4A017]/20";
const errorInputCls =
  "w-full rounded-xl border border-rose-300 bg-rose-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/20";

// ─── static data ───────────────────────────────────────────────────────────
const APPLICANT_TYPES = [
  "Student",
  "Individual Innovator",
  "Team / Group",
  "Startup / Entrepreneur",
  "Farmer / Rural Innovator",
  "Researcher",
  "Teacher / Educator",
  "Technician / Engineer",
  "NGO / Community Group",
  "Institution / University",
  "Other",
];

const PROGRAM_TRACKS = [
  "Local / Regional Innovation",
  "National / International Innovation",
  "K-12 / School Innovation",
  "IFIA / Partner Referral",
  "Other",
];

const GENDERS = ["Male", "Female", "Non-binary / Other", "Prefer not to say"];
const LANGUAGES = ["English", "Kannada", "Hindi", "Tamil", "Telugu", "Marathi", "Other"];

const PROTOTYPE_OPTIONS: { value: string; label: string; sub: string }[] = [
  { value: "IDEA_STAGE",        label: "Idea stage only",                  sub: "No drawing or model yet" },
  { value: "SKETCH_AVAILABLE",  label: "Sketch / drawing available",       sub: "Rough design or diagram exists" },
  { value: "CONCEPT_NOTE",      label: "Concept note available",           sub: "A written concept note or brief exists" },
  { value: "BASIC_PROTOTYPE",   label: "Basic prototype available",        sub: "Physical or digital mock-up built" },
  { value: "WORKING_PROTOTYPE", label: "Working prototype available",      sub: "Functional version can be shown" },
  { value: "PILOT_TESTED",      label: "Pilot tested",                     sub: "Feedback collected from actual users" },
  { value: "MARKET_READY",      label: "Market ready",                     sub: "Ready for launch, scale, or commercialization" },
];

const SUPPORT_OPTIONS = [
  "Mentorship from experts",
  "Prototype development support",
  "Technical review & feedback",
  "Funding / grant guidance",
  "Patent / IP guidance",
  "Incubation support",
  "Exhibition / showcase opportunity",
  "Market access / commercialization",
  "Legal support",
  "Networking with innovators",
  "Other",
];

const MIN_TEAM_MEMBERS = 2;
const MAX_TEAM_MEMBERS = 10;
const MAX_SUPPORTING_FILE_SIZE = 50 * 1024 * 1024;
const SUPPORTING_FILE_ACCEPT = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.mp3,.wav,.m4a,.mp4,.mov,.webm";
const SUPPORTING_FILE_EXTENSIONS = new Set(
  SUPPORTING_FILE_ACCEPT.split(",").map((ext) => ext.replace(".", "")),
);

const CATEGORIES: Record<string, string[]> = {
  AGRICULTURE: [
    "Crop improvement & smart farming",
    "Irrigation & water management",
    "Post-harvest & storage solutions",
    "Agri-tech & precision farming",
    "Organic farming & soil health",
    "Livestock & dairy innovation",
  ],
  HEALTHCARE: [
    "Diagnostic tools & devices",
    "Affordable healthcare access",
    "Mental health solutions",
    "Maternal & child health",
    "Preventive health & nutrition",
    "Rural health delivery",
  ],
  EDUCATION: [
    "EdTech platforms & tools",
    "Skill development & vocational training",
    "Inclusive & special education",
    "Early childhood education",
    "STEM learning innovations",
    "Teacher training & support",
  ],
  ENVIRONMENT: [
    "Waste management & recycling",
    "Air & water pollution control",
    "Biodiversity conservation",
    "Climate-smart agriculture",
    "Green building & urban planning",
    "Carbon footprint reduction",
  ],
  AI_SOFTWARE: [
    "AI/ML applications",
    "IoT & sensor systems",
    "Blockchain & data security",
    "Natural language & speech tech",
    "Computer vision & image processing",
    "Robotics & automation",
    "Cybersecurity solutions",
  ],
  WATER: [
    "Drinking water purification",
    "Rainwater harvesting",
    "Sanitation & hygiene solutions",
    "Wastewater treatment",
    "Groundwater management",
  ],
  ENERGY: [
    "Solar energy solutions",
    "Biomass & bioenergy",
    "Wind energy innovations",
    "Energy storage & batteries",
    "Mini & micro grids",
    "Energy efficiency tools",
  ],
  OTHERS: [
    "Food processing & preservation",
    "Nutritional supplements",
    "Food safety & quality",
    "Supply chain & distribution",
    "Functional & fortified foods",
    "Reducing food waste",
  ],
  WOMEN_SAFETY: [
    "Women & gender empowerment",
    "Safety & emergency response",
    "Economic inclusion",
    "Legal aid & access to justice",
    "Child protection & welfare",
  ],
  RURAL_DEVELOPMENT: [
    "Rural connectivity & infrastructure",
    "Village entrepreneurship",
    "Self-help group empowerment",
    "Digital literacy in villages",
    "Rural financial services",
  ],
  "Assistive Technology": [
    "Disability inclusion & mobility aids",
    "Communication devices",
    "Sensory & cognitive assistance",
    "Accessible learning tools",
  ],
  TRANSPORTATION: [
    "Last-mile connectivity",
    "Electric vehicles & clean transport",
    "Road safety innovations",
    "Public transport optimization",
    "Accessibility for differently-abled",
  ],
  "Waste Management": [
    "Solid waste sorting & recycling",
    "E-waste disposal",
    "Composting & bio-waste",
    "Zero-waste processes",
  ],
  OTHER: [
    "Unique cross-domain idea",
    "Cultural & creative innovation",
    "Sports & recreation",
    "Tourism & heritage",
    "Defence & safety",
    "Space & astronomy",
    "Handicrafts & traditional skills",
  ],
};

// ─── backend mapping ───────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  AGRICULTURE: "Agriculture",
  HEALTHCARE: "Healthcare",
  EDUCATION: "Education",
  ENVIRONMENT: "Environment",
  AI_SOFTWARE: "AI / Technology / Digital",
  WATER: "Water",
  ENERGY: "Energy",
  OTHERS: "Other",
  WOMEN_SAFETY: "Women Safety",
  RURAL_DEVELOPMENT: "Rural Development",
  ASSISTIVE_TECHNOLOGY: "Assistive Technology",
  TRANSPORTATION: "Transportation & Mobility",
  WASTE_MANAGEMENT: "Waste Management",
  OTHER: "Other",
};

// IdeaCategory enum names accepted by the backend normalizer.
const CATEGORY_MAP: Record<string, string> = {
  AGRICULTURE: "AGRICULTURE",
  HEALTHCARE: "HEALTHCARE",
  EDUCATION: "EDUCATION",
  ENVIRONMENT: "ENVIRONMENT",
  AI_SOFTWARE: "AI_SOFTWARE",
  WATER: "WATER",
  ENERGY: "ENERGY",
  OTHERS: "OTHERS",
  WOMEN_SAFETY: "WOMEN_SAFETY",
  RURAL_DEVELOPMENT: "RURAL_DEVELOPMENT",
  ASSISTIVE_TECHNOLOGY: "ASSISTIVE_TECHNOLOGY",
  TRANSPORTATION: "OTHERS",
  WASTE_MANAGEMENT: "WASTE_MANAGEMENT",
  OTHER: "OTHERS",
};

// IdeaApplicantType enum values
const APPLICANT_TYPE_MAP: Record<string, string> = {
  "Student":                "COLLEGE_STUDENT",  // overridden to K12_STUDENT when showGuardian
  "Individual Innovator":   "ADULT_INNOVATOR",
  "Team / Group":           "GENERAL_PUBLIC",
  "Startup / Entrepreneur": "STARTUP",
  "Farmer / Rural Innovator":"FARMER",
  "Researcher":             "RESEARCHER",
  "Teacher / Educator":     "ADULT_INNOVATOR",
  "Technician / Engineer":  "ADULT_INNOVATOR",
  "NGO / Community Group":  "GENERAL_PUBLIC",
  "Institution / University":"GENERAL_PUBLIC",
  "Other":                  "OTHER",
};

// IdeaSourceProgram / ProgramTrack enum values (both columns use same 3 values)
const PROGRAM_TRACK_MAP: Record<string, string> = {
  "Local / Regional Innovation":        "LOCAL_REGIONAL",
  "National / International Innovation":"NATIONAL_INTERNATIONAL",
  "K-12 / School Innovation":           "K12",
  "IFIA / Partner Referral":            "NATIONAL_INTERNATIONAL", // no IFIA_REFERRAL in IdeaSourceProgram
  "Other":                              "LOCAL_REGIONAL",
};

// ─── types ─────────────────────────────────────────────────────────────────
interface FormData {
  // Applicant Details
  fullName: string;
  phone: string;
  email: string;
  age: string;
  gender: string;
  city: string;
  state: string;
  organization: string;
  preferredLanguage: string;
  // Applicant Type
  applicantType: string;
  // Team / Group (conditional)
  teamName: string;
  teamMemberCount: string;
  teamMemberNames: string[];
  // Program Track
  programTrack: string;
  // Guardian (conditional)
  guardianName: string;
  guardianRelationship: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianConsent: boolean;
  // Idea Details
  ideaTitle: string;
  problemStatement: string;
  solutionDescription: string;
  targetUsers: string;
  applicationContext: string;
  uniqueness: string;
  // Category
  category: string;
  subCategory: string;
  // Prototype
  prototypeStatus: string;
  // Support
  supportNeeded: string[];
  // Consent
  consentData: boolean;
  consentOriginal: boolean;
  consentContact: boolean;
}

type BackendStatus = "checking" | "online" | "offline";

// ─── animation variants ────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

const successCardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 220, damping: 22, delay: 0.1 },
  },
  exit: { opacity: 0, scale: 0.95, y: 16, transition: { duration: 0.2 } },
};

// ─── sub-components ────────────────────────────────────────────────────────

function SectionCard({
  num,
  title,
  badge,
  required,
  children,
}: {
  num: number;
  title: string;
  badge?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#002B5C] text-white text-sm font-bold shrink-0">
          {num}
        </span>
        <h2 className="text-lg font-semibold text-slate-800">
          {title}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </h2>
        {badge && (
          <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-[#002B5C] bg-[#EAF2FB] border border-[#BFD7EA] px-2.5 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5" data-error={error ? "true" : undefined}>
      <label className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-rose-500 mt-0.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

function OptionGrid({
  options,
  value,
  onChange,
  cols = 2,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  cols?: number;
}) {
  return (
    <div className={`grid gap-2.5 ${cols === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`text-left rounded-xl border px-4 py-3 text-sm transition ${
              selected
                ? "border-[#D4A017] bg-[#FFF5D6] text-[#002B5C] font-semibold"
                : "border-slate-200 bg-white text-slate-700 hover:border-[#BFD7EA]"
            }`}
          >
            <span
              className={`inline-flex w-4 h-4 rounded-full border mr-2 align-middle items-center justify-center transition ${
                selected ? "bg-[#002B5C] border-[#002B5C]" : "border-slate-300 bg-white"
              }`}
            >
              {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </span>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function ConsentBox({
  checked,
  onToggle,
  title,
  body,
  error,
}: {
  checked: boolean;
  onToggle: () => void;
  title: React.ReactNode;
  body: string;
  error?: string;
}) {
  return (
    <div
      data-error={error ? "true" : undefined}
      className={`rounded-2xl border-2 px-5 py-4 transition cursor-pointer ${
        checked ? "border-[#D4A017] bg-[#FFF5D6]" : error ? "border-rose-300 bg-rose-50/50" : "border-slate-200 bg-white hover:border-[#BFD7EA]"
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition ${checked ? "bg-[#002B5C] border-[#002B5C]" : "border-slate-300 bg-white"}`}>
          {checked && (
            <svg viewBox="0 0 10 8" fill="none" className="w-3 h-3">
              <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-800 mb-1">{title}</p>
          <p className="text-xs text-slate-500 leading-relaxed">{body}</p>
          {error && (
            <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {error}
            </p>
          )}
        </div>
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

// ─── main page ─────────────────────────────────────────────────────────────

const INITIAL: FormData = {
  fullName: "", phone: "", email: "", age: "", gender: "",
  city: "", state: "", organization: "", preferredLanguage: "",
  applicantType: "", teamName: "", teamMemberCount: "", teamMemberNames: [],
  programTrack: "",
  guardianName: "", guardianRelationship: "", guardianPhone: "", guardianEmail: "", guardianConsent: false,
  ideaTitle: "", problemStatement: "", solutionDescription: "",
  targetUsers: "", applicationContext: "", uniqueness: "",
  category: "", subCategory: "",
  prototypeStatus: "",
  supportNeeded: [],
  consentData: false, consentOriginal: false, consentContact: false,
};

export default function SubmitIdeaPage() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success">("idle");
  const [submitError, setSubmitError] = useState("");
  const [appId, setAppId] = useState("");
  const [backendStatus, setBackendStatus] = useState<BackendStatus>("checking");
  const [supportingFiles, setSupportingFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");

  const sourceContext = useMemo(
    () => getPublicSourceContextFromSearch(window.location.search, document.referrer, window.location.pathname),
    [],
  );
  const sourcePlatform = sourceContext.sourcePlatform;

  // Health check on mount
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/health`, { signal: controller.signal })
      .then((r) => setBackendStatus(r.ok ? "online" : "offline"))
      .catch(() => setBackendStatus("offline"));
    return () => controller.abort();
  }, []);

  const set = (key: keyof FormData, value: FormData[keyof FormData]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const setApplicantType = (value: string) => {
    setForm((prev) => ({
      ...prev,
      applicantType: value,
      ...(value === "Team / Group"
        ? {}
        : { teamName: "", teamMemberCount: "", teamMemberNames: [] }),
    }));
    setErrors((prev) => ({
      ...prev,
      applicantType: undefined,
      teamName: undefined,
      teamMemberCount: undefined,
      teamMemberNames: undefined,
    }));
  };

  const setTeamMemberCount = (value: string) => {
    const count = Math.max(0, Math.min(MAX_TEAM_MEMBERS, Number(value || 0)));
    setForm((prev) => ({
      ...prev,
      teamMemberCount: value,
      teamMemberNames: Array.from({ length: count }, (_, idx) => prev.teamMemberNames[idx] ?? (idx === 0 ? prev.fullName : "")),
    }));
    setErrors((prev) => ({ ...prev, teamMemberCount: undefined, teamMemberNames: undefined }));
  };

  const setTeamMemberName = (index: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      teamMemberNames: prev.teamMemberNames.map((name, idx) => idx === index ? value : name),
    }));
    setErrors((prev) => ({ ...prev, teamMemberNames: undefined }));
  };

  const toggleSupport = (option: string) => {
    setForm((prev) => ({
      ...prev,
      supportNeeded: prev.supportNeeded.includes(option)
        ? prev.supportNeeded.filter((s) => s !== option)
        : [...prev.supportNeeded, option],
    }));
  };

  const addSupportingFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const next = [...supportingFiles];
    let error = "";

    Array.from(incoming).forEach((file) => {
      const ext = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : "";
      if (!SUPPORTING_FILE_EXTENSIONS.has(ext)) {
        error = "One or more files use an unsupported format.";
        return;
      }
      if (file.size > MAX_SUPPORTING_FILE_SIZE) {
        error = "Each file must be 50 MB or smaller.";
        return;
      }
      next.push(file);
    });

    setSupportingFiles(next);
    setFileError(error);
  };

  const removeSupportingFile = (index: number) => {
    setSupportingFiles((prev) => prev.filter((_, i) => i !== index));
    setFileError("");
  };

  // ── K12 / minor derivations ────────────────────────────────────────────
  const ageNum       = form.age ? parseInt(form.age, 10) : null;
  const isMinor      = ageNum !== null && !isNaN(ageNum) && ageNum < 18;
  const isStudentType = form.applicantType === "Student";
  const isTeamSubmission = form.applicantType === "Team / Group";
  const isK12Track   = form.programTrack === "K-12 / School Innovation";

  // Guardian section appears for any of: minor / student type / K-12 track
  const showGuardian    = isMinor || isStudentType || isK12Track;
  // Guardian fields are REQUIRED only when age is confirmed below 18
  const guardianRequired = isMinor;

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};

    if (!form.fullName.trim())         e.fullName        = "Full name is required.";
    if (!form.phone.trim())            e.phone           = "Phone number is required.";
    if (!form.email.trim())            e.email           = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email address.";
    if (!form.city.trim())             e.city            = "City / Village / District is required.";
    if (!form.applicantType)           e.applicantType   = "Please select an applicant type.";
    if (!form.programTrack)            e.programTrack    = "Please select a submission track.";

    if (isTeamSubmission) {
      const count = Number(form.teamMemberCount);
      if (!form.teamName.trim()) e.teamName = "Team name is required.";
      if (!form.teamMemberCount.trim()) {
        e.teamMemberCount = "Total team members is required.";
      } else if (!Number.isInteger(count) || count < MIN_TEAM_MEMBERS) {
        e.teamMemberCount = `Team must have at least ${MIN_TEAM_MEMBERS} members.`;
      } else if (count > MAX_TEAM_MEMBERS) {
        e.teamMemberCount = `Team can have up to ${MAX_TEAM_MEMBERS} members.`;
      }
      const expectedNames = Number.isInteger(count) ? count : 0;
      const names = form.teamMemberNames.slice(0, expectedNames);
      if (expectedNames >= MIN_TEAM_MEMBERS && names.some((name) => !name.trim())) {
        e.teamMemberNames = "Please enter a name for each team member.";
      }
    }

    if (guardianRequired) {
      if (!form.guardianName.trim())        e.guardianName        = "Guardian name is required for applicants under 18.";
      if (!form.guardianRelationship.trim()) e.guardianRelationship = "Relationship to applicant is required.";
      if (!form.guardianPhone.trim())       e.guardianPhone       = "Guardian phone is required for applicants under 18.";
      if (!form.guardianConsent)            e.guardianConsent     = "Guardian consent is required for applicants under 18.";
    }

    if (!form.ideaTitle.trim())        e.ideaTitle       = "Idea title is required.";
    if (!form.problemStatement.trim()) e.problemStatement= "Problem statement is required.";
    if (!form.solutionDescription.trim()) e.solutionDescription = "Solution description is required.";
    if (!form.targetUsers.trim())      e.targetUsers     = "Please describe who will benefit.";
    if (!form.prototypeStatus)         e.prototypeStatus = "Please select a development status.";
    if (!form.consentData)             e.consentData     = "You must agree to data processing.";
    if (!form.consentOriginal)         e.consentOriginal = "You must confirm the idea is original.";
    if (!form.consentContact)          e.consentContact  = "You must agree to be contacted.";

    setErrors(e);

    if (Object.keys(e).length > 0) {
      setTimeout(() => {
        const el = document.querySelector("[data-error='true']");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return false;
    }
    return true;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    setSubmitState("submitting");
    setSubmitError("");

    // applicant_type: minor always K12_STUDENT; adult student → COLLEGE_STUDENT; else mapped
    const resolvedApplicantType: string =
      isMinor      ? "K12_STUDENT"
      : isStudentType ? "COLLEGE_STUDENT"
      : (APPLICANT_TYPE_MAP[form.applicantType] ?? "GENERAL_PUBLIC");

    // program_track / source_program: minor always K12 (even if user picked something else)
    const resolvedProgramTrack: string =
      isMinor || isK12Track
        ? "K12"
        : (PROGRAM_TRACK_MAP[form.programTrack] ?? "LOCAL_REGIONAL");

    const resolvedCategory = form.category ? (CATEGORY_MAP[form.category] ?? "OTHERS") : null;
    const teamMemberCount = isTeamSubmission ? Number(form.teamMemberCount) : null;
    const teamMemberNames = isTeamSubmission
      ? form.teamMemberNames.slice(0, teamMemberCount ?? 0).map((name) => name.trim())
      : null;

    const payload: Record<string, unknown> = {
      applicant_name:       form.fullName,
      email:                form.email,
      phone:                form.phone,
      age:                  ageNum ?? 0,
      gender:               form.gender || "",
      location:             [form.city, form.state].filter(Boolean).join(", "),
      city:                 form.city,
      state:                form.state || "",
      organization:         form.organization || "",
      original_language:    form.preferredLanguage || "English",
      preferred_language:   form.preferredLanguage || "English",
      team_name:            isTeamSubmission ? form.teamName.trim() : null,
      team_member_count:    teamMemberCount,
      team_member_names:    teamMemberNames,
      applicant_type:       resolvedApplicantType,
      program_track:        resolvedProgramTrack,
      source_program:       resolvedProgramTrack,
      source_type:          "ONLINE_FORM",
      idea_title:           form.ideaTitle,
      problem_statement:    form.problemStatement,
      solution_description: form.solutionDescription,
      category:             resolvedCategory,
      sub_category:         form.subCategory || "",
      target_users:         form.targetUsers,
      application_context:  form.applicationContext || "",
      uniqueness:           form.uniqueness || "",
      prototype_status:     form.prototypeStatus || "IDEA_STAGE",
      support_needed:       form.supportNeeded.join(", "),
      // Source tracking — identifies origin platform/URL
      source_platform:      sourcePlatform,
      source_domain:        SOURCE_DOMAIN,
      source_url:           window.location.href,
      referrer_url:         document.referrer || null,
    };

    if (showGuardian) {
      Object.assign(payload, {
        guardian_name:         form.guardianName || "",
        guardian_relationship: form.guardianRelationship || "",
        guardian_phone:        form.guardianPhone || "",
        guardian_email:        form.guardianEmail || "",
        guardian_consent:      form.guardianConsent,
      });
    }

    try {
      const hasFiles = supportingFiles.length > 0;
      const body = hasFiles ? new window.FormData() : JSON.stringify(payload);
      const headers = hasFiles ? undefined : { "Content-Type": "application/json" };
      if (hasFiles && body instanceof window.FormData) {
        body.append("idea_json", JSON.stringify(payload));
        supportingFiles.forEach((file) => body.append("files", file));
      }

      const res = await fetch(`${API_BASE_URL}/api/v1/ideas${hasFiles ? "/with-files" : ""}`, {
        method: "POST",
        headers,
        body,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as Record<string, unknown>;
        const detail = data?.detail ?? data?.message;
        let msg: string;
        if (typeof detail === "string") {
          msg = detail;
        } else if (Array.isArray(detail)) {
          msg = (detail as Array<{ msg?: string; loc?: string[] }>)
            .map((d) => [d.loc?.slice(-1)[0], d.msg].filter(Boolean).join(": "))
            .join(" | ");
        } else if (res.status === 422) {
          msg = "Validation error — one or more fields were rejected by the server. Please review your answers.";
        } else if (res.status === 400) {
          msg = "Bad request — the server rejected the submission. Please check your entries.";
        } else {
          msg = `Submission failed (${res.status}). Please try again or contact support.`;
        }
        setSubmitError(msg);
        setSubmitState("idle");
        return;
      }

      const data = await res.json() as { application_id?: string };
      setAppId(data.application_id ?? "N/A");
      setSubmitState("success");
    } catch {
      setSubmitError("Could not reach the server. Please check your connection and try again.");
      setSubmitState("idle");
    }
  };

  const subCategories = form.category ? CATEGORIES[form.category] ?? [] : [];
  const delay = (n: number) => ({ style: { transitionDelay: `${n * 0.05}s` } });

  return (
    <div className="min-h-screen bg-slate-50 font-[Plus_Jakarta_Sans,system-ui,sans-serif]">

      <FocusedHeader source={sourceContext} cta={{ href: sourceContext.trackUrl, label: "Track Idea" }} />
      <MobileBackButton />

      <div>
        <div className="max-w-3xl mx-auto flex items-center justify-end gap-2 px-4 pt-4 sm:px-6">
          <BackendBadge status={backendStatus} />
        </div>
        {/* ── Hero Banner ──────────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-4">
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible"
            className="rounded-3xl bg-gradient-to-br from-[#EAF2FB] to-[#FFF5D6] border border-[#BFD7EA] px-6 py-8 sm:px-10 sm:py-10 text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Submit Your Idea</h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto mb-6">
              Share your idea, concept, prototype, sketch, document, or proposal for review.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { icon: Sparkles, label: "Free to submit" },
                { icon: Lock,     label: "Confidential"   },
                { icon: Shield,   label: "No account needed" },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 bg-white/80 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                  <Icon className="w-3.5 h-3.5 text-[#002B5C]" />
                  {label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Form ─────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} noValidate className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 space-y-5">

          {/* §1 — Applicant Details */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" {...delay(1)}>
            <SectionCard num={1} title="Applicant Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name" required error={errors.fullName}>
                  <input type="text" placeholder="e.g. Priya Sharma" value={form.fullName}
                    onChange={(e) => set("fullName", e.target.value)}
                    className={errors.fullName ? errorInputCls : inputCls} data-error={errors.fullName ? "true" : undefined} />
                </Field>
                <Field label="Phone Number" required error={errors.phone}>
                  <input type="tel" placeholder="+91 98765 43210" value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    className={errors.phone ? errorInputCls : inputCls} data-error={errors.phone ? "true" : undefined} />
                </Field>
                <Field label="Email Address" required error={errors.email}>
                  <input type="email" placeholder="you@example.com" value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={errors.email ? errorInputCls : inputCls} data-error={errors.email ? "true" : undefined} />
                </Field>
                <Field label="Age" hint="Optional - needed for K-12 / minor pathway detection">
                  <input type="number" placeholder="e.g. 17" min={5} max={110} value={form.age}
                    onChange={(e) => set("age", e.target.value)} className={inputCls} />
                </Field>
                <Field label="Gender" hint="Optional">
                  <select value={form.gender} onChange={(e) => set("gender", e.target.value)} className={inputCls}>
                    <option value="">— Select —</option>
                    {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </Field>
                <Field label="Preferred Language" hint="Language you are most comfortable in">
                  <select value={form.preferredLanguage} onChange={(e) => set("preferredLanguage", e.target.value)} className={inputCls}>
                    <option value="">— Select —</option>
                    {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </Field>
                <Field label="City / Village / District" required error={errors.city}>
                  <input type="text" placeholder="e.g. Mysuru" value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    className={errors.city ? errorInputCls : inputCls} data-error={errors.city ? "true" : undefined} />
                </Field>
                <Field label="State" hint="Optional">
                  <input type="text" placeholder="e.g. Karnataka" value={form.state}
                    onChange={(e) => set("state", e.target.value)} className={inputCls} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Organization / School / College / Startup / Institution" hint="Optional">
                    <input type="text" placeholder="e.g. IIT Mysuru, Self-employed, JSS High School" value={form.organization}
                      onChange={(e) => set("organization", e.target.value)} className={inputCls} />
                  </Field>
                </div>
              </div>
            </SectionCard>
          </motion.div>

          {/* §2 — Applicant Type */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" {...delay(2)}>
            <SectionCard num={2} title="Applicant Type" required>
              <div data-error={errors.applicantType ? "true" : undefined}>
                <OptionGrid options={APPLICANT_TYPES} value={form.applicantType}
                  onChange={setApplicantType} />
                {errors.applicantType && (
                  <p className="flex items-center gap-1 text-xs text-rose-500 mt-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />{errors.applicantType}
                  </p>
                )}
                <AnimatePresence>
                  {isTeamSubmission && (
                    <motion.div
                      key="team-fields"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="mt-5 rounded-2xl border border-[#BFD7EA] bg-[#EAF2FB]/70 p-4"
                    >
                      <div className="mb-4 flex items-start gap-2.5">
                        <Users className="mt-0.5 h-4 w-4 shrink-0 text-[#002B5C]" />
                        <p className="text-xs leading-relaxed text-[#002B5C]">
                          Add the team name and all member names. Member 1 should be the main applicant or team lead.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Team Name" required error={errors.teamName}>
                          <input
                            type="text"
                            placeholder="e.g. Solar Innovators"
                            value={form.teamName}
                            onChange={(e) => set("teamName", e.target.value)}
                            className={errors.teamName ? errorInputCls : inputCls}
                            data-error={errors.teamName ? "true" : undefined}
                          />
                        </Field>
                        <Field
                          label="Total Team Members"
                          required
                          hint={`${MIN_TEAM_MEMBERS}-${MAX_TEAM_MEMBERS} members`}
                          error={errors.teamMemberCount}
                        >
                          <input
                            type="number"
                            min={MIN_TEAM_MEMBERS}
                            max={MAX_TEAM_MEMBERS}
                            placeholder="e.g. 3"
                            value={form.teamMemberCount}
                            onChange={(e) => setTeamMemberCount(e.target.value)}
                            className={errors.teamMemberCount ? errorInputCls : inputCls}
                            data-error={errors.teamMemberCount ? "true" : undefined}
                          />
                        </Field>
                        {form.teamMemberNames.map((name, idx) => (
                          <Field
                            key={idx}
                            label={idx === 0 ? "Member 1 / Team Lead Name" : `Member ${idx + 1} Name`}
                            required
                            error={idx === 0 ? errors.teamMemberNames : undefined}
                          >
                            <input
                              type="text"
                              placeholder={idx === 0 ? "Main applicant / team lead" : "Team member name"}
                              value={name}
                              onChange={(e) => setTeamMemberName(idx, e.target.value)}
                              className={errors.teamMemberNames ? errorInputCls : inputCls}
                              data-error={errors.teamMemberNames && idx === 0 ? "true" : undefined}
                            />
                          </Field>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </SectionCard>
          </motion.div>

          {/* §3 — Program / Submission Track */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" {...delay(3)}>
            <SectionCard num={3} title="Program / Submission Track" required>
              <div data-error={errors.programTrack ? "true" : undefined}>
                <OptionGrid options={PROGRAM_TRACKS} value={form.programTrack}
                  onChange={(v) => set("programTrack", v)} cols={2} />
                {errors.programTrack && (
                  <p className="flex items-center gap-1 text-xs text-rose-500 mt-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />{errors.programTrack}
                  </p>
                )}
              </div>
            </SectionCard>
          </motion.div>

          {/* §4 — Guardian Details (conditional) */}
          <AnimatePresence>
            {showGuardian && (
              <motion.div
                key="guardian"
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: EASE } }}
                exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.25 } }}
              >
                <SectionCard num={4} title="Parent / Guardian Details" badge="K-12 / Minor">
                  {/* Minor-specific note */}
                  {isMinor && (
                    <div className="mb-3 flex items-start gap-2.5 rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3">
                      <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-rose-700 leading-relaxed font-medium">
                        Applicants below 18 are treated under the K-12 / minor submission pathway and require parent or guardian consent. All guardian fields below are mandatory.
                      </p>
                    </div>
                  )}
                  <div className="mb-4 flex items-start gap-2.5 rounded-2xl bg-[#FFF5D6] border border-[#D4A017]/30 px-4 py-3">
                    <UserCheck className="w-4 h-4 text-[#002B5C] mt-0.5 shrink-0" />
                    <p className="text-xs text-[#002B5C] leading-relaxed">
                      {isMinor
                        ? "Guardian details and consent are required. The applicant's type will be submitted as K-12 Student and program track as K-12 / School Innovation regardless of selection above."
                        : "This section appears because the applicant selected Student type or K-12 / School Innovation track. Guardian details are recommended but not mandatory for adults."}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Parent / Guardian Full Name" required={guardianRequired} error={errors.guardianName}>
                      <input type="text" placeholder="Guardian's full name" value={form.guardianName}
                        onChange={(e) => set("guardianName", e.target.value)}
                        className={errors.guardianName ? errorInputCls : inputCls}
                        data-error={errors.guardianName ? "true" : undefined} />
                    </Field>
                    <Field label="Relationship to Applicant" required={guardianRequired} hint={guardianRequired ? undefined : "e.g. Father, Mother, Guardian"} error={errors.guardianRelationship}>
                      <input type="text" placeholder="e.g. Mother" value={form.guardianRelationship}
                        onChange={(e) => set("guardianRelationship", e.target.value)}
                        className={errors.guardianRelationship ? errorInputCls : inputCls}
                        data-error={errors.guardianRelationship ? "true" : undefined} />
                    </Field>
                    <Field label="Guardian Phone" required={guardianRequired} error={errors.guardianPhone}>
                      <input type="tel" placeholder="+91 98765 43210" value={form.guardianPhone}
                        onChange={(e) => set("guardianPhone", e.target.value)}
                        className={errors.guardianPhone ? errorInputCls : inputCls}
                        data-error={errors.guardianPhone ? "true" : undefined} />
                    </Field>
                    <Field label="Guardian Email" hint="Optional">
                      <input type="email" placeholder="guardian@example.com" value={form.guardianEmail}
                        onChange={(e) => set("guardianEmail", e.target.value)} className={inputCls} />
                    </Field>
                    <div className="sm:col-span-2">
                      <ConsentBox
                        checked={form.guardianConsent}
                        onToggle={() => set("guardianConsent", !form.guardianConsent)}
                        title={guardianRequired
                          ? <><span>Parent / Guardian Consent</span> <span className="text-rose-500">*</span></>
                          : "Parent / Guardian Consent (recommended)"
                        }
                        body="I, the parent or legal guardian of the applicant, give my full consent for the submission of this idea on behalf of the minor. I confirm the information provided is accurate and I take responsibility for the applicant's participation in this program."
                        error={errors.guardianConsent}
                      />
                    </div>
                  </div>
                </SectionCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* §5 — Idea Details */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" {...delay(4)}>
            <SectionCard num={5} title="Idea Details">
              <div className="flex flex-col gap-4">
                <Field label="Idea Title" required error={errors.ideaTitle}>
                  <input type="text" placeholder="Give your idea a clear, catchy name" value={form.ideaTitle}
                    onChange={(e) => set("ideaTitle", e.target.value)}
                    className={errors.ideaTitle ? errorInputCls : inputCls}
                    data-error={errors.ideaTitle ? "true" : undefined} />
                </Field>
                <Field label="Problem Statement" required hint="Describe the problem or gap you are addressing." error={errors.problemStatement}>
                  <textarea rows={4} placeholder="What problem are you solving? Who is affected?"
                    value={form.problemStatement} onChange={(e) => set("problemStatement", e.target.value)}
                    className={`${errors.problemStatement ? errorInputCls : inputCls} resize-none`}
                    data-error={errors.problemStatement ? "true" : undefined} />
                </Field>
                <Field label="Solution / Innovation Description" required hint="Explain your idea and how it addresses the problem." error={errors.solutionDescription}>
                  <textarea rows={5} placeholder="Describe your solution in detail…"
                    value={form.solutionDescription} onChange={(e) => set("solutionDescription", e.target.value)}
                    className={`${errors.solutionDescription ? errorInputCls : inputCls} resize-none`}
                    data-error={errors.solutionDescription ? "true" : undefined} />
                </Field>
                <Field label="Who will benefit from this idea?" required hint="Who are the primary users or beneficiaries?" error={errors.targetUsers}>
                  <textarea rows={3} placeholder="e.g. Smallholder farmers in Karnataka, urban students aged 12–18…"
                    value={form.targetUsers} onChange={(e) => set("targetUsers", e.target.value)}
                    className={`${errors.targetUsers ? errorInputCls : inputCls} resize-none`}
                    data-error={errors.targetUsers ? "true" : undefined} />
                </Field>
                <Field label="Where and how can this idea be used?" hint="Optional — describe real-world applications or settings.">
                  <textarea rows={3} placeholder="e.g. Rural villages without reliable electricity, school classrooms…"
                    value={form.applicationContext} onChange={(e) => set("applicationContext", e.target.value)}
                    className={`${inputCls} resize-none`} />
                </Field>
                <Field label="What makes your idea new or different?" hint="Optional — highlight what is unique about your approach.">
                  <textarea rows={3} placeholder="e.g. Uses locally available materials, no internet required, costs under ₹500…"
                    value={form.uniqueness} onChange={(e) => set("uniqueness", e.target.value)}
                    className={`${inputCls} resize-none`} />
                </Field>
              </div>
            </SectionCard>
          </motion.div>

          {/* §6 — Innovation Category */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" {...delay(5)}>
            <SectionCard num={6} title="Innovation Category">
              <div className="flex flex-col gap-4">
                <Field label="Category" required error={errors.category}>
                  <select value={form.category}
                    onChange={(e) => { set("category", e.target.value); set("subCategory", ""); }}
                    className={errors.category ? errorInputCls : inputCls}
                    data-error={errors.category ? "true" : undefined}>
                    <option value="">— Select a category —</option>
                    {Object.keys(CATEGORIES).map((cat) => (
                      <option key={cat} value={cat}>{CATEGORY_LABELS[cat] ?? cat}</option>
                    ))}
                  </select>
                </Field>
                {form.category && subCategories.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
                    <Field label="Sub-category" hint="Optional — pick the closest match">
                      <select value={form.subCategory} onChange={(e) => set("subCategory", e.target.value)} className={inputCls}>
                        <option value="">— Select a sub-category —</option>
                        {subCategories.map((sub) => <option key={sub} value={sub}>{sub}</option>)}
                      </select>
                    </Field>
                  </motion.div>
                )}
              </div>
            </SectionCard>
          </motion.div>

          {/* §7 — Prototype / Development Status */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" {...delay(6)}>
            <SectionCard num={7} title="Prototype / Development Status" required>
              <div className="flex flex-col gap-3" data-error={errors.prototypeStatus ? "true" : undefined}>
                {PROTOTYPE_OPTIONS.map(({ value, label, sub }) => {
                  const selected = form.prototypeStatus === value;
                  return (
                    <button key={value} type="button" onClick={() => set("prototypeStatus", value)}
                      className={`text-left rounded-2xl border-2 px-5 py-4 transition ${
                        selected ? "border-[#D4A017] bg-[#FFF5D6]" : "border-slate-200 bg-white hover:border-[#BFD7EA]"
                      }`}>
                      <p className={`text-sm font-semibold ${selected ? "text-[#002B5C]" : "text-slate-800"}`}>{label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                    </button>
                  );
                })}
                {errors.prototypeStatus && (
                  <p className="flex items-center gap-1 text-xs text-rose-500">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />{errors.prototypeStatus}
                  </p>
                )}
              </div>
            </SectionCard>
          </motion.div>

          {/* §8 — Support Needed */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" {...delay(7)}>
            <SectionCard num={8} title="Support Needed">
              <p className="text-xs text-slate-400 mb-4">Select all types of support you're looking for (optional).</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SUPPORT_OPTIONS.map((option) => {
                  const checked = form.supportNeeded.includes(option);
                  return (
                    <button key={option} type="button" onClick={() => toggleSupport(option)}
                      className={`text-left rounded-xl border px-4 py-3 text-sm transition ${
                        checked ? "border-[#D4A017] bg-[#FFF5D6] text-[#002B5C] font-medium" : "border-slate-200 bg-white text-slate-700 hover:border-[#BFD7EA]"
                      }`}>
                      <span className={`inline-block w-4 h-4 rounded border mr-2 align-middle transition ${checked ? "bg-[#002B5C] border-[#002B5C]" : "border-slate-300 bg-white"}`}>
                        {checked && (
                          <svg viewBox="0 0 10 8" fill="none" className="w-full h-full p-0.5">
                            <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>
            </SectionCard>
          </motion.div>

          {/* §9 — Supporting Files */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" {...delay(8)}>
            <SectionCard num={9} title="Supporting Files">
              <div className="rounded-2xl border border-[#BFD7EA] bg-[#EAF2FB] px-5 py-4">
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#BFD7EA] bg-white px-4 py-6 text-center transition hover:border-[#D4A017]">
                  <Paperclip className="h-5 w-5 text-[#002B5C]" aria-hidden="true" />
                  <span className="text-sm font-semibold text-[#002B5C]">Upload supporting files</span>
                  <span className="text-xs leading-5 text-slate-500">
                    PDF, DOC, images, audio, video, sketches, or prototype proof. Max 50 MB per file.
                  </span>
                  <input
                    type="file"
                    multiple
                    accept={SUPPORTING_FILE_ACCEPT}
                    className="sr-only"
                    onChange={(e) => {
                      addSupportingFiles(e.target.files);
                      e.currentTarget.value = "";
                    }}
                  />
                </label>
                {fileError && (
                  <p className="mt-3 flex items-center gap-1 text-xs text-rose-600">
                    <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    {fileError}
                  </p>
                )}
                {supportingFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {supportingFiles.map((file, index) => (
                      <div key={`${file.name}-${index}`} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
                        <Paperclip className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
                          <p className="text-xs text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSupportingFile(index)}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </SectionCard>
          </motion.div>

          {/* §10 — Consent & Declaration */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" {...delay(9)}>
            <SectionCard num={10} title="Consent & Declaration">
              <div className="flex flex-col gap-3">
                <ConsentBox
                  checked={form.consentData} onToggle={() => set("consentData", !form.consentData)}
                  title={<>Data Processing Consent <span className="text-rose-500">*</span></>}
                  body="I consent to NMF-IFIA collecting, storing, and processing the information submitted in this form for the purpose of evaluating my innovation idea and facilitating relevant support services. My data will be handled in accordance with applicable data protection regulations."
                  error={errors.consentData}
                />
                <ConsentBox
                  checked={form.consentOriginal} onToggle={() => set("consentOriginal", !form.consentOriginal)}
                  title={<>Originality Declaration <span className="text-rose-500">*</span></>}
                  body="I declare that the idea submitted is my original work (or developed by my team). It does not infringe upon any existing patents, copyrights, or intellectual property rights. I take full responsibility for the authenticity of the content provided."
                  error={errors.consentOriginal}
                />
                <ConsentBox
                  checked={form.consentContact} onToggle={() => set("consentContact", !form.consentContact)}
                  title={<>Contact Permission <span className="text-rose-500">*</span></>}
                  body="I agree to be contacted by NMF-IFIA representatives and partner organisations via the phone number and email provided, for follow-up on my submission, evaluation feedback, mentorship opportunities, or programme communications."
                  error={errors.consentContact}
                />
              </div>
            </SectionCard>
          </motion.div>

          {/* Submit */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" {...delay(10)}>
            <button type="submit" disabled={submitState === "submitting"}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#002B5C] hover:bg-[#003d82] disabled:bg-[#BFD7EA] text-white font-semibold text-base px-6 py-4 transition shadow-lg shadow-[#002B5C]/20">
              {submitState === "submitting" ? (
                <><Loader2 className="w-5 h-5 animate-spin" />Submitting…</>
              ) : (
                <><Sparkles className="w-5 h-5" />Submit My Idea</>
              )}
            </button>

            {submitError && (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" aria-hidden="true" />
                <p className="text-sm text-rose-700">{submitError}</p>
              </div>
            )}

            <p className="text-center text-xs text-slate-400 mt-3">
              By submitting you agree to the consents declared above.
            </p>
          </motion.div>
        </form>
      </div>

      {/* ── Success Overlay ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {submitState === "success" && (
          <motion.div
            key="success-overlay"
            variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 z-50 bg-white/95 backdrop-blur flex items-center justify-center px-4"
          >
            <motion.div
              variants={successCardVariants} initial="hidden" animate="visible" exit="exit"
              className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 text-center"
            >
              <div className="flex justify-center mb-5">
                <span className="flex items-center justify-center w-16 h-16 rounded-full bg-[#EAF2FB]">
                  <CheckCircle2 className="w-8 h-8 text-[#002B5C]" />
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Idea Submitted!</h2>
              <p className="text-slate-500 text-sm mb-5">
                Thank you for sharing your innovation with the NMF-IFIA community.
              </p>
              <div className="bg-[#EAF2FB] border border-[#BFD7EA] rounded-2xl px-5 py-4 mb-5">
                <p className="text-xs text-[#002B5C] font-semibold uppercase tracking-wider mb-1">Application ID</p>
                <p className="text-2xl font-bold text-[#002B5C] tracking-widest">{appId}</p>
                <p className="text-xs text-slate-400 mt-1">Save this ID — you will need it to track your idea.</p>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mb-6">
                <Users className="w-3.5 h-3.5 text-[#002B5C]" />
                Confirmation sent to <span className="font-medium text-slate-700">{form.email}</span>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <a href={sourceContext.trackUrl}
                  className="inline-flex items-center gap-2 border border-[#BFD7EA] bg-[#EAF2FB] text-[#002B5C] font-semibold text-sm px-5 py-3 rounded-xl transition hover:bg-[#daeaf5]">
                  Track My Idea
                </a>
                <a
                  href={sourceContext.homeUrl}
                  target={sourceContext.isExternalHome ? "_blank" : undefined}
                  rel={sourceContext.isExternalHome ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-2 bg-[#002B5C] hover:bg-[#003d82] text-white font-semibold text-sm px-5 py-3 rounded-xl transition shadow-lg shadow-[#002B5C]/20">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <PublicSiteFooter />
    </div>
  );
}
