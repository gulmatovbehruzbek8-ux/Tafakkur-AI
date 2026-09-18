# Tafakkur AI — Day 2 Plan — Sept 18 (Checkpoint 1 day)

**CP1 window: 14:00–18:00. This is 40% of your final score.**
CP1 is **three separate 10-minute sessions**, one per mentor, back to back — they don't listen together, so you need three tailored pitches, not one generic one:
- **Technical mentor:** execution, code readiness, innovativeness, team's tech knowledge, tech stack.
- **Business mentor:** idea/problem relevance, business model & monetization, competitive edge, financial viability, growth potential.
- **Domain mentor:** problem relevance, domain understanding, practical application, legal compliance, impact scale.

**Before anything else today:** ask a coordinator whether the Ta'lim (Education) track has a designated "priority direction" this round. If it does and you opt in, you get +2 from the business mentor and fixed 10/10 + 7/10 scores from the domain mentor — free points if it applies.

## Schedule anchors (from official agenda)
- 09:00–10:00 Free work
- 11:00–13:00 Mentor time / project work
- 11:45–13:00 Business workshop
- 13:00–14:00 Lunch
- **14:00–18:00 Checkpoint 1** (3 × 10-min mentor rotations)
- 18:00–19:00 Dinner
- 19:00–21:00 Free work

## Team / attendance
- All 3–5 members must be physically present in the venue; coordinators check every 2 hours. Don't send anyone off-site today.
- Map your actual people to the four expected roles: developer(s)/AI specialist(s), UI/UX designer, business analyst, project manager — makes the team-knowledge and business criteria easier to answer well.

## Scope for today — P0 (must be working before 14:00)
1. **FastAPI backend + Ollama** — at least one endpoint returning a real model response. This is the single most important technical-mentor signal today.
2. **3 dashboard skeletons** (Student / Professor / Admin) — routing + layout, even unstyled.
3. **Announcement Generator, end-to-end** — 3 bullet points in → formal AI-written post out. Simplest feature to get fully working live; use this as your CP1 demo centerpiece.
4. **OneID login — MOCKED** — a login screen with fake verified-identity flow. Label it internally as demo auth, not real OneID.
5. **HEMIS Connect — MOCKED** — a "Connect HEMIS" button that loads a seeded JSON (fake schedule/grades/attendance for 2–3 demo students). No real HEMIS API call.
6. **Pitch deck v1** — problem, 3-in-1 solution (tutor/grader/announcements), architecture diagram, and a **business model slide** (who pays — university licensing, per-seat, govt procurement, etc.). Mark OneID/HEMIS boxes explicitly as "planned integration / demo data for prototype" — do not claim they're live.
7. **Logistics** — laptop + charger, extension cord/mouse, IDE and libraries pre-installed for offline work, docs saved offline, backup hotspot ready, decide who presents to which mentor.

## P1 (start today, finish tonight/tomorrow morning if no time before CP1)
- RAG tutor skeleton: syllabus upload + basic Q&A (accuracy can be rough today).
- Auto-grader skeleton: upload assignment → draft AI score.

## Explicitly NOT today (roadmap slide only — do not attempt)
Real OneID/HEMIS API, education map, complaint/ombudsman system, career navigator, digital passport (national scale), voice AI. These go on one "vision" slide, nothing more.

## Role split
- **AI/Backend:** Ollama + FastAPI, Announcement Generator, RAG/grader skeletons.
- **Frontend/UI-UX:** 3 dashboard shells, OneID mock screen, HEMIS mock "connect" flow + seeded data render.
- **Business analyst/PM:** business model slide, seed fake student/professor data, deck v1, confirm priority-direction status with coordinators, prep CP1 talking points per mentor type.

## Before 14:00 checklist
- [ ] Asked coordinator about priority-direction status
- [ ] Ollama responds via API
- [ ] Announcement Generator demoable live
- [ ] OneID + HEMIS mock flows clickable
- [ ] Deck v1 ready — architecture, business model, honest real-vs-planned labeling
- [ ] Presenter assigned per mentor; each person can answer that mentor's specific criteria
- [ ] Laptop/charger/mouse/offline docs/hotspot packed

## Tonight (19:00–21:00)
- Push RAG tutor and auto-grader from skeleton toward working.
- Start wiring dashboards to real backend endpoints instead of static mocks.
