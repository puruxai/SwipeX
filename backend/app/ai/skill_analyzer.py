from typing import List, Dict, Any
from collections import Counter

def generate_skill_gap_report(user_skills: List[str], target_jobs: List[Dict[str, Any]]) -> Dict[str, Any]:
    user_skills_lower = set([s.lower() for s in user_skills])
    
    missing_counter = Counter()
    matched_counter = Counter()
    
    for job in target_jobs:
        reqs = job.get("required_skills", [])
        for req in reqs:
            req_lower = req.lower()
            if any(req_lower in s or s in req_lower for s in user_skills_lower):
                matched_counter[req.title()] += 1
            else:
                missing_counter[req.title()] += 1
                
    top_missing = missing_counter.most_common(5)
    top_matched = matched_counter.most_common(5)
    
    learning_recommendations = []
    for skill_name, count in top_missing:
        learning_recommendations.append({
            "skill": skill_name,
            "demand_frequency": count,
            "impact": "High" if count >= 3 else "Medium",
            "suggestion": f"Adding {skill_name} to your profile would unlock {count} additional high-match job opportunities."
        })
        
    readiness_score = 0
    total_skills_demanded = len(missing_counter) + len(matched_counter)
    if total_skills_demanded > 0:
        readiness_score = int((len(matched_counter) / total_skills_demanded) * 100)
    else:
        readiness_score = 75
        
    return {
        "candidate_readiness_score": readiness_score,
        "top_missing_skills": [{"skill": k, "count": v} for k, v in top_missing],
        "top_matched_skills": [{"skill": k, "count": v} for k, v in top_matched],
        "learning_recommendations": learning_recommendations
    }
