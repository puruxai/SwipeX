import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.ai.resume_parser import parse_resume_text
from app.ai.ats_engine import calculate_ats_score
from app.ai.matching_engine import compute_job_match
from app.auth import get_password_hash, verify_password

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_resume_parser_ai():
    raw_text = """
    Jane Doe
    jane@example.com | 555-0199
    Skills: Python, React, FastAPI, Docker, SQL, AWS
    Experience: Developed microservices for 4 years. Improved system performance by 40%.
    Education: BS Computer Science
    """
    parsed = parse_resume_text(raw_text)
    assert parsed["email"] == "jane@example.com"
    assert "Python" in parsed["skills"]
    assert "React" in parsed["skills"]

def test_ats_engine_scoring():
    raw_text = "John Smith\njohn@test.com\nSkills: Python, Docker, React\nExperience: Built web apps."
    parsed = parse_resume_text(raw_text)
    ats_result = calculate_ats_score(parsed)
    assert "ats_score" in ats_result
    assert 0 <= ats_result["ats_score"] <= 100

def test_job_match_calculator():
    user_profile = {"skills": ["Python", "FastAPI", "React"], "experience_years": 3.0}
    resume_data = {"parsed_text": "Experienced Python engineer with React frontend background.", "skills": ["Python", "React"]}
    job = {
        "title": "Full Stack Engineer",
        "description": "Python FastAPI and React developer needed",
        "required_skills": ["Python", "React", "FastAPI"],
        "nice_to_have_skills": ["Docker"],
        "experience_level": "Mid Level"
    }
    match_res = compute_job_match(user_profile, resume_data, job)
    assert match_res["match_percentage"] > 70.0
    assert len(match_res["missing_skills"]) == 0

def test_password_hash_round_trip():
    """Registration must not depend on an incompatible native bcrypt wheel."""
    password = "Password123!"
    hashed_password = get_password_hash(password)
    assert hashed_password != password
    assert verify_password(password, hashed_password)
    assert not verify_password("incorrect-password", hashed_password)

def test_password_length_policy():
    """Verify password policy limits: 6 character minimum is accepted, 5 is rejected."""
    import random
    rand_val = random.randint(1000, 9999)
    response_ok = client.post("/api/v1/auth/register", json={
        "email": f"test_policy_{rand_val}@example.com",
        "password": "abc123",
        "fullName": "Policy Tester",
        "role": "user"
    })
    assert response_ok.status_code == 200
    assert "access_token" in response_ok.json()

    # Test invalid registration (5 chars)
    response_fail = client.post("/api/v1/auth/register", json={
        "email": f"test_fail_{rand_val}@example.com",
        "password": "abc12",
        "fullName": "Policy Failure Tester",
        "role": "user"
    })
    assert response_fail.status_code == 422

def test_ai_matching_logic_by_domain():
    """Verify domain categories match accurately and filter out other categories."""
    # 1. AI Engineer
    ai_profile = {"skills": ["Python", "PyTorch", "LLM"], "experience_years": 3.0, "target_role": "AI Engineer"}
    ai_resume = {"parsed_text": "AI Engineer skilled in PyTorch and LLMs", "skills": ["Python", "PyTorch"]}
    
    # 2. Frontend
    fe_profile = {"skills": ["React", "TypeScript"], "experience_years": 2.0, "target_role": "Frontend Developer"}
    fe_resume = {"parsed_text": "Frontend Developer skilled in React and TypeScript", "skills": ["React", "TypeScript"]}
    
    # 3. DevOps
    devops_profile = {"skills": ["Docker", "Kubernetes", "AWS"], "experience_years": 4.0, "target_role": "DevOps Engineer"}
    devops_resume = {"parsed_text": "DevOps Engineer with Kubernetes and AWS", "skills": ["Docker", "Kubernetes"]}
    
    # 4. Backend
    be_profile = {"skills": ["FastAPI", "PostgreSQL", "Python"], "experience_years": 3.0, "target_role": "Backend Developer"}
    be_resume = {"parsed_text": "Backend Developer specializing in FastAPI and Python", "skills": ["FastAPI", "PostgreSQL"]}

    # 5. Data Scientist
    ds_profile = {"skills": ["Python", "Pandas", "Scikit-Learn"], "experience_years": 3.0, "target_role": "Data Scientist"}
    ds_resume = {"parsed_text": "Data Scientist with Pandas and Machine Learning", "skills": ["Python", "Pandas"]}

    # 6. Cyber Security
    cs_profile = {"skills": ["Cybersecurity", "Penetration Testing"], "experience_years": 3.0, "target_role": "Cyber Security"}
    cs_resume = {"parsed_text": "Cybersecurity Engineer with Penetration Testing experience", "skills": ["Cybersecurity"]}

    # Sample jobs
    job_ai = {"title": "Machine Learning Engineer", "required_skills": ["Python", "PyTorch"], "description": "Build ML models"}
    job_fe = {"title": "React Frontend Engineer", "required_skills": ["React"], "description": "Build UI"}
    job_devops = {"title": "Cloud Platform DevOps", "required_skills": ["Kubernetes"], "description": "CI/CD cloud"}
    job_be = {"title": "FastAPI Backend Developer", "required_skills": ["Python", "FastAPI"], "description": "Database APIs"}
    job_ds = {"title": "Data Scientist - NLP", "required_skills": ["Python", "Pandas"], "description": "Build analytics models"}
    job_cs = {"title": "Cyber Security Analyst", "required_skills": ["SIEM"], "description": "Analyze network security"}
    job_unrelated = {"title": "Accountant & Sales Lead", "required_skills": ["Accounting"], "description": "Finance tax filings"}

    # Test AI matches only AI
    assert compute_job_match(ai_profile, ai_resume, job_ai)["match_percentage"] >= 70.0
    assert compute_job_match(ai_profile, ai_resume, job_fe)["match_percentage"] < 70.0
    assert compute_job_match(ai_profile, ai_resume, job_unrelated)["match_percentage"] < 70.0

    # Test FE matches only FE
    assert compute_job_match(fe_profile, fe_resume, job_fe)["match_percentage"] >= 70.0
    assert compute_job_match(fe_profile, fe_resume, job_devops)["match_percentage"] < 70.0

    # Test DevOps matches only DevOps
    assert compute_job_match(devops_profile, devops_resume, job_devops)["match_percentage"] >= 70.0
    assert compute_job_match(devops_profile, devops_resume, job_be)["match_percentage"] < 70.0

    # Test Backend matches only Backend
    assert compute_job_match(be_profile, be_resume, job_be)["match_percentage"] >= 70.0
    assert compute_job_match(be_profile, be_resume, job_ds)["match_percentage"] < 70.0

    # Test Data Scientist matches only DS
    assert compute_job_match(ds_profile, ds_resume, job_ds)["match_percentage"] >= 70.0
    assert compute_job_match(ds_profile, ds_resume, job_cs)["match_percentage"] < 70.0

    # Test Cyber Security matches only CS
    assert compute_job_match(cs_profile, cs_resume, job_cs)["match_percentage"] >= 70.0
    assert compute_job_match(cs_profile, cs_resume, job_ai)["match_percentage"] < 70.0
