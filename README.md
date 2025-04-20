# Resume Skill Extractor

## DEMO - 
https://resume-fix-csfirst.windsurf.build/

## Overview
Resume Skill Extractor is a full-stack web application for uploading, analyzing, and managing resumes. It leverages AI to extract skills, work experience, and summaries from resumes, helping job seekers optimize their applications and enabling hiring managers to efficiently filter candidates.

---

## 1. Technologies Used

### Frontend
- **Framework:** Next.js / React
- **Language:** TypeScript
- **UI:** Tailwind CSS
- **Node.js:** v18.x

### Backend
- **Framework:** Express.js (Node.js v18.x)
- **Database:** SQLite (via Prisma ORM v6.6.0)
- **Authentication:** JWT, Passport.js (Google OAuth2)
- **File Uploads:** Multer
- **AI Integration:** Gemini API (Google)

### DevOps
- **Containerization:** Docker

---

## 2. API Reference (Backend)


### Resume Management
- `POST /resumes/upload` (Authenticated)
  - **Body:** `multipart/form-data` with `pdf` field (PDF/DOC/DOCX)
  - **Response:** `{ message, resume, extracted }`
- `GET /resumes` (Authenticated)
  - **Response:** Array of resumes with extracted fields
- `GET /resumes/:id/download` (Authenticated)
  - **Response:** Download the original resume file
- `DELETE /resumes/:id` (Authenticated)
  - **Response:** `{ message }` on success
- `GET /resumes/:id` (Authenticated)
  - **Response:** Extracted fields for a specific resume

**Authentication:** All endpoints (except `/auth/google*`) require a valid JWT.

---

## 3. AI Model & Extraction Flow
- **Model:** Google Gemini API
- **How it works:**
  1. User uploads a resume (PDF/DOC/DOCX).
  2. Text is extracted from the file.
  3. The text is sent to Gemini with a prompt emphasizing a concise, professional summary and skill extraction.
  4. Gemini returns structured JSON (summary, skills, work experience, etc.), which is saved in the database.

---

## 4. Usage Scenarios

### For Job Seekers
- Upload multiple tailored resumes for different job applications.
- Instantly see extracted skills, summaries, and work experience for each resume.
- Compare how your skills match job descriptions (future feature).
- Download, delete, and manage all your resumes in one place.

### For Hiring Managers
- Upload and analyze candidate resumes in bulk.
- Filter and sort resumes based on extracted skills and experience.
- Quickly identify top candidates for specific roles.

---

## 5. Deployment Instructions

### Prerequisites
- **Docker** (v20+)

### Steps to Deploy

1. **Clone the Repository**
   ```sh
   git clone <this-repo-url>
   cd ResumeFix
   ```
2. **Configure Environment Variables**
   - Open `docker-compose.yaml`.
   - Set the required environment variables under the `environment` section for both `backend` and `frontend` services. **Do not commit sensitive values.**

   **Required Environment Variables:**
   - Backend:
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
     - `GOOGLE_CALLBACK_URL`
     - `JWT_SECRET`
     - `DATABASE_URL`
     - `GEMINI_API_KEY`
     - `FRONTEND_ORIGIN`
   - Frontend:
     - `NEXT_PUBLIC_API_URL`

3. **Start the Application**
   ```sh
   docker-compose up
   ```
   - This will build and start both frontend (on port 3000) and backend (on port 5000).

4. **Access the Application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:5000](http://localhost:5000)

---

> For advanced deployment (Kubernetes, cloud, etc.), refer to previous versions or reach out to the maintainer.


## 6. Credits

**Developed by:** Somaansh Virmani  
**Task:** CSFirst Resume Skill Extractor

---
