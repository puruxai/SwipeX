# SwipeX – AI Swipe-Based Intelligent Job Discovery & Career Assistance Platform

![SwipeX Cover Banner](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80)

SwipeX is a full-stack, AI-powered career platform designed to make job discovery effortless and engaging using Tinder-style swipe gestures (Swipe Right to Apply, Swipe Left to Skip). Backed by FastAPI, Python AI/NLP algorithms, and a React glassmorphic UI, SwipeX automatically parses candidate resumes, calculates ATS scores (0-100), performs semantic TF-IDF job matching, provides skill-gap reports, ranks candidate applications for recruiters, and adapts its recommendation feed dynamically based on user swipe behavior.

---

## Key Features Matrix

### 1. 🎴 Swipe Job Discovery Feed
- **Tinder-Style Gesture Cards**: Swipe Right to Apply instantly, Swipe Left to Pass, Swipe Up to Bookmark/Save.
- **Card Flip & Match Rationale**: View overall Match %, TF-IDF Vector score, missing skills list, and human-readable AI recommendation reason.
- **Adaptive Recommendation Learning**: Machine learning algorithm boosts preferred company types (MNC, Startup) and skill clusters based on previous Swipe Right actions.
- **Undo Swipe**: Ability to revert previous swipes instantly.

### 2. 📄 AI Resume Parser & ATS Score Gauge
- **Multi-Format Support**: Upload PDF, DOCX, or TXT resumes.
- **Real-Time ATS Scorer (0-100)**: Evaluates contact info, section structure, skill density, impact action verbs, and document length.
- **Skill Extraction & Taxonomy Sync**: Automatically extracts technical and soft skills and updates user profile preferences.
- **Actionable Optimization Report**: Highlights missing section headers, weak action verbs, and formatting recommendations.

### 3. 🔍 Smart Job Search & Multi-Criteria Filters
- **Company Filters**: MNC, Startup, Newly Founded Startup.
- **Flexibility Badges**: 100% Remote, Hybrid, Onsite.
- **Salary Slider & Experience Levels**: Filter by minimum annual compensation ($0 - $200k+), Entry Level, Mid Level, Senior.
- **Badges**: Fresher Friendly, Low Competition roles.

### 4. 📊 Candidate Discovery Dashboard
- **Recharts Analytics**: Monthly application trends area chart & application status funnel bar chart.
- **Skill Gap & Readiness Report**: Identifies top missing skills demanded across target job postings and suggests high-impact learning paths.
- **Application Status Tracker**: Monitor status changes (Applied, Shortlisted, Interviewing, Offered, Rejected).

### 5. 💼 Recruiter HQ & AI Candidate Ranking
- **Post Job Listing Wizard**: AI job descriptor tool for defining required skills, salary ranges, and company types.
- **ATS Candidate Ranking Board**: Applicants sorted automatically by AI Match % and ATS Score.
- **One-Click Status Updater**: Change candidate status and send automated status update notifications.

### 6. 🛡️ Admin Security & Control Panel
- **User & Recruiter Management**: Enable/Disable candidate or recruiter accounts.
- **Platform Analytics**: Total users, posted jobs, swipes recorded, and application conversion rates.
- **Security Audit Logs**: Track authentication events, job posts, and ATS scans.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS (Custom Dark Glassmorphic Design System), Framer Motion, Lucide React Icons, Recharts, Axios, Context API (Auth & Notifications).
- **Backend**: Python 3.11, FastAPI, SQLAlchemy ORM, Pydantic v2, Scikit-Learn (TF-IDF Vectorizer & Cosine Similarity), PyPDF, Python-Docx, PyTest.
- **Security**: OAuth2 with Password hashing (Bcrypt) & JWT Access Tokens (Role-Based Access Control: Candidate, Recruiter, Admin).
- **Database**: SQLite (Zero-configuration out-of-the-box local setup) / PostgreSQL support.
- **DevOps**: Docker, Docker Compose, Nginx, GitHub Actions CI/CD.

---

## 🚀 Quick Start Guide

### Option 1: Docker Compose (Recommended)

Run the entire full-stack platform with a single command:

```bash
docker-compose up --build
```

- **Frontend UI**: http://localhost:3000
- **FastAPI Backend & Swagger Docs**: http://localhost:8000/docs

---

### Option 2: Local Development Setup

#### 1. Backend Setup (FastAPI)

```bash
cd backend

# Create virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database seeder
python app/seed.py

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

Backend Swagger REST API Documentation will be available at: http://localhost:8000/docs

#### 2. Frontend Setup (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Frontend application will open at: http://localhost:3000

---

## 🔑 Demo Account Credentials

The platform comes pre-seeded with rich sample datasets and demo accounts:

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **Job Seeker (Candidate)** | `alex@swipex.io` | `Password123!` | Swipe feed, Resume ATS scanner, Dashboard, Job Search |
| **Recruiter** | `recruiter@techcorp.com` | `Password123!` | Post jobs, View AI ATS candidate rankings, Status updates |
| **Platform Admin** | `admin@swipex.io` | `Password123!` | System stats, User control, Audit logs |

---

## 🧪 Running Unit Tests

Run backend test suite with PyTest:

```bash
cd backend
pytest tests/
```

---

## 📜 License

SwipeX is released under the MIT License.
