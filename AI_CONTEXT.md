# Project AI Context

## 1. Project Overview

This repository is a **careers web application** centered on frontend UI/UX for hiring discovery.

What it currently does:
- Presents company branding and hiring content.
- Lists open roles with filters and quick actions.
- Provides an application form UI.
- Includes a frontend chatbot widget with predefined interactions.

Project shape:
- Full-stack repository, but current evolution is primarily **frontend-driven**.

## 2. Technology Stack

Frontend:
- React 19
- React Router DOM
- Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Framer Motion
- Lucide React
- Axios

Backend:
- Node.js + Express (ESM)
- Mongoose
- JWT + cookie-based admin auth
- bcryptjs

Database:
- MongoDB via Mongoose (`Job`, `Admin` schemas)

Tooling:
- ESLint (frontend)
- npm (frontend + backend)

## 3. Backend Overview

Backend is organized as a simple REST API layer:
- `GET /api/jobs`, `GET /api/jobs/:id` (public job reads)
- `POST/PUT/DELETE /api/jobs` (admin-protected mutations)
- `POST /api/admin/login` (admin auth)

Auth flow:
- Admin login issues JWT and stores it in HTTP-only `token` cookie.
- Middleware validates token and admin role for protected job routes.

Database usage:
- Job CRUD uses Mongoose `Job` model.
- Admin auth uses `Admin` model.

Important note:
- Backend server listen block is currently commented in `backend/server.js`.

## 4. Frontend Architecture Map

Top-level rendering flow:
- `main.jsx` → mounts `App.jsx`
- `App.jsx` → global shell + routes

Route map:
- `/` → `HomePage`
- `/positions` → `OpenPositionsPage`
- `/apply` → `ApplyFormPage`

Shared layout composition:
- `App`
  - `Navbar`
  - Routed page content (`HomePage` / `OpenPositionsPage` / `ApplyFormPage`)
  - `Footer`

Detailed frontend map (Pages → Components → UI elements):

HomePage
├ Hero content (animated heading + dynamic words)
├ Stats/Culture/Hiring sections
├ Dedicated chatbot preview section
├ Floating `ChatbotWidget`
└ Uses shared global layout (`Navbar` + `Footer` from `App`)

OpenPositionsPage
├ `PageHeader`
├ Sticky `FilterBar`
├ Jobs grid of `JobCard`
├ Loading skeleton state
├ Empty state
├ Favorites count
└ Quick-view modal

ApplyFormPage
├ `PageHeader`
├ Application form fields + client validation
├ Success and error states
└ Resume upload input (PDF validation)

Reusable component map:
- `Navbar`: route nav + mobile menu behavior.
- `Footer`: links, contact details, map, social links.
- `PageHeader`: section/page heading wrapper.
- `FilterBar`: search/location/type/experience filters.
- `JobCard`: job summary, favorite action, quick-view trigger, apply CTA.
- `ChatbotWidget`: toggleable assistant UI + canned/predefined interactions.

State management patterns:
- Local component state (`useState`) for UI and interaction state.
- `useEffect` for data fetches, scroll behavior, intervals, and localStorage sync.
- No global state library (no Redux/Zustand/Context-driven app state for domain data).

API call locations:
- Jobs fetch in `OpenPositionsPage` (`GET http://localhost:3000/api/jobs`).
- Roles fetch in `ApplyFormPage` (`GET http://localhost:3000/api/jobs`).
- Application submission in `ApplyFormPage` (`POST http://localhost:5000/api/applications/apply`).

Frontend data flow patterns:
- Parent-driven filtering: `OpenPositionsPage` owns filter state and passes handler to `FilterBar`.
- Card actions bubble up: `JobCard` triggers callbacks (`onToggleFavorite`, `onQuickView`) managed by `OpenPositionsPage`.
- UI persistence: favorites stored and restored via localStorage in `OpenPositionsPage`.

## 5. Folder Structure

- `frontend/`
  - `src/main.jsx` — React mount entry
  - `src/App.jsx` — route shell + layout composition
  - `src/pages/` — route pages (`HomePage`, `OpenPositionsPage`, `ApplyFormPage`)
  - `src/components/` — reusable UI (`Navbar`, `Footer`, `PageHeader`, `FilterBar`, `JobCard`, `ChatbotWidget`)
  - `src/index.css` — shared Tailwind utility class composition
  - `src/assets/` — static assets (logo)
  - `vite.config.js`, `tailwind.config.js`, `eslint.config.js` — tooling/config
- `backend/`
  - API routes, controllers, models, middleware, db config, utility scripts

## 6. Core Features

Frontend-visible features:
1. Marketing-rich Home page with animated sections.
2. Open positions discovery with client-side filtering.
3. Job cards with quick-view and favorite toggle actions.
4. Loading skeletons and empty-state UX for job search.
5. Candidate application form with client-side validation and submit flow.
6. Chatbot widget with predefined prompts and rule-based replies.

Backend-supported core features:
1. Job CRUD API with admin protection on write routes.
2. Admin login and cookie-based JWT auth.

## 7. UI Extension Points

These are safe insertion points for future frontend features:

1. `HomePage`
- Add new sections between existing blocks (hero/culture/hiring/testimonials/chatbot preview).
- Extend animated stats and testimonials with additional cards/data.

2. `OpenPositionsPage`
- Extend `FilterBar` inputs and filter criteria.
- Add pagination/infinite scroll below jobs grid.
- Add richer modal content/side panel for quick-view.
- Add sorting, compare mode, or bookmarked jobs panel.

3. `JobCard`
- Add badges (match score, urgency, remote status chip).
- Add micro-interactions (hover details, tooltips, save feedback).

4. `ApplyFormPage`
- Add multi-step UI.
- Add helper hints for field completion.
- Add preview section before submit.

5. `ChatbotWidget`
- Expand predefined prompt groups.
- Add conversation memory UI.
- Add context-aware suggestions from current page.

6. Shared layout/components
- `Navbar` and `Footer` are global, suitable for global nav/help/announcement additions.
- `PageHeader` can be extended with breadcrumbs, metadata, or action slots.

## 8. Data Sources

Frontend data origins:
1. Jobs API
- Source: `GET http://localhost:3000/api/jobs`
- Used in: `OpenPositionsPage`, `ApplyFormPage`

2. Application submission endpoint
- Source: `POST http://localhost:5000/api/applications/apply`
- Used in: `ApplyFormPage`

3. Local browser storage
- `favoriteJobs` key in localStorage
- Used in: `OpenPositionsPage`

4. In-component static data
- Home page content arrays (testimonials, stats, culture, hiring steps)
- Chatbot canned responses + predefined interaction list

5. Route/query params
- `ApplyFormPage` consumes `role` from URL query string

## 9. Styling Architecture

Styling approach:
- Tailwind-first utility classes in JSX.
- Shared semantic class patterns defined in `src/index.css` (`.btn-primary`, `.btn-secondary`, `.card`, `.input-field`, `.section-padding`).
- Theme direction currently: dark background + emerald accents.

Animation architecture:
- Framer Motion for section entrance, transitions, and micro-interactions.
- Some dynamic UI timing via `useEffect` intervals (hero words/stat counters).

Reusable visual patterns:
- Card-based sections (`.card`).
- Gradient accents for CTA and emphasis.
- Consistent spacing through `.section-padding` and Tailwind spacing scales.

## 10. AI Feature Integration Points

Frontend-first AI-ready components:

1. `ChatbotWidget`
- Current rule-based replies can be upgraded to model-backed responses.
- Predefined interaction chips can map to AI intents.

2. `OpenPositionsPage`
- AI-powered ranking/sorting of jobs by inferred candidate fit.
- Natural language filtering input for jobs.

3. `JobCard`
- Add AI match score badges and explanation snippets.

4. `ApplyFormPage`
- Resume-guided field suggestions and skill extraction.
- AI feedback before submit (completeness/readability checks).

5. `HomePage`
- Personalized role recommendations in hero/chatbot section.

## 11. Known Limitations

1. Backend runtime setup ambiguity
- `app.listen(...)` is commented out in backend entry file.

2. Hardcoded API hosts/ports in frontend
- Jobs and apply URLs are hardcoded to localhost endpoints.

3. Apply endpoint mismatch
- Frontend submits to `/api/applications/apply` on port 5000, while this backend does not expose that route.

4. Potential delete controller bug
- Job delete controller checks `if (!deleteJob)` instead of checking the deleted document variable.

5. Hardcoded admin seed credentials
- `seedAdmin.js` contains plaintext default credentials.

6. No centralized frontend API client abstraction
- API calls are embedded directly inside page components.

7. No global state layer for domain data
- Cross-page data/state relies on local component state and localStorage.

8. Limited automated test coverage
- Frontend emphasizes build/lint scripts; backend test script is placeholder.
