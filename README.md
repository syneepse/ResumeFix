# Resume Skill Extractor

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
- **Orchestration:** Kubernetes

---

## 2. API Reference (Backend)

### Authentication
- `GET /auth/google` – Initiate Google OAuth2 login
- `GET /auth/google/callback` – OAuth2 callback, issues JWT

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
- **kubectl** (for Kubernetes)
- **Node.js** (v18+) and **npm** (for local development)

### 5.1. On Windows, Mac, or Linux

#### a) Install Docker
- **Windows/Mac:** [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Linux:**
  ```sh
  sudo apt-get update
  sudo apt-get install -y docker.io
  sudo systemctl enable --now docker
  ```

#### b) Install kubectl
- [Official instructions](https://kubernetes.io/docs/tasks/tools/)
- **Linux example:**
  ```sh
  curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl"
  chmod +x ./kubectl
  sudo mv ./kubectl /usr/local/bin/kubectl
  ```

#### c) Build and Push Docker Images
- Backend:
  ```sh
  docker build -t your-docker-repo/resume-backend:latest .
  docker push your-docker-repo/resume-backend:latest
  ```
- Frontend:
  ```sh
  docker build -f Dockerfile.frontend -t your-docker-repo/resume-frontend:latest .
  docker push your-docker-repo/resume-frontend:latest
  ```

#### d) Configure Secrets (All Environment Variables)
- All environment variables from `.env` files (frontend and backend) should be set dynamically via Kubernetes secrets.
- Edit `deployment.yaml` and add your secrets to the `resume-secrets` Secret. Example:
  ```yaml
  apiVersion: v1
  kind: Secret
  metadata:
    name: resume-secrets
    namespace: default
  stringData:
    jwt-secret: "<insert-your-jwt-secret-here>"
    gemini-api-key: "<insert-your-gemini-api-key-here>"
    google-client-id: "<insert-your-google-client-id-here>"
    google-client-secret: "<insert-your-google-client-secret-here>"
    google-callback-url: "<insert-your-google-callback-url-here>"
    # Add more variables as needed
  ```
- Reference these secrets in your backend and frontend deployment `env` sections using `valueFrom.secretKeyRef`. Example:
  ```yaml
  env:
    - name: JWT_SECRET
      valueFrom:
        secretKeyRef:
          name: resume-secrets
          key: jwt-secret
    - name: GOOGLE_CLIENT_ID
      valueFrom:
        secretKeyRef:
          name: resume-secrets
          key: google-client-id
    # ...and so on for all variables
  ```
- No sensitive values are hardcoded in code or Dockerfiles. All configuration is managed securely via Kubernetes.

**Typical variables to set:**
- Backend: `JWT_SECRET`, `GEMINI_API_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`, `DATABASE_URL` (if not using default)
- Frontend: `NEXT_PUBLIC_API_URL`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

> Add or remove variables as your project requires. All sensitive data should be managed this way for security and flexibility.

#### e) Deploy to Kubernetes
- Apply the deployment manifest:
  ```sh
  kubectl apply -f deployment.yaml
  ```

#### f) Access the Application
- The frontend will be exposed on **NodePort 32000** (http://<your-node-ip>:32000)
- The backend will be exposed on **NodePort 32001** (http://<your-node-ip>:32001)
- You can change these ports in `deployment.yaml` if needed.

---

## 6. Credits

**Developed by:** Somaansh Virmani  
**Task:** CSFirst Resume Skill Extractor

---
