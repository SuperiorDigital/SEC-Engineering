"use client";

import { useMemo, useState } from "react";

type FieldErrors = Partial<
  Record<
    | "name"
    | "email"
    | "phone"
    | "position"
    | "licenseStatus"
    | "yearsExperience"
    | "resume",
    string
  >
>;

type FormState = {
  name: string;
  email: string;
  phone: string;
  position: string;
  licenseStatus: string;
  yearsExperience: string;
  coverMessage: string;
  resume: File | null;
};

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_BYTES = 10 * 1024 * 1024;

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  position: "",
  licenseStatus: "",
  yearsExperience: "",
  coverMessage: "",
  resume: null,
};

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhone(value: string): boolean {
  return /^[0-9()+\-\s.]{7,}$/.test(value);
}

export function CareersApplicationForm() {
  const [startedAt] = useState<string>(() => String(Date.now()));
  const [website, setWebsite] = useState("");
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const resumeSummary = useMemo(() => {
    if (!form.resume) {
      return "";
    }
    return `${form.resume.name} (${Math.ceil(form.resume.size / 1024)} KB)`;
  }, [form.resume]);

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
  }

  function validate(current: FormState): FieldErrors {
    const next: FieldErrors = {};

    if (!current.name.trim()) {
      next.name = "Name is required.";
    }

    if (!current.email.trim()) {
      next.email = "Email is required.";
    } else if (!isEmail(current.email.trim())) {
      next.email = "Enter a valid email address.";
    }

    if (!current.phone.trim()) {
      next.phone = "Phone is required.";
    } else if (!isPhone(current.phone.trim())) {
      next.phone = "Enter a valid phone number.";
    }

    if (!current.position) {
      next.position = "Position is required.";
    }

    if (!current.licenseStatus) {
      next.licenseStatus = "License status is required.";
    }

    if (!current.yearsExperience.trim()) {
      next.yearsExperience = "Years of experience is required.";
    } else {
      const years = Number(current.yearsExperience);
      if (Number.isNaN(years) || years < 0 || years > 70) {
        next.yearsExperience = "Enter a value between 0 and 70.";
      }
    }

    if (!current.resume) {
      next.resume = "Resume file is required.";
    } else if (!ACCEPTED_TYPES.includes(current.resume.type)) {
      next.resume = "Resume must be PDF, DOC, or DOCX.";
    } else if (current.resume.size > MAX_FILE_BYTES) {
      next.resume = "Resume must be 10MB or smaller.";
    }

    return next;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);
    setIsSuccess(false);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = new FormData();
      payload.append("name", form.name.trim());
      payload.append("email", form.email.trim());
      payload.append("phone", form.phone.trim());
      payload.append("position", form.position);
      payload.append("licenseStatus", form.licenseStatus);
      payload.append("yearsExperience", form.yearsExperience.trim());
      payload.append("coverMessage", form.coverMessage.trim());
      payload.append("website", website);
      payload.append("startedAt", startedAt);
      if (form.resume) {
        payload.append("resume", form.resume);
      }

      const response = await fetch("/api/careers-application", {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error || "Unable to submit application.");
      }

      setIsSuccess(true);
      setForm(initialState);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unexpected error while submitting application."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-4 md:grid-cols-2" noValidate>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="career-website">Website</label>
        <input
          id="career-website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      <div className="md:col-span-1">
        <label htmlFor="career-name" className="text-sm font-semibold text-foreground">
          Name
        </label>
        <input
          id="career-name"
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
          className="mt-2 w-full rounded-[var(--radius-md)] border border-border px-3 py-2"
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name ? <p className="mt-1 text-xs text-red-700">{errors.name}</p> : null}
      </div>

      <div className="md:col-span-1">
        <label htmlFor="career-email" className="text-sm font-semibold text-foreground">
          Email
        </label>
        <input
          id="career-email"
          type="email"
          value={form.email}
          onChange={(event) => update("email", event.target.value)}
          className="mt-2 w-full rounded-[var(--radius-md)] border border-border px-3 py-2"
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email ? <p className="mt-1 text-xs text-red-700">{errors.email}</p> : null}
      </div>

      <div className="md:col-span-1">
        <label htmlFor="career-phone" className="text-sm font-semibold text-foreground">
          Phone
        </label>
        <input
          id="career-phone"
          value={form.phone}
          onChange={(event) => update("phone", event.target.value)}
          className="mt-2 w-full rounded-[var(--radius-md)] border border-border px-3 py-2"
          aria-invalid={Boolean(errors.phone)}
        />
        {errors.phone ? <p className="mt-1 text-xs text-red-700">{errors.phone}</p> : null}
      </div>

      <div className="md:col-span-1">
        <label htmlFor="career-position" className="text-sm font-semibold text-foreground">
          Position Interested In
        </label>
        <select
          id="career-position"
          value={form.position}
          onChange={(event) => update("position", event.target.value)}
          className="mt-2 w-full rounded-[var(--radius-md)] border border-border px-3 py-2"
          aria-invalid={Boolean(errors.position)}
        >
          <option value="">Select position</option>
          <option value="Mechanical">Mechanical</option>
          <option value="Electrical">Electrical</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Other">Other</option>
        </select>
        {errors.position ? <p className="mt-1 text-xs text-red-700">{errors.position}</p> : null}
      </div>

      <div className="md:col-span-1">
        <label htmlFor="career-license" className="text-sm font-semibold text-foreground">
          License Status
        </label>
        <select
          id="career-license"
          value={form.licenseStatus}
          onChange={(event) => update("licenseStatus", event.target.value)}
          className="mt-2 w-full rounded-[var(--radius-md)] border border-border px-3 py-2"
          aria-invalid={Boolean(errors.licenseStatus)}
        >
          <option value="">Select status</option>
          <option value="Licensed PE">Licensed PE</option>
          <option value="EIT">EIT</option>
          <option value="Unlicensed">Unlicensed</option>
        </select>
        {errors.licenseStatus ? (
          <p className="mt-1 text-xs text-red-700">{errors.licenseStatus}</p>
        ) : null}
      </div>

      <div className="md:col-span-1">
        <label htmlFor="career-years" className="text-sm font-semibold text-foreground">
          Years of Experience
        </label>
        <input
          id="career-years"
          type="number"
          min={0}
          max={70}
          value={form.yearsExperience}
          onChange={(event) => update("yearsExperience", event.target.value)}
          className="mt-2 w-full rounded-[var(--radius-md)] border border-border px-3 py-2"
          aria-invalid={Boolean(errors.yearsExperience)}
        />
        {errors.yearsExperience ? (
          <p className="mt-1 text-xs text-red-700">{errors.yearsExperience}</p>
        ) : null}
      </div>

      <div className="md:col-span-2">
        <label htmlFor="career-message" className="text-sm font-semibold text-foreground">
          Cover Message (Optional)
        </label>
        <textarea
          id="career-message"
          value={form.coverMessage}
          onChange={(event) => update("coverMessage", event.target.value)}
          className="mt-2 min-h-28 w-full rounded-[var(--radius-md)] border border-border px-3 py-2"
        />
      </div>

      <div className="md:col-span-2">
        <label htmlFor="career-resume" className="text-sm font-semibold text-foreground">
          Resume (PDF, DOC, DOCX)
        </label>
        <input
          id="career-resume"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(event) => update("resume", event.target.files?.[0] ?? null)}
          className="mt-2 w-full rounded-[var(--radius-md)] border border-border px-3 py-2"
          aria-invalid={Boolean(errors.resume)}
        />
        {resumeSummary ? <p className="mt-1 text-xs text-text-muted">{resumeSummary}</p> : null}
        {errors.resume ? <p className="mt-1 text-xs text-red-700">{errors.resume}</p> : null}
      </div>

      {submitError ? (
        <p className="md:col-span-2 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      ) : null}

      {isSuccess ? (
        <p className="md:col-span-2 rounded-[var(--radius-md)] border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          Application submitted successfully. Our team will contact you soon.
        </p>
      ) : null}

      <div className="md:col-span-2">
        <button type="submit" disabled={isSubmitting} className="button-primary">
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </form>
  );
}
