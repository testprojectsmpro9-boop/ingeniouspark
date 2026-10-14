import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { CheckCircle2, Loader2 } from "lucide-react";
import { fadeUp } from "../types";
import type { FormData, SubmitState } from "../types";
import { membershipTypes, initialFormData } from "../data";
import TypeWriter from "./TypeWriter";
import { API_BASE_URL } from "../config";

function FormField({ id, label, required = false, children }: {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);

  const onFocus = () => {
    gsap.to(wrapRef.current, { boxShadow: "0 0 0 3px rgba(212,160,23,0.28)", duration: 0.22, ease: "power2.out" });
    gsap.to(labelRef.current, { color: "#D4A017", x: 3, duration: 0.2, ease: "power2.out" });
  };
  const onBlur = () => {
    gsap.to(wrapRef.current, { boxShadow: "0 0 0 0px rgba(212,160,23,0)", duration: 0.3, ease: "power2.out" });
    gsap.to(labelRef.current, { x: 0, duration: 0.3, ease: "power2.out", clearProps: "color" });
  };

  return (
    <div onFocus={onFocus} onBlur={onBlur}>
      <label ref={labelRef} htmlFor={id} className="mb-2 block text-sm font-medium text-slate-200">
        {label} {required && <span className="text-[#D4A017]">*</span>}
      </label>
      <div ref={wrapRef} className="rounded-2xl">
        {children}
      </div>
    </div>
  );
}

function getInquiryScope(formData: FormData) {
  const text = `${formData.memberType} ${formData.areaOfInterest} ${formData.message}`.toLowerCase();

  if (/\b(k-?12|school)\b/.test(text)) {
    return {
      program_track: "K12",
      visibility_scope: "LOCAL_ONLY",
      source_program: "NMF_K12",
    };
  }

  if (/\b(local|regional|mysuru|mysore)\b/.test(text)) {
    return {
      program_track: "LOCAL_REGIONAL",
      visibility_scope: "LOCAL_ONLY",
      source_program: "NMF_LOCAL",
    };
  }

  return {
    program_track: "NATIONAL_INTERNATIONAL",
    visibility_scope: "GLOBAL_AND_LOCAL",
    source_program: "IFIA_AFFILIATE",
  };
}

export default function RegisterSection() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [formError, setFormError] = useState("");

  const canSubmit = submitState !== "submitting";

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setFormError("");
  };

  const handleSubmit = async () => {
    if (submitState === "submitting") return;

    const fullName = formData.fullName.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const message = formData.message.trim();

    if (!fullName) {
      setFormError("Please enter your full name.");
      return;
    }
    if (!email && !phone) {
      setFormError("Please enter either your email or phone number.");
      return;
    }
    if (!message) {
      setFormError("Please add a short message.");
      return;
    }

    setSubmitState("submitting");
    setFormError("");

    const areaOfInterest = formData.areaOfInterest.trim();
    const payload = {
      inquiry_type: "REGISTER_INTEREST",
      full_name: fullName,
      email,
      phone,
      organization: "",
      interest_area: formData.memberType,
      message: areaOfInterest
        ? `Area of interest: ${areaOfInterest}\n\n${message}`
        : message,
      source_page: "public_register_interest",
      ...getInquiryScope(formData),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/public/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      setSubmitState("success");
      setFormData(initialFormData);
    } catch {
      setFormError("We could not submit your interest right now. Please try again in a moment.");
      setSubmitState("idle");
    }
  };

  return (
    <section id="register-interest" className="relative overflow-hidden bg-[#02111f]/85 px-5 py-16 text-white sm:px-6 sm:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#06b6d4]/40 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[#06b6d4]/5 blur-3xl" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start"
        >
          {/* Left */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#D4A017]">
              <TypeWriter text="Signal reception" />
            </p>
            <h2 className="mt-4 text-3xl font-bold">
              <TypeWriter text="Send your spark into IngeniousPark" delay={0.3} />
            </h2>
            <p className="mt-5 max-w-xl text-slate-300">
              Become part of a growing Mysuru-first innovation community. Share your details to receive
              early updates on membership, programs, events, and opportunities.
            </p>
            <div className="mt-8 space-y-3">
              {[
                "Membership updates and early access notifications",
                "Relevant opportunities based on your role and interest",
                "A clear local starting point before wider ecosystem engagement",
              ].map((text) => (
                <div key={text} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D4A017]" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form
            className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur md:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit();
            }}
          >
            <AnimatePresence mode="wait">
              {submitState === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring" as const, stiffness: 200, damping: 20 }}
                  className="flex flex-col items-center py-12 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D4A017]/20">
                    <CheckCircle2 className="h-8 w-8 text-[#D4A017]" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-white">Interest noted!</h3>
                  <p className="mt-3 max-w-xs text-sm text-slate-400">
                    Thank you. Our team will contact you soon.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitState("idle")}
                    className="mt-8 rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
                  >
                    Submit another
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      { id: "full-name", label: "Full name", key: "fullName" as const, type: "text", placeholder: "Enter your name", required: true },
                      { id: "email", label: "Email", key: "email" as const, type: "email", placeholder: "Enter your email", required: false },
                      { id: "phone", label: "Phone", key: "phone" as const, type: "tel", placeholder: "Enter your phone number", required: false },
                    ].map((field) => (
                      <FormField key={field.id} id={field.id} label={field.label} required={field.required}>
                        <input
                          id={field.id}
                          type={field.type}
                          value={formData[field.key]}
                          onChange={(e) => updateField(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#D4A017]"
                        />
                      </FormField>
                    ))}
                    <FormField id="member-type" label="Member type">
                      <select
                        id="member-type"
                        value={formData.memberType}
                        onChange={(e) => updateField("memberType", e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#D4A017]"
                      >
                        {membershipTypes.map((m) => <option key={m.title}>{m.title}</option>)}
                      </select>
                    </FormField>
                    <div className="md:col-span-2">
                      <FormField id="area-of-interest" label="Area of interest">
                        <input
                          id="area-of-interest"
                          type="text"
                          value={formData.areaOfInterest}
                          onChange={(e) => updateField("areaOfInterest", e.target.value)}
                          placeholder="Membership, events, collaboration, INV Title, partnerships"
                          className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#D4A017]"
                        />
                      </FormField>
                    </div>
                    <div className="md:col-span-2">
                      <FormField id="message" label="Message" required>
                        <textarea
                          id="message"
                          rows={4}
                          value={formData.message}
                          onChange={(e) => updateField("message", e.target.value)}
                          placeholder="Tell us how you would like to engage with IngeniousPark"
                          className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#D4A017]"
                        />
                      </FormField>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs leading-6 text-slate-400">Membership fee details announced soon. Priority updates for interest submissions.</p>
                      {formError && (
                        <p className="mt-2 text-sm font-medium text-rose-300" role="alert">
                          {formError}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className="magnetic-btn inline-flex min-w-[160px] items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {submitState === "submitting" ? (
                        <><Loader2 className="h-4 w-4 animate-spin" />Submitting…</>
                      ) : "Submit interest"}
                    </button>
                  </div>
                  <AnimatePresence>
                    {submitState === "submitting" && (
                      <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.4, ease: "easeInOut" }}
                        className="mt-4 h-1 origin-left rounded-full bg-gradient-to-r from-[#002B5C] via-[#D4A017] to-[#003B73]"
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
