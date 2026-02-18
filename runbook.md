# CMS Update Runbook (Headless WordPress)

## Purpose
This runbook defines how to update project text and images in headless WordPress without touching frontend code. It supports:
- Primary path: WordPress REST API (recommended for day-to-day updates)
- Secondary path: WP-CLI (recommended for admin and bulk import/update)

## Scope
- Project content updates (title, slug, status, category, description, metadata)
- Project media updates (hero image, gallery images)
- Publish/unpublish workflow

## Required Inputs
- WordPress base URL (example: `https://cms.example.com`)
- API credentials with write access
- Project data (JSON/CSV)
- Image files with clear naming
- Confirmed custom post type slug: `projects`
- Confirmed field keys for ACF/meta mapping

---

## Authentication
Use one of the following for write operations:

1. Application Passwords (simple, built-in)
   - Generate for a dedicated service user with least privilege.
   - Use HTTP Basic auth for API requests.

2. JWT/OAuth (if already configured)
   - Use bearer token flow.
   - Rotate secrets/tokens and store in secure secrets manager.

Do not use anonymous write endpoints.

---

## REST API Workflow (Primary)

### Step 1: Upload image(s)
Upload hero and gallery images first so you can reference media IDs/URLs.

```bash
curl -u "WP_USER:APP_PASSWORD" \
  -X POST "https://cms.example.com/wp-json/wp/v2/media" \
  -H "Content-Disposition: attachment; filename=project-hero.jpg" \
  -H "Content-Type: image/jpeg" \
  --data-binary "@./images/project-hero.jpg"
```

Capture from response:
- `id` (media ID)
- `source_url` (image URL)

### Step 2: Create project record

```bash
curl -u "WP_USER:APP_PASSWORD" \
  -X POST "https://cms.example.com/wp-json/wp/v2/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Air Force Academy Visitor Center",
    "slug": "air-force-academy-visitor-center",
    "status": "draft",
    "featured_media": 456,
    "acf": {
      "location": "Colorado Springs, CO",
      "completion_date": "2024-06",
      "featured": true,
      "description": "Full project description",
      "hero_image": "https://cms.example.com/wp-content/uploads/2026/02/project-hero.jpg",
      "gallery_images": [
        "https://cms.example.com/wp-content/uploads/2026/02/gallery-1.jpg",
        "https://cms.example.com/wp-content/uploads/2026/02/gallery-2.jpg"
      ]
    }
  }'
```

### Step 3: Update existing project

```bash
curl -u "WP_USER:APP_PASSWORD" \
  -X POST "https://cms.example.com/wp-json/wp/v2/projects/123" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Project Name",
    "status": "draft",
    "acf": {
      "description": "Updated description",
      "completion_date": "2026-02"
    }
  }'
```

### Step 4: Publish or unpublish

Publish:
```bash
curl -u "WP_USER:APP_PASSWORD" \
  -X POST "https://cms.example.com/wp-json/wp/v2/projects/123" \
  -H "Content-Type: application/json" \
  -d '{"status":"publish"}'
```

Unpublish (set to draft):
```bash
curl -u "WP_USER:APP_PASSWORD" \
  -X POST "https://cms.example.com/wp-json/wp/v2/projects/123" \
  -H "Content-Type: application/json" \
  -d '{"status":"draft"}'
```

### Step 5: Verify frontend
- Load the project page in frontend.
- Confirm hero/gallery images and text render correctly.
- Confirm category filters still work.

---

## WP-CLI Workflow (Secondary / Bulk)
Use this path for large updates, migrations, or admin maintenance.

### Create project post
```bash
wp post create \
  --post_type=projects \
  --post_status=draft \
  --post_title="Air Force Academy Visitor Center" \
  --post_name="air-force-academy-visitor-center"
```

### Import hero image and attach
```bash
wp media import ./images/project-hero.jpg \
  --title="Air Force Academy Visitor Center Hero" \
  --post_id=123
```

### Set featured image
```bash
wp post meta update 123 _thumbnail_id 456
```

### Update core content fields
```bash
wp post update 123 --post_content="Full project description"
```

### Update ACF/meta fields (examples)
```bash
wp post meta update 123 location "Colorado Springs, CO"
wp post meta update 123 completion_date "2024-06"
wp post meta update 123 featured 1
```

### Publish/unpublish
```bash
wp post update 123 --post_status=publish
wp post update 123 --post_status=draft
```

### Bulk pattern (CSV-driven concept)
- Read each CSV row.
- Create/update post by slug.
- Import/attach media.
- Update ACF/meta keys.
- Publish only after validation.

---

## API vs WP-CLI Decision Guide
Use REST API when:
- Updating one/few projects from external systems
- Triggering updates from integrations or automations
- Non-admin operators need predictable endpoint workflow

Use WP-CLI when:
- Running bulk imports/one-time migrations
- Repairing metadata/media links at scale
- Admin/devops is operating directly on WP host

---

## Validation Checklist
Before publish:
- Title, slug, category, and status are correct
- Hero image loads and is optimized
- Gallery images are associated and ordered correctly
- ACF/meta fields map to frontend model
- Project card appears in correct category section

After publish:
- Frontend reflects changes without code deploy
- Lighthouse/perf impact acceptable
- No broken image URLs

---

## Security and Ops Notes
- Use least-privilege users for API/CLI workflows.
- Store credentials in environment secrets, never in repo.
- Keep an audit log of who changed what and when.
- Prefer draft-first updates, then publish after verification.
- Backup database/media before large bulk operations.

---

## Fast Start (Recommended)
1. Upload images via REST API (`/wp/v2/media`).
2. Create/update project via REST API (`/wp/v2/projects`).
3. Verify on frontend.
4. Publish.
5. Use WP-CLI only when doing bulk or admin-scale changes.
