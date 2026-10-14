import {
  Award,
  Building2,
  Globe2,
  GraduationCap,
  Lightbulb,
  Network,
  Users,
  UserPlus,
  Zap,
  MapPin,
  FlaskConical,
  Cpu,
  Rocket,
  GraduationCap as GradCap,
  BookOpen,
  Factory,
} from "lucide-react";
import type { CollaborationCard, FormData } from "../types";

export { Award };

export const sectionNav = [
  { id: "hero", label: "Home" },
  { id: "who-can-submit", label: "Who Can Apply" },
  { id: "submit-methods", label: "Submission" },
  { id: "evaluation", label: "Review Process" },
  { id: "why-mysuru", label: "Innovation Hub" },
  { id: "membership", label: "Membership" },
  { id: "register-interest", label: "Register" },
];

export const initialFormData: FormData = {
  fullName: "",
  email: "",
  phone: "",
  memberType: "Innovator / Individual",
  areaOfInterest: "",
  message: "",
};

export const membershipTypes = [
  {
    title: "Innovator / Individual",
    desc: "For grassroots innovators, independent thinkers, and early-stage creators from Mysuru Region.",
    Icon: Lightbulb,
    color: "navy",
    bg: "bg-[#EAF2FB]",
    iconBg: "bg-[#EAF2FB]",
    iconColor: "text-[#002B5C]",
    border: "border-[#BFD7EA]",
  },
  {
    title: "Student Member",
    desc: "For students who want to explore innovation, contribute to community work, and grow.",
    Icon: GraduationCap,
    color: "gold",
    bg: "bg-[#FFF5D6]",
    iconBg: "bg-[#FFF5D6]",
    iconColor: "text-[#002B5C]",
    border: "border-[#D4A017]/30",
  },
  {
    title: "Institutional Member",
    desc: "For colleges, organizations, and institutions looking to collaborate locally.",
    Icon: Building2,
    color: "navy2",
    bg: "bg-[#EAF2FB]",
    iconBg: "bg-[#EAF2FB]",
    iconColor: "text-[#003B73]",
    border: "border-[#BFD7EA]",
  },
  {
    title: "Ecosystem / Partner",
    desc: "For ecosystem players and supporters who want to contribute and build together.",
    Icon: Network,
    color: "navy3",
    bg: "bg-[#FFF5D6]",
    iconBg: "bg-[#FFF5D6]",
    iconColor: "text-[#002B5C]",
    border: "border-[#D4A017]/30",
  },
];

export const benefits = [
  "Priority updates on membership, programs, and community activities",
  "Invitations to member-focused events, gatherings, and engagement sessions",
  "Visibility within a growing local innovation community",
  "Stronger networking with innovators, institutions, and ecosystem partners",
  "Access pathways to relevant opportunities, showcases, and structured initiatives",
  "Recognition and participation within a Mysuru-first innovation network",
  "Regular communication on programs, collaborations, and future initiatives",
  "Early connection to wider IFIA Bharat and global ecosystem pathways",
];

export const ifiaOfferings = [
  "Funding support pathways and ecosystem access",
  "Mentorship, training, and workshops",
  "International exposure through IFIA's global network",
  "Patent facilitation and intellectual property guidance",
  "Technical validation and commercialization support",
  "Innovation challenges, showcases, and structured events",
  "Technology transfer and innovation ecosystem connections",
  "Access to certification, recognition, and title-based pathways",
];

export const invHighlights = [
  "Formal recognition for inventors and innovators",
  "Eligibility via patent, IFIA award, or official recommendation",
  "International exposure through the IFIA ecosystem",
];

export const missionVision = [
  {
    title: "IFIA Bharat Mission",
    text: "To foster a culture of innovation that empowers individuals and organizations to create impactful solutions.",
    Icon: Zap,
    color: "text-[#002B5C]",
    bg: "bg-[#EAF2FB]",
  },
  {
    title: "IFIA Bharat Vision",
    text: "To establish India as a global leader in innovation and entrepreneurship.",
    Icon: Globe2,
    color: "text-[#002B5C]",
    bg: "bg-[#FFF5D6]",
  },
  {
    title: "NMF Approach",
    text: "To build a strong Mysuru-first platform where local participation, community action, and innovation opportunities come together with purpose.",
    Icon: MapPin,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
];

export const mysuruEcosystem = [
  {
    Icon: GradCap,
    label: "Universities & Colleges",
    value: "25+",
    desc: "University of Mysore (est. 1916), NIT Mysuru, JSS institutions, Vidyavardhaka group, and 20+ affiliated colleges.",
    color: "navy",
    iconBg: "bg-[#EAF2FB]",
    iconColor: "text-[#002B5C]",
  },
  {
    Icon: FlaskConical,
    label: "Research Institutes",
    value: "8+",
    desc: "CFTRI (Central Food Technological Research Institute), CSIR-CFTRI, DFRL — world-class R&D in food, defense, and materials science.",
    color: "gold",
    iconBg: "bg-[#FFF5D6]",
    iconColor: "text-[#002B5C]",
  },
  {
    Icon: Rocket,
    label: "Space & Defense",
    value: "ISRO",
    desc: "LPSC (Liquid Propulsion Systems Centre) and ISAC facilities near Mysuru Region — making the city part of India's space journey.",
    color: "indigo",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-700",
  },
  {
    Icon: Cpu,
    label: "Tech Industry",
    value: "500+ cos",
    desc: "Infosys (founding campus), L&T Infotech, Wipro, and a growing base of tech SMEs operating from Hebbal IT Park and beyond.",
    color: "navy2",
    iconBg: "bg-[#EAF2FB]",
    iconColor: "text-[#003B73]",
  },
  {
    Icon: BookOpen,
    label: "Innovation Culture",
    value: "Heritage+Tech",
    desc: "Palace city with centuries of cultural heritage meeting modern education — a unique creative tension that fuels original thinking.",
    color: "amber",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
  },
  {
    Icon: Factory,
    label: "Traditional Industries",
    value: "Silk & More",
    desc: "World-renowned silk industry, sandalwood, agarbathi manufacturing — traditional innovation waiting to be digitised and scaled.",
    color: "rose",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-700",
  },
];

export const mysuruStats = [
  { value: 25, suffix: "+", label: "Universities & Colleges" },
  { value: 8, suffix: "+", label: "Research Institutes" },
  { value: 500, suffix: "+", label: "Tech Companies" },
  { value: 1916, suffix: "", label: "Year UoM Founded" },
];

export const whyMysuruReasons = [
  {
    title: "Untapped local potential",
    text: "Many innovators and students in Mysuru Region have ideas but lack exposure, direction, and access to structured ecosystems.",
    featured: false,
  },
  {
    title: "Access gap",
    text: "Opportunities exist nationally and globally, but they are often not reachable or visible at the local level.",
    featured: false,
  },
  {
    title: "Need for a local bridge",
    text: "NMF creates that bridge — making participation easier, more human, and grounded in the local context.",
    featured: true,
  },
  {
    title: "Community-first approach",
    text: "Instead of top-down systems, we focus on building a community where people engage, learn, and grow together.",
    featured: false,
  },
  {
    title: "Stronger together",
    text: "When local participation increases, it becomes easier to connect Mysuru Region to national and global ecosystems meaningfully.",
    featured: false,
  },
  {
    title: "Sustainable growth",
    text: "Starting local ensures consistency, trust, and long-term impact rather than one-time exposure.",
    featured: false,
  },
];

export const journeySteps = [
  {
    step: "01",
    title: "Register your interest",
    text: "Share your details and tell us how you would like to engage with NMF.",
    detail: "Fill in the registration form with your name, role, and area of interest. Takes under 2 minutes.",
    Icon: UserPlus,
    color: "navy",
    iconBg: "bg-[#EAF2FB]",
    iconColor: "text-[#002B5C]",
    border: "border-[#BFD7EA]",
    glowColor: "rgba(0,43,92,0.3)",
  },
  {
    step: "02",
    title: "Connect locally",
    text: "Receive updates, participate in community activities, and start engaging through Mysuru-first opportunities.",
    detail: "Attend NMF events, join community calls, and start building relationships within Mysuru's innovation network.",
    Icon: Users,
    color: "gold",
    iconBg: "bg-[#FFF5D6]",
    iconColor: "text-[#002B5C]",
    border: "border-[#D4A017]/40",
    glowColor: "rgba(212,160,23,0.3)",
  },
  {
    step: "03",
    title: "Grow into wider pathways",
    text: "As the ecosystem expands, members can move toward larger programs, recognition pathways, and collaborations.",
    detail: "Access IFIA Bharat programs, apply for INV Title recognition, and connect to the global IFIA network.",
    Icon: Globe2,
    color: "indigo",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-700",
    border: "border-indigo-300",
    glowColor: "rgba(99,102,241,0.3)",
  },
];

export const collaborationCards: CollaborationCard[] = [
  {
    title: "NMF",
    subtitle: "Less speech. More reach.",
    image: "/mnf-logo.png",
    alt: "NMF logo",
    description:
      "NMF is a Mysuru-first Section 8 platform focused on local participation, community engagement, collaboration, and building accessible pathways into larger innovation ecosystems.",
    highlights: [
      "Local access point for Mysuru",
      "Community-led engagement and hosting",
      "Institutional and ecosystem collaboration",
    ],
    websiteLabel: "Visit NMF",
    website: "https://nammamysorefoundation.org/",
    color: "emerald",
  },
  {
    title: "IFIA Bharat",
    subtitle: "Empowering innovators across India",
    image: "/ifia-bharat-logo.png",
    alt: "IFIA Bharat logo",
    description:
      "IFIA Bharat is positioned as a national innovation platform supporting inventors, innovators, recognition pathways, ecosystem-building, events, and access to a wider global network.",
    highlights: [
      "Innovation programs and structured events",
      "Recognition pathways like INV Title",
      "National access with global alignment",
    ],
    websiteLabel: "Visit IFIA Bharat",
    website: "https://www.ifiabharat.com/about/ifia-bharat",
    color: "cyan",
  },
  {
    title: "IFIA Global",
    subtitle: "Global network of inventors since 1968",
    image: "/ifia-global-logo.png",
    alt: "IFIA Global logo",
    description:
      "IFIA Global connects inventors, associations, exhibitions, and innovation ecosystems across countries, creating international recognition and collaboration opportunities.",
    highlights: [
      "International inventor network",
      "Global exhibitions and recognition",
      "Cross-border ecosystem connections",
    ],
    websiteLabel: "Visit IFIA Global",
    website: "https://ifia.com/",
    color: "indigo",
  },
  {
    title: "ABIPIR (Brazil)",
    subtitle: "International association partner",
    image: null,
    alt: "ABIPIR logo placeholder",
    description:
      "ABIPIR represents an international association layer in this collaboration, strengthening the wider global context and helping connect local participation to broader innovation relationships.",
    highlights: [
      "International association presence",
      "Wider ecosystem credibility",
      "Cross-border collaboration context",
    ],
    websiteLabel: "Website coming soon",
    website: "#",
    color: "violet",
  },
  {
    title: "Pratyagra Foundation",
    subtitle: "Incubation partner",
    image: "/pratyagra-foundation-logo.svg",
    alt: "Pratyagra Foundation logo",
    description:
      "Pratyagra Foundation strengthens the collaboration through incubation support, outreach, and shared commitment to meaningful innovation impact.",
    highlights: [
      "Incubation and outreach support",
      "Partner-led collaboration strength",
      "Shared focus on accessible innovation",
    ],
    websiteLabel: "Visit Pratyagra",
    website: "https://pratyagrafoundation.org/",
    color: "gold",
  },
  {
    title: "Akshaya Ahara Foundation",
    subtitle: "Community partner",
    image: "/aaf-logo.jpg",
    alt: "Akshaya Ahara Foundation logo",
    description:
      "Akshaya Ahara Foundation supports community care and local social impact through its outreach work.",
    highlights: [
      "Community-focused support",
      "Local outreach and impact",
      "Local social impact collaboration",
    ],
    websiteLabel: "Visit Akshaya Ahara",
    website: "https://www.akshayaaahara.org/",
    color: "orange",
  },
];

export const ecoNodes = [
  {
    id: "mysuru",
    label: "Mysuru Region",
    sub: "Local base",
    bg: "bg-slate-50",
    border: "border-slate-300",
    text: "text-slate-800",
    dot: "bg-slate-400",
    dotHex: "#94a3b8",
    x: 50,
    y: 75,
  },
  {
    id: "nmf",
    label: "NMF",
    sub: "Local bridge",
    bg: "bg-[#EAF2FB]",
    border: "border-[#002B5C]",
    text: "text-[#002B5C]",
    dot: "bg-[#002B5C]",
    dotHex: "#002B5C",
    x: 25,
    y: 30,
  },
  {
    id: "ifia-bharat",
    label: "IFIA Bharat",
    sub: "National platform",
    bg: "bg-[#FFF5D6]",
    border: "border-[#D4A017]",
    text: "text-[#002B5C]",
    dot: "bg-[#D4A017]",
    dotHex: "#D4A017",
    x: 50,
    y: 5,
  },
  {
    id: "ifia-global",
    label: "IFIA Global",
    sub: "Global network",
    bg: "bg-indigo-50",
    border: "border-indigo-400",
    text: "text-indigo-900",
    dot: "bg-indigo-500",
    dotHex: "#6366f1",
    x: 75,
    y: 30,
  },
  {
    id: "abipir",
    label: "ABIPIR",
    sub: "Brazil partner",
    bg: "bg-[#EAF2FB]",
    border: "border-[#003B73]",
    text: "text-[#003B73]",
    dot: "bg-[#003B73]",
    dotHex: "#003B73",
    x: 90,
    y: 70,
  },
];

export const ecoConnections = [
  { from: "mysuru", to: "nmf" },
  { from: "nmf", to: "ifia-bharat" },
  { from: "ifia-bharat", to: "ifia-global" },
  { from: "ifia-global", to: "abipir" },
  { from: "nmf", to: "ifia-global" },
];

// ─── Innovation Hub story data ────────────────────────────────────────────
// Wodeyar timeline beats (Section 3)
export interface WodeyarBeat {
  year: number;
  title: string;
  caption: string;
}
export const wodeyarTimeline: WodeyarBeat[] = [
  {
    year: 1881,
    title: "Representative Assembly established.",
    caption: "One of India's earliest deliberative bodies — a system of voice, not just rule.",
  },
  {
    year: 1902,
    title: "First Indian state with hydroelectric power.",
    caption: "Shivanasamudra project — engineering as public infrastructure.",
  },
  {
    year: 1916,
    title: "University of Mysore founded.",
    caption: "Public higher education built from scratch, not borrowed.",
  },
];

// Audience tiles (Section 6)
export type AudienceMood = "cool" | "emerald" | "amber" | "indigo" | "rose" | "warm" | "modern" | "heritage";

export interface AudienceTile {
  key: string;
  title: string;
  oneLine: string;
  imagePath: string;
  videoSrc?: string; // optional future video loop
  accent: string;
  mood: AudienceMood;
}
export const audienceList: AudienceTile[] = [
  { key: "students",    title: "Students",            oneLine: "From a school project to a research thesis.", imagePath: "/innovation-hub/audience/students.jpg",    accent: "#06b6d4", mood: "cool"     },
  { key: "farmers",     title: "Farmers",             oneLine: "A field-tested fix counts as innovation.",     imagePath: "/innovation-hub/audience/farmers.jpg",     accent: "#10b981", mood: "emerald"  },
  { key: "makers",      title: "Makers",              oneLine: "Built it in a garage? Submit it.",             imagePath: "/innovation-hub/audience/makers.jpg",      accent: "#D4A017", mood: "amber"    },
  { key: "researchers", title: "Researchers",         oneLine: "Lab work that should reach the world.",         imagePath: "/innovation-hub/audience/researchers.jpg", accent: "#6366f1", mood: "indigo"   },
  { key: "startups",    title: "Startups",            oneLine: "Early-stage product, no funding yet.",          imagePath: "/innovation-hub/audience/startups.jpg",    accent: "#a78bfa", mood: "indigo"   },
  { key: "teachers",    title: "Teachers",            oneLine: "Classroom innovations that change learning.",   imagePath: "/innovation-hub/audience/teachers.jpg",    accent: "#f0c040", mood: "warm"     },
  { key: "grassroots",  title: "Grassroots innovators", oneLine: "Community fixes, civic ideas, public good.",  imagePath: "/innovation-hub/audience/grassroots.jpg",  accent: "#2dd4bf", mood: "emerald"  },
  { key: "ngos",        title: "NGOs & community groups", oneLine: "Programs that are ready to scale.",         imagePath: "/innovation-hub/audience/ngos.jpg",        accent: "#fb7185", mood: "rose"     },
];

// Support pillars (Section 8)
export interface SupportPillar {
  key: string;
  title: string;
  tagline: string;
  body: string;
  imagePath: string;
  videoSrc?: string;
  accent: string;
  mood: "warm" | "cool" | "indigo" | "emerald" | "amber" | "modern";
}
export const pillarList: SupportPillar[] = [
  {
    key: "mentorship",
    title: "Mentorship",
    tagline: "People who have already walked the path.",
    body: "Subject-matter mentors review your idea and give direction. Periodic check-ins, no fixed format.",
    imagePath: "/innovation-hub/support/mentorship.jpg",
    accent: "#D4A017",
    mood: "warm",
  },
  {
    key: "prototype",
    title: "Prototype support",
    tagline: "From concept to something you can hold.",
    body: "Access to maker spaces, labs, and partner facilities for selected ideas.",
    imagePath: "/innovation-hub/support/prototype.jpg",
    videoSrc: "/innovation-hub/video/support-showcase-loop.mp4",
    accent: "#06b6d4",
    mood: "cool",
  },
  {
    key: "review",
    title: "Expert review",
    tagline: "A jury that takes your idea seriously.",
    body: "Field-specific jury evaluation. Honest feedback. Documented recommendations.",
    imagePath: "/innovation-hub/support/review.jpg",
    accent: "#6366f1",
    mood: "indigo",
  },
  {
    key: "ip",
    title: "IP & patent guidance",
    tagline: "Protect what you build.",
    body: "Guidance on IP basics, patent filing pathways, and confidentiality through the review process.",
    imagePath: "/innovation-hub/support/ip-guidance.jpg",
    accent: "#10b981",
    mood: "emerald",
  },
  {
    key: "exhibition",
    title: "Exhibitions & showcase",
    tagline: "Visibility you cannot buy.",
    body: "Selected ideas reach exhibitions, demo days, and recognition forums — local to international.",
    imagePath: "/innovation-hub/support/exhibition.jpg",
    accent: "#f0c040",
    mood: "amber",
  },
  {
    key: "collaboration",
    title: "Collaboration network",
    tagline: "The right introduction at the right time.",
    body: "Partner institutions, mentors, sponsors, and IFIA-linked networks open as the idea matures.",
    imagePath: "/innovation-hub/support/collaboration.jpg",
    accent: "#2dd4bf",
    mood: "modern",
  },
];

// Idea format glyphs (Section 7) — labels only; glyph rendered inline
export interface IdeaFormat {
  key: string;
  label: string;
}
export const formatList: IdeaFormat[] = [
  { key: "online",   label: "Online form" },
  { key: "pdf",      label: "PDF / document" },
  { key: "sketch",   label: "Sketch / drawing" },
  { key: "voice",    label: "Voice recording" },
  { key: "video",    label: "Video clip" },
  { key: "photo",    label: "Photo of prototype" },
  { key: "offline",  label: "Offline paper form" },
  { key: "walkin",   label: "Local centre walk-in" },
];
