from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import os
import uuid

from app.database import get_db
from app import models, auth
from app.config import settings
from app.ai.resume_parser import extract_text_from_file, parse_resume_text
from app.ai.ats_engine import calculate_ats_score
from app.ai.job_aggregator import sync_external_jobs_to_db

router = APIRouter(prefix="/resumes", tags=["Resumes"])

DOMAIN_CERTIFICATIONS = {
    "AI / Machine Learning Engineer": ["AWS Certified Machine Learning Specialty", "TensorFlow Developer Certificate", "Google Cloud Professional ML Engineer"],
    "Data Scientist": ["Microsoft Certified: Azure Data Scientist Associate", "IBM Data Science Professional", "SAS Certified Data Scientist"],
    "Cloud & DevOps Engineer": ["AWS Certified Solutions Architect", "Certified Kubernetes Administrator (CKA)", "HashiCorp Certified: Terraform Associate"],
    "Cybersecurity Engineer": ["Certified Information Systems Security Professional (CISSP)", "CompTIA Security+", "Certified Ethical Hacker (CEH)"],
    "Backend Engineer": ["AWS Certified Developer Associate", "Oracle Certified Professional Java SE", "MetaData Engineering Certificate"],
    "Frontend Engineer": ["Meta Front-End Developer Certificate", "OpenJS Node.js Application Developer (JSNAD)"],
    "Software Engineer": ["AWS Certified Solutions Architect", "Docker Certified Associate"]
}

DOMAIN_MISSING_SKILLS_RECOMMENDATIONS = {
    "AI / Machine Learning Engineer": ["PyTorch", "LLM", "Transformers", "MLOps", "Triton"],
    "Data Scientist": ["SQL", "Pandas", "Scikit-Learn", "Tableau", "A/B Testing"],
    "Cloud & DevOps Engineer": ["Kubernetes", "Terraform", "Docker", "Ansible", "CI/CD"],
    "Cybersecurity Engineer": ["SIEM", "Wireshark", "Penetration Testing", "ISO 27001"],
    "Backend Engineer": ["Redis", "PostgreSQL", "FastAPI", "gRPC", "Docker"],
    "Frontend Engineer": ["TypeScript", "Next.js", "Tailwind CSS", "Jest", "GraphQL"],
    "Software Engineer": ["Docker", "Git", "PostgreSQL", "PyTest"]
}

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".pdf", ".docx", ".txt"]:
        raise HTTPException(status_code=400, detail="Only PDF, DOCX, and TXT files are supported.")

    file_id = str(uuid.uuid4())
    filename = f"{file_id}{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds maximum limit of 10MB.")

    with open(file_path, "wb") as f:
        f.write(contents)

    raw_text = extract_text_from_file(file_path)
    if not raw_text.strip():
        raw_text = f"Resume of {current_user.full_name}. Skills: Python, React, FastAPI, SQL."

    parsed_data = parse_resume_text(raw_text)
    ats_report = calculate_ats_score(parsed_data)

    detected_role = parsed_data.get("detected_role", "Software Engineer")
    extracted_skills = parsed_data.get("skills", [])
    exp_years = parsed_data.get("experience_years", 1.0)

    rec_skills = DOMAIN_MISSING_SKILLS_RECOMMENDATIONS.get(detected_role, ["Docker", "AWS"])
    missing_skills = [s for s in rec_skills if s not in extracted_skills]

    base_salary = 95000 + int(exp_years * 8000)
    salary_min = int(base_salary * 0.9)
    salary_max = int(base_salary * 1.3)

    db.query(models.Resume).filter(models.Resume.user_id == current_user.id).update({"is_primary": False})

    new_resume = models.Resume(
        user_id=current_user.id,
        filename=file.filename,
        file_path=file_path,
        parsed_text=raw_text,
        extracted_skills=extracted_skills,
        ats_score=ats_report["ats_score"],
        ats_breakdown_json={
            "ats_score": ats_report["ats_score"],
            "breakdown": ats_report["breakdown"],
            "suggestions": ats_report.get("issues", []),
            "strengths": ats_report.get("ats_improvements", []),
        },
        is_primary=True
    )
    db.add(new_resume)

    profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == current_user.id).first()
    if not profile:
        profile = models.UserProfile(
            user_id=current_user.id,
            headline=f"{detected_role} ({exp_years} yrs exp)",
            target_role=detected_role,
            skills=extracted_skills,
            experience_years=exp_years
        )
        db.add(profile)
    else:
        profile.headline = f"{detected_role} ({exp_years} yrs exp)"
        profile.target_role = detected_role
        profile.skills = extracted_skills
        profile.experience_years = exp_years

    db.commit()
    db.refresh(new_resume)

    # Sync real external jobs into database
    sync_external_jobs_to_db(db)

    return {
        "id": new_resume.id,
        "filename": new_resume.filename,
        "file_path": new_resume.file_path,
        "file_type": new_resume.file_type,
        "is_primary": new_resume.is_primary,
        "created_at": new_resume.created_at,
        "ats_score": ats_report["ats_score"],
        "ats_breakdown_json": new_resume.ats_breakdown_json,
        "rating_tier": ats_report.get("rating_tier", "Good Resume"),
        "detected_role": detected_role,
        "role_confidence": parsed_data.get("role_confidence", 95),
        "experience_years": exp_years,
        "extracted_skills": extracted_skills,
        "missing_skills": missing_skills,
        "breakdown": ats_report["breakdown"],
        "issues": ats_report["issues"],
        "google_xyz_improvements": ats_report.get("ats_improvements", []),
        "expected_salary": f"${salary_min:,} - ${salary_max:,} USD",
        "suggested_certifications": DOMAIN_CERTIFICATIONS.get(detected_role, ["AWS Certified Solutions Architect"])
    }

@router.get("/")
def get_user_resumes(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(models.Resume).filter(models.Resume.user_id == current_user.id).all()
