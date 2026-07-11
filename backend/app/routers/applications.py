from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/applications", tags=["Job Applications"])

@router.get("/", response_model=List[schemas.ApplicationOut])
def get_user_applications(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    apps = db.query(models.Application).filter(models.Application.user_id == current_user.id).order_by(models.Application.applied_at.desc()).all()
    return apps

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
