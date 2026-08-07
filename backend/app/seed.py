import datetime
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app import models, auth
from app.config import settings

def seed_database():
    if settings.ENVIRONMENT == "production":
        print("Production environment detected. Seeding database is disabled.")
        return
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if users already seeded and we have enough jobs
        if db.query(models.User).first() and db.query(models.Job).count() >= 90:
            print("Database already seeded.")
            return

        print("Wiping existing records for clean re-seeding...")
        db.query(models.SwipeAction).delete()
        db.query(models.Application).delete()
        db.query(models.Job).delete()
        db.query(models.Resume).delete()
        db.query(models.UserProfile).delete()
        db.query(models.User).delete()
        db.commit()

        print("Seeding database with rich initial dataset...")

        # 1. Create Default Accounts
        # Password for all test accounts: "Password123!"
        hashed_pw = auth.get_password_hash("Password123!")

        # Candidate User
        seeker = models.User(
            email="alex@swipex.io",
            hashed_password=hashed_pw,
            full_name="Alex Mercer",
            role="user",
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
            is_active=True,
            is_verified=True
        )
        db.add(seeker)

        # Recruiter User
        recruiter = models.User(
            email="recruiter@techcorp.com",
            hashed_password=hashed_pw,
            full_name="Sarah Jenkins",
            role="recruiter",
            avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
            is_active=True,
            is_verified=True
        )
        db.add(recruiter)

        # Admin User
        admin = models.User(
            email="admin@swipex.io",
            hashed_password=hashed_pw,
            full_name="System Administrator",
            role="admin",
            avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
            is_active=True,
            is_verified=True
        )
        db.add(admin)

        db.commit()
        db.refresh(seeker)
        db.refresh(recruiter)
        db.refresh(admin)

        # 2. Create Candidate Profile
        seeker_profile = models.UserProfile(
            user_id=seeker.id,
            headline="Full Stack AI Developer | React, FastAPI, Python",
            bio="Passionate software engineer building modern high-performance web apps and AI agents. Experienced in React, Python, Docker, and REST APIs.",
            phone="+1 (555) 234-5678",
            location="San Francisco, CA",
            target_role="Full Stack Engineer",
            expected_salary=135000,
            preferred_location="Remote / Hybrid",
            remote_only=True,
            skills=["Python", "React", "FastAPI", "TypeScript", "Tailwind", "PostgreSQL", "Docker", "Git", "REST API", "Machine Learning"],
            experience_years=3.5,
            portfolio_links=["https://github.com/alexmercer", "https://linkedin.com/in/alexmercer"],
            education_json=[{
                "degree": "B.S. in Computer Science",
                "institution": "University of California, Berkeley",
                "year": "2022"
            }],
            experience_json=[{
                "title": "Software Engineer",
                "company": "Vanguard Tech Inc.",
                "duration": "2022 - Present",
                "description": "Developed React UI components and FastAPI microservices. Improved API latency by 35%."
            }],
            projects_json=[{
                "name": "SwipeX Job Discovery",
                "description": "Full-stack AI job discovery app built with React, FastAPI, and scikit-learn match algorithms."
            }]
        )
        db.add(seeker_profile)

        # 3. Create Sample Resume
        sample_resume_text = """
        ALEX MERCER
        alex@swipex.io | +1 (555) 234-5678 | San Francisco, CA | github.com/alexmercer

        PROFESSIONAL SUMMARY
        Innovative Full Stack Software Engineer with 3+ years of experience engineering scalable web applications and AI-driven platforms using Python, FastAPI, React, TypeScript, and Docker.

        TECHNICAL SKILLS
        - Languages: Python, JavaScript, TypeScript, SQL, HTML5, CSS3
        - Frameworks & Libraries: React, FastAPI, Node.js, Express, Tailwind CSS, Redux, Scikit-Learn, PyTest
        - Cloud & DevOps: AWS, Docker, Kubernetes, Git, GitHub Actions, CI/CD, PostgreSQL, Redis

        EXPERIENCE
        Software Engineer | Vanguard Tech Inc. | 2022 – Present
        - Spearheaded development of core React frontend applications serving 50,000+ active users.
        - Developed RESTful microservices using Python FastAPI and PostgreSQL, reducing query latency by 35%.
        - Automated CI/CD deployment pipelines using GitHub Actions and Docker containers on AWS.

        PROJECTS
        AI Resume Matcher & ATS Analyzer
        - Engineered an intelligent TF-IDF and NLP resume parsing engine calculating ATS scores (0-100).
        - Achieved 94% accuracy in matching candidate skills to job specifications.

        EDUCATION
        B.S. Computer Science | UC Berkeley | Graduated May 2022
        """

        resume = models.Resume(
            user_id=seeker.id,
            filename="Alex_Mercer_Resume_2026.pdf",
            file_path="./uploads/sample_resume.pdf",
            file_type="pdf",
            parsed_text=sample_resume_text.strip(),
            extracted_skills=["Python", "React", "FastAPI", "TypeScript", "SQL", "Tailwind", "Docker", "AWS", "Scikit-Learn", "Git", "PostgreSQL", "REST API"],
            ats_score=88,
            ats_breakdown_json={
                "ats_score": 88,
                "breakdown": {
                    "contact_info": {"score": 15, "max": 15},
                    "section_structure": {"score": 20, "max": 20},
                    "skills_density": {"score": 28, "max": 30},
                    "impact_metrics": {"score": 15, "max": 20},
                    "length_format": {"score": 10, "max": 15}
                },
                "suggestions": [
                    "Add more quantifiable metrics for personal projects (e.g. 'boosted active user engagement by 25%')."
                ],
                "strengths": [
                    "Excellent ATS readability and section structure.",
                    "High technical skill density detected (12+ verified skills)."
                ]
            },
            is_primary=True
        )
        db.add(resume)

        # 4. Seed Jobs Data (20+ realistic job postings)
        # 4. Seed Jobs Data (90+ realistic job postings across all 6 core domains)
        jobs_data = []

        domains_sample_data = {
            "AI / Machine Learning Engineer": {
                "titles": [
                    "AI Engineer", "Machine Learning Engineer", "Deep Learning Engineer", 
                    "NLP Engineer", "LLM Engineer", "Computer Vision Engineer", 
                    "MLOps Engineer", "AI Research Engineer", "Generative AI Engineer", 
                    "Applied AI Engineer", "AI Workflows Developer", "Neural Networks Specialist",
                    "Speech AI Engineer", "Reinforcement Learning Developer", "AI Platform Engineer"
                ],
                "skills": ["Python", "PyTorch", "TensorFlow", "Scikit-Learn", "LLM", "NLP", "Computer Vision", "Docker"],
                "companies": ["OpenAI", "Anthropic", "Google", "Microsoft", "Meta", "NVIDIA", "Hugging Face", "Cohere", "Mistral AI", "Scale AI", "Stability AI", "Midjourney", "DeepMind", "Tesla", "Apple"]
            },
            "Frontend Engineer": {
                "titles": [
                    "Frontend Engineer", "React Developer", "Senior UI Developer", 
                    "Next.js Developer", "TypeScript Engineer", "Staff Web Engineer", 
                    "UI Specialist", "Frontend Performance Engineer", "Interface Architect", 
                    "Lead Web Developer", "Framer Motion Developer", "Web Application Developer",
                    "React Native Engineer", "Design Systems Engineer", "SaaS Frontend Developer"
                ],
                "skills": ["React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind"],
                "companies": ["Stripe", "Vercel", "Airbnb", "Meta", "Shopify", "Netlify", "Figma", "Canva", "Slack", "Uber", "Lyft", "Pinterest", "HubSpot", "Dropbox", "Square"]
            },
            "Cloud & DevOps Engineer": {
                "titles": [
                    "DevOps Engineer", "Cloud Platform Engineer", "Site Reliability Engineer (SRE)", 
                    "Infrastructure Automation Specialist", "Kubernetes Operator", "CI/CD Pipeline Developer", 
                    "Terraform Platform Engineer", "AWS Systems Architect", "Docker Systems Developer", 
                    "Lead DevOps Architect", "Cloud Security Engineer", "Release Engineer",
                    "Reliability Architect", "Linux Systems Engineer", "GitOps Specialist"
                ],
                "skills": ["Docker", "Kubernetes", "AWS", "GCP", "Azure", "CI/CD", "Terraform", "Ansible"],
                "companies": ["HashiCorp", "Amazon", "Google Cloud", "Netflix", "Red Hat", "Datadog", "PagerDuty", "New Relic", "Sysdig", "Atlassian", "GitHub", "GitLab", "DigitalOcean", "Heroku", "VMware"]
            },
            "Backend Engineer": {
                "titles": [
                    "Backend Developer", "FastAPI Python Engineer", "Node.js REST API Developer", 
                    "Django Systems Engineer", "Go Microservices Developer", "Java Enterprise Developer", 
                    "Database Architect", "High-Throughput API Developer", "Senior Python Backend Developer",
                    "Distributed Systems Engineer", "API Gateway Architect", "Backend Systems Specialist",
                    "Rust Backend Engineer", "FastAPI Core Developer", "Node.js Platform Engineer"
                ],
                "skills": ["FastAPI", "Django", "Flask", "Node.js", "PostgreSQL", "MongoDB", "Redis", "Go", "Java"],
                "companies": ["Stripe", "Paypal", "Amazon", "Salesforce", "Uber", "eBay", "LinkedIn", "Twitter", "Zoom", "Twilio", "Adyen", "Klarna", "Chime", "Robinhood", "Coinbase"]
            },
            "Data Scientist": {
                "titles": [
                    "Data Scientist", "Quantitative Analyst", "Data Analyst", 
                    "Machine Learning Data Scientist", "Senior Data Insights Analyst", "Statistical Modeling Specialist", 
                    "Data Science Researcher", "Big Data Analytics Engineer", "Business Intelligence Scientist",
                    "Product Data Analyst", "Marketing Data Scientist", "Experimentation Engineer",
                    "Risk Data Scientist", "Data Modeler", "Data Analytics Strategist"
                ],
                "skills": ["Pandas", "NumPy", "Scikit-Learn", "Machine Learning", "Python", "SQL", "Tableau"],
                "companies": ["Meta", "Netflix", "Airbnb", "Uber", "Lyft", "Spotify", "Pinterest", "Instacart", "DoorDash", "Reddit", "Twitter", "Snap", "TikTok", "Palantir", "Databricks"]
            },
            "Cybersecurity Engineer": {
                "titles": [
                    "Cyber Security Analyst", "Security Engineer", "Information Security Specialist", 
                    "Penetration Tester", "Zero Trust Architect", "SIEM Operator", 
                    "Network Intrusion Analyst", "Incident Response Developer", "SecOps Engineer",
                    "AppSec Analyst", "Vulnerability Assessor", "Threat Intelligence Researcher",
                    "Identity & Access Engineer", "Crypto Systems Specialist", "DevSecOps Specialist"
                ],
                "skills": ["Cybersecurity", "Penetration Testing", "SIEM", "Cryptography", "Wireshark"],
                "companies": ["CrowdStrike", "Palo Alto Networks", "FireEye", "Cloudflare", "Okta", "OneTrust", "Splunk", "Zscaler", "Fortinet", "Check Point", "Rapid7", "Tenable", "Qualys", "SentinelOne", "Proofpoint"]
            }
        }

        for domain, details in domains_sample_data.items():
            for idx in range(15):
                title = details["titles"][idx % len(details["titles"])]
                company = details["companies"][idx % len(details["companies"])]
                
                is_rem = (idx % 2 == 0)
                is_hyb = not is_rem and (idx % 3 == 0)
                loc = "Remote" if is_rem else ("New York, NY" if idx % 2 == 0 else "San Francisco, CA")
                
                jobs_data.append({
                    "title": title,
                    "company": company,
                    "company_logo": f"https://logo.clearbit.com/{company.lower().replace(' ', '').replace('(', '').replace(')', '')}.com" if idx % 3 == 0 else "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
                    "company_type": "MNC" if idx % 2 == 0 else "Startup",
                    "location": loc,
                    "is_remote": is_rem,
                    "is_hybrid": is_hyb,
                    "job_type": "Full Time",
                    "salary_min": 100000 + (idx * 5000),
                    "salary_max": 140000 + (idx * 6000),
                    "currency": "USD",
                    "experience_level": "Senior" if idx % 3 == 0 else ("Entry Level" if idx % 4 == 0 else "Mid Level"),
                    "description": f"Exciting opportunity for a professional {title} to build next-generation applications and scale platform infrastructures at {company}.",
                    "required_skills": details["skills"][:4] + [details["skills"][-1]] if len(details["skills"]) >= 5 else details["skills"],
                    "nice_to_have_skills": ["Git", "CI/CD"],
                    "is_fresher_friendly": idx % 4 == 0,
                    "low_competition": idx % 2 == 0
                })

        created_jobs = []
        for j_data in jobs_data:
            job = models.Job(
                recruiter_id=recruiter.id,
                **j_data
            )
            db.add(job)
            created_jobs.append(job)

        db.commit()

        # 5. Seed Initial Applications & Notifications
        if created_jobs:
            app1 = models.Application(
                user_id=seeker.id,
                job_id=created_jobs[0].id,
                resume_id=resume.id,
                match_score=92.5,
                ats_score=88,
                status="Interviewing",
                notes="Candidate screened by recruiter. Scheduled round 1 technical interview."
            )
            db.add(app1)

            app2 = models.Application(
                user_id=seeker.id,
                job_id=created_jobs[1].id,
                resume_id=resume.id,
                match_score=86.0,
                ats_score=88,
                status="Applied"
            )
            db.add(app2)

            notif1 = models.Notification(
                user_id=seeker.id,
                title="Interview Scheduled!",
                message="OpenAI invited you to a technical interview for Senior AI & Full Stack Engineer.",
                type="interview"
            )
            db.add(notif1)

            notif2 = models.Notification(
                user_id=seeker.id,
                title="High Match Job Alert",
                message="We found 3 new jobs matching your profile with over 90% ATS compatibility.",
                type="job_alert"
            )
            db.add(notif2)

            db.commit()

        print("Database seed completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
