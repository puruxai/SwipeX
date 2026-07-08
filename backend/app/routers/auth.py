from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=schemas.Token)
def register(user_in: schemas.UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = auth.get_password_hash(user_in.password)
    assigned_role = user_in.role
    if assigned_role == "recruiter":
        assigned_role = models.UserRole.RECRUITER_UNVERIFIED.value

    user = models.User(
        email=user_in.email,
        hashed_password=hashed_pw,
        full_name=user_in.full_name,
        role=assigned_role
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Initialize empty profile
    profile = models.UserProfile(user_id=user.id)
    db.add(profile)
    db.commit()

    access_token = auth.create_access_token(data={"sub": str(user.id), "role": user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "avatar_url": user.avatar_url
        }
    }

@router.post("/login", response_model=schemas.Token)
def login(login_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_data.email).first()
    if not user or not auth.verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account is inactive")

    access_token = auth.create_access_token(data={"sub": str(user.id), "role": user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "avatar_url": user.avatar_url
        }
    }

@router.post("/google", response_model=schemas.Token)
def google_oauth(req: schemas.GoogleLoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if not user:
        assigned_role = req.role
        if assigned_role == "recruiter":
            assigned_role = models.UserRole.RECRUITER_UNVERIFIED.value

        user = models.User(
            email=req.email,
            hashed_password=auth.get_password_hash("GoogleOAuthSecuredPass2026!"),
            full_name=req.full_name,
            role=assigned_role,
            avatar_url=req.avatar_url,
            is_verified=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        profile = models.UserProfile(user_id=user.id)
        db.add(profile)
        db.commit()

    access_token = auth.create_access_token(data={"sub": str(user.id), "role": user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "avatar_url": user.avatar_url
        }
    }

@router.get("/me", response_model=schemas.UserOut)
def get_current_user_info(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    return current_user
