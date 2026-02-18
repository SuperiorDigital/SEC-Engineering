import { google } from "googleapis";

const DEFAULT_SHEET_ID = "1BumOnqpe_018pL0fz-ZpLvOp_vpKZoWR6o2ndjhjAOI";
const DEFAULT_TAB_NAME = "Submissions";

const SUBMISSION_COLUMNS = [
  "submitted_at",
  "submission_type",
  "name",
  "email",
  "phone",
  "position",
  "license_status",
  "years_experience",
  "cover_message",
  "resume_name",
  "resume_type",
  "resume_size",
  "project_type",
  "message",
  "note",
] as const;

type SubmissionColumn = (typeof SUBMISSION_COLUMNS)[number];

type AppendSheetRowParams = {
  values: Array<string | number | boolean | null | undefined>;
};

type AppendSubmissionRowParams = {
  row: Partial<Record<SubmissionColumn, string | number | boolean>>;
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getPrivateKey(): string {
  const rawKey = getRequiredEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY");
  return rawKey.replace(/\\n/g, "\n");
}

export async function appendSheetRow({ values }: AppendSheetRowParams): Promise<void> {
  const clientEmail = getRequiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = getPrivateKey();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID || DEFAULT_SHEET_ID;
  const tabName = process.env.GOOGLE_SHEET_TAB_NAME || DEFAULT_TAB_NAME;

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await ensureSubmissionHeaders(sheets, spreadsheetId, tabName);

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${tabName}!A:Z`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [values.map((value) => (value == null ? "" : value))],
    },
  });
}

async function ensureSubmissionHeaders(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  tabName: string
): Promise<void> {
  const read = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${tabName}!A1:O1`,
  });

  const existing = read.data.values?.[0] ?? [];
  const matches = SUBMISSION_COLUMNS.every(
    (column, index) => (existing[index] || "") === column
  );

  if (matches) {
    return;
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${tabName}!A1:O1`,
    valueInputOption: "RAW",
    requestBody: {
      values: [Array.from(SUBMISSION_COLUMNS)],
    },
  });
}

export async function appendSubmissionRow({
  row,
}: AppendSubmissionRowParams): Promise<void> {
  const orderedValues = SUBMISSION_COLUMNS.map((column) => row[column] ?? "");
  await appendSheetRow({ values: orderedValues });
}
