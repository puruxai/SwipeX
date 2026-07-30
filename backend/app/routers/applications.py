from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas, auth
from app.ai.matching_engine import compute_job_match

router = APIRouter(prefix="/applications", tags=["Job Applications"])

@router.get("/", response_model=List[schemas.ApplicationOut])
def get_user_applications(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    apps = db.query(models.Application).filter(models.Application.user_id == current_user.id).order_by(models.Application.applied_at.desc()).all()
    return apps

@router.post("/apply", response_model=schemas.ApplicationOut, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=schemas.ApplicationOut, status_code=status.HTTP_201_CREATED)
def apply_to_job(
    swipe_in: schemas.SwipeCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(models.Job).filter(models.Job.id == swipe_in.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    existing_app = db.query(models.Application).filter(
        models.Application.user_id == current_user.id,
        models.Application.job_id == swipe_in.job_id
    ).first()

    if existing_app:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="You have already applied for this job.")

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
    
    # Record swipe action for analytics consistency
    existing_swipe = db.query(models.SwipeAction).filter(
        models.SwipeAction.user_id == current_user.id,
        models.SwipeAction.job_id == swipe_in.job_id
    ).first()
    if existing_swipe:
        existing_swipe.action = "like"
    else:
        new_swipe = models.SwipeAction(user_id=current_user.id, job_id=swipe_in.job_id, action="like")
        db.add(new_swipe)

    notif = models.Notification(
        user_id=current_user.id,
        title="Application Submitted!",
        message=f"You successfully applied for {job.title} at {job.company}.",
        type="application"
    )
    db.add(notif)
    db.commit()
    db.refresh(application)

    return application

@router.get("/saved", response_model=List[schemas.JobOut])
def get_saved_jobs(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    saved_swipes = db.query(models.SwipeAction).filter(
        models.SwipeAction.user_id == current_user.id,
        models.SwipeAction.action == "save"
    ).all()

    job_ids = [s.job_id for s in saved_swipes]
    if not job_ids:
        return []
        
    jobs = db.query(models.Job).filter(models.Job.id.in_(job_ids)).all()
    return jobs

@router.put("/{app_id}/status", response_model=schemas.ApplicationOut)
def update_application_status(
    app_id: int,
    status_update: schemas.ApplicationStatusUpdate,
    current_user: models.User = Depends(auth.get_current_active_recruiter),
    db: Session = Depends(get_db)
):
    app_obj = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app_obj:
        raise HTTPException(status_code=404, detail="Application not found")
    if current_user.role != models.UserRole.ADMIN.value and app_obj.job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only update applications for your own jobs")

    app_obj.status = status_update.status
    if status_update.notes:
        app_obj.notes = status_update.notes

    db.commit()
    db.refresh(app_obj)

    # Notify applicant
    notif = models.Notification(
        user_id=app_obj.user_id,
        title="Application Status Updated",
        message=f"Your application status for {app_obj.job.title} changed to '{status_update.status}'.",
        type="interview" if status_update.status in ["Interviewing", "Offered"] else "info"
    )
    db.add(notif)
    db.commit()

    return app_obj
