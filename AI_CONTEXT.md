# Project AI Context

## 1. Project Overview

This repository appears to be a **careers website application** for Aparaitech, with a React frontend and a Node/Express backend.

Primary user-facing goals inferred from code:
- Showcase company/culture content and hiring process.
- Display open job positions from backend APIs.
- Let candidates submit job applications from a frontend form.
- Provide lightweight chatbot-style guidance for role discovery (frontend-only UI behavior).

Project type:
- **Full-stack web application** (frontend + backend), currently with some integration gaps.

Unknown – Needs clarification:
- Whether this repository is intended for production use as-is or as a prototype/demo.
- Whether application submission backend (`/api/applications/apply`) is in another service/repo.

## 2. Technology Stack

Frontend:
- React 19
- React Router DOM
- Vite
- Tailwind CSS (v4 via `@tailwindcss/vite`)
- Framer Motion
- Lucide React icons
- Axios

Backend:
- Node.js + Express (ESM modules)
- Mongoose (MongoDB ODM)
- JWT (`jsonwebtoken`) for admin auth
- `cookie-parser` for cookie-based token handling
- `bcryptjs` for password hashing/checking
- `cors`, `dotenv`

Database:
- MongoDB (via Mongoose)
- Models: `Job`, `Admin`

Tooling:
- ESLint (frontend)
- npm scripts for dev/build/lint (frontend)

Not detected:
- Docker
- CI/CD workflows
- Redis
- Cloud provider-specific config
- Automated backend tests

## 3. Project Architecture

High-level architecture:

User Browser
→ React Frontend (Vite app)
→ HTTP calls (Axios/fetch)
→ Express API (jobs + admin auth)
→ Mongoose models
→ MongoDB

Additional auth path:
- Admin login endpoint issues JWT in an HTTP-only cookie (`token`), and protected job mutation routes use middleware that validates this cookie token.

Important note:
- Backend server entry currently has `app.listen(...)` commented out, so runtime startup behavior is unclear unless launched elsewhere.

## 4. Folder Structure Explanation

Top level:
- `frontend/` — UI application
- `backend/` — API and DB access
- `AI_CONTEXT.md` — this context document

Frontend (`frontend/`):
- `src/main.jsx` — React bootstrap entry.
- `src/App.jsx` — route wiring and global layout (`Navbar`, pages, `Footer`).
- `src/pages/` — page-level screens (`HomePage`, `OpenPositionsPage`, `ApplyFormPage`).
- `src/components/` — reusable UI components (navigation, cards, filters, chatbot, etc.).
- `src/index.css` — shared Tailwind utility-style component classes.
- `vite.config.js`, `tailwind.config.js`, `eslint.config.js` — build/style/lint config.

Backend (`backend/`):
- `server.js` — express app initialization and route mounting.
- `routes/` — route modules (`job.routes.js`, `admin.routes.js`).
- `controlllers/` — controller logic (note spelling includes triple “l”).
- `models/` — Mongoose schemas (`Job`, `Admin`).
- `middleware/adminAuth.js` — JWT cookie auth guard.
- `config/db.js` — MongoDB connection helper.
- `utils/generateToken.js` — JWT signing.
- `seedAdmin.js` — admin seeding script with hardcoded credentials.

## 5. Core Features

1) Careers marketing content (frontend)
- Home page with hero, culture, hiring process, testimonials, and chatbot section.
- Uses Framer Motion for animations and dynamic text/counters.

2) Job listing and filtering
- Fetches jobs from backend endpoint (`GET /api/jobs`).
- Client-side filtering by search/location/type/experience.
- Includes loading skeletons, quick-view modal, and favorites stored in localStorage.

3) Application form UI
- Candidate form with client-side validation and PDF resume check.
- Submits multipart form data to `/api/applications/apply` on port 5000.

4) Admin authentication (backend)
- `POST /api/admin/login` validates admin email/password.
- Returns token and sets HTTP-only cookie.

5) Job management APIs (backend)
- Public: list jobs, get job by id.
- Protected by `adminAuth`: create/update/delete job.

## 6. UI Structure

Pages:
- Home page (`/`)
- Open positions (`/positions`)
- Apply form (`/apply`)

Layout system:
- `App.jsx` wraps all pages with persistent `Navbar` and `Footer`.
- Shared utility classes in `index.css`:
  - `.btn-primary`, `.btn-secondary`
  - `.card`, `.input-field`
  - `.section-padding`

Reusable components:
- `Navbar`
- `Footer`
- `PageHeader`
- `FilterBar`
- `JobCard`
- `ChatbotWidget`

Navigation:
- React Router (`BrowserRouter`, `Routes`, `Route`)

UI framework/style:
- Tailwind utility classes + custom component class shortcuts in `index.css`
- Framer Motion for animated transitions

## 7. Key Files and Their Roles

Frontend key files:
- `frontend/src/main.jsx` → React app mount/bootstrap.
- `frontend/src/App.jsx` → Routing and global page shell.
- `frontend/src/pages/HomePage.jsx` → Primary marketing page + chatbot section.
- `frontend/src/pages/OpenPositionsPage.jsx` → Jobs listing, filtering, skeleton loading, favorites, quick-view.
- `frontend/src/pages/ApplyFormPage.jsx` → Application form, validation, submission.
- `frontend/src/components/ChatbotWidget.jsx` → Frontend-only chatbot UI and canned intent responses.
- `frontend/src/components/FilterBar.jsx` → Jobs filter controls.
- `frontend/src/components/JobCard.jsx` → Individual job card rendering + actions.
- `frontend/src/index.css` → Global style tokens/components.
- `frontend/package.json` → frontend scripts/dependencies.

Backend key files:
- `backend/server.js` → API setup and middleware registration.
- `backend/routes/job.routes.js` → job route map.
- `backend/routes/admin.routes.js` → admin login route.
- `backend/controlllers/job.controller.js` → job CRUD/business logic.
- `backend/controlllers/admin.controller.js` → admin login flow.
- `backend/middleware/adminAuth.js` → protected route authorization.
- `backend/models/Job.js` → Job schema definition.
- `backend/models/Admin.js` → Admin schema definition.
- `backend/config/db.js` → MongoDB connection logic.
- `backend/seedAdmin.js` → helper script to create initial admin user.
- `backend/package.json` → backend dependencies.

## 8. Data Flow

### A) Jobs listing flow
1. Frontend loads Open Positions page.
2. `OpenPositionsPage` calls `GET http://localhost:3000/api/jobs`.
3. Backend `job.routes.js` routes to `getAllJobs` controller.
4. Controller queries `Job` model via Mongoose and returns JSON.
5. Frontend stores jobs in state and applies client-side filters.

### B) Admin auth + protected job mutation flow
1. Admin posts credentials to `POST /api/admin/login`.
2. Backend validates credentials against `Admin` model.
3. JWT is generated and set in `token` HTTP-only cookie.
4. Protected routes (`POST/PUT/DELETE /api/jobs`) require `adminAuth` middleware.
5. Middleware verifies cookie token and role.

### C) Candidate apply flow
1. User fills `ApplyFormPage` form.
2. Frontend validates fields and PDF resume type.
3. Frontend submits `FormData` to `http://localhost:5000/api/applications/apply`.
4. Backend handling for this endpoint is **not present in this repository**.

Unknown – Needs clarification:
- Which service owns `/api/applications/apply` and how it should be run in local/dev.

## 9. Known Limitations

1. Backend startup ambiguity
- `app.listen(...)` is commented out in `backend/server.js`.

2. Integration mismatch in apply endpoint
- Frontend apply submits to port 5000 and route not defined in current backend.

3. Hardcoded API base URLs in frontend
- Jobs calls use explicit `http://localhost:3000`.
- Apply submits to explicit `http://localhost:5000`.

4. Potential logic bug in job delete controller
- `deleteJob` checks `if (!deleteJob)` instead of `if (!deletedJob)`.

5. Hardcoded admin seed credentials
- `seedAdmin.js` contains plaintext default credentials.

6. No explicit environment template file observed
- `.env.example` not found in scanned files.

7. Validation and consistency gaps
- Some job type strings in frontend filters may not match backend enum capitalization/hyphen style.

8. Test coverage appears minimal
- Frontend has build/lint scripts; backend has placeholder `test` script only.

## 10. Potential AI Integration Points

1. Chatbot enhancement (existing UI is a strong starting point)
- Replace canned responses with LLM-backed role guidance.
- Add context-aware suggestions from current job inventory.

2. Smart job recommendation engine
- Recommend jobs based on entered skills, resume text, and prior interactions.

3. Resume intelligence
- Parse uploaded resumes and auto-suggest best matching roles.

4. Semantic search on jobs
- Natural language queries (e.g., “remote backend role with Node and 2+ years”).

5. Candidate assistance workflow
- AI-assisted form filling hints, interview prep tips, and FAQ summarization.

6. Admin analytics assistant
- Hiring funnel summaries, role demand trends, and candidate quality insights.

## 11. Questions for the Project Owner

1. Is this repository meant to be a single deployable system, or is apply-submission handled by a separate backend service?
2. What is the authoritative backend URL and environment strategy (dev/staging/prod)?
3. Should `backend/server.js` be the runtime entrypoint (and if so, should `app.listen` be enabled)?
4. Do you want cookie-based admin auth only, or also token-in-header support?
5. Should favorite jobs be persisted per user account in backend instead of localStorage?
6. Is there an expected authentication flow for candidates (currently no user auth in frontend/backend)?
7. What are the required environment variables and their expected names? (`MONGO_URL`, `JWT_SECRET`, etc.)
8. Are there security requirements for admin seeding (remove hardcoded credentials, rotate secrets, etc.)?
9. Should job filters be server-side for scalability, or remain client-side?
10. What level of accessibility/compliance is expected (WCAG targets, keyboard support, screen-reader testing)?
11. Is there a product roadmap priority among chatbot improvements, recommendation engine, and analytics?

