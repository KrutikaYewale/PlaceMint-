# PlaceMint
## Product Requirements Document (PRD) + Technical Requirements Document (TRD)

### Tagline:
### *“An Intelligent Campus Recruitment Ecosystem”*

---

# 1. Project Overview

## Project Title
PlaceMint

## Domain
Education Technology (EdTech)

## Project Type
Full Stack Web Application

## Objective
PlaceMint is a centralized campus recruitment platform designed to streamline and automate the placement process for students, recruiters, and placement coordinators.

The platform enables:
- Students to create professional profiles and apply for job drives.
- Companies to conduct campus recruitment digitally.
- Placement coordinators to manage recruitment workflows efficiently.
- Colleges to analyze placement statistics and hiring trends.

The project aims to reduce manual placement management, improve communication, and provide intelligent placement insights.

---

# 2. Problem Statement

Most colleges still manage placements using spreadsheets, emails, WhatsApp groups, and manual shortlisting methods.

Current problems include:
- Lack of centralized placement management
- Time-consuming manual eligibility checks
- Poor communication between students and recruiters
- No analytics or placement insights
- No resume guidance or skill tracking
- Difficulty comparing offers and tracking placement trends

PlaceMint solves these issues by creating a smart digital placement ecosystem.

---

# 3. Vision Statement

“To build an intelligent campus recruitment ecosystem that not only manages placements digitally but also improves student career readiness using automation, analytics, and smart recommendations.”

---

# 4. USP (Unique Selling Proposition)

## Main USP
PlaceMint is an AI-assisted placement management platform combining recruitment automation, resume analysis, placement analytics, and smart recommendations.

## Key Differentiators

### Smart Eligibility Engine
Automatically checks:
- CGPA
- Branch
- Skills
- Backlogs
- Passing year

Provides exact rejection reasons and improvement suggestions.

### AI Resume Analyzer
- ATS resume score
- Resume quality analysis
- Missing keyword suggestions
- Industry readiness insights

### Offer Comparison Dashboard
Students can compare:
- Salary packages
- Roles
- Locations
- Bond periods
- Company ratings

### Placement Prediction Analytics
Predicts placement probability using:
- Skill sets
- Previous placement trends
- Academic performance

### Skill Recommendation Engine
Suggests in-demand skills based on:
- Student branch
- Industry trends
- Placement statistics

---

# 5. MVP (Minimum Viable Product)

## MVP Goal
Build a working campus placement system with core recruitment functionality.

## MVP Features

### Student Module
- Registration/Login
- Profile management
- Resume upload
- View job drives
- Apply for jobs
- Track application status

### Company Module
- Register/Login
- Post job drives
- Set eligibility criteria
- View applicants
- Shortlist students

### Admin Module
- Manage students
- Manage recruiters
- Manage drives
- Schedule interviews
- Update results

### Authentication
- JWT Authentication
- Password encryption using bcrypt
- Role-based access control

### Notifications
- Email notifications using Email.js

### Analytics
- Placement charts using Recharts

---

# 6. Functional Requirements

## Student Functionalities
- Student signup/login
- Profile creation
- Resume upload
- View eligible jobs
- Apply for drives
- Track application status

## Company Functionalities
- Company registration/login
- Create job drives
- Add eligibility criteria
- Manage applicants
- Shortlist candidates

## Admin Functionalities
- Verify student profiles
- Approve recruiter drives
- Manage interview schedules
- Generate placement reports

---

# 7. Technical Requirements Document (TRD)

## Recommended Tech Stack

### Frontend
- React.js
- React Router
- React Hook Form
- Axios
- Tailwind CSS / Bootstrap
- Recharts

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose ODM

### Authentication
- JWT
- bcrypt

### Notifications
- Email.js

---

# 8. System Architecture

## Frontend Layer
Handles:
- UI Components
- Dashboards
- Forms
- Routing

## Backend Layer
Handles:
- APIs
- Authentication
- Business logic
- File uploads

## Database Layer
Stores:
- Users
- Job drives
- Applications
- Analytics data

---

# 9. Database Design

## Collections

### Users
- name
- email
- password
- role

### Students
- branch
- cgpa
- skills
- certifications
- resumeURL

### Companies
- companyName
- recruiterName
- industry

### Jobs
- role
- package
- eligibility
- deadline

### Applications
- studentId
- jobId
- status

---

# 10. Analytics Dashboard

## Reports
- Placement percentage
- Highest package
- Average package
- Company-wise hiring
- Branch-wise placement trends

## Charts
- Pie Charts
- Bar Graphs
- Line Charts

---

# 11. Security Features

- JWT Authentication
- Password hashing using bcrypt
- Protected routes
- Role-based access control
- File validation

---

# 12. Future Enhancements

## AI Features
- Resume analyzer
- AI interview chatbot
- Placement prediction
- Skill recommendation engine

## Advanced Features
- Online aptitude tests
- Real-time notifications using Socket.io
- LinkedIn profile import
- Video interview integration

---

# 13. Deployment Plan

## Frontend
- Vercel
- Netlify

## Backend
- Render
- Railway

## Database
- MongoDB Atlas

---

# 14. Project Timeline

| Week | Task |
|---|---|
| 1 | Requirement Analysis + UI Design |
| 2 | Authentication System |
| 3 | Student Module |
| 4 | Company Module |
| 5 | Admin Module |
| 6 | Job Application Workflow |
| 7 | Analytics Dashboard |
| 8 | Testing + Deployment |

---

# 15. Expected Outcomes

The platform will:
- Digitize campus recruitment
- Reduce manual placement work
- Improve recruiter-student communication
- Provide placement analytics
- Improve student career readiness

---

# 16. Conclusion

PlaceMint is a MERN-stack based intelligent recruitment management system designed to modernize campus placements using automation, analytics, and smart recommendations.

The project demonstrates:
- Full Stack Development
- Authentication & Security
- Database Design
- Dashboard Analytics
- Real-world Workflow Automation

PlaceMint is an excellent final-year project idea and a strong portfolio project for software development careers.
