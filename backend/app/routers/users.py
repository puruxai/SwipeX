from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/users", tags=["Users & Profiles"])

@router.get("/profile", response_model=schemas.UserProfileOut)
def get_user_profile(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == current_user.id).first()
    if not profile:
        profile = models.UserProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("/profile", response_model=schemas.UserProfileOut)
def update_user_profile(
    profile_in: schemas.UserProfileUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == current_user.id).first()
    if not profile:
        profile = models.UserProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()

    update_data = profile_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile

@router.delete("/profile")
def delete_user_account(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Delete through the ORM so configured relationship cascades are honored.
    # A bulk query delete bypasses those cascades and can leave orphaned rows.
    db.delete(current_user)
    db.commit()
    return {"message": "User account and all associated profile records successfully purged."}

@router.get("/profile/export")
def export_user_data(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == current_user.id).first()
    resumes = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).all()
    applications = db.query(models.Application).filter(models.Application.user_id == current_user.id).all()
    swipes = db.query(models.SwipeAction).filter(models.SwipeAction.user_id == current_user.id).all()
    
    return {
        "user_details": {
            "email": current_user.email,
            "full_name": current_user.full_name,
            "role": current_user.role,
            "created_at": current_user.created_at
        },
        "profile": {
            "headline": profile.headline if profile else None,
            "bio": profile.bio if profile else None,
            "skills": profile.skills if profile else [],
            "experience_years": profile.experience_years if profile else 0.0,
            "location": profile.location if profile else None
        },
        "resumes_count": len(resumes),
        "applications": [{"job_id": app.job_id, "status": app.status, "applied_at": app.applied_at} for app in applications],
        "swipes_count": len(swipes)
    }
