import urllib.request
import json
import logging
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app import models

logger = logging.getLogger("job_aggregator")

ARBEITNOW_API_URL = "https://www.arbeitnow.com/api/job-board-api"
REMOTIVE_API_URL = "https://remotive.com/api/remote-jobs?category=software-dev&limit=25"

def fetch_external_jobs() -> List[Dict[str, Any]]:
    """
    Fetches real-world active software engineering and AI job postings
    from public job board APIs (Arbeitnow, Remotive).
    """
    normalized_jobs = []

    # 1. Fetch from Arbeitnow Public API
    try:
        req = urllib.request.Request(ARBEITNOW_API_URL, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            items = data.get("data", [])
            for item in items[:15]:
                title = item.get("title", "Software Engineer")
                company = item.get("company_name", "Tech Startup")
                location = item.get("location", "Remote")
                description = item.get("description", "Join our software development team.")
                tags = item.get("tags", ["Python", "React", "Docker"])
                
                normalized_jobs.append({
                    "title": title,
                    "company": company,
                    "company_logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
                    "company_type": "Startup" if "startup" in description.lower() else "MNC",
                    "location": location,
                    "is_remote": True if "remote" in location.lower() or item.get("remote", False) else False,
                    "is_hybrid": False,
                    "job_type": "Full Time",
                    "salary_min": 110000,
                    "salary_max": 160000,
                    "currency": "USD",
                    "experience_level": "Mid Level",
                    "description": description[:1000],
                    "required_skills": tags[:6] if tags else ["Python", "React"],
                    "nice_to_have_skills": ["AWS", "Docker"],
                    "is_fresher_friendly": True,
                    "low_competition": True
                })
    except Exception as e:
        logger.warning(f"Arbeitnow job fetch notice: {e}")

    # 2. Fetch from Remotive API
    try:
        req = urllib.request.Request(REMOTIVE_API_URL, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            items = data.get("jobs", [])
            for item in items[:15]:
                title = item.get("title", "Senior Developer")
                company = item.get("company_name", "Cloud Corp")
                description = item.get("description", "Building scalable cloud applications.")
                tags = item.get("tags", ["Python", "FastAPI", "TypeScript"])
                
                normalized_jobs.append({
                    "title": title,
                    "company": company,
                    "company_logo": item.get("company_logo", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&auto=format&fit=crop&q=80"),
                    "company_type": "MNC",
                    "location": "Remote",
                    "is_remote": True,
                    "is_hybrid": False,
                    "job_type": "Full Time",
                    "salary_min": 125000,
                    "salary_max": 175000,
                    "currency": "USD",
                    "experience_level": "Senior",
                    "description": description[:1000],
                    "required_skills": tags[:6] if tags else ["Python", "TypeScript"],
                    "nice_to_have_skills": ["Kubernetes", "PostgreSQL"],
                    "is_fresher_friendly": False,
                    "low_competition": True
                })
    except Exception as e:
        logger.warning(f"Remotive job fetch notice: {e}")

    return normalized_jobs

def sync_external_jobs_to_db(db: Session) -> int:
    """
    Syncs fetched external job postings into database if not already present.
    """
    external_jobs = fetch_external_jobs()
    if not external_jobs:
        return 0

    # Get recruiter user for assigning job creator
    recruiter = db.query(models.User).filter(models.User.role == "recruiter").first()
    recruiter_id = recruiter.id if recruiter else 1

    added_count = 0
    for j_data in external_jobs:
        existing = db.query(models.Job).filter(
            models.Job.title == j_data["title"],
            models.Job.company == j_data["company"]
        ).first()
        
        if not existing:
            job = models.Job(
                recruiter_id=recruiter_id,
                **j_data
            )
            db.add(job)
            added_count += 1

    if added_count > 0:
        db.commit()

    return added_count
