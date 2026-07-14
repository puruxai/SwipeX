from typing import Dict, Any, List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def compute_job_match(user_profile: Dict[str, Any], resume_data: Dict[str, Any], job: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes accurate multi-factor AI match percentage between user/resume and a job.
    Returns:
    - match_percentage (float 0 to 100)
    - skill_match_score (float)
    - semantic_match_score (float)
    - missing_skills (list of str)
    - recommendation_reason (str)
    """
    user_skills = set([s.lower() for s in (user_profile.get("skills") or [])] + [s.lower() for s in (resume_data.get("skills") or [])])
    required_skills = [s.lower() for s in (job.get("required_skills") or [])]
    nice_to_have_skills = [s.lower() for s in (job.get("nice_to_have_skills") or [])]
    
    # 1. Skill Overlap Calculation
    missing_required = []
    matched_required = []
    
    for req in required_skills:
        if any(req in user_s or user_s in req for user_s in user_skills):
            matched_required.append(req)
        else:
            missing_required.append(req)
            
    matched_nice = []
    for nice in nice_to_have_skills:
        if any(nice in user_s or user_s in nice for user_s in user_skills):
            matched_nice.append(nice)
            
    total_req_count = len(required_skills) if required_skills else 1
    skill_overlap_ratio = (len(matched_required) / total_req_count) * 0.8 + (len(matched_nice) / max(len(nice_to_have_skills), 1)) * 0.2
    skill_match_score = min(skill_overlap_ratio * 100, 100)
    
    # 2. Semantic TF-IDF Similarity
    resume_text = (resume_data.get("parsed_text", "") + " " + " ".join(user_skills) + " " + (user_profile.get("target_role") or "")).strip()
    job_text = (job.get("title", "") + " " + job.get("description", "") + " " + " ".join(required_skills)).strip()
    
    semantic_match_score = 50.0
    if resume_text and job_text:
        try:
            vectorizer = TfidfVectorizer(stop_words='english')
            tfidf_matrix = vectorizer.fit_transform([resume_text, job_text])
            sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            semantic_match_score = min(max(float(sim * 100 * 1.5), 20.0), 98.0)
        except Exception:
            semantic_match_score = 50.0

    # 3. Experience Fit Score
    user_exp = float(user_profile.get("experience_years", 0) or resume_data.get("experience_years", 0))
    job_exp_level = (job.get("experience_level") or "").lower()
    
    exp_score = 80.0
    if "entry" in job_exp_level or job.get("is_fresher_friendly"):
        exp_score = 95.0 if user_exp <= 3 else 80.0
    elif "senior" in job_exp_level:
        exp_score = 95.0 if user_exp >= 4 else (60.0 if user_exp >= 2 else 40.0)
    elif "mid" in job_exp_level:
        exp_score = 90.0 if 1 <= user_exp <= 6 else 75.0

    # 4. Remote / Location Fit Score
    pref_remote = user_profile.get("remote_only", False)
    job_remote = job.get("is_remote", False)
    location_score = 100.0 if (job_remote or not pref_remote) else 70.0

    # Weighted Total Match Percentage
    final_match = (
        skill_match_score * 0.50 +
        semantic_match_score * 0.30 +
        exp_score * 0.10 +
        location_score * 0.10
    )
    final_match = round(min(max(final_match, 15.0), 99.0), 1)

    # Human readable AI recommendation reason generator
    reasons = []
    if skill_match_score >= 80:
        reasons.append(f"Strong skill alignment ({len(matched_required)}/{len(required_skills)} required skills matched).")
    elif len(matched_required) > 0:
        reasons.append(f"Matches key skills: {', '.join([s.title() for s in matched_required[:3]])}.")
        
    if job_remote:
        reasons.append("100% Remote flexibility.")
    if job.get("is_fresher_friendly"):
        reasons.append("Fresher friendly role with high interview probability.")
    if job.get("company_type") == "MNC":
        reasons.append("Top MNC tier company environment.")
    elif job.get("company_type") == "Startup":
        reasons.append("Fast-paced startup growth opportunities.")

    recommendation_reason = " | ".join(reasons) if reasons else "Good matches based on target role and skill profile."

    return {
        "match_percentage": final_match,
        "skill_match_score": round(skill_match_score, 1),
        "semantic_match_score": round(semantic_match_score, 1),
        "experience_fit_score": round(exp_score, 1),
        "missing_skills": [s.title() for s in missing_required],
        "matched_skills": [s.title() for s in matched_required],
        "recommendation_reason": recommendation_reason
    }
