# Mission: Complete World-Class Frontend Redesign for "Tafakkur AI"

You are collaborating as an elite AI engineer and designer on **Tafakkur AI**, competing in the **Umummilly AI Xakaton (Khorezm Stage, Sept 17–20, 2026)** in the **Ta'lim (Education) track**.

---

## 1. Project Background & Context

### Target Problems (Ministry of Higher Education, Science and Innovations):
1. **Problem #4 (Primary):** AI agents that dramatically elevate efficiency for professors, university students, and administration.
2. **Problem #2:** AI Auto-Grading of student assignments against teacher rubrics.
3. **Problem #3:** University Chatbot and AI Academic Tutoring.

### The Value Proposition:
**Tafakkur AI** is a privacy-first, locally-hosted AI educational platform for universities in Uzbekistan. Because AI inference runs locally on university servers (via Ollama running open-source models like Llama-3 / Qwen), sensitive student records and intellectual property never leak to foreign cloud providers.

### Tech Stack:
- **Frontend:** Next.js (App Router, React 19, Tailwind CSS v4, TypeScript) located in `E:\Hackathon\frontend`. Running on `http://localhost:3000`.
- **Backend:** FastAPI (`backend/main.py`) running on `http://localhost:8000` with SQLite (`tafakkur.db`) for user authentication, roles, and live HEMIS profile synchronization.
- **AI Engine:** Ollama local inference + fallback simulation for demo stability.

### The Portals & Routes in `frontend/src/app`:
1. **Authentication (`/login`):**
   - Clean login and registration with 4 roles: `student`, `oquvchi`, `teacher` (mentor), `admin`.
   - 1-click demo buttons for quick testing: Talaba (`student`), O'qituvchi (`teacher`), Admin (`admin`).
2. **Student Portal (`/student`):**
   - `/student`: Student profile, HEMIS ID (`38491023`), GPA (`4.8`), group (`AI-22`), course, faculty, contact info.
   - `/student/calendar`: Academic calendar, assignment deadlines, submission statuses.
   - `/student/sow`: Scheme of Work / Curriculum breakdown with interactive topics and slide-out AI tutor drawer.
   - `/student/chatbot`: **Tafakkur AI** personal academic tutor chatbot with starter prompts, copy-to-clipboard, and conversational stream.
3. **Teacher Portal (`/teacher`):**
   - `/teacher`: Professor profile, HEMIS ID (`PROF-9012`), department, faculty, academic rank.
   - `/teacher/calendar`: Teaching schedule, lectures, lab sessions.
   - `/teacher/sow`: Curriculum progress, module completion tracking, homework submissions.
   - `/teacher/grader`: **AI Avto-Baholovchi (Auto-Grader)**: Teachers select a student, provide/tweak rubrics, view student submissions, and trigger 1-click AI grading with numerical score (0–100) and structured feedback.
   - `/teacher/chatbot`: **Tafakkur AI Professor Edition**: Pedagogical assistant for rubric creation, lesson plans, exam variant generation.
4. **Admin / Principal Portal (`/admin`):**
   - `/admin`: Executive university metrics & KPI dashboard (total students, teachers, active classes, attendance, GPA).
   - `/admin/users`: User & Profile management table with complete HEMIS detail modal (ID, Faculty, Group, Course, GPA, Department, Position, Phone, Email) synced directly with SQLite `tafakkur.db`.
   - `/admin/news`: **Tafakkur AI E'lonlar Generatori (Press)**: Turns brief bullet points into formal university decrees, press releases, and announcements.

### Critical Rules:
- **Branding:** The AI must ALWAYS be named **Tafakkur AI** (never "HEMIS"). HEMIS is strictly the university database being integrated.
- **Language:** All user-facing UI copy must remain in **Uzbek (Latin script)**.
- **Integrity:** Preserve all working API connections (`fetch('http://localhost:8000/...')`), local storage session handlers (`localStorage.getItem('tafakkur_user')`), and authentication flow.

---

## 2. Your Assignment

The user wants you to completely redesign the frontend to make it look world-class, premium, modern, and visually stunning.

### Step 1: Online Research
Before touching the code, conduct thorough online research into cutting-edge UI/UX patterns:
- Modern educational SaaS and AI platforms (e.g., Linear, Vercel, modern LMS platforms, Stripe dashboards, Duolingo Max, Notion, Raycast).
- Modern aesthetic standards: clean typography, refined color palette (subtle slates, rich dark accents, vibrant blue/indigo/emerald highlights), subtle borders (`border-slate-200/80`), soft multi-layered drop shadows, Bento Grid layouts, micro-animations, accessible pill badges, responsive navigation.
- Search the web for inspiration, design trends, and component patterns that make judges instantly say "Wow, this looks like a production-grade Silicon Valley product."

### Step 2: Comprehensive Frontend Redesign
Execute the redesign across the Next.js frontend (`E:\Hackathon\frontend`):
1. **Global Design System (`globals.css`, layout, typography, components):**
   - Ensure cohesive, ultra-crisp visual design system.
2. **Component Polish (`Sidebar.tsx`, cards, modals, tables, badges, chat bubbles):**
   - Elevate the visual fidelity, hover states, transitions, and layout balance.
3. **All Key Pages:**
   - `/login`
   - `/student`, `/student/calendar`, `/student/sow`, `/student/chatbot`
   - `/teacher`, `/teacher/calendar`, `/teacher/sow`, `/teacher/grader`, `/teacher/chatbot`
   - `/admin`, `/admin/users`, `/admin/news`
4. **Verification:**
   - Run `npm run build` in `E:\Hackathon\frontend` to ensure 0 build errors.

Take the lead, do your research, and deliver an exceptional design overhaul!
