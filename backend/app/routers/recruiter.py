from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/recruiter", tags=["Recruiter Dashboard"])

@router.get("/jobs", response_model=List[schemas.JobOut])
def get_recruiter_posted_jobs(
    current_recruiter: models.User = Depends(auth.get_current_active_recruiter),
    db: Session = Depends(get_db)
):
    jobs = db.query(models.Job).filter(models.Job.recruiter_id == current_recruiter.id).order_by(models.Job.created_at.desc()).all()
    return jobs

@router.get("/jobs/{job_id}/applicants", response_model=List[schemas.ApplicationOut])
def get_job_applicants_ranking(
    job_id: int,
    current_recruiter: models.User = Depends(auth.get_current_active_recruiter),
    db: Session = Depends(get_db)
):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.recruiter_id != current_recruiter.id and current_recruiter.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to view applicants for this job")

    # Applicants sorted by match_score & ats_score descending
    apps = db.query(models.Application).filter(models.Application.job_id == job_id).order_by(
        models.Application.match_score.desc(),
        models.Application.ats_score.desc()
    ).all()

    return apps

@router.put("/jobs/{job_id}", response_model=schemas.JobOut)
def update_job(
    job_id: int,
    job_in: schemas.JobCreate,
    current_recruiter: models.User = Depends(auth.get_current_active_recruiter),
    db: Session = Depends(get_db)
):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.recruiter_id != current_recruiter.id and current_recruiter.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to edit this job")

    for field, val in job_in.model_dump().items():
        setattr(job, field, val)

    db.commit()
    db.refresh(job)
    return job

@router.delete("/jobs/{job_id}")
def delete_job(
    job_id: int,
    current_recruiter: models.User = Depends(auth.get_current_active_recruiter),
    db: Session = Depends(get_db)
):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.recruiter_id != current_recruiter.id and current_recruiter.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this job")

    db.delete(job)
    db.commit()
    return {"message": "Job posting deleted successfully"}
