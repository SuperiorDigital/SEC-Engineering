# Implementation Plan for SEC Website Redesign

## Overview
This document outlines the implementation plan for the SEC website redesign project. The project involves building a React frontend with Next.js and integrating it with a headless WordPress backend. The frontend will be served locally on `http://localhost:3009` during development.

---

## Stack
- [ ] **Frontend:** React 18+ with Next.js
- [ ] **Backend:** WordPress (headless) with REST API
- [ ] **Hosting:** Local development on `http://localhost:3009`
- [ ] **Key Libraries:**
  - [ ] Axios (API calls)
  - [ ] Framer Motion (animations)
  - [ ] React Hook Form (form handling)
  - [ ] React Lightbox (image galleries)

---

## Execution Phases

### Phase 1: Frontend Architecture (Days 1–2)
- [ ] Initialize Next.js app
- [ ] Set up global layout, navigation, and footer
- [ ] Implement design tokens:
  - [ ] Color palette (teal, gray, light mode only)
  - [ ] Typography (headings, body text, spacing)
  - [ ] Responsive grid system (12-column, mobile-first)
- [ ] Configure localhost to run on `http://localhost:3009`

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
- [ ] Build a central API client for WordPress REST API
- [ ] Map WordPress responses to frontend models
- [ ] Implement category filtering and featured/archive logic
- [ ] Add caching and revalidation strategies
- [ ] Handle loading and error states
- [ ] Implement authenticated content update workflow:
  - [ ] Project create/update endpoint support (text + metadata)
  - [ ] Media upload workflow for hero/gallery images
  - [ ] Link uploaded media to project ACF fields
  - [ ] Publish/unpublish update capability
- [ ] Add optional WP-CLI admin workflow:
  - [ ] Define bulk import/update script approach for projects and images
  - [ ] Document when to use API vs WP-CLI

### Phase 4: Page Development (Days 3–5)
- [ ] Build the following pages and components:
  - [ ] **Homepage:** Hero section, featured projects, services overview, statistics, CTA
  - [ ] **About Us:** Company overview, team grid with modals for bios
  - [ ] **Services:** Mechanical, Electrical, Plumbing pages
  - [ ] **Projects:**
    - [ ] Main portfolio page with category filters
    - [ ] Project detail pages with galleries and related projects
  - [ ] **Careers:** Job application form with resume upload
  - [ ] **Contact:** Office info, Google Maps, minimal contact form
  - [ ] **Hidden Page:** `/llm-context` for AI optimization

### Phase 5: Forms, SEO, Accessibility (Days 6–7)
- [ ] Implement forms:
  - [ ] Careers form (resume upload, validation, email notifications)
  - [ ] Contact form (minimal fields, validation)
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
- [ ] Fully functional React frontend integrated with WordPress backend
- [ ] Responsive, mobile-first design
- [ ] Optimized performance (Lighthouse 90+)
- [ ] Accessible and SEO-friendly website
- [ ] Clear content management workflow for the client
- [ ] Documented workflow for updating project text and images via REST API, with optional WP-CLI bulk workflow

---

## Timeline
- [ ] **Total Duration:** 7 days
- [ ] **Phase Breakdown:**
  - [ ] Days 1–2: Architecture, design system, WordPress setup
  - [ ] Days 3–5: Core pages and API integration
  - [ ] Days 6–7: Forms, optimization, QA, launch

---

## Next Steps
1. [ ] Initialize Next.js app and configure localhost.
2. [ ] Set up WordPress content model with CPTs, taxonomies, and ACF fields.
3. [ ] Configure authenticated REST write workflow for project content and media.
4. [ ] Define optional WP-CLI bulk update workflow and documentation.
5. [ ] Begin building core pages and components.