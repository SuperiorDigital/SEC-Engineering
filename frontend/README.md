This is the SEC frontend built with [Next.js](https://nextjs.org) as part of a headless WordPress + React architecture.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3009](http://localhost:3009) with your browser.

## Phase 1 Completed

- Base app architecture in place (App Router + global layout)
- Shared header/footer shell created
- Design tokens and utility classes established in global styles
- Primary and utility route placeholders created

## Next Phase

WordPress content modeling and REST integration layer setup.

## WordPress API Configuration (Phase 3)

Create `frontend/.env.local`:

```bash
WORDPRESS_BASE_URL=https://cms.example.com
WORDPRESS_API_USER=service_user
WORDPRESS_API_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
```

Notes:
- `WORDPRESS_BASE_URL` is required for read operations in the Next.js server components.
- `WORDPRESS_API_USER` and `WORDPRESS_API_APP_PASSWORD` are only required for authenticated write operations.
- Current integration layer is in `src/lib/wordpress/`:
	- `client.ts`: central WordPress REST client + authenticated write helper
	- `queries.ts`: model mapping, category grouping, featured/archive logic
	- `types.ts`: API/model types

## Google Sheets Submission Pipeline

Careers and Contact forms append rows to Google Sheets via server routes.

Add to `frontend/.env.local`:

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1BumOnqpe_018pL0fz-ZpLvOp_vpKZoWR6o2ndjhjAOI
GOOGLE_SHEET_TAB_NAME=Submissions
SHEETS_TEST_TOKEN=replace-with-a-long-random-token
```

Setup steps:
- Create a Google Cloud service account with Google Sheets API access.
- Share the target spreadsheet with the service account email (Editor access).
- Keep the private key in environment variables only; never commit it.
- Create a `Submissions` tab (or set `GOOGLE_SHEET_TAB_NAME` to your chosen tab).
- Header row is auto-initialized/normalized on write with columns:
	- `submitted_at`, `submission_type`, `name`, `email`, `phone`, `position`, `license_status`, `years_experience`, `cover_message`, `resume_name`, `resume_type`, `resume_size`, `project_type`, `message`, `note`

Server endpoints:
- `POST /api/careers-application` appends `careers_application` rows.
- `POST /api/contact-inquiry` appends `contact_inquiry` rows.

Submission protections:
- Per-IP rate limiting on submission endpoints.
- Honeypot field rejection for basic bot traffic.
- Minimum form-fill time guard to reduce instant bot posts.

Connectivity test endpoint:
- `POST /api/sheets-test` appends `sheets_connectivity_test` rows.
- Requires `Authorization: Bearer <SHEETS_TEST_TOKEN>`.

Quick test command:

```bash
curl -X POST http://localhost:3009/api/sheets-test \
	-H "Authorization: Bearer $SHEETS_TEST_TOKEN" \
	-H "Content-Type: application/json" \
	-d '{"note":"local verification"}'
```

## Build and Lint

```bash
npm run lint
npm run build
```
