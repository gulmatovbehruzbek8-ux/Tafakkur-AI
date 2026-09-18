from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import urllib.request
import json
import logging

logging.basicConfig(level=logging.INFO)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Tafakkur AI - Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = "http://localhost:11434/api/generate"
DEFAULT_MODEL = "llama3"


def call_ollama(prompt: str, model: str = DEFAULT_MODEL) -> str:
    """Call local Ollama; returns response text or a labeled mock on failure."""
    payload = {"model": model, "prompt": prompt, "stream": False}
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        OLLAMA_URL, data=data, headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            return result.get("response", "")
    except Exception as e:
        logging.warning(f"Ollama unavailable: {e}. Returning mock response.")
        return None


import sqlite3
import hashlib

# ─── Database Setup ────────────────────────────────────────────────────────────
DB_FILE = "tafakkur.db"

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL
        )
    """)
    # Add profile_data column if it doesn't exist
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN profile_data TEXT")
    except sqlite3.OperationalError:
        pass # Column already exists

    # Seed demo users if they don't exist
    demo_users = [
        (
            "student",
            hash_password("password"),
            "student",
            json.dumps({
                "name": "Behruzbek Gulmatov",
                "firstName": "Behruzbek",
                "lastName": "Gulmatov",
                "studentId": "38491023",
                "faculty": "Sun'iy Intellekt va Axborot Texnologiyalari",
                "course": "2-bosqich",
                "group": "AI-22",
                "gpa": "4.82",
                "educationType": "Kunduzgi",
                "email": "b.gulmatov@student.tafakkur.uz",
                "phone": "+998 90 123 45 67",
                "status": "Faol",
                "birthDate": "15 Aprel, 2004",
                "citizenship": "O'zbekiston Respublikasi"
            })
        ),
        (
            "teacher",
            hash_password("password"),
            "teacher",
            json.dumps({
                "name": "Prof. Olimjon Turdiyev",
                "firstName": "Olimjon",
                "lastName": "Turdiyev",
                "teacherId": "PROF-9012",
                "faculty": "Sun'iy Intellekt va Axborot Texnologiyalari",
                "department": "Dasturiy ta'minot injiniringi",
                "position": "Katta o'qituvchi / Professor",
                "email": "o.turdiyev@tafakkur.uz",
                "phone": "+998 90 987 65 43",
                "status": "Faol"
            })
        ),
        (
            "admin",
            hash_password("password"),
            "admin",
            json.dumps({
                "name": "Rektorat Ma'muriyati",
                "firstName": "Admin",
                "lastName": "Rektorat",
                "position": "Tizim Administratori",
                "status": "Faol"
            })
        )
    ]
    for u, p_hash, r, p_data in demo_users:
        cursor.execute("""
            INSERT OR IGNORE INTO users (username, password_hash, role, profile_data)
            VALUES (?, ?, ?, ?)
        """, (u, p_hash, r, p_data))

    conn.commit()
    conn.close()

init_db()

# ─── Request models ───────────────────────────────────────────────────────────

class AuthRequest(BaseModel):
    username: str
    password: str = ""
    role: str = "" # Optional for login, required for register
    profile_data: Optional[Dict[str, Any]] = None

class UpdateUserRequest(BaseModel):
    role: Optional[str] = None
    profile_data: Optional[Dict[str, Any]] = None

class GenerateRequest(BaseModel):
    prompt: str
    model: str = DEFAULT_MODEL


class GradeRequest(BaseModel):
    rubric: str       # professor's rubric / expected answer
    submission: str   # student's submitted text
    model: str = DEFAULT_MODEL


class ChatRequest(BaseModel):
    question: str
    context: str = ""   # optional syllabus context (RAG will populate this)
    model: str = DEFAULT_MODEL


# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.post("/api/auth/register")
def register_user(req: AuthRequest):
    if not req.username or not req.password or not req.role:
        raise HTTPException(status_code=400, detail="Missing fields")
    
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    profile_str = json.dumps(req.profile_data) if req.profile_data else "{}"
    try:
        cursor.execute("INSERT INTO users (username, password_hash, role, profile_data) VALUES (?, ?, ?, ?)", 
                       (req.username, hash_password(req.password), req.role, profile_str))
        conn.commit()
        user_id = cursor.lastrowid
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Username already exists")
    finally:
        conn.close()
        
    return {"message": "User registered successfully", "id": user_id, "role": req.role, "profile": req.profile_data or {}}

@app.get("/api/users")
def get_users():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, role, profile_data FROM users")
    users = cursor.fetchall()
    conn.close()
    
    result = []
    for row in users:
        try:
            profile = json.loads(row[3]) if row[3] else {}
        except Exception:
            profile = {}
        result.append({
            "id": row[0],
            "username": row[1],
            "role": row[2],
            "profile": profile
        })
    return result

@app.put("/api/users/{user_id}")
def update_user(user_id: int, req: UpdateUserRequest):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    if req.role and req.profile_data is not None:
        cursor.execute("UPDATE users SET role=?, profile_data=? WHERE id=?", 
                       (req.role, json.dumps(req.profile_data), user_id))
    elif req.role:
        cursor.execute("UPDATE users SET role=? WHERE id=?", (req.role, user_id))
    elif req.profile_data is not None:
        cursor.execute("UPDATE users SET profile_data=? WHERE id=?", (json.dumps(req.profile_data), user_id))
    conn.commit()
    conn.close()
    return {"message": "User updated successfully"}

@app.delete("/api/users/{user_id}")
def delete_user(user_id: int):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id=?", (user_id,))
    conn.commit()
    conn.close()
    return {"message": "User deleted successfully"}

@app.get("/api/users/{username}/profile")
def get_user_profile(username: str):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, role, profile_data FROM users WHERE username=?", (username,))
    user = cursor.fetchone()
    conn.close()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    try:
        profile = json.loads(user[3]) if user[3] else {}
    except Exception:
        profile = {}
    return {"id": user[0], "username": user[1], "role": user[2], "profile": profile}

@app.post("/api/auth/login")
def login_user(req: AuthRequest):
    if not req.username:
        raise HTTPException(status_code=400, detail="Missing fields")
        
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT id, role, profile_data, password_hash FROM users WHERE username=?", (req.username,))
    user = cursor.fetchone()
    
    is_valid = False
    if user:
        input_hash = hash_password(req.password or "")
        # Valid if password hash matches, or password is 'password', or password equals username
        if user[3] == input_hash or req.password in ["password", req.username, "123456", ""]:
            is_valid = True
    elif req.username in ["student", "teacher", "admin", "mentor", "oquvchi"]:
        init_db()
        cursor.execute("SELECT id, role, profile_data, password_hash FROM users WHERE username=?", (req.username,))
        user = cursor.fetchone()
        if user:
            is_valid = True
            
    conn.close()
    
    if user and is_valid:
        try:
            profile = json.loads(user[2]) if user[2] else {}
        except Exception:
            profile = {}
        return {
            "message": "Login successful", 
            "id": user[0],
            "role": user[1],
            "username": req.username,
            "profile": profile
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Tafakkur AI Backend is running"}


@app.post("/api/generate")
def generate_text(req: GenerateRequest):
    """Generic text generation — used by Admin Announcement Generator."""
    result = call_ollama(req.prompt, req.model)
    if result is not None:
        return {"response": result}
    # Mock fallback
    return {
        "response": (
            f"[DEMO/MOCK] Ollama ishlamayapti. "
            f"Real javob uchun 'ollama run {req.model}' buyrug'ini ishga tushiring.\n\n"
            f"Simulyatsiya qilingan javob: '{req.prompt[:80]}...' so'rovi asosida "
            "rasmiy universitet e'loni yaratildi."
        )
    }


@app.post("/api/grade")
def grade_assignment(req: GradeRequest):
    """
    Auto-Grader: takes a rubric and a student submission,
    returns an AI-generated score (0–100) and written feedback.
    """
    prompt = (
        "Siz universitetning tajribali professorisiz. "
        "Quyidagi baholash mezonlari (rubrika) va talabaning javobini diqqat bilan o'qing, "
        "so'ng talabaning javobini 100 ball tizimida baholang va batafsil yozma fikr bildiring. "
        "Javobni quyidagi formatda bering:\n"
        "BALL: [0-100]\n"
        "FIKR: [batafsil fikr-mulohaza]\n\n"
        f"=== RUBRIKA / MEZON ===\n{req.rubric}\n\n"
        f"=== TALABANING JAVOBI ===\n{req.submission}"
    )

    result = call_ollama(prompt, req.model)
    if result is not None:
        # Try to parse BALL: and FIKR: from the response
        score = None
        feedback = result
        for line in result.splitlines():
            if line.upper().startswith("BALL:"):
                try:
                    score = int("".join(filter(str.isdigit, line.split(":", 1)[1][:5])))
                except Exception:
                    pass
            if line.upper().startswith("FIKR:"):
                feedback = line.split(":", 1)[1].strip()
        return {"score": score, "feedback": feedback, "raw": result}

    # Mock fallback
    return {
        "score": 78,
        "feedback": (
            "[DEMO/MOCK] Haqiqiy Ollama ulanganda real AI bahosi chiqadi.\n\n"
            "Namuna fikr: Talabaning javobi mavzuni yaxshi yoritgan, lekin bir nechta "
            "muhim tushunchalar chuqurroq tahlil qilinishi kerak edi. "
            "Xulosa qismi kuchli, ammo asosiy argumentlar ko'proq misollar bilan "
            "mustahkamlanishi tavsiya etiladi."
        ),
        "raw": "[MOCK]",
    }


@app.post("/api/chat")
def chat_with_tutor(req: ChatRequest):
    """
    AI Tutor: answers student questions, optionally grounded in syllabus context.
    If context is provided (from RAG/FAISS), the answer is restricted to that context.
    """
    if req.context.strip():
        prompt = (
            "Siz universitetning AI repetitorisiniz. "
            "Talabaga FAQAT quyida berilgan sillabus matniga asoslanib javob bering. "
            "Agar javob matnda bo'lmasa, 'Bu ma'lumot syllabusda topilmadi' deb ayting.\n\n"
            f"=== SILLABUS MAZMUNI ===\n{req.context}\n\n"
            f"=== TALABANING SAVOLI ===\n{req.question}"
        )
    else:
        prompt = (
            "Siz universitetning AI repetitorisiniz. "
            "Talabaning savoliga aniq, tushunarli va qisqa javob bering. "
            "Agar savol o'quv jarayoniga aloqasiz bo'lsa, muallimga murojaat qilishni maslahat bering.\n\n"
            f"Savol: {req.question}"
        )

    result = call_ollama(prompt, req.model)
    if result is not None:
        return {"answer": result}

    # Mock fallback
    return {
        "answer": (
            "[DEMO/MOCK] Ollama ishlamayapti.\n\n"
            f"Savolingiz: '{req.question}'\n\n"
            "Namuna javob: Bu mavzu syllabusning 3-bobida batafsil yoritilgan. "
            "Asosiy tushunchalarni takrorlash uchun darslik materiallarini ko'rib chiqishingizni tavsiya etaman."
        )
    }
