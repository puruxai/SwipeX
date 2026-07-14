from typing import List, Dict, Any
from app.ai.matching_engine import compute_job_match

def rank_jobs_for_swipe(user_profile: Dict[str, Any], resume_data: Dict[str, Any], jobs: List[Dict[str, Any]], swipe_history: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Ranks available job cards dynamically. 
    Applies user swipe learning: Boosts company types & skill clusters from previous 'like' (Swipe Right) actions.
    Suppresses roles or company types from recent 'skip' (Swipe Left) actions.
    """
    liked_company_types = set()
    liked_skills = set()
    skipped_titles = set()

    for swipe in swipe_history:
        action = swipe.get("action")
        job = swipe.get("job", {})
        if action == "like":
            if job.get("company_type"):
                liked_company_types.add(job.get("company_type"))
            for s in (job.get("required_skills") or []):
                liked_skills.add(s.lower())
        elif action == "skip":
            if job.get("title"):
                skipped_titles.add(job.get("title").lower())

    ranked_jobs = []
    for job in jobs:
        match_info = compute_job_match(user_profile, resume_data, job)
        score = match_info["match_percentage"]

        # Boost if company type matches liked swipe history
        if job.get("company_type") in liked_company_types:
            score += 5.0
            
        # Boost if required skills contain liked skills
        job_skills = [s.lower() for s in (job.get("required_skills") or [])]
        overlap_liked = len(set(job_skills).intersection(liked_skills))
        score += min(overlap_liked * 2.5, 8.0)

        # Penalty if similar title was skipped recently
        if job.get("title", "").lower() in skipped_titles:
            score -= 10.0

        final_match_pct = round(min(max(score, 10.0), 99.0), 1)
        
        job_dict = dict(job)
        job_dict["match_percentage"] = final_match_pct
        job_dict["recommendation_reason"] = match_info["recommendation_reason"]
        job_dict["missing_skills"] = match_info["missing_skills"]
        job_dict["matched_skills"] = match_info["matched_skills"]

        ranked_jobs.append(job_dict)

    # Sort descending by calculated match percentage
    ranked_jobs.sort(key=lambda x: x["match_percentage"], reverse=True)
    return ranked_jobs
