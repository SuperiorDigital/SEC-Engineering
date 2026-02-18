import { NextResponse } from "next/server";
import { appendSubmissionRow } from "@/lib/integrations/googleSheets";
import { runSubmissionGuards } from "@/lib/security/submissionGuard";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  projectType?: string;
  message?: string;
  website?: string;
  startedAt?: string;
};

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhone(value: string): boolean {
  return /^[0-9()+\-\s.]{7,}$/.test(value);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ContactPayload | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim();
  const projectType = (body.projectType || "").trim();
  const message = (body.message || "").trim();
  const website = (body.website || "").trim();
  const startedAt = (body.startedAt || "").trim();

  const guard = runSubmissionGuards({
    routeKey: "contact",
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

  if (!name || !email || !phone || !projectType || !message) {
    return NextResponse.json(
      { error: "Missing required fields for contact inquiry." },
      { status: 400 }
    );
  }

  if (!isEmail(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  if (!isPhone(phone)) {
    return NextResponse.json({ error: "Invalid phone number." }, { status: 400 });
  }

  const submittedAt = new Date().toISOString();

  try {
    await appendSubmissionRow({
      row: {
        submitted_at: submittedAt,
        submission_type: "contact_inquiry",
        name,
        email,
        phone,
        project_type: projectType,
        message,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Unable to write inquiry to Google Sheet: ${error.message}`
            : "Unable to write inquiry to Google Sheet.",
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
      projectType,
      messageLength: message.length,
    },
  });
}
