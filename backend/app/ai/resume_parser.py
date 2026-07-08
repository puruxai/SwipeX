import re
import os
from typing import Dict, Any, List

SKILL_GROUPED_TAXONOMY = {
    "Programming": {
        "Python": r"\b(python|py)\b",
        "TypeScript": r"\b(typescript|ts)\b",
        "JavaScript": r"\b(javascript|js)\b",
        "Java": r"\b(java)\b",
        "C++": r"\b(c\+\+)\b",
        "Go": r"\b(golang|go)\b",
        "Rust": r"\b(rust)\b",
        "SQL": r"\b(sql)\b"
    },
    "Frameworks & Web": {
        "FastAPI": r"\b(fastapi)\b",
        "Django": r"\b(django)\b",
        "Flask": r"\b(flask)\b",
        "React": r"\b(react|reactjs)\b",
        "Next.js": r"\b(next\.js|nextjs)\b",
        "Node.js": r"\b(node\.js|nodejs|node)\b",
        "GraphQL": r"\b(graphql)\b"
    },
    "AI & Data Science": {
        "PyTorch": r"\b(pytorch)\b",
        "TensorFlow": r"\b(tensorflow|tf)\b",
        "Scikit-Learn": r"\b(scikit-learn|sklearn)\b",
        "Machine Learning": r"\b(machine learning|ml)\b",
        "Deep Learning": r"\b(deep learning)\b",
        "Computer Vision": r"\b(computer vision|cv)\b",
        "NLP": r"\b(nlp|natural language processing)\b",
        "LLM": r"\b(llm|large language model|openai|transformers)\b",
        "Pandas": r"\b(pandas)\b",
        "NumPy": r"\b(numpy)\b"
    },
    "Databases": {
        "PostgreSQL": r"\b(postgresql|postgres)\b",
        "MongoDB": r"\b(mongodb|mongo)\b",
        "Redis": r"\b(redis)\b"
    },
    "Cloud & DevOps": {
        "Docker": r"\b(docker)\b",
        "Kubernetes": r"\b(kubernetes|k8s)\b",
        "AWS": r"\b(aws|amazon web services)\b",
        "GCP": r"\b(gcp|google cloud)\b",
        "Azure": r"\b(azure)\b",
        "CI/CD": r"\b(ci/cd|continuous integration)\b"
    },
    "Tools & Testing": {
        "Git": r"\b(git|github|gitlab)\b",
        "PyTest": r"\b(pytest)\b"
    }
}

DOMAIN_MAP = {
    "AI / Machine Learning Engineer": ["PyTorch", "TensorFlow", "Scikit-Learn", "Machine Learning", "Deep Learning", "NLP", "LLM", "Computer Vision"],
    "Data Scientist": ["Pandas", "NumPy", "Scikit-Learn", "Machine Learning", "Python", "SQL"],
    "Cloud & DevOps Engineer": ["Docker", "Kubernetes", "AWS", "GCP", "Azure", "CI/CD"],
    "Cybersecurity Engineer": ["Cybersecurity", "Penetration Testing", "SIEM", "Cryptography"],
    "Backend Engineer": ["FastAPI", "Django", "Flask", "Node.js", "PostgreSQL", "MongoDB", "Redis", "Go", "Java"],
    "Frontend Engineer": ["React", "Next.js", "TypeScript", "JavaScript"],
    "Full Stack Developer": ["React", "Node.js", "PostgreSQL", "TypeScript", "FastAPI"]
}

def extract_text_from_file(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".txt":
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()
        except Exception:
            return ""
    elif ext == ".pdf":
        try:
            import pypdf
            reader = pypdf.PdfReader(file_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""
            return text
        except Exception:
            return ""
    elif ext == ".docx":
        try:
            import docx
            doc = docx.Document(file_path)
            return "\n".join([p.text for p in doc.paragraphs])
        except Exception:
            return ""
    return ""

def detect_career_domain_with_confidence(skills: List[str], text: str) -> (str, int):
    text_lower = text.lower()
    
    if "ai engineer" in text_lower or "machine learning engineer" in text_lower or "ml engineer" in text_lower:
        return "AI / Machine Learning Engineer", 98
    if "data scientist" in text_lower or "data science" in text_lower:
        return "Data Scientist", 96
    if "cybersecurity" in text_lower or "security engineer" in text_lower:
        return "Cybersecurity Engineer", 95
    if "devops" in text_lower or "cloud engineer" in text_lower:
        return "Cloud & DevOps Engineer", 96
    if "backend engineer" in text_lower or "backend developer" in text_lower:
        return "Backend Engineer", 94
    if "frontend engineer" in text_lower or "frontend developer" in text_lower:
        return "Frontend Engineer", 94

    skills_set = set(skills)
    domain_scores = {}
    for domain, domain_skills in DOMAIN_MAP.items():
        score = len(skills_set.intersection(set(domain_skills)))
        domain_scores[domain] = score

    sorted_domains = sorted(domain_scores.items(), key=lambda x: x[1], reverse=True)
    if sorted_domains and sorted_domains[0][1] > 0:
        top_domain = sorted_domains[0][0]
        top_score = sorted_domains[0][1]
        conf = min(75 + top_score * 5, 96)
        return top_domain, conf

    return "Software Engineer", 85

def parse_resume_text(text: str) -> Dict[str, Any]:
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    
    # Extract Name (1st line if it has words and doesn't look like email/phone/link)
    name = "Alex Mercer"
    for line in lines[:3]:
        if not re.search(r'@|http|\+?\d{3}', line) and len(line.split()) <= 4:
            name = line
            break

    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    email = email_match.group(0) if email_match else None

    phone_match = re.search(r'(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}', text)
    phone = phone_match.group(0) if phone_match else None

    # Link extraction
    linkedin_match = re.search(r'linkedin\.com/in/[\w\.-]+', text, re.IGNORECASE)
    linkedin = f"https://{linkedin_match.group(0)}" if linkedin_match else None

    github_match = re.search(r'github\.com/[\w\.-]+', text, re.IGNORECASE)
    github = f"https://{github_match.group(0)}" if github_match else None

    portfolio_match = re.search(r'(?:https?://)?(?:www\.)?[\w\.-]+\.[a-z]{2,}(?:/[\w\.-]*)?', text, re.IGNORECASE)
    portfolio = None
    if portfolio_match:
        cand_url = portfolio_match.group(0)
        if "linkedin" not in cand_url.lower() and "github" not in cand_url.lower():
            portfolio = cand_url

    # Standard Section Extraction
    sections = {
        "summary": [],
        "experience": [],
        "projects": [],
        "education": [],
        "skills": [],
        "certifications": [],
        "languages": [],
        "leadership": [],
        "volunteer": [],
        "achievements": [],
        "publications": []
    }
    
    current_sec = None
    for line in lines:
        line_clean = line.strip()
        line_lower = line_clean.lower()
        
        # Check section boundaries
        if any(h in line_lower for h in ["summary", "profile", "objective"]):
            current_sec = "summary"
        elif any(h in line_lower for h in ["experience", "employment", "work history", "professional experience", "internships"]):
            current_sec = "experience"
        elif any(h in line_lower for h in ["projects", "personal projects", "portfolio"]):
            current_sec = "projects"
        elif any(h in line_lower for h in ["education", "academic", "university", "credentials"]):
            current_sec = "education"
        elif any(h in line_lower for h in ["skills", "technical skills", "technologies", "core competencies"]):
            current_sec = "skills"
        elif any(h in line_lower for h in ["certifications", "licenses"]):
            current_sec = "certifications"
        elif any(h in line_lower for h in ["languages"]):
            current_sec = "languages"
        elif any(h in line_lower for h in ["leadership", "management"]):
            current_sec = "leadership"
        elif any(h in line_lower for h in ["volunteer", "community"]):
            current_sec = "volunteer"
        elif any(h in line_lower for h in ["achievements", "awards"]):
            current_sec = "achievements"
        elif any(h in line_lower for h in ["publications", "research", "patents"]):
            current_sec = "publications"
        elif current_sec and len(line_clean) > 2:
            sections[current_sec].append(line_clean)

    # Dynamic Skills Taxonomy extraction
    extracted_skills = []
    grouped_skills = {}
    for group_name, taxonomy in SKILL_GROUPED_TAXONOMY.items():
        grouped_skills[group_name] = []
        for skill_name, pattern in taxonomy.items():
            if re.search(pattern, text, re.IGNORECASE):
                extracted_skills.append(skill_name)
                grouped_skills[group_name].append(skill_name)

    text_lower = text.lower()
    has_experience = len(sections["experience"]) > 0
    has_education = len(sections["education"]) > 0
    has_projects = len(sections["projects"]) > 0
    has_skills = len(sections["skills"]) > 0

    # Calculate experience years
    exp_phrase = re.search(r'(\d+)\+?\s*years?\s+(?:of\s+)?experience', text_lower)
    if exp_phrase:
        years = float(exp_phrase.group(1))
    else:
        years = 1.0
        year_matches = re.findall(r'\b(20\d{2}|19\d{2})\b', text)
        if len(year_matches) >= 2:
            try:
                nums = sorted([int(y) for y in year_matches])
                diff = nums[-1] - nums[0]
                if 0 < diff <= 35:
                    years = float(diff)
            except Exception:
                pass

    words = len(text.split())
    detected_role, confidence = detect_career_domain_with_confidence(extracted_skills, text)

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "linkedin": linkedin,
        "github": github,
        "portfolio": portfolio,
        "skills": extracted_skills,
        "grouped_skills": grouped_skills,
        "detected_role": detected_role,
        "role_confidence": confidence,
        "experience_years": years,
        "sections": sections,
        "has_sections": {
            "experience": has_experience or "experience" in text_lower,
            "education": has_education or "education" in text_lower,
            "projects": has_projects or "projects" in text_lower,
            "skills": has_skills or "skills" in text_lower
        },
        "word_count": words,
        "parsed_text": text
    }
