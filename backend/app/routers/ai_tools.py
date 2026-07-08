from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from pydantic import BaseModel

from app.database import get_db
from app import models, auth
from app.ai import generative_tools

router = APIRouter(prefix="/ai", tags=["Generative AI Career Toolkit"])

class CoverLetterReq(BaseModel):
    job_id: Optional[int] = None
    job_title: Optional[str] = "Senior Software Engineer"
    company: Optional[str] = "NeuralStack Labs"

class InterviewPrepReq(BaseModel):
    job_title: str = "Full Stack AI Engineer"
    required_skills: List[str] = ["Python", "React", "FastAPI", "Docker"]

class RoadmapReq(BaseModel):
    current_role: Optional[str] = "Software Developer"
    target_role: Optional[str] = "Senior AI Architect"

class SalaryPredictReq(BaseModel):
    title: str = "Full Stack AI Engineer"
    skills: List[str] = ["Python", "React", "FastAPI", "Docker"]
    experience_years: float = 3.5
    location: str = "San Francisco, CA"
    company_type: str = "Startup"

class ResumeCompareReq(BaseModel):
    resume_id_a: int
    resume_id_b: int

class RewriteResumeReq(BaseModel):
    target_score: int = 98

class MatchJdReq(BaseModel):
    job_description: str

@router.post("/cover-letter")
def api_generate_cover_letter(
    req: CoverLetterReq,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == current_user.id).first()
    candidate_profile = {
        "full_name": current_user.full_name,
        "skills": profile.skills if profile else ["Python", "React", "FastAPI"]
    }

    job_details = {
        "title": req.job_title,
        "company": req.company
    }

    if req.job_id:
        job = db.query(models.Job).filter(models.Job.id == req.job_id).first()
        if job:
            job_details["title"] = job.title
            job_details["company"] = job.company

    return generative_tools.generate_cover_letter(candidate_profile, job_details)

@router.post("/interview-questions")
def api_generate_interview_questions(
    req: InterviewPrepReq,
    current_user: models.User = Depends(auth.get_current_user)
):
    return generative_tools.generate_interview_questions(req.job_title, req.required_skills)

@router.post("/career-roadmap")
def api_generate_career_roadmap(
    req: RoadmapReq,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == current_user.id).first()
    skills = profile.skills if profile else ["Python", "React"]
    return generative_tools.generate_career_roadmap(
        req.current_role or (profile.headline if profile else "Software Developer"),
        req.target_role or (profile.target_role if profile else "Senior AI Architect"),
        skills
    )

@router.post("/salary-predict")
def api_predict_salary(
    req: SalaryPredictReq,
    current_user: models.User = Depends(auth.get_current_user)
):
    return generative_tools.predict_salary_range(
        req.title, req.skills, req.experience_years, req.location, req.company_type
    )

@router.post("/resume-compare")
def api_compare_resumes(
    req: ResumeCompareReq,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    res_a = db.query(models.Resume).filter(models.Resume.id == req.resume_id_a, models.Resume.user_id == current_user.id).first()
    res_b = db.query(models.Resume).filter(models.Resume.id == req.resume_id_b, models.Resume.user_id == current_user.id).first()

    if not res_a or not res_b:
        raise HTTPException(status_code=404, detail="One or both resume versions not found")

    dict_a = {"filename": res_a.filename, "ats_score": res_a.ats_score, "extracted_skills": res_a.extracted_skills or []}
    dict_b = {"filename": res_b.filename, "ats_score": res_b.ats_score, "extracted_skills": res_b.extracted_skills or []}

    return generative_tools.compare_resume_versions(dict_a, dict_b)

@router.post("/rewrite-resume")
def api_rewrite_resume(
    req: RewriteResumeReq,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).first()
    raw_text = resume.parsed_text if resume else "Python FastAPI React Engineer"
    return generative_tools.rewrite_resume_for_target_ats(raw_text, req.target_score)

@router.post("/match-jd")
def api_match_jd(
    req: MatchJdReq,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).first()
    raw_text = resume.parsed_text if resume else "Python FastAPI React Engineer"
    return generative_tools.match_resume_with_job_description(raw_text, req.job_description)

class CoachingChatReq(BaseModel):
    message: str
    session_id: Optional[str] = "career_coach_session"

class CoachingInterviewReq(BaseModel):
    question: str
    answer: str
    session_id: Optional[str] = "interview_coach_session"

@router.post("/coaching/chat")
def api_coaching_chat(
    req: CoachingChatReq,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == current_user.id).first()
    skills = profile.skills if profile else ["Python", "React"]
    role = profile.target_role if profile else "Software Engineer"
    
    response_msg = f"Based on your profile as a {role} skilled in {', '.join(skills[:3])}, I recommend focusing on building projects that demonstrate these skills in high-concurrency settings. Let's work on adding more details to your resume projects."
    
    new_log = models.CoachingLog(
        user_id=current_user.id,
        session_id=req.session_id,
        question=req.message,
        response=response_msg,
        feedback={"recommended_skills": skills[:3]}
    )
    db.add(new_log)
    db.commit()
    return {"response": response_msg, "log_id": new_log.id}

@router.post("/coaching/interview/answer")
def api_coaching_interview_answer(
    req: CoachingInterviewReq,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    has_situation = any(k in req.answer.lower() for k in ["situation", "when", "at", "during", "project"])
    has_action = any(k in req.answer.lower() for k in ["did", "action", "built", "implemented", "resolved", "engineered"])
    has_result = any(k in req.answer.lower() for k in ["result", "metric", "improved", "increased", "%", "users"])
    
    score = 40
    feedback_notes = []
    if has_situation:
        score += 20
    else:
        feedback_notes.append("Describe the context or situation clearly.")
    if has_action:
        score += 25
    else:
        feedback_notes.append("Outline the direct action you took to solve the challenge.")
    if has_result:
        score += 15
    else:
        feedback_notes.append("Include measurable results or outcomes (e.g. percentages, user counters).")
        
    evaluation_msg = f"STAR Method Score: {score}/100. Feedback: {' '.join(feedback_notes) if feedback_notes else 'Excellent usage of the STAR framework!'}"
    
    new_log = models.CoachingLog(
        user_id=current_user.id,
        session_id=req.session_id,
        question=req.question,
        response=req.answer,
        feedback={"star_score": score, "evaluation": evaluation_msg}
    )
    db.add(new_log)
    db.commit()
    return {"evaluation": evaluation_msg, "score": score, "log_id": new_log.id}
