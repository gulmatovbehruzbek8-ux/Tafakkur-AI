# Comprehensive Execution Plan: Local AI University Platform

## 1. Project Objective
Build a privacy-first, locally hosted AI platform for universities that increases the efficiency of professors, assists students, and streamlines administration. 
This directly addresses the hackathon's "Priority Topics" to maximize bonus points:
* **Problem #2**: Automated grading and feedback.
* **Problem #3**: University policy chatbot.
* **Problem #4**: AI agent for professor and student efficiency.

## 2. Tech Stack (Optimized for a 2-Day Hackathon)
* **Local AI Engine**: [Ollama](https://ollama.com/) running a lightweight open-source model (e.g., Llama-3-8B or Qwen-2.5 for better Uzbek support).
* **AI Orchestration**: LangChain or LlamaIndex.
* **Backend**: FastAPI (Python) – fast to develop, natively asynchronous, great for AI tasks.
* **Frontend**: Next.js/React (if the team has UI/UX designers) OR Streamlit (if the team is purely Python-focused and needs a UI instantly).
* **Database**: SQLite (for standard relational data like users/grades) + ChromaDB or FAISS (Vector DB for Document RAG).

## 3. Core MVP Features (Demo Scope)
Do not try to build a massive LMS like Canvas. Build exactly what is needed for the 7-minute pitch.
* **Admin Module (The Principal)**
  * AI News Drafter: Input 3 bullet points -> Output a formal university announcement.
* **Professor Module (The Mentor)**
  * Dashboard showing student list and overall class progress.
  * Document Upload: Upload a syllabus or grading rubric.
  * AI Grader: Select a student's submission, hit "Auto-Grade", view the AI's feedback, and click "Approve".
* **Student Module**
  * Dashboard showing the latest Principal announcements.
  * AI Tutor Chatbot: A RAG-powered chatbot where the student can ask questions *specifically* about the syllabus the professor uploaded.

## 4. Team Roles & Task Delegation (For a 3-5 person team)
* **AI / Backend Developer (1-2 people)**
  * Install and configure Ollama.
  * Write the FastAPI endpoints (`/chat`, `/generate-news`, `/grade-assignment`).
  * Build the RAG pipeline (chunking PDFs, saving to FAISS, querying).
* **Frontend / UI Developer (1-2 people)**
  * Build the 3 distinct views (Admin, Professor, Student).
  * Connect the frontend to the FastAPI endpoints.
  * Make the UI look polished (UI is heavily judged in the "Innovation/Application" criteria).
* **Project Manager / Pitch Lead (1 person)**
  * Create the pitch deck (using the 3 min pitch + 2 min demo + 2 min Q&A format).
  * Keep the team on track for Checkpoint 1 & 2.
  * Create dummy data (fake syllabus, fake student essays, fake rubrics) so the demo looks realistic.

## 5. Day-by-Day Roadmap
### Day 1: Sept 17 (Setup & Core Logic)
* **14:00 - 18:00**: 
  * Backend: Setup FastAPI, run Ollama locally, confirm the LLM can respond to simple API requests.
  * Frontend: Initialize repository, create basic navigation structure (Admin/Prof/Student tabs).
* **19:00 - 21:00**: 
  * Backend: Build the RAG document upload script.
  * Frontend: Build the Chat UI and News UI.

### Day 2: Sept 18 (Integration & Checkpoint 1)
* **09:00 - 13:00**:
  * Connect Frontend to Backend. Ensure the Chatbot can answer questions based on an uploaded document.
* **14:00 - 18:00 (Checkpoint 1)**:
  * Present the initial architecture and basic functionality to the Technical Mentor.
  * Backend: Implement the Auto-Grading prompt logic.
* **19:00 - 21:00**:
  * Build the "Approve Grade" UI for the professor.

### Day 3: Sept 19 (Polish & Checkpoint 2)
* **09:00 - 14:00**:
  * Finalize the Business Model (How does this make money? Subscription per university? Server setup fees?).
  * Fix all bugs. The demo MUST not crash.
* **14:00 - 18:00 (Checkpoint 2)**:
  * Final mentor review. Have GitHub repo organized with a solid `README.md`.
* **19:30 - 21:00 (Final Prep)**:
  * Rehearse the 3-minute pitch over and over.

### Day 4: Sept 20 (Final Pitch)
* Present to the judges. Focus on:
  1. **Privacy**: It runs locally, protecting student data.
  2. **Efficiency**: Saves hours of grading and admin work.
  3. **Relevance**: Directly hits 3 priority problems of the Ministry of Higher Education.
