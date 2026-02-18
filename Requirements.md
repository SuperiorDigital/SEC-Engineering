# Website Design Requirements Document
**Client:** SEC/MEP Engineering Firm  
**Project:** Headless WordPress + React Frontend Redesign  
**Date:** February 17, 2026  
**Prepared by:** Superior Digital

## Executive Summary

This document outlines the complete requirements for redesigning an MEP (Mechanical, Electrical, Plumbing) engineering firm's website using a headless WordPress backend with React frontend. The client seeks a modern, warm, visual-first design that showcases their project portfolio and makes content updates simple and fast.

**Key Objectives:**
- Transform from "boring white" utilitarian design to warm, visual, professional aesthetic
- Make MEP systems and projects visually engaging despite technical subject matter
- Enable rapid content updates (24-hour turnaround for new projects)
- Optimize for mobile (57-58% of traffic expected from mobile devices)
- Direct contact to specific team members, not generic forms

## Site Map

### Primary Navigation

HOME
├── About Us
│   ├── Company Overview
│   └── Our Team (12 employees)
│
├── Services
│   ├── Mechanical Engineering
│   ├── Electrical Engineering
│   └── Plumbing Engineering
│
├── Projects
│   ├── Federal Government
│   │   ├── Featured Projects (2 showcase)
│   │   └── Project Archive (text list)
│   ├── State Government
│   │   ├── Featured Projects (2 showcase)
│   │   └── Project Archive (text list)
│   ├── Higher Education
│   │   ├── Featured Projects (2 showcase)
│   │   └── Project Archive (text list)
│   ├── Healthcare
│   │   ├── Featured Projects (2 showcase)
│   │   └── Project Archive (text list)
│   └── Physical Plant
│       ├── Featured Projects (2 showcase)
│       └── Project Archive (text list)
│
├── Careers
│   ├── Open Positions
│   └── Application Form (with resume upload)
│
└── Contact
    └── Office Information

### Secondary/Utility Pages

├── Privacy Policy
├── Terms of Service
└── /llm-context (hidden page for AI search optimization)

## Detailed Page Requirements

### 1. Homepage

**Purpose:** Create immediate visual impact, establish warm professional tone, showcase recent work

**Layout Sections:**

\begin{itemize}
\item \textbf{Hero Section}
  \begin{itemize}
  \item Large hero image or slow-moving image carousel (3-5 seconds per image)
  \item Company tagline overlaid on image
  \item Primary CTA button: "View Our Projects"
  \item Secondary CTA button: "Meet Our Team"
  \end{itemize}

\item \textbf{Introduction Section}
  \begin{itemize}
  \item Brief company overview (2-3 paragraphs)
  \item Emphasis on experience and project scope
  \item Warm, approachable tone (not overly technical)
  \end{itemize}

\item \textbf{Featured Projects Section}
  \begin{itemize}
  \item Display 3-4 recent/significant projects
  \item Each project card shows:
    \begin{itemize}
    \item Hero image (building exterior, NOT HVAC systems)
    \item Project name
    \item Category badge (Federal, State, Healthcare, etc.)
    \item Brief description (1-2 sentences)
    \item "View Project" link
    \end{itemize}
  \item Hover effect: image scales slightly, overlay appears
  \end{itemize}

\item \textbf{Services Overview Section}
  \begin{itemize}
  \item Three columns: Mechanical, Electrical, Plumbing
  \item Icon or image for each service
  \item Brief description
  \item "Learn More" link to Services page
  \end{itemize}

\item \textbf{Statistics/Achievements Section}
  \begin{itemize}
  \item Years in business
  \item Number of completed projects
  \item Number of team members
  \item Key certifications or achievements
  \end{itemize}

\item \textbf{Call-to-Action Section}
  \begin{itemize}
  \item Strong statement about working together
  \item Contact button or link to team page
  \end{itemize}
\end{itemize}

### 2. About Us - Company Overview

**Purpose:** Establish credibility, explain company values and approach

**Content Requirements:**

\begin{itemize}
\item Company history and founding
\item Core values and approach to projects
\item Why clients choose this firm over competitors
\item Team size and structure (12-person team, staying intentionally small)
\item Service area/geographic focus
\item Key differentiators
\end{itemize}

**Visual Elements:**

\begin{itemize}
\item Office photos or team in action (if available)
\item Company logo prominently displayed
\item Quote or testimonial from client (if available)
\end{itemize}

### 3. About Us - Our Team

**Purpose:** Humanize the company, provide direct contact to team members

**Layout:**

\begin{itemize}
\item Grid display of all 12 employees
\item Each team member card shows:
  \begin{itemize}
  \item Professional headshot photo
  \item Name
  \item Job title/role
  \item Key credentials (PE license, specialization)
  \item Direct email link (NOT contact form)
  \end{itemize}
\end{itemize}

**Interaction:**

\begin{itemize}
\item Click on team member card to expand/open modal with:
  \begin{itemize}
  \item Full bio (education, experience, specializations)
  \item Years with company
  \item Notable projects they've worked on
  \item Direct email button (opens default email client)
  \item LinkedIn link (optional)
  \end{itemize}
\end{itemize}

**Critical Requirement:** Email links MUST go directly to individual email addresses, not to general info@ address.

### 4. Services Pages

**Purpose:** Explain what the firm does in each discipline

**Structure (3 separate pages or tabs):**

\begin{enumerate}
\item Mechanical Engineering
\item Electrical Engineering
\item Plumbing Engineering
\end{enumerate}

**Content for Each Service Page:**

\begin{itemize}
\item Service overview description
\item Types of projects handled
\item Approach and methodology
\item Key capabilities and technologies
\item Relevant certifications
\item Link to related projects
\end{itemize}

**Visual Elements:**

\begin{itemize}
\item Mix of building exteriors and system images
\item Avoid overly technical system photos on main sections
\item Include before/after images if applicable
\item Diagrams or infographics explaining complex systems
\end{itemize}

### 5. Projects - Main Portfolio Page

**Purpose:** Organize and display project portfolio by category

**Navigation:**

\begin{itemize}
\item Category filter buttons at top:
  \begin{itemize}
  \item All Projects (default)
  \item Federal Government
  \item State Government
  \item Higher Education
  \item Healthcare
  \item Physical Plant
  \end{itemize}
\end{itemize}

**Project Display (per category):**

\begin{itemize}
\item \textbf{Featured/Showcase Projects (2 per category)}
  \begin{itemize}
  \item Large project cards with hero images
  \item Building exterior as primary image
  \item Project name and location
  \item Brief description (2-3 sentences)
  \item Click to view full project details
  \end{itemize}

\item \textbf{Project Archive List}
  \begin{itemize}
  \item Simple text list below featured projects
  \item Project name, location, year
  \item NO click-through (just listed for reference)
  \item Shows historical depth and experience
  \end{itemize}
\end{itemize}

**Total Showcase Projects:** 10 projects across all categories (5 categories × 2 projects each)

### 6. Individual Project Detail Pages

**Purpose:** Showcase significant projects with comprehensive detail

**Page Structure:**

\begin{itemize}
\item \textbf{Project Header}
  \begin{itemize}
  \item Project name
  \item Location
  \item Category badge
  \item Completion date
  \end{itemize}

\item \textbf{Hero Image}
  \begin{itemize}
  \item Large building exterior photo
  \item High-quality, optimized for fast loading
  \end{itemize}

\item \textbf{Project Overview Section}
  \begin{itemize}
  \item Client name (if allowed)
  \item Project scope and description
  \item Key challenges addressed
  \item Solutions provided
  \item Project outcome/impact
  \end{itemize}

\item \textbf{Project Details Table}
\end{itemize}

\begin{table}
\begin{tabular}{|l|l|}
\hline
\textbf{Attribute} & \textbf{Details} \\
\hline
Square Footage & [value] \\
\hline
Services Provided & Mechanical, Electrical, Plumbing \\
\hline
Project Duration & [months/years] \\
\hline
Budget Range & [if applicable] \\
\hline
Certifications & LEED, etc. \\
\hline
\end{tabular}
\caption{Project specifications table example}
\end{table}

\begin{itemize}
\item \textbf{Image Gallery}
  \begin{itemize}
  \item 5-10 images per project
  \item Mix: 60\% building exteriors/interiors, 40\% system photos
  \item Grid layout (3 columns on desktop, 2 on tablet, 1 on mobile)
  \item Lightbox functionality when clicked
  \item Navigation arrows in lightbox
  \item Captions for each image
  \end{itemize}

\item \textbf{Related Projects}
  \begin{itemize}
  \item 2-3 similar projects from same category
  \item Thumbnail, name, brief description
  \item Link to view those projects
  \end{itemize}
\end{itemize}

**Image Optimization Requirements:**

\begin{itemize}
\item All images optimized for web (WebP format preferred)
\item Responsive image sizes for different screen sizes
\item Lazy loading for images below fold
\item Maximum load time: 2 seconds for page
\end{itemize}

### 7. Careers Page

**Purpose:** Attract qualified engineering candidates

**Content:**

\begin{itemize}
\item Introduction to company culture
\item Why work here (benefits, projects, team size)
\item General positions typically hiring for:
  \begin{itemize}
  \item Licensed Mechanical Engineers
  \item Licensed Electrical Engineers
  \item Unlicensed Engineers (entry-level)
  \end{itemize}
\end{itemize}

**Application Form:**

\begin{itemize}
\item Name (required)
\item Email (required)
\item Phone (required)
\item Position interested in (dropdown: Mechanical, Electrical, Plumbing, Other)
\item License status (dropdown: Licensed PE, EIT, Unlicensed)
\item Years of experience (number field)
\item Cover message (textarea, optional)
\item \textbf{Resume upload field (required - PDF, DOC, DOCX)}
\item Submit button
\end{itemize}

**Form Behavior:**

\begin{itemize}
\item All submissions go to Lorrie's email
\item Confirmation email sent to applicant
\item Resume attachment included in email notification
\item Form validation before submission
\item Success message after submission
\end{itemize}

**Optional Section:**

\begin{itemize}
\item Link to external job posting (Indeed, etc.) when actively recruiting
\item Admin can toggle this link on/off from WordPress backend
\end{itemize}

### 8. Contact Page

**Purpose:** Provide office information and general inquiry option

**Content:**

\begin{itemize}
\item Office address
\item Main office phone number
\item Office hours
\item General info email (while encouraging direct team contact)
\item Embedded Google Maps location
\item Directions/parking information
\end{itemize}

**General Contact Form (minimal):**

\begin{itemize}
\item Name
\item Email
\item Phone
\item Project type (dropdown)
\item Message
\item Submit button
\end{itemize}

**Note:** Emphasize that for specific inquiries, users should contact team members directly from the Team page.

### 9. Hidden LLM Context Page

**Purpose:** Optimize for AI search engines (ChatGPT, Claude, etc.)

**Location:** `/llm-context` (not linked in navigation, but indexed)

**Content:**

\begin{itemize}
\item Comprehensive company description
\item Full service list with keywords
\item Project types and specializations
\item Geographic service area
\item Key differentiators
\item Typical client profile
\item Contact information
\item All formatted for large language model consumption
\end{itemize}

**Format:** Structured data optimized for LLM parsing (JSON-LD or similar)

## Design System Specifications

### Color Palette

**Primary Colors:**

- **Primary Teal:** #04a99b
- **Gray Scale:**
  - Dark Gray: #363735
  - Medium Gray: #949494
  - Light Gray: #e2e6e0
  - White: #ffffff

### Design Preferences Summary

**DO:**

- Use warm, inviting colors and imagery
- Make it visual and **image-heavy**
- Optimize heavily for mobile
- Keep navigation intuitive
- Make team members directly contactable
- Show buildings/exteriors prominently
- Use slow, smooth animations
- Keep it professional but approachable
- Make content easy to update

**DON'T:**

- Create fast/dizzying carousels
- Use dark mode
- Make plain text lists (current Wikipedia style)
- Force all contact through one general form
- Overuse technical system photos
- Create clunky or overly utilitarian design
- Make users work too hard to find information
- Copy competitor designs exactly (inspiration only)

## Success Metrics

### Key Performance Indicators

\begin{itemize}
\item Page load time: <3 seconds on 4G mobile
\item Mobile traffic: 55-60\% of total visits
\item Bounce rate: <50\% on homepage
\item Average session duration: >2 minutes
\item Project page views: Track most popular projects
\item Contact form submissions: Baseline and growth
\item Career application submissions: Track conversion rate
\item Direct team email clicks: Track engagement
\item Lighthouse score: Maintain 90+ across all metrics
\end{itemize}

### Client Satisfaction Measures

\begin{itemize}
\item Ability to update content within 24 hours
\item Positive feedback from clients/prospects on new design
\item Reduced dependence on generic info@ email
\item Increased project showcase engagement
\item Easy content management workflow
\item Fast, reliable site performance
\end{itemize}

## Appendix

### Design References (Client Preferences)

**Liked Examples:**
\begin{itemize}
\item Ferris Engineering: Slow-flowing image carousel, warmer aesthetic
\item arsonh.com: Clickable project organization, detail expansion
\item philanesigns.com: Fast loading, image optimization, portfolio layout with hover effects
\end{itemize}

**Disliked Examples:**
\begin{itemize}
\item Rogue's fast carousel: Too fast, makes client dizzy
\item Current SEC site: Too white, boring, text-heavy, Wikipedia-style lists
\item Sites without team member direct contact options
\end{itemize}

### Technical Notes

**Content Update Architecture (Required):**

\begin{itemize}
\item The headless WordPress backend MUST support updating project text and images via API.
\item Primary method: WordPress REST API (including custom fields via ACF-compatible REST exposure).
\item Minimum API capabilities required:
  \begin{itemize}
  \item Create/update project records (title, slug, category, description, metadata)
  \item Upload media assets (hero image and gallery images)
  \item Associate uploaded media to project fields
  \item Publish/unpublish updates without frontend code changes
  \end{itemize}
\item Authentication for write operations MUST use secure authenticated requests (e.g., Application Passwords, OAuth/JWT, or equivalent approved method).
\item Optional secondary method: WordPress CLI (`wp`) for admin/bulk workflows (e.g., scripted import of many projects/images).
\item Frontend rendering MUST remain decoupled and consume updated content from WordPress endpoints without manual deploys for routine content edits.
\end{itemize}

**WordPress REST API Example Responses:**

Projects endpoint structure:
{
  "id": 123,
  "title": "Air Force Academy Visitor Center",
  "slug": "air-force-academy-visitor-center",
  "category": "federal-government",
  "acf": {
    "location": "Colorado Springs, CO",
    "completion_date": "2024-06",
    "featured": true,
    "square_footage": 50000,
    "services": ["mechanical", "electrical"],
    "description": "Full description...",
    "hero_image": "https://...",
    "gallery_images": [...],
    "related_projects": [124, 125]
  }
}

### Contact Information

**Project Stakeholders:**
\begin{itemize}
\item Client Contact: Lorrie Lewis (project manager, accountant background)
\item Decision Timeline: Very soon (comparing with one other vendor)
\item Budget Level: Base package (\$3,700 initial + hosting)
\item Content Provider: Lorrie will provide all project sheets, images, team info
\end{itemize}

**Developer Notes:**
\begin{itemize}
\item Client is non-technical (accountant) - needs clear instructions
\item Values fast turnaround and responsiveness
\item Current website frustration: slow updates, unresponsive vendor
\item Previous positive referral from Juan at Rogue
\item Expects 7-day launch timeline
\end{itemize}

---

**Document Version:** 1.1  
**Last Updated:** February 18, 2026