# Resume Skill Extractor: Project Checklist Plan

> **Status: All planned tasks have been completed as of 2025-04-19.**

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
    - [x] Set up ESLint, Prettier, and basic linting rules
    - [x] Add support for environment variables (dotenv)
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
- [x] Resume improvement suggestions
    - [x] For each resume, suggest actions to increase fit for selected JDs
- [x] View application status/history
    - [x] List all jobs the candidate has applied to
    - [x] Show application status (pending, reviewed, matched, etc.)

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
- [x] **GET /resumes** – Fetch all resumes for the authenticated user
    - [x] Implement authentication middleware
    - [x] Connect to database and fetch resumes
    - [x] Return results in JSON format
- [x] **POST /resumes** – Upload a new resume (extract info, store in database, return updated list)
    - [x] Set up file upload (Multer or similar)
    - [x] Extract resume info using AI/ML API
    - [x] Store resume and extracted info in database
    - [x] Return updated list of resumes
- [x] **DELETE /resumes/:id** – Delete a specific resume
    - [x] Implement resume deletion route
    - [x] Remove resume from database and storage
    - [x] Return updated list
- [x] **GET /resumes/:id/download** – Download a specific resume file
    - [x] Implement file download route
    - [x] Fetch file from storage and return
- [x] **POST /match** – Perform job description to resume matching, return matched skills and rating
    - [x] Receive JD and resume data
    - [x] Call AI/ML API for matching
    - [x] Return matched skills and fit rating

## Back-End Checklist (Express.js)

### General
- [x] Set up Express.js backend project
    - [x] Create new Express.js project directory (e.g., /back-end)
    - [x] Initialize npm and package.json
    - [x] Initialize Git repository and .gitignore
    - [x] Install dependencies: express, typescript, ts-node-dev, dotenv, cors, multer, etc.
    - [x] Set up tsconfig.json for TypeScript
    - [x] Organize code into modules:
        - [x] routes
        - [x] controllers
        - [x] services
        - [x] utils
        - [x] middlewares
    - [x] Configure environment variables (.env, dotenv)
    - [x] Add README for backend setup and usage
    - [x] Set up ESLint and Prettier for formatting and linting
    - [x] Ensure all code is clean, readable, and well-documented

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
- [x] Validate file types and sizes during upload

## 8. Documentation & Environment
- [x] Document environment variables needed (Google OAuth credentials, DB path, etc.)
- [x] Add scripts to initialize/setup the database

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
- [x] Create /back-end directory
- [x] Run npm init -y
- [x] Install core dependencies: express, cors, dotenv
- [x] Install dev dependencies: typescript, ts-node-dev, @types/express, @types/node, @types/cors, @types/multer, eslint, prettier
- [x] Initialize git and create .gitignore
- [x] Create tsconfig.json
- [x] Create README.md
- [x] Create .env and .env.example

### 2. Set Up Project Structure
- [x] Create folders: routes, controllers, services, utils, middlewares, models
- [x] Create src/index.ts as the entry point

### 3. Configure Scripts in package.json
- [x] Add scripts for development (ts-node-dev), build, and start

### 4. Add ESLint and Prettier Configs
- [x] Create .eslintrc.json and .prettierrc

### 5. First Commit
- [x] Stage all files and commit: "Initial Express.js backend setup"

### 6. Continue with API and Database Implementation
- [x] Follow the detailed API and database steps above

---

## Deployment & Dockerization
- [x] Write Dockerfiles for both front-end and back-end
- [x] Set up docker-compose for local development
- [x] Configure environment variables and secrets
- [x] Plan for deployment to cloud (e.g., AWS, Azure, GCP, Vercel, Netlify)
- [x] Set up CI/CD pipeline (GitHub Actions, GitLab CI, etc.)

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
