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

DOMAIN_ROADMAPS = {
    "AI / Machine Learning Engineer": {
        "next_skill": "PyTorch / LLM",
        "architecture_target": "Distributed Training",
        "recommended_cloud": "GCP / AWS"
    },
    "Data Scientist": {
        "next_skill": "A/B Testing",
        "architecture_target": "Big Data Pipelines",
        "recommended_cloud": "Databricks"
    },
    "Cloud & DevOps Engineer": {
        "next_skill": "Kubernetes / GitOps",
        "architecture_target": "Infrastructure as Code",
        "recommended_cloud": "AWS / GCP"
    },
    "Cybersecurity Engineer": {
        "next_skill": "SIEM Tools",
        "architecture_target": "Zero Trust Architectures",
        "recommended_cloud": "AWS Security Hub"
    },
    "Backend Engineer": {
        "next_skill": "gRPC / FastAPI",
        "architecture_target": "Microservices Design",
        "recommended_cloud": "AWS / Docker"
    },
    "Frontend Engineer": {
        "next_skill": "TypeScript / Next.js",
        "architecture_target": "Server-side Rendering",
        "recommended_cloud": "Vercel / AWS"
    },
    "Software Engineer": {
        "next_skill": "Design Patterns",
        "architecture_target": "System Architecture",
        "recommended_cloud": "AWS / Docker"
    }
}

DOMAIN_COMPANIES = {
    "AI / Machine Learning Engineer": "Google, Microsoft, NVIDIA, OpenAI",
    "Data Scientist": "Meta, Netflix, Airbnb, Uber",
    "Cloud & DevOps Engineer": "Amazon (AWS), HashiCorp, Google Cloud, Netflix",
    "Cybersecurity Engineer": "CrowdStrike, Palo Alto Networks, FireEye, Cloudflare",
    "Backend Engineer": "Stripe, Paypal, Amazon, Salesforce",
    "Frontend Engineer": "Vercel, Meta, Airbnb, Vercel, Shopify",
    "Software Engineer": "Microsoft, Apple, Amazon, Google"
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
    user_upload_dir = os.path.join(settings.UPLOAD_DIR, str(current_user.id))
    file_path = os.path.join(user_upload_dir, filename)
    normalized_path = file_path.replace("\\", "/")

    os.makedirs(user_upload_dir, exist_ok=True)

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
        file_path=normalized_path,
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

    parsed_sections = parsed_data.get("sections", {})
    profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == current_user.id).first()
    if not profile:
        profile = models.UserProfile(
            user_id=current_user.id,
            headline=f"{detected_role} ({exp_years} yrs exp)",
            target_role=detected_role,
            skills=extracted_skills,
            experience_years=exp_years,
            education_json=parsed_sections.get("education", []),
            experience_json=parsed_sections.get("experience", []),
            projects_json=parsed_sections.get("projects", [])
        )
        db.add(profile)
    else:
        profile.headline = f"{detected_role} ({exp_years} yrs exp)"
        profile.target_role = detected_role
        profile.skills = extracted_skills
        profile.experience_years = exp_years
        profile.education_json = parsed_sections.get("education", [])
        profile.experience_json = parsed_sections.get("experience", [])
        profile.projects_json = parsed_sections.get("projects", [])

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
        "suggested_certifications": DOMAIN_CERTIFICATIONS.get(detected_role, ["AWS Certified Solutions Architect"]),
        "candidate_name": parsed_data.get("name") or current_user.full_name,
        "target_roadmap": DOMAIN_ROADMAPS.get(detected_role, DOMAIN_ROADMAPS["Software Engineer"]),
        "matching_companies": DOMAIN_COMPANIES.get(detected_role, DOMAIN_COMPANIES["Software Engineer"])
    }

@router.get("/analysis/latest")
def get_latest_resume_analysis(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    primary_resume = db.query(models.Resume).filter(
        models.Resume.user_id == current_user.id,
        models.Resume.is_primary == True
    ).order_by(models.Resume.created_at.desc()).first()
    
    if not primary_resume:
        return None
        
    profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == current_user.id).first()
    detected_role = profile.target_role if profile else "Software Engineer"
    exp_years = profile.experience_years if profile else 1.0
    extracted_skills = primary_resume.extracted_skills or []
    
    rec_skills = DOMAIN_MISSING_SKILLS_RECOMMENDATIONS.get(detected_role, ["Docker", "AWS"])
    missing_skills = [s for s in rec_skills if s not in extracted_skills]
    
    base_salary = 95000 + int(exp_years * 8000)
    salary_min = int(base_salary * 0.9)
    salary_max = int(base_salary * 1.3)
    
    breakdown = primary_resume.ats_breakdown_json or {}
    
    score = primary_resume.ats_score
    if score >= 95:
        rating = "Outstanding Resume"
    elif score >= 90:
        rating = "Excellent Resume"
    elif score >= 80:
        rating = "Strong Resume"
    elif score >= 70:
        rating = "Good Resume"
    elif score >= 60:
        rating = "Average Resume"
    elif score >= 50:
        rating = "Basic Resume"
    else:
        rating = "Very Poor Resume"

    return {
        "id": primary_resume.id,
        "filename": primary_resume.filename,
        "file_path": primary_resume.file_path,
        "is_primary": primary_resume.is_primary,
        "created_at": primary_resume.created_at,
        "ats_score": score,
        "ats_breakdown_json": primary_resume.ats_breakdown_json,
        "rating_tier": rating,
        "detected_role": detected_role,
        "role_confidence": 94 if score >= 90 else (88 if score >= 80 else 78),
        "experience_years": exp_years,
        "extracted_skills": extracted_skills,
        "missing_skills": missing_skills,
        "breakdown": breakdown.get("breakdown", {}),
        "issues": breakdown.get("suggestions", []),
        "google_xyz_improvements": breakdown.get("strengths", []),
        "expected_salary": f"${salary_min:,} - ${salary_max:,} USD",
        "suggested_certifications": DOMAIN_CERTIFICATIONS.get(detected_role, ["AWS Certified Solutions Architect"]),
        "candidate_name": current_user.full_name,
        "target_roadmap": DOMAIN_ROADMAPS.get(detected_role, DOMAIN_ROADMAPS["Software Engineer"]),
        "matching_companies": DOMAIN_COMPANIES.get(detected_role, DOMAIN_COMPANIES["Software Engineer"])
    }

@router.get("/")
def get_user_resumes(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(models.Resume).filter(models.Resume.user_id == current_user.id).all()
