"use client";

import { useState } from "react";

type ContactErrors = Partial<
  Record<"name" | "email" | "phone" | "projectType" | "message", string>
>;

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
};

const initialState: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  projectType: "",
  message: "",
};

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhone(value: string): boolean {
  return /^[0-9()+\-\s.]{7,}$/.test(value);
}

export function ContactInquiryForm() {
  const [startedAt] = useState<string>(() => String(Date.now()));
  const [website, setWebsite] = useState("");
  const [form, setForm] = useState<ContactFormState>(initialState);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function update<K extends keyof ContactFormState>(
    field: K,
    value: ContactFormState[K]
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
  }

  function validate(current: ContactFormState): ContactErrors {
    const next: ContactErrors = {};

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

    if (!current.projectType) {
      next.projectType = "Project type is required.";
    }

    if (!current.message.trim()) {
      next.message = "Message is required.";
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
      const response = await fetch("/api/contact-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          projectType: form.projectType,
          message: form.message.trim(),
          website,
          startedAt,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error || "Unable to submit inquiry.");
      }

      setIsSuccess(true);
      setForm(initialState);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unexpected error while submitting inquiry."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-4 md:grid-cols-2" noValidate>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="contact-name" className="text-sm font-semibold text-foreground">
          Name
        </label>
        <input
          id="contact-name"
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
          className="mt-2 w-full rounded-[var(--radius-md)] border border-border px-3 py-2"
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name ? <p className="mt-1 text-xs text-red-700">{errors.name}</p> : null}
      </div>

      <div>
        <label htmlFor="contact-email" className="text-sm font-semibold text-foreground">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          value={form.email}
          onChange={(event) => update("email", event.target.value)}
          className="mt-2 w-full rounded-[var(--radius-md)] border border-border px-3 py-2"
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email ? <p className="mt-1 text-xs text-red-700">{errors.email}</p> : null}
      </div>

      <div>
        <label htmlFor="contact-phone" className="text-sm font-semibold text-foreground">
          Phone
        </label>
        <input
          id="contact-phone"
          value={form.phone}
          onChange={(event) => update("phone", event.target.value)}
          className="mt-2 w-full rounded-[var(--radius-md)] border border-border px-3 py-2"
          aria-invalid={Boolean(errors.phone)}
        />
        {errors.phone ? <p className="mt-1 text-xs text-red-700">{errors.phone}</p> : null}
      </div>

      <div>
        <label
          htmlFor="contact-project-type"
          className="text-sm font-semibold text-foreground"
        >
          Project Type
        </label>
        <select
          id="contact-project-type"
          value={form.projectType}
          onChange={(event) => update("projectType", event.target.value)}
          className="mt-2 w-full rounded-[var(--radius-md)] border border-border px-3 py-2"
          aria-invalid={Boolean(errors.projectType)}
        >
          <option value="">Select project type</option>
          <option value="Federal Government">Federal Government</option>
          <option value="State Government">State Government</option>
          <option value="Higher Education">Higher Education</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Physical Plant">Physical Plant</option>
          <option value="Other">Other</option>
        </select>
        {errors.projectType ? (
          <p className="mt-1 text-xs text-red-700">{errors.projectType}</p>
        ) : null}
      </div>

      <div className="md:col-span-2">
        <label htmlFor="contact-message" className="text-sm font-semibold text-foreground">
          Message
        </label>
        <textarea
          id="contact-message"
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
          className="mt-2 min-h-28 w-full rounded-[var(--radius-md)] border border-border px-3 py-2"
          aria-invalid={Boolean(errors.message)}
        />
        {errors.message ? (
          <p className="mt-1 text-xs text-red-700">{errors.message}</p>
        ) : null}
      </div>

      {submitError ? (
        <p className="md:col-span-2 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      ) : null}

      {isSuccess ? (
        <p className="md:col-span-2 rounded-[var(--radius-md)] border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          Inquiry submitted successfully. We will follow up shortly.
        </p>
      ) : null}

      <div className="md:col-span-2">
        <button type="submit" disabled={isSubmitting} className="button-primary">
          {isSubmitting ? "Submitting..." : "Submit Inquiry"}
        </button>
      </div>
    </form>
  );
}
