import { NextResponse } from "next/server";
import { appendSubmissionRow } from "@/lib/integrations/googleSheets";

type TestPayload = {
  note?: string;
};

function getBearerToken(request: Request): string {
  const authHeader = request.headers.get("authorization") || "";
  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return "";
  }
  return token.trim();
}

export async function POST(request: Request) {
  const requiredToken = process.env.SHEETS_TEST_TOKEN;

  if (!requiredToken) {
    return NextResponse.json(
      { error: "SHEETS_TEST_TOKEN is not configured." },
      { status: 500 }
    );
  }

  const providedToken = getBearerToken(request);
  if (!providedToken || providedToken !== requiredToken) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as TestPayload | null;
  const note = (body?.note || "manual connectivity test").trim();
  const submittedAt = new Date().toISOString();

  try {
    await appendSubmissionRow({
      row: {
        submitted_at: submittedAt,
        submission_type: "sheets_connectivity_test",
        name: "system",
        email: "system@example.com",
        phone: "n/a",
        note,
      },
    });

    return NextResponse.json({
      success: true,
      submittedAt,
      message: "Test row appended to Google Sheet.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Failed to append test row: ${error.message}`
            : "Failed to append test row.",
      },
      { status: 500 }
    );
  }
}
