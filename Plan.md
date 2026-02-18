# Implementation Plan for SEC Website Redesign

## Overview
This document outlines the implementation plan for the SEC website redesign project. The project involves building a React frontend with Next.js and integrating it with a headless WordPress backend. The frontend will be served locally on `http://localhost:3009` during development.

---

## Stack
- [x] **Frontend:** React + Next.js App Router
- [x] **Backend:** WordPress (headless) with REST API
- [x] **Hosting:** Local development on `http://localhost:3009`
- [x] **Key Libraries in use:**
  - [x] Next.js built-in `fetch` (API calls)
  - [x] Google APIs SDK (`googleapis`) for Sheets integration

---

## Execution Phases

### Phase 1: Frontend Architecture (Days 1–2)
- [x] Initialize Next.js app
- [x] Set up global layout, navigation, and footer
- [x] Implement design tokens:
  - [x] Color palette (teal, gray, light mode only)
  - [x] Typography (headings, body text, spacing)
  - [x] Responsive grid system (12-column, mobile-first)
- [x] Configure localhost to run on `http://localhost:3009`

### Phase 2: WordPress Content Model (Days 1–2)
- [x] Create custom post types (CPTs):
  - [x] Projects
  - [x] Team Members
  - [x] Services
- [x] Define custom taxonomies:
  - [x] Project Categories (Federal, State, etc.)
  - [x] Service Types
- [x] Add Advanced Custom Fields (ACF) for:
  - [x] Project details (e.g., location, completion date, gallery images)
  - [x] Team member bios (e.g., credentials, notable projects)
  - [x] Service capabilities (e.g., key certifications, related projects)
  - [x] Careers toggle (e.g., active job postings)
- [x] Configure ACF and CPTs for REST API write support:
  - [x] Expose required project fields in REST responses
  - [x] Ensure project text fields are writable via authenticated API calls
  - [x] Ensure hero/gallery media relationships are writable via API

### Phase 3: API Integration Layer (Days 3–5)
- [x] Build a central API client for WordPress REST API
- [x] Map WordPress responses to frontend models
- [x] Implement category filtering and featured/archive logic
- [x] Add caching and revalidation strategies
- [x] Handle loading and error states
- [x] Implement authenticated content update workflow:
  - [x] Project create/update endpoint support (text + metadata)
  - [x] Media upload workflow for hero/gallery images
  - [x] Link uploaded media to project ACF fields
  - [x] Publish/unpublish update capability
- [x] Add optional WP-CLI admin workflow:
  - [x] Define bulk import/update script approach for projects and images
  - [x] Document when to use API vs WP-CLI

### Phase 4: Page Development (Days 3–5)
- [x] Build the following pages and components:
  - [x] **Homepage:** Hero section, featured projects, services overview, statistics, CTA
  - [x] **About Us:** Company overview, team grid with modals for bios
  - [x] **Services:** Mechanical, Electrical, Plumbing pages
  - [x] **Projects:**
    - [x] Main portfolio page with category filters
    - [x] Project detail pages with galleries and related projects
  - [x] **Careers:** Job application form with resume upload
  - [x] **Contact:** Office info, Google Maps, minimal contact form
  - [x] **Hidden Page:** `/llm-context` for AI optimization

### Phase 5: Forms, SEO, Accessibility (Days 6–7)
- [x] Implement forms:
  - [x] Careers form (resume upload, validation, Google Sheets pipeline)
  - [x] Contact form (minimal fields, validation)
- [ ] Optimize for SEO:
  - [ ] Meta tags, Open Graph, schema markup
  - [ ] XML sitemap, robots.txt
- [ ] Ensure WCAG 2.1 AA compliance:
  - [ ] Keyboard navigation, focus indicators, color contrast
  - [ ] Alt text for images, ARIA labels

### Phase 6: QA, Performance, Launch Checklist (Days 6–7)
- [ ] Run pre-launch testing:
  - [ ] Cross-browser and mobile testing
  - [ ] Lighthouse performance checks (90+ score)
  - [ ] Verify image optimization (WebP, lazy loading)
- [ ] Execute launch checklist:
  - [ ] Content verification (team info, projects, services)
  - [ ] DNS cutover and post-launch monitoring

---

## Deliverables
- [x] Fully functional React frontend integrated with WordPress backend
- [x] Responsive, mobile-first design
- [ ] Optimized performance (Lighthouse 90+)
- [ ] Accessible and SEO-friendly website
- [x] Clear content management workflow for the client
- [x] Documented workflow for updating project text and images via REST API, with optional WP-CLI bulk workflow

---

## Timeline
- [ ] **Total Duration:** 7 days
- [ ] **Phase Breakdown:**
  - [ ] Days 1–2: Architecture, design system, WordPress setup
  - [ ] Days 3–5: Core pages and API integration
  - [ ] Days 6–7: Forms, optimization, QA, launch

---

## Next Steps
1. [ ] Run end-to-end production verification (Careers + Contact submissions to Google Sheet).
2. [ ] Complete SEO pass (metadata, OG, sitemap, robots).
3. [ ] Complete accessibility QA pass (WCAG 2.1 AA checklist).
4. [ ] Execute launch QA checklist (mobile/browser/performance/content).
5. [ ] Optional: add email notifications (Lorrie + applicant confirmation).

---

## Post-Launch Improvements (Optional)
- [ ] Add dedicated email notifications for submissions.
- [ ] Add reCAPTCHA or Turnstile for stronger bot protection.
- [ ] Add admin dashboard/reporting view for submissions.
- [ ] Add automated integration tests for API routes and form flows.