import datetime
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app import models, auth

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if users already seeded
        if db.query(models.User).first():
            print("Database already seeded.")
            return

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
        jobs_data = [
            {
                "title": "Senior AI & Full Stack Engineer",
                "company": "NeuralStack Labs",
                "company_logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
                "company_type": "Newly Founded Startup",
                "location": "San Francisco, CA (Remote)",
                "is_remote": True,
                "is_hybrid": False,
                "job_type": "Full Time",
                "salary_min": 140000,
                "salary_max": 180000,
                "currency": "USD",
                "experience_level": "Mid Level",
                "description": "We are building the next generation of autonomous AI workflow agents. Looking for a passionate Full Stack AI Engineer skilled in Python (FastAPI), React, Tailwind, and LLM integrations.",
                "required_skills": ["Python", "FastAPI", "React", "TypeScript", "Tailwind", "LLM", "Docker"],
                "nice_to_have_skills": ["PyTorch", "Redis", "LangChain"],
                "is_fresher_friendly": False,
                "low_competition": True
            },
            {
                "title": "Frontend Engineer (React + Motion)",
                "company": "Pulse Digital",
                "company_logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&auto=format&fit=crop&q=80",
                "company_type": "MNC",
                "location": "New York, NY",
                "is_remote": True,
                "is_hybrid": True,
                "job_type": "Full Time",
                "salary_min": 125000,
                "salary_max": 160000,
                "currency": "USD",
                "experience_level": "Mid Level",
                "description": "Design and craft wowed glassmorphism user experiences for our enterprise dashboard suite using React, Tailwind CSS, and Framer Motion.",
                "required_skills": ["React", "JavaScript", "TypeScript", "Tailwind", "HTML", "CSS", "Git"],
                "nice_to_have_skills": ["Framer Motion", "Figma", "Redux"],
                "is_fresher_friendly": True,
                "low_competition": False
            },
            {
                "title": "Python Backend & Microservices Developer",
                "company": "HyperScale Cloud",
                "company_logo": "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&auto=format&fit=crop&q=80",
                "company_type": "Startup",
                "location": "Austin, TX (Remote)",
                "is_remote": True,
                "is_hybrid": False,
                "job_type": "Full Time",
                "salary_min": 130000,
                "salary_max": 170000,
                "currency": "USD",
                "experience_level": "Senior",
                "description": "Join our cloud infrastructure team. Build ultra-fast REST APIs, scale PostgreSQL databases, and orchestrate Docker container deployments.",
                "required_skills": ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "Docker", "AWS", "REST API"],
                "nice_to_have_skills": ["Kubernetes", "Redis", "Kafka"],
                "is_fresher_friendly": False,
                "low_competition": True
            },
            {
                "title": "Junior Web Developer & AI Associate",
                "company": "Apex NextGen Tech",
                "company_logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80",
                "company_type": "Newly Founded Startup",
                "location": "Seattle, WA",
                "is_remote": True,
                "is_hybrid": False,
                "job_type": "Full Time",
                "salary_min": 85000,
                "salary_max": 110000,
                "currency": "USD",
                "experience_level": "Entry Level",
                "description": "Great entry-level opportunity for ambitious fresh graduates to learn Python, React, and modern machine learning tools.",
                "required_skills": ["Python", "JavaScript", "HTML", "CSS", "Git"],
                "nice_to_have_skills": ["React", "FastAPI", "SQL"],
                "is_fresher_friendly": True,
                "low_competition": True
            },
            {
                "title": "Lead UI/UX Designer & Frontend Strategist",
                "company": "Vivid Studio",
                "company_logo": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=80",
                "company_type": "Startup",
                "location": "Los Angeles, CA",
                "is_remote": False,
                "is_hybrid": True,
                "job_type": "Full Time",
                "salary_min": 115000,
                "salary_max": 145000,
                "currency": "USD",
                "experience_level": "Mid Level",
                "description": "Transform visual design concepts into sleek responsive web interfaces with Figma, React, and CSS animations.",
                "required_skills": ["Figma", "UI/UX", "React", "CSS", "Tailwind"],
                "nice_to_have_skills": ["Wireframing", "JavaScript"],
                "is_fresher_friendly": False,
                "low_competition": False
            },
            {
                "title": "Data Scientist - NLP & Resume AI",
                "company": "TalentIQ Systems",
                "company_logo": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&auto=format&fit=crop&q=80",
                "company_type": "MNC",
                "location": "Boston, MA (Remote)",
                "is_remote": True,
                "is_hybrid": False,
                "job_type": "Full Time",
                "salary_min": 145000,
                "salary_max": 190000,
                "currency": "USD",
                "experience_level": "Senior",
                "description": "Build state-of-the-art NLP models, semantic keyword extractors, and recommendation engines for enterprise recruitment.",
                "required_skills": ["Python", "NLP", "Machine Learning", "Scikit-Learn", "Pandas", "PyTorch"],
                "nice_to_have_skills": ["Transformers", "FastAPI", "Docker"],
                "is_fresher_friendly": False,
                "low_competition": True
            }
        ]

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
                message="NeuralStack Labs invited you to a technical interview for Senior AI & Full Stack Engineer.",
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
