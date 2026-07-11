from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, auth
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

def token_response(user: models.User) -> dict:
    return {
        "access_token": auth.create_access_token(data={"sub": str(user.id), "role": user.role}),
        "refresh_token": auth.create_refresh_token(user.id),
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "full_name": user.full_name, "role": user.role, "avatar_url": user.avatar_url},
    }

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

    return token_response(user)

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
    if auth.password_needs_upgrade(user.hashed_password):
        user.hashed_password = auth.get_password_hash(login_data.password)
        db.commit()

    return token_response(user)

@router.post("/refresh", response_model=schemas.Token)
def refresh_token(payload: schemas.RefreshTokenRequest, db: Session = Depends(get_db)):
    user_id = auth.decode_refresh_token(payload.refresh_token)
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Account is unavailable")
    return token_response(user)

@router.post("/google", response_model=schemas.Token)
def google_oauth():
    if not settings.GOOGLE_OAUTH_ENABLED:
        raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Google sign-in is not configured")
    # Do not trust identity data posted by the browser. Enabling this switch is
    # reserved for a deployment that injects a verified Google ID-token adapter.
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Google ID-token verification adapter is required")

@router.get("/me", response_model=schemas.UserOut)
def get_current_user_info(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    return current_user
