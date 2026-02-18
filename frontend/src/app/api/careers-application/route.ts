import { NextResponse } from "next/server";
import { appendSubmissionRow } from "@/lib/integrations/googleSheets";
import { runSubmissionGuards } from "@/lib/security/submissionGuard";

const ACCEPTED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const MAX_FILE_BYTES = 10 * 1024 * 1024;

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhone(value: string): boolean {
  return /^[0-9()+\-\s.]{7,}$/.test(value);
}

export async function POST(request: Request) {
  const form = await request.formData();

  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const phone = String(form.get("phone") || "").trim();
  const position = String(form.get("position") || "").trim();
  const licenseStatus = String(form.get("licenseStatus") || "").trim();
  const yearsExperience = Number(String(form.get("yearsExperience") || "").trim());
  const coverMessage = String(form.get("coverMessage") || "").trim();
  const resume = form.get("resume");
  const website = String(form.get("website") || "");
  const startedAt = String(form.get("startedAt") || "");

  const guard = runSubmissionGuards({
    routeKey: "careers",
    request,
    honeypotValue: website,
    startedAt,
  });

  if (!guard.ok) {
    return NextResponse.json(
      { error: guard.error || "Submission rejected." },
      { status: guard.status || 400 }
    );
  }

  if (!name || !email || !phone || !position || !licenseStatus || Number.isNaN(yearsExperience)) {
    return NextResponse.json(
      { error: "Missing required fields for careers application." },
      { status: 400 }
    );
  }

  if (!isEmail(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  if (!isPhone(phone)) {
    return NextResponse.json({ error: "Invalid phone number." }, { status: 400 });
  }

  if (yearsExperience < 0 || yearsExperience > 70) {
    return NextResponse.json(
      { error: "Years of experience must be between 0 and 70." },
      { status: 400 }
    );
  }

  if (!(resume instanceof File)) {
    return NextResponse.json({ error: "Resume file is required." }, { status: 400 });
  }

  if (!ACCEPTED_TYPES.has(resume.type)) {
    return NextResponse.json(
      { error: "Resume must be PDF, DOC, or DOCX." },
      { status: 400 }
    );
  }

  if (resume.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { error: "Resume file must be 10MB or smaller." },
      { status: 400 }
    );
  }

  const submittedAt = new Date().toISOString();

  try {
    await appendSubmissionRow({
      row: {
        submitted_at: submittedAt,
        submission_type: "careers_application",
        name,
        email,
        phone,
        position,
        license_status: licenseStatus,
        years_experience: yearsExperience,
        cover_message: coverMessage,
        resume_name: resume.name,
        resume_type: resume.type,
        resume_size: resume.size,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Unable to write submission to Google Sheet: ${error.message}`
            : "Unable to write submission to Google Sheet.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    submittedAt,
    summary: {
      name,
      email,
      phone,
      position,
      licenseStatus,
      yearsExperience,
      hasCoverMessage: Boolean(coverMessage),
      resumeName: resume.name,
    },
  });
}
