# WordPress Phase 2 Setup (Content Model)

This folder contains the Phase 2 implementation for the SEC headless WordPress backend.

## Included
- Plugin: `sec-headless-content-model`
- Registers custom post types:
  - `projects`
  - `team_members`
  - `services`
- Registers taxonomies:
  - `project_category` (for projects)
  - `service_type` (for services)
- Registers REST-exposed custom field payloads via `acf` object:
  - Project details (location, completion date, featured, square footage, description, hero, gallery, services, related projects)
  - Team member profile fields
  - Service capabilities fields
- Adds careers toggle setting in WP admin + REST endpoint

## Install
1. Copy `wordpress/wp-content/plugins/sec-headless-content-model` into your WordPress `wp-content/plugins/` directory.
2. In WordPress admin, activate **SEC Headless Content Model**.
3. Visit **Settings > Permalinks** and click **Save Changes** once to flush rewrite rules.

## Careers Toggle
- Admin UI: `Settings > General > Careers Openings Enabled`
- REST endpoint:
  - `GET /wp-json/sec/v1/settings/careers`
  - `POST /wp-json/sec/v1/settings/careers` with body:
    ```json
    { "careers_openings_enabled": true }
    ```

## Example API calls
Create a project draft:
```bash
curl -u "WP_USER:APP_PASSWORD" \
  -X POST "https://cms.example.com/wp-json/wp/v2/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Air Force Academy Visitor Center",
    "slug":"air-force-academy-visitor-center",
    "status":"draft",
    "category":"federal-government",
    "acf":{
      "location":"Colorado Springs, CO",
      "completion_date":"2024-06",
      "featured":true,
      "square_footage":50000,
      "description":"Full project description",
      "hero_image":"https://cms.example.com/wp-content/uploads/2026/02/project-hero.jpg",
      "gallery_images":["https://cms.example.com/wp-content/uploads/2026/02/gallery-1.jpg"],
      "services":["mechanical","electrical"],
      "related_projects":[124,125]
    }
  }'
```

Publish project:
```bash
curl -u "WP_USER:APP_PASSWORD" \
  -X POST "https://cms.example.com/wp-json/wp/v2/projects/123" \
  -H "Content-Type: application/json" \
  -d '{"status":"publish"}'
```
