import pytest
import random
from fastapi.testclient import TestClient
from app.main import app
from app.ai.resume_parser import parse_resume_text
from app.ai.ats_engine import calculate_ats_score
from app.ai.matching_engine import compute_job_match
from app.ai.recommendation_engine import rank_jobs_for_swipe
from app.ai.skill_analyzer import generate_skill_gap_report
from app.ai.generative_tools import (
    generate_cover_letter,
    generate_interview_questions,
    generate_career_roadmap,
    predict_salary_range
)

client = TestClient(app)

def test_root_and_health():
    response = client.get("/")
    assert response.status_code == 200

def test_auth_registration_and_login():
    rand_id = random.randint(10000, 99999)
    email = f"audit_user_{rand_id}@swipex.io"
    
    reg_res = client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "Password123!",
        "full_name": "Audit Candidate",
        "role": "user"
    })
    assert reg_res.status_code == 200
    reg_data = reg_res.json()
    assert "access_token" in reg_data
    token = reg_data["access_token"]

    login_res = client.post("/api/v1/auth/login", json={
        "email": email,
        "password": "Password123!"
    })
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()

    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == email

def test_ai_resume_parser_extensive():
    raw_text = """
    ALEX MERCER
    alex.mercer@test.org | +1 (555) 987-6543 | San Francisco, CA

    SUMMARY
    Senior Full Stack Engineer with 5+ years experience building cloud applications with Python, FastAPI, React, TypeScript, Docker, PostgreSQL, AWS, and Machine Learning.

    EXPERIENCE
    Lead Engineer | Quantum Labs | 2021 - Present
    - Architected microservices with Python and FastAPI serving 100k users.
    - Reduced API latency by 45% and scaled database queries.

    EDUCATION
    B.S. Computer Science | Stanford University | 2020

    SKILLS
    Python, React, FastAPI, Docker, PostgreSQL, AWS, Kubernetes, Scikit-Learn, PyTest, Git
    """
    parsed = parse_resume_text(raw_text)
    assert parsed["email"] == "alex.mercer@test.org"
    assert parsed["experience_years"] >= 5.0
    assert "Python" in parsed["skills"]
    assert "Fastapi" in parsed["skills"] or "FastAPI" in parsed["skills"]
    assert parsed["has_sections"]["experience"] is True
    assert parsed["has_sections"]["education"] is True

def test_ai_ats_scoring_accuracy():
    parsed_data = {
        "email": "candidate@swipex.io",
        "phone": "+1-555-0199",
        "skills": ["Python", "React", "FastAPI", "Docker", "PostgreSQL", "AWS", "Git", "PyTest", "Scikit-Learn", "TypeScript"],
        "experience_years": 4.0,
        "has_sections": {"experience": True, "education": True, "projects": True, "skills": True},
        "word_count": 450,
        "parsed_text": "Architected microservices, reduced latency by 45%, managed $100k budget. Built React UI."
    }
    score_report = calculate_ats_score(parsed_data)
    assert score_report["ats_score"] >= 80
    assert "breakdown" in score_report
    assert score_report["breakdown"]["contact_info"]["score"] == 15

def test_ai_semantic_job_matching():
    user_profile = {"skills": ["Python", "FastAPI", "React", "Docker"], "experience_years": 3.0}
    resume_data = {"parsed_text": "Experienced Python engineer building React and FastAPI cloud apps.", "skills": ["Python", "React", "FastAPI"]}
    job = {
        "title": "Senior AI & Full Stack Engineer",
        "description": "Looking for a Python FastAPI and React developer with Docker experience.",
        "required_skills": ["Python", "FastAPI", "React", "Docker"],
        "nice_to_have_skills": ["AWS"],
        "experience_level": "Mid Level",
        "is_remote": True
    }
    match = compute_job_match(user_profile, resume_data, job)
    assert match["match_percentage"] >= 85.0
    assert "recommendation_reason" in match

def test_ai_generative_cover_letter():
    profile = {"full_name": "Jane Developer", "skills": ["Python", "FastAPI", "React"]}
    job = {"title": "Senior AI Engineer", "company": "NeuralStack"}
    res = generate_cover_letter(profile, job)
    assert "NeuralStack" in res["cover_letter"]
    assert "Jane Developer" in res["cover_letter"]

def test_ai_generative_interview_questions():
    questions = generate_interview_questions("Senior AI Engineer", ["Python", "FastAPI", "Docker"])
    assert len(questions) >= 3
    assert "question" in questions[0]
    assert "answer_guide" in questions[0]

def test_ai_generative_career_roadmap():
    roadmap = generate_career_roadmap("Software Developer", "Senior AI Architect", ["Python", "React"])
    assert len(roadmap["milestones"]) == 4

def test_ai_generative_salary_prediction():
    pred = predict_salary_range("Senior AI Engineer", ["Python", "React", "FastAPI"], 4.0, "San Francisco", "Startup")
    assert pred["predicted_median"] > 100000

def test_role_based_access_security():
    rand_id = random.randint(10000, 99999)
    email = f"candidate_sec_{rand_id}@swipex.io"
    
    reg = client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "Password123!",
        "full_name": "Sec Candidate",
        "role": "user"
    })
    token = reg.json().get("access_token")
    
    rec_res = client.get("/api/v1/recruiter/jobs", headers={"Authorization": f"Bearer {token}"})
    assert rec_res.status_code == 403

    admin_res = client.get("/api/v1/admin/stats", headers={"Authorization": f"Bearer {token}"})
    assert admin_res.status_code == 403

def test_admin_telemetry_endpoint():
    login_res = client.post("/api/v1/auth/login", json={
        "email": "admin@swipex.io",
        "password": "Password123!"
    })
    assert login_res.status_code == 200
    token = login_res.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    
    res = client.get("/api/v1/admin/telemetry", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "total_requests" in data
    assert "api_requests" in data
    assert "ai_requests" in data
    assert "avg_response_time_ms" in data
    assert "recent_trends" in data
