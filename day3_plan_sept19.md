# Tafakkur AI — Day 3 Plan — Sept 19 (Checkpoint 2 day)

**CP2 window: 14:00–18:00, hard deadline. This is 60% of your final score — no late submissions accepted.**
Same format as CP1: **three separate 10-minute mentor sessions** (technical, business, domain) — refine yesterday's three tailored pitches based on CP1 feedback rather than starting over.
Deliverables due at 14:00: presentation + GitHub link.

Tie-break order if scores end up equal: CP2 score → domain mentor score → technical mentor score → head coordinator decision. Worth knowing, not worth planning around.

## Schedule anchors (from official agenda)
- 09:00–10:00 Registration / free work
- 10:00–11:00 Pitching workshop
- 11:00–14:00 Mentors + lunch
- **14:00–18:00 CP2 — presentation + GitHub due**
- 18:00–19:00 Dinner
- 19:00–19:30 Top-15 announced
- 19:30–21:00 Final prep + video

## Scope for today — P0 (must be done before 14:00)
1. **RAG Tutor working** — syllabus-aware chat, real answers from FAISS-retrieved context.
2. **Auto-grader working** — upload assignment/rubric → AI score + written feedback.
3. **Announcement Generator polished** — already working from yesterday; tighten UI/output quality.
4. **All 3 dashboards wired to real backend** — no more static mocks except OneID/HEMIS.
4a. **Landing page polished** — this is the front door of a real website; make sure it's presentable enough to open cold in front of a mentor or judge, not just the app screens.
5. **AI Academic Passport (your wow feature)** — subject-mastery bars + one AI-generated insight, built on top of grader output + seeded data.
6. **Deck v2** — update architecture/demo slides, sharpen the business model slide with real-ish numbers (pricing, target customer, market size if you can estimate it — this is scored directly by the business mentor), add a clearly separate "Roadmap" slide for OneID/HEMIS real integration, education map, complaint system, career navigator, national passport. Keep roadmap items OFF the "what we built" slides entirely.
7. **GitHub repo** — clean commit history, README explaining what's real vs. mocked, pushed well before 14:00.
8. **Live deploy (if you did the optional Vercel deploy last night)** — confirm the hosted link still works with today's backend changes; keep the ngrok/Cloudflare tunnel to Ollama running through CP2 and the final if you're relying on it.

## Explicitly still NOT today
Real OneID/HEMIS API access, education map, ombudsman/complaint system, career navigator, voice AI — roadmap slide only.

## Role split
- **AI/Backend:** finish RAG tutor + auto-grader, keep endpoints stable for the demo.
- **Frontend/UI-UX:** finish wiring dashboards, build the Academic Passport view.
- **Business analyst/PM:** finalize business model numbers, deck v2, GitHub README, rehearse full pitch, prep for CP2 mentor Q&A per mentor type.

## Before 14:00 checklist
- [ ] Tutor answers questions using syllabus content
- [ ] Grader produces a real score + feedback on a demo assignment
- [ ] Academic Passport renders with demo data + one AI insight
- [ ] Deck v2 finished — business model sharpened, roadmap clearly separated from built features
- [ ] GitHub pushed, README accurate
- [ ] Each presenter has refined their mentor-specific pitch based on CP1 feedback

## After CP2 (19:30–21:00) — Final prep
- Rehearse the 7-minute structure (same format as final): 3 min pitch / 2 min demo / 2 min Q&A.
- Record a backup demo video — the agenda explicitly reserves this slot for it, and it protects you if live demo/wifi fails during the final.
