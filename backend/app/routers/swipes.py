from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas, auth
from app.ai.recommendation_engine import rank_jobs_for_swipe
from app.ai.matching_engine import compute_job_match
from app.ai.job_aggregator import sync_external_jobs_to_db

router = APIRouter(prefix="/swipes", tags=["Swipe Job Discovery"])

@router.get("/feed", response_model=List[schemas.JobOut])
def get_swipe_recommendation_feed(
    limit: int = 20,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Ensure database has active external jobs
    sync_external_jobs_to_db(db)

    # Fetch candidate profile & active resume
    profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == current_user.id).first()
    user_profile_dict = {
        "skills": profile.skills if profile else [],
        "experience_years": profile.experience_years if profile else 0.0,
        "target_role": profile.target_role if profile else "",
        "remote_only": profile.remote_only if profile else False
    }

    primary_resume = db.query(models.Resume).filter(
        models.Resume.user_id == current_user.id,
        models.Resume.is_primary == True
    ).first()
    
    resume_data = {
        "parsed_text": primary_resume.parsed_text if primary_resume else "",
        "skills": primary_resume.extracted_skills if primary_resume else [],
        "experience_years": user_profile_dict["experience_years"]
    }

    # Fetch IDs of already swiped jobs by this user
    already_swiped_ids = [s.job_id for s in db.query(models.SwipeAction.job_id).filter(models.SwipeAction.user_id == current_user.id).all()]

    # Fetch available active jobs not yet swiped
    unswiped_jobs = db.query(models.Job).filter(
        models.Job.status == "active",
        ~models.Job.id.in_(already_swiped_ids) if already_swiped_ids else True
    ).all()

    # If all swiped, return general active jobs list as infinite feed
    if not unswiped_jobs:
        unswiped_jobs = db.query(models.Job).filter(models.Job.status == "active").limit(limit).all()

    # Fetch user swipe history for adaptive recommendation learning
    swipe_history_records = db.query(models.SwipeAction).filter(models.SwipeAction.user_id == current_user.id).all()
    swipe_history = []
    for s in swipe_history_records:
        job_obj = db.query(models.Job).filter(models.Job.id == s.job_id).first()
        if job_obj:
            swipe_history.append({
                "action": s.action,
                "job": {
                    "company_type": job_obj.company_type,
                    "title": job_obj.title,
                    "required_skills": job_obj.required_skills
                }
            })

    # Prepare jobs dictionaries for recommendation engine
    jobs_dicts = []
    for j in unswiped_jobs:
        j_dict = {
            "id": j.id,
            "recruiter_id": j.recruiter_id,
            "title": j.title,
            "company": j.company,
            "company_logo": j.company_logo or "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
            "company_type": j.company_type or "Startup",
            "location": j.location or "Remote",
            "is_remote": j.is_remote if j.is_remote is not None else True,
            "is_hybrid": j.is_hybrid if j.is_hybrid is not None else False,
            "job_type": j.job_type or "Full Time",
            "salary_min": j.salary_min or 110000,
            "salary_max": j.salary_max or 160000,
            "currency": j.currency or "USD",
            "experience_level": j.experience_level or "Mid Level",
            "description": j.description or "Scalable engineering role.",
            "required_skills": j.required_skills or [],
            "nice_to_have_skills": j.nice_to_have_skills or [],
            "is_fresher_friendly": j.is_fresher_friendly if j.is_fresher_friendly is not None else True,
            "low_competition": j.low_competition if j.low_competition is not None else True,
            "status": j.status,
            "applicants_count": j.applicants_count or 0,
            "created_at": j.created_at
        }
        jobs_dicts.append(j_dict)

    ranked_jobs = rank_jobs_for_swipe(user_profile_dict, resume_data, jobs_dicts, swipe_history)
    return ranked_jobs[:limit]

@router.post("/action")
def record_swipe_action(
    swipe_in: schemas.SwipeCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(models.Job).filter(models.Job.id == swipe_in.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    existing_swipe = db.query(models.SwipeAction).filter(
        models.SwipeAction.user_id == current_user.id,
        models.SwipeAction.job_id == swipe_in.job_id
    ).first()

    if existing_swipe:
        existing_swipe.action = swipe_in.action
    else:
        new_swipe = models.SwipeAction(
            user_id=current_user.id,
            job_id=swipe_in.job_id,
            action=swipe_in.action
        )
        db.add(new_swipe)

    db.commit()

    if swipe_in.action == "like":
        existing_app = db.query(models.Application).filter(
            models.Application.user_id == current_user.id,
            models.Application.job_id == swipe_in.job_id
        ).first()

        if not existing_app:
            primary_resume = db.query(models.Resume).filter(
                models.Resume.user_id == current_user.id,
                models.Resume.is_primary == True
            ).first()

            profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == current_user.id).first()
            user_profile_dict = {"skills": profile.skills if profile else [], "experience_years": profile.experience_years if profile else 0.0}
            resume_data = {"parsed_text": primary_resume.parsed_text if primary_resume else "", "skills": primary_resume.extracted_skills if primary_resume else []}
            
            job_dict = {
                "title": job.title, "description": job.description,
                "required_skills": job.required_skills or [], "nice_to_have_skills": job.nice_to_have_skills or [],
                "experience_level": job.experience_level, "is_remote": job.is_remote
            }
            
            match_res = compute_job_match(user_profile_dict, resume_data, job_dict)

            application = models.Application(
                user_id=current_user.id,
                job_id=swipe_in.job_id,
                resume_id=primary_resume.id if primary_resume else None,
                match_score=match_res["match_percentage"],
                ats_score=primary_resume.ats_score if primary_resume else 70,
                status=models.ApplicationStatus.APPLIED.value
            )
            db.add(application)
            job.applicants_count += 1
            
            notif = models.Notification(
                user_id=current_user.id,
                title="Application Submitted!",
                message=f"You successfully applied for {job.title} at {job.company}.",
                type="application"
            )
            db.add(notif)
            db.commit()

    return {"message": f"Recorded swipe '{swipe_in.action}' for job {job.title}", "action": swipe_in.action}
