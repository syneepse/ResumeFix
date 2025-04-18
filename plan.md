# Resume Skill Extractor: Project Checklist Plan

## Core Features
1. **Login Page**
   - User authentication (already implemented)
2. **Resume Upload & Storage**
   - Users can upload and store multiple resumes (PDF)
3. **Skill Extraction**
   - Extract skills and key information from uploaded resumes using AI/ML
4. **Job Description (JD) Upload**
   - Users can upload and manage multiple job descriptions
5. **Fit Matching**
   - For each JD, display how well each uploaded resume matches (fit score)
6. **Resume Improvement Suggestions**
   - For each resume, provide actionable suggestions to increase their fit for selected JDs


## Overview
A web application to extract, analyze, and manage resume data using AI models. The platform will cater to candidates, offering a streamlined workflow focused on resume upload, extraction, and job application. The solution will be built using React (front-end) and Express.js (Node.js back-end), leveraging AI APIs (e.g., GPT, Gemini) for information extraction.

---

## Front-End Checklist (Next.js)

**Status:** Nearly complete. Minor refinements or bug fixes may remain.

### General
- [x] Set up Next.js project structure
    - [x] Initialize Next.js app with TypeScript support
    - [x] Configure project directory structure (pages, components, styles, utils)
    - [ ] Set up ESLint, Prettier, and basic linting rules
    - [ ] Add support for environment variables (dotenv)
- [x] Implement routing for candidate view
    - [x] Create layout for candidates
    - [x] Configure navigation and sidebar components
- [x] Design a clean, responsive UI with modern components
    - [x] Choose a UI library (Tailwind CSS)
    - [x] Set up global theme and style overrides
    - [x] Implement mobile responsiveness
    - [x] Create reusable form and button components

### Candidate View
- [x] Dashboard page structure scaffolded and styled
- [x] Resume table with skill extraction, job matching, and loading states
- [ ] Resume improvement suggestions
    - [ ] For each resume, suggest actions to increase fit for selected JDs
- [ ] View application status/history
    - [ ] List all jobs the candidate has applied to
    - [ ] Show application status (pending, reviewed, matched, etc.)

### Shared Components
- [x] PDF upload component
    - [x] Reusable drag-and-drop PDF uploader
    - [x] Error handling and user feedback
- [x] Summary view for extracted data
    - [x] Component to display key fields in a card or modal
- [x] Notification and status messages
    - [x] Toasts, alerts, and inline feedback

### Dummy Data
- [x] Create mock resumes for testing
    - [x] Use JSON files or mock API endpoints
- [x] Simulate candidate applications and fit scores
    - [x] Pre-populate dashboard views for candidates

---

## API Checklist (Express.js)
- [ ] **GET /resumes** – Fetch all resumes for the authenticated user
    - [ ] Implement authentication middleware
    - [ ] Connect to database and fetch resumes
    - [ ] Return results in JSON format
- [ ] **POST /resumes** – Upload a new resume (extract info, store in database, return updated list)
    - [ ] Set up file upload (Multer or similar)
    - [ ] Extract resume info using AI/ML API
    - [ ] Store resume and extracted info in database
    - [ ] Return updated list of resumes
- [ ] **DELETE /resumes/:id** – Delete a specific resume
    - [ ] Implement resume deletion route
    - [ ] Remove resume from database and storage
    - [ ] Return updated list
- [ ] **GET /resumes/:id/download** – Download a specific resume file
    - [ ] Implement file download route
    - [ ] Fetch file from storage and return
- [ ] **POST /match** – Perform job description to resume matching, return matched skills and rating
    - [ ] Receive JD and resume data
    - [ ] Call AI/ML API for matching
    - [ ] Return matched skills and fit rating

## Back-End Checklist (Express.js)

### General
- [ ] Set up Express.js backend project
    - [ ] Create new Express.js project directory (e.g., /back-end)
    - [ ] Initialize npm and package.json
    - [ ] Initialize Git repository and .gitignore
    - [ ] Install dependencies: express, typescript, ts-node-dev, dotenv, cors, multer, etc.
    - [ ] Set up tsconfig.json for TypeScript
    - [ ] Organize code into modules:
        - [ ] routes
        - [ ] controllers
        - [ ] services
        - [ ] utils
        - [ ] middlewares
    - [ ] Configure environment variables (.env, dotenv)
    - [ ] Add README for backend setup and usage
    - [ ] Set up ESLint and Prettier for formatting and linting
    - [ ] Ensure all code is clean, readable, and well-documented

- [x] Connect to a database (SQLite via Prisma)
    - [x] Choose a database and install Node.js driver (Prisma)
    - [x] Create and test database connection utility (Prisma Client)
    - [x] Design and implement schema/models for:
        - [x] Users
        - [x] Resumes


---
  
## Back-End Setup: Step-by-Step

---

# Back-End Checklist

## 1. Database Selection & Setup
- [x] Research and choose a simple SQL database for Express.js (SQLite with Prisma)
    - Recommendation: Use SQLite with the `better-sqlite3` or `sqlite3` npm package for easy integration and zero setup, or MySQL with `mysql2` if you expect to scale.
- [x] Install the chosen database library and add it to `package.json` (Prisma, @prisma/client)
- [x] Create a database connection utility/module (Prisma Client)

## 2. Schema Design & Migration
- [x] Design schema for:
    - Accounts table (Google-authenticated users)
        - Fields: id, google_id, email, name, avatar_url, created_at, last_login
    - Resumes table
        - Fields: id, user_id (foreign key), filename, skills (JSON array of strings), name, email, phone, work_experience, summary, upload_date
- [x] Create migration scripts or SQL statements to initialize tables (Prisma migration)

## 3. Google Authentication Integration
- [x] Set up Google OAuth2 authentication for Express.js (use `passport-google-oauth20`)
- [x] Implement login route and callback to handle Google sign-in
- [x] On login, create or update user in the accounts table

## 4. PDF Upload & Storage
- [x] Set up file upload handling (using `multer` for Express)
- [x] Implement API endpoint to upload PDFs (save file and metadata)
- [x] Store PDF info (name, filename, skills, phone, email, work_experience, summary, etc.) in the Resumes table (via Prisma)

## 5. PDF Retrieval & Listing
- [x] Implement API endpoint to list PDFs for the authenticated user
- [x] Implement API endpoint to download/view a specific PDF

## 6. Skills Extraction & Storage
- [x] Ensure the skills field in Resumes table can store a list (using JSON via Prisma)
- [x] On PDF/Word upload, use GenAI (Gemini) to extract all necessary information (name, email, phone, skills, work_experience, summary) and store in the database automatically. No manual skills update API is needed.

## 7. Security & Access Control
- [x] Ensure all PDF routes are protected (authenticated users only)
- [ ] Validate file types and sizes during upload

## 8. Documentation & Environment
- [ ] Document environment variables needed (Google OAuth credentials, DB path, etc.)
- [ ] Add scripts to initialize/setup the database

---

# Next Steps

1. **Validate file types and sizes during upload**
   - Only allow PDF or Word documents (.pdf, .doc, .docx), limit file size (e.g., 2MB)
   - Return appropriate error for invalid uploads
2. **Integrate GenAI for automatic information extraction on upload**
   - When a user uploads a document, automatically extract technical skills and other relevant info using GenAI, and save to the database
3. **Document environment variables and setup**
   - List required .env variables in README/plan
4. **Add scripts or instructions to initialize/setup the database**
5. **(Optional) Implement job and application tables and endpoints**

# Resume (PDF) API Endpoints

1. **Fetch all resumes for a specific user**
    - `GET /api/resumes`
    - Returns a list of all resume metadata for the authenticated user.

2. **Retrieve the PDF file for a specific resume**
    - `GET /api/resumes/:id/pdf`
    - Returns the raw PDF file for the given resume ID (if the user owns it).

3. **View a PDF (inline)**
    - `GET /api/resumes/:id/view`
    - Returns the PDF with headers set for inline viewing in browser (could be same as previous, but with different headers).

4. **Delete a resume**
    - `DELETE /api/resumes/:id`
    - Deletes the resume record and the associated PDF file (if the user owns it).

5. **Upload a resume, extract its details, and store in DB**
    - `POST /api/resumes`
    - Accepts a PDF upload, extracts details (name, email, phone, skills, work_experience, summary, etc.), and stores the info and file.

---

These tasks and endpoints form the foundation for the back-end of the project, ensuring user authentication via Google, secure PDF upload/storage, and robust resume management.


### 1. Initialize Express.js Project
- [ ] Create /back-end directory
- [ ] Run npm init -y
- [ ] Install core dependencies: express, cors, dotenv
- [ ] Install dev dependencies: typescript, ts-node-dev, @types/express, @types/node, @types/cors, @types/multer, eslint, prettier
- [ ] Initialize git and create .gitignore
- [ ] Create tsconfig.json
- [ ] Create README.md
- [ ] Create .env and .env.example

### 2. Set Up Project Structure
- [ ] Create folders: routes, controllers, services, utils, middlewares, models
- [ ] Create src/index.ts as the entry point

### 3. Configure Scripts in package.json
- [ ] Add scripts for development (ts-node-dev), build, and start

### 4. Add ESLint and Prettier Configs
- [ ] Create .eslintrc.json and .prettierrc

### 5. First Commit
- [ ] Stage all files and commit: "Initial Express.js backend setup"

### 6. Continue with API and Database Implementation
- [ ] Follow the detailed API and database steps above

---

## Deployment & Dockerization
- [ ] Write Dockerfiles for both front-end and back-end
- [ ] Set up docker-compose for local development
- [ ] Configure environment variables and secrets
- [ ] Plan for deployment to cloud (e.g., AWS, Azure, GCP, Vercel, Netlify)
- [ ] Set up CI/CD pipeline (GitHub Actions, GitLab CI, etc.)

---

## Business Impacts
- **Efficiency:** Automates resume screening, reducing manual HR effort
- **Accuracy:** AI-driven extraction and fit scoring improves candidate-job matching
- **Scalability:** Supports high volume of candidates and job postings
- **Candidate Experience:** Provides instant feedback and transparency

- **Data-Driven Decisions:** Enables analytics on hiring pipeline and skill gaps

---

## Notes
- Ensure support for various job roles and resume formats
- Use freely available AI APIs (ensure API keys are securely managed)
- Prioritize clean UX and accessibility
- Plan for extensibility (adding more features like interview scheduling, analytics, etc.)
