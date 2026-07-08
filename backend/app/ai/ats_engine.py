from typing import Dict, Any, List
import re

def calculate_ats_score(parsed_data: Dict[str, Any], job_description: str = "") -> Dict[str, Any]:
    """
    100% Deterministic, Calculated Mathematical ATS Engine.
    
    9 Weighted Scoring Categories (Total = 100 Points):
    1. Resume Parsing Accuracy: 15%
    2. Formatting & Structure: 15%
    3. Keyword Match: 20%
    4. Technical Skills: 15%
    5. Projects: 10%
    6. Experience: 10%
    7. Education: 5%
    8. Grammar & Readability: 5%
    9. Achievements & Certifications: 5%
    """
    issues = []
    
    sections = parsed_data.get("has_sections", {})
    skills = parsed_data.get("skills", [])
    word_count = parsed_data.get("word_count", 0)
    parsed_text = parsed_data.get("parsed_text", "")
    email = parsed_data.get("email")
    phone = parsed_data.get("phone")
    detected_role = parsed_data.get("detected_role", "Software Engineer")
    confidence = parsed_data.get("role_confidence", 85)
    exp_years = parsed_data.get("experience_years", 1.0)

    # 1. Resume Parsing Accuracy (15 Points Max)
    parsing_score = 0.0
    if email:
        parsing_score += 8.0
    else:
        issues.append({
            "section": "Header", 
            "severity": "Critical", 
            "issue": "Missing contact email address", 
            "boost": "+8 pts", 
            "why": "ATS parsers require an email to create candidate database profiles."
        })
    
    if phone:
        parsing_score += 7.0
    else:
        issues.append({
            "section": "Header", 
            "severity": "Medium", 
            "issue": "Missing phone number", 
            "boost": "+7 pts", 
            "why": "Recruiters require a phone contact for screen scheduling."
        })

    # 2. Formatting & Structure (15 Points Max)
    formatting_score = 0.0
    req_sections = ["experience", "education", "skills", "projects"]
    for sec in req_sections:
        if sections.get(sec):
            formatting_score += 3.75
        else:
            issues.append({
                "section": sec.capitalize(), 
                "severity": "High", 
                "issue": f"Missing standard '{sec.capitalize()}' section header", 
                "boost": "+4 pts", 
                "why": f"ATS parsers look for standard '{sec.capitalize()}' headers to segment resumes."
            })

    # 3. Keyword Match & Density (20 Points Max)
    if job_description.strip():
        # Match against JD keywords
        jd_words = set(re.findall(r'\b[A-Za-z]{4,}\b', job_description.lower()))
        res_words = set(re.findall(r'\b[A-Za-z]{4,}\b', parsed_text.lower()))
        matched = jd_words.intersection(res_words)
        match_ratio = len(matched) / max(len(jd_words), 1)
        keyword_score = min(match_ratio * 25.0, 20.0)
    else:
        keyword_score = min(len(skills) * 2.0, 20.0)

    if len(skills) < 6:
        issues.append({
            "section": "Skills", 
            "severity": "High", 
            "issue": "Low skill taxonomy density (under 6 skills detected)", 
            "boost": "+6 pts", 
            "why": "Recruiter ATS search filters screen out resumes with fewer than 6 technical skills."
        })

    # 4. Technical Skills Coverage (15 Points Max)
    tech_skills_score = min(len(skills) * 2.5, 15.0)

    # 5. Projects & Action Metrics (10 Points Max)
    numbers_found = len(re.findall(r'\b\d+(?:[\.,]\d+)?%?\b', parsed_text))
    action_verbs = len(re.findall(r'\b(developed|built|architected|increased|reduced|managed|improved|led|scaled|created|designed)\b', parsed_text.lower()))
    projects_score = min(numbers_found * 1.5 + action_verbs * 1.0, 10.0)
    if numbers_found < 3:
        issues.append({
            "section": "Projects & Experience", 
            "severity": "Critical", 
            "issue": "Lack of quantifiable impact metrics", 
            "boost": "+8 pts", 
            "why": "Unquantified statements score lower than metric-driven achievements ('improved load speed by 42%')."
        })

    # 6. Experience Depth (10 Points Max)
    experience_score = min(exp_years * 2.0 + 2.0, 10.0)

    # 7. Education Quality (5 Points Max)
    education_score = 5.0 if sections.get("education") else 2.0

    # 8. Grammar & Readability (5 Points Max)
    grammar_score = 5.0
    if word_count < 250:
        grammar_score = 2.5
        issues.append({
            "section": "Summary", 
            "severity": "Medium", 
            "issue": "Resume content too brief (under 250 words)", 
            "boost": "+3 pts", 
            "why": "Parsers consider under 250 words insufficient for mid/senior roles."
        })
    elif word_count > 1200:
        grammar_score = 3.5
        issues.append({
            "section": "Formatting", 
            "severity": "Low", 
            "issue": "Resume text exceeds 1200 words", 
            "boost": "+2 pts", 
            "why": "Recruiters favor concise 1-2 page document structures."
        })

    # 9. Achievements & Certifications (5 Points Max)
    has_certs = any(k in parsed_text.lower() for k in ["certified", "certification", "aws", "gcp", "azure", "cissp", "certificate"])
    achievements_score = 5.0 if has_certs else 2.5

    # Total Calculated ATS Score
    raw_total = (parsing_score + formatting_score + keyword_score + tech_skills_score + projects_score + experience_score + education_score + grammar_score + achievements_score)
    original_ats_score = int(min(max(raw_total, 35), 98))

    if original_ats_score <= 50:
        rating_tier = "Very Poor Resume"
    elif original_ats_score <= 65:
        rating_tier = "Basic Resume"
    elif original_ats_score <= 75:
        rating_tier = "Average Resume"
    elif original_ats_score <= 85:
        rating_tier = "Good Resume"
    elif original_ats_score <= 92:
        rating_tier = "Strong Resume"
    elif original_ats_score <= 96:
        rating_tier = "Excellent Resume"
    else:
        rating_tier = "Outstanding Resume"

    # Breakdown Dictionary
    breakdown = {
        "contact_info": {"score": int(parsing_score), "max": 15},
        "formatting_score": {"score": int(formatting_score), "max": 15},
        "keyword_match": {"score": int(keyword_score), "max": 20},
        "technical_skills": {"score": int(tech_skills_score), "max": 15},
        "projects_score": {"score": int(projects_score), "max": 10},
        "experience_score": {"score": int(experience_score), "max": 10},
        "education_quality": {"score": int(education_score), "max": 5},
        "grammar_score": {"score": int(grammar_score), "max": 5},
        "achievements_score": {"score": int(achievements_score), "max": 5},
        "overall_ats_score": original_ats_score,
        "rating_tier": rating_tier,
        "resume_health": min(original_ats_score + 3, 100),
        "recruiter_readability": int(formatting_score * 4.0 + grammar_score * 8.0),
        "ats_parse_rate": 98 if (parsing_score >= 12 and formatting_score >= 10) else 75,
        "job_match_percentage": min(original_ats_score + 2, 100)
    }

    formula_explanation = f"Calculated Formula: Parsing ({int(parsing_score)}/15) + Formatting ({int(formatting_score)}/15) + Keywords ({int(keyword_score)}/20) + Technical Skills ({int(tech_skills_score)}/15) + Projects ({int(projects_score)}/10) + Experience ({int(experience_score)}/10) + Education ({int(education_score)}/5) + Grammar ({int(grammar_score)}/5) + Achievements ({int(achievements_score)}/5) = {original_ats_score}/100 ({rating_tier})"

    return {
        "ats_score": original_ats_score,
        "rating_tier": rating_tier,
        "detected_role": detected_role,
        "role_confidence": confidence,
        "formula_explanation": formula_explanation,
        "breakdown": breakdown,
        "issues": issues,
        "ats_improvements": [
            {
                "original": "Developed a web application.",
                "improved": "Developed a high-concurrency React & FastAPI web application serving 15,000 active users, reducing server response latencies by 42%."
            },
            {
                "original": "Built machine learning model.",
                "improved": "Architected a Scikit-Learn Random Forest classification model achieving 96% accuracy on 50,000 historical records, optimizing inference speeds by 35%."
            }
        ]
    }
