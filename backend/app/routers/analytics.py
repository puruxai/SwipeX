from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.database import get_db
from app import models, auth
from app.ai.skill_analyzer import generate_skill_gap_report

router = APIRouter(prefix="/analytics", tags=["Analytics & Insights"])

@router.get("/dashboard")
def get_candidate_dashboard_analytics(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    apps = db.query(models.Application).filter(models.Application.user_id == current_user.id).all()
    swipes = db.query(models.SwipeAction).filter(models.SwipeAction.user_id == current_user.id).all()
    resumes = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).all()
    profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == current_user.id).first()

    total_applied = len(apps)
    shortlisted = len([a for a in apps if a.status == "Shortlisted"])
    interviewing = len([a for a in apps if a.status == "Interviewing"])
    offered = len([a for a in apps if a.status == "Offered"])
    rejected = len([a for a in apps if a.status == "Rejected"])
    saved_jobs_count = len([s for s in swipes if s.action == "save"])

    success_rate = round(((shortlisted + interviewing + offered) / max(total_applied, 1)) * 100, 1)
    avg_match = round(sum([a.match_score for a in apps]) / max(total_applied, 1), 1) if apps else 78.5

    latest_resume = db.query(models.Resume).filter(
        models.Resume.user_id == current_user.id,
        models.Resume.is_primary == True
    ).first()
    latest_ats_score = latest_resume.ats_score if latest_resume else (resumes[0].ats_score if resumes else 0)

    # Monthly trends mock data format for Recharts
    monthly_trends = [
        {"month": "Jan", "applications": max(0, total_applied - 8), "interviews": max(0, interviewing - 2)},
        {"month": "Feb", "applications": max(0, total_applied - 5), "interviews": max(0, interviewing - 1)},
        {"month": "Mar", "applications": max(0, total_applied - 3), "interviews": interviewing},
        {"month": "Apr", "applications": total_applied, "interviews": interviewing + 1}
    ]

    # Target jobs for skill gap analysis
    applied_job_ids = [a.job_id for a in apps]
    target_jobs = db.query(models.Job).filter(models.Job.id.in_(applied_job_ids)).all() if applied_job_ids else db.query(models.Job).limit(10).all()
    target_jobs_dicts = [{"required_skills": j.required_skills or []} for j in target_jobs]

    user_skills = profile.skills if profile else []
    skill_gap_report = generate_skill_gap_report(user_skills, target_jobs_dicts)

    return {
        "summary": {
            "total_applied": total_applied,
            "saved_jobs": saved_jobs_count,
            "shortlisted": shortlisted,
            "interviewing": interviewing,
            "offered": offered,
            "rejected": rejected,
            "success_rate": success_rate,
            "average_match_score": avg_match,
            "latest_ats_score": latest_ats_score
        },
        "monthly_trends": monthly_trends,
        "skill_gap_report": skill_gap_report,
        "ats_breakdown": latest_resume.ats_breakdown_json if latest_resume else {}
    }
