### Case Log Storage Architecture

Case logs are stored in browser localStorage under the key `case_logs` as JSON.
The Admin panel writes structured incident records (title, environment, symptoms,
root cause, fix, notes, date) to localStorage.

The public Case Logs page reads the same data and renders it in a read-only
incident report format.

This simulates a real IT ticketing system architecture:
Admin UI → Persistent Storage → Public Knowledge Base

Current storage: localStorage (client-side)
Future upgrade path: Cloud database with authenticated API

## Dev Log — Projects System + Admin CMS + Tagging

**Date:** 2026-01-XX  
**Focus:** Supabase schema design, Admin CRUD, Project pages, Tagging, Search, Inline Editing

### Summary

Built a full Projects management system on top of an existing React + Supabase portfolio. The system now supports:

- Public `/projects` page (terminal-style list)
- Individual project detail pages (`/projects/:slug`)
- Search and tag filtering
- Pinned projects (featured at top)
- Tech stack tagging (Linux, Windows, Git, Networking, Hardware, React)
- Admin-only project creation and editing
- Inline editing for case logs and projects
- Mini “progress logs” (project_updates) for continuous documentation

### Architecture

- **Frontend:** React + Vite + React Router
- **Backend:** Supabase (Postgres + Auth + RLS)
- **Auth:** Supabase session-based admin login
- **Data Model:**
  - `case_logs` – troubleshooting / learning logs
  - `projects` – portfolio projects with metadata
  - `project_updates` – per-project progress / mini case logs
  - `tags` stored as `text[]` for filtering and classification

### Features Implemented

- Admin Dashboard:
  - Create, edit, delete case logs
  - Multi-select tag system (pill toggles)
  - Inline edit expansion with prefilled forms
  - Supabase RLS policies for owner-only write access
- Public Case Logs:
  - Grid layout
  - Tag badges
  - Ready for search and filter
- Projects System:
  - Terminal-style list with pinned entries
  - Project detail pages (problem, solution, results, links)
  - Tech stack tags
  - SQL-backed data insertion
  - Slug-based routing
- Database:
  - Enabled `pgcrypto` extension for UUIDs
  - Created relational schema with cascade deletes
  - Used Postgres arrays for tags and stacks
  - RLS for public read / authenticated write

### Skills Demonstrated

- SQL schema design
- Supabase RLS & Auth
- React state management
- CRUD UI with inline editing
- Tagging and filtering systems
- Admin CMS design
- Documentation-first workflow
- Debugging (hooks errors, routing, deployment, GitHub Pages)

### Next Planned

- Admin UI for managing projects & updates
- Search + filter on public Projects page
- Screenshot uploads
- Severity levels for case logs
- Resume-ready polish
