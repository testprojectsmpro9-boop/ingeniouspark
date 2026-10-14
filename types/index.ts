export type CollaborationCard = {
  title: string;
  subtitle: string;
  image: string | null;
  alt: string;
  description: string;
  highlights: string[];
  websiteLabel: string;
  website: string;
  directWebsite?: boolean;
  color: string;
};

export type FormData = {
  fullName: string;
  email: string;
  phone: string;
  memberType: string;
  areaOfInterest: string;
  message: string;
};

export type SubmitState = "idle" | "submitting" | "success";

export const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: EASE } },
};

export const slideRight = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
};

export const springModal = {
  hidden: { opacity: 0, scale: 0.92, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 220, damping: 22 },
  },
  exit: { opacity: 0, scale: 0.95, y: 16, transition: { duration: 0.2 } },
};

export const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: EASE } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.22 } },
};
