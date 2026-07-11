from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator
from typing import List, Optional, Any, Dict
from datetime import datetime

# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=10, max_length=128)
    full_name: str = Field(..., min_length=2, max_length=255)
    role: str = "user" # user, recruiter, admin

    @field_validator("role")
    @classmethod
    def validate_registration_role(cls, value: str) -> str:
        if value not in {"user", "recruiter"}:
            raise ValueError("Only candidate and recruiter registration is allowed")
        return value

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleLoginRequest(BaseModel):
    email: EmailStr
    full_name: str
    avatar_url: Optional[str] = None
    google_token: Optional[str] = None
    role: str = "user"

class Token(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str
    user: Dict[str, Any]

class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(..., min_length=20)

class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[str] = None

# User & Profile Schemas
class UserProfileUpdate(BaseModel):
    headline: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    target_role: Optional[str] = None
    expected_salary: Optional[int] = None
    preferred_location: Optional[str] = None
    remote_only: Optional[bool] = None
    skills: Optional[List[str]] = None
    experience_years: Optional[float] = None
    portfolio_links: Optional[List[str]] = None
    education_json: Optional[List[Dict[str, Any]]] = None
    experience_json: Optional[List[Dict[str, Any]]] = None
    projects_json: Optional[List[Dict[str, Any]]] = None

class UserProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    headline: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    target_role: Optional[str] = None
    expected_salary: Optional[int] = None
    preferred_location: Optional[str] = None
    remote_only: bool = False
    skills: List[str] = []
    experience_years: float = 0.0
    portfolio_links: List[str] = []
    education_json: List[Any] = []
    experience_json: List[Any] = []
    projects_json: List[Any] = []
    updated_at: datetime

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    full_name: str
    role: str
    avatar_url: Optional[str] = None
    is_active: bool
    is_verified: bool
    created_at: datetime
    profile: Optional[UserProfileOut] = None

# Resume Schemas
class ResumeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    filename: str
    file_type: str
    extracted_skills: List[str] = []
    ats_score: int
    ats_breakdown_json: Dict[str, Any] = {}
    is_primary: bool
    created_at: datetime

# Job Schemas
class JobCreate(BaseModel):
    title: str
    company: str
    company_logo: Optional[str] = None
    company_type: str = "Startup" # MNC, Startup, Newly Founded Startup
    location: str
    is_remote: bool = False
    is_hybrid: bool = False
    job_type: str = "Full Time"
    salary_min: int = 0
    salary_max: int = 0
    currency: str = "USD"
    experience_level: str = "Mid Level"
    description: str
    required_skills: List[str] = []
    nice_to_have_skills: List[str] = []
    is_fresher_friendly: bool = False
    low_competition: bool = False

class JobOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    recruiter_id: int
    title: str
    company: str
    company_logo: Optional[str] = None
    company_type: str
    location: str
    is_remote: bool
    is_hybrid: bool
    job_type: str
    salary_min: int
    salary_max: int
    currency: str
    experience_level: str
    description: str
    required_skills: List[str] = []
    nice_to_have_skills: List[str] = []
    is_fresher_friendly: bool
    low_competition: bool
    status: str
    applicants_count: int
    created_at: datetime
    match_percentage: Optional[float] = None
    recommendation_reason: Optional[str] = None
    missing_skills: Optional[List[str]] = None

# Swipe Schema
class SwipeCreate(BaseModel):
    job_id: int
    action: str # like, skip, save

    @field_validator("action")
    @classmethod
    def validate_action(cls, value: str) -> str:
        if value not in {"like", "skip", "save"}:
            raise ValueError("Action must be like, skip, or save")
        return value

class ApplicationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    job_id: int
    resume_id: Optional[int] = None
    match_score: float
    ats_score: int
    status: str
    notes: Optional[str] = None
    applied_at: datetime
    job: Optional[JobOut] = None
    user: Optional[UserOut] = None

class ApplicationStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None

# Notification Schema
class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    title: str
    message: str
    type: str
    is_read: bool
    created_at: datetime
