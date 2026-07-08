from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/jobs", tags=["Jobs & Search"])

@router.get("/", response_model=List[schemas.JobOut])
def list_and_search_jobs(
    search: Optional[str] = None,
    company_type: Optional[str] = None, # MNC, Startup, Newly Founded Startup
    is_remote: Optional[bool] = None,
    is_hybrid: Optional[bool] = None,
    job_type: Optional[str] = None,
    experience_level: Optional[str] = None,
    is_fresher_friendly: Optional[bool] = None,
    low_competition: Optional[bool] = None,
    min_salary: Optional[int] = None,
    skills: Optional[str] = None, # Comma separated
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(models.Job).filter(models.Job.status == "active")

    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (models.Job.title.ilike(search_fmt)) |
            (models.Job.company.ilike(search_fmt)) |
            (models.Job.description.ilike(search_fmt))
        )

    if company_type:
        query = query.filter(models.Job.company_type == company_type)

    if is_remote is not None:
        query = query.filter(models.Job.is_remote == is_remote)

    if is_hybrid is not None:
        query = query.filter(models.Job.is_hybrid == is_hybrid)

    if job_type:
        query = query.filter(models.Job.job_type == job_type)

    if experience_level:
        query = query.filter(models.Job.experience_level == experience_level)

    if is_fresher_friendly is not None:
        query = query.filter(models.Job.is_fresher_friendly == is_fresher_friendly)

    if low_competition is not None:
        query = query.filter(models.Job.low_competition == low_competition)

    if min_salary is not None:
        query = query.filter(models.Job.salary_max >= min_salary)

    jobs = query.order_by(models.Job.created_at.desc()).offset(skip).limit(limit).all()
    return jobs

@router.get("/{job_id}", response_model=schemas.JobOut)
def get_job_by_id(job_id: int, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.post("/", response_model=schemas.JobOut)
def create_job(
    job_in: schemas.JobCreate,
    current_recruiter: models.User = Depends(auth.get_current_active_recruiter),
    db: Session = Depends(get_db)
):
    job = models.Job(
        recruiter_id=current_recruiter.id,
        **job_in.model_dump()
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job
