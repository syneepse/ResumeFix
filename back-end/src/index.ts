import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import session from 'express-session';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { PrismaClient } from './generated/prisma';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { extractResumeInfoWithGemini } from './gemini';

const prisma = new PrismaClient();

// Set up multer for PDF uploads
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only PDF or Word documents (.pdf, .doc, .docx) are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(session({ secret: process.env.JWT_SECRET || 'supersecret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

import { authenticateToken } from './middleware/auth';

// Passport Google OAuth2 setup
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_CALLBACK_URL!,
}, async (accessToken: string, refreshToken: string, profile: Profile, done) => {
  try {
    const user = await prisma.account.upsert({
      where: { google_id: profile.id },
      update: {
        email: profile.emails?.[0]?.value,
        name: profile.displayName,
        avatar_url: profile.photos?.[0]?.value,
        last_login: new Date(),
      },
      create: {
        google_id: profile.id,
        email: profile.emails?.[0]?.value || '',
        name: profile.displayName,
        avatar_url: profile.photos?.[0]?.value,
        created_at: new Date(),
        last_login: new Date(),
      }
    });
    return done(null, user);
  } catch (error) {
    return done(error, undefined);
  }
}));

passport.serializeUser((user: Express.User, done: (err: any, id?: unknown) => void) => {
  done(null, user);
});
passport.deserializeUser((user: Express.User, done: (err: any, user?: Express.User | false | null) => void) => {
  done(null, user);
});

// Google OAuth2 routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req: Request, res: Response) => {
  // On successful auth, issue JWT and redirect to frontend
  const user = (req as any).user;
  const payload = {
    id: user.id,
    displayName: user.displayName,
    emails: user.emails,
    provider: user.provider
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
  // Redirect to frontend with token as query param (or set cookie in production)
  res.redirect(`http://localhost:3000/auth/callback?token=${token}`);
});

// POST /resumes/upload – Upload a PDF and save metadata
app.post('/resumes/upload', authenticateToken, (req: Request, res: Response, next: NextFunction) => {
  upload.single('pdf')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ error: 'File size exceeds 10MB limit' });
      }
      res.status(400).json({ error: err.message });
    } else if (err) {
      res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    // Extract text from PDF or DOCX
    let resumeText = '';
    const filePath = path.join(uploadDir, req.file.filename);
    if (req.file.mimetype === 'application/pdf') {
      try {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        resumeText = pdfData.text;
      } catch (pdfErr) {
        console.error('PDF parse error:', pdfErr);
        res.status(400).json({ error: 'Failed to parse PDF. Please upload a valid PDF file.' });
      }
    } else if (
      req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      req.file.mimetype === 'application/msword'
    ) {
      try {
        const dataBuffer = fs.readFileSync(filePath);
        const result = await mammoth.extractRawText({ buffer: dataBuffer });
        resumeText = result.value;
      } catch (docErr) {
        console.error('DOCX parse error:', docErr);
        res.status(400).json({ error: 'Failed to parse Word document. Please upload a valid DOC or DOCX file.' });
      }
    } else {
      res.status(400).json({ error: 'Unsupported file type' });
      return;
    }

    // Call Gemini API to extract info, even if resumeText is empty or not a real resume
    let extracted: any = {};
    try {
      extracted = await extractResumeInfoWithGemini(resumeText);
    } catch (err: any) {
      // If Gemini fails, just proceed with empty extracted fields instead of failing the whole upload
      console.warn('Gemini extraction failed, proceeding with minimal info:', err);
      extracted = {};
    }

    // Save metadata & extracted info to DB
    const resume = await prisma.resume.create({
      data: {
        user_id: user.id,
        filename: req.file.filename,
        skills: extracted.skills ? JSON.stringify(extracted.skills) : "",
        name: extracted.name || null,
        email: extracted.email || null,
        phone: extracted.phone || null,
        work_experience: extracted.work_experience || null,
        summary: extracted.summary || null,
        upload_date: new Date(),
      }
    });
    res.status(201).json({ message: 'Resume uploaded', resume, extracted });
  } catch (err) {
    console.error('Upload error:', err); // Log the full error object for debugging
    if (err && (err as any).stack) {
      console.error('Error stack:', (err as any).stack);
    }
    res.status(500).json({ error: 'Failed to upload or process resume', detail: (err as any).message || err });
  }
});

// GET /resumes – Fetch all resumes for the authenticated user
app.get('/resumes', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const resumes = await prisma.resume.findMany({
      where: { user_id: user.id },
      orderBy: { upload_date: 'desc' }
    });

    const res_with_skills = resumes.map(r => ({
      ...r,
      skills: r.skills ? JSON.parse(r.skills) : []
    }));
    res.json(res_with_skills)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resumes', detail: err });
  }
});

// GET /resumes/:id/download – Download a specific PDF
app.get('/resumes/:id/download', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const resume = await prisma.resume.findFirst({
      where: { id: parseInt(req.params.id), user_id: user.id }
    });
    if (!resume) {
      res.status(404).json({ error: 'Resume not found' });
      return;
    }
    const filePath = path.join(uploadDir, resume.filename);
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'File not found on server' });
      return;
    }
    res.download(filePath, resume.filename);
  } catch (err) {
    res.status(500).json({ error: 'Failed to download resume', detail: err });
  }
});

app.delete('/resumes/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const resume = await prisma.resume.findFirst({
      where: { id: parseInt(req.params.id), user_id: user.id }
    });
    if (!resume) {
      res.status(404).json({ error: 'Resume not found' });
      return;
    }
    // Delete the file from disk and ensure it is removed
    const filePath = path.join(uploadDir, resume.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        // Double-check the file is gone
        if (fs.existsSync(filePath)) {
          console.error(`Failed to delete file: ${filePath}`);
          res.status(500).json({ error: 'Failed to delete resume file from disk.' });
          return;
        }
      } catch (fileErr) {
        console.error(`Error deleting file ${filePath}:`, fileErr);
        res.status(500).json({ error: 'Error deleting resume file from disk.', detail: fileErr });
        return;
      }
    }
    await prisma.resume.delete({ where: { id: resume.id } });
    res.json({ message: 'Resume deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete resume', detail: err });
  }
});



// (Optional) POST /match endpoint can be updated later as needed.


// GET /resumes/:id – Fetch all extracted fields for a specific resume
app.get('/resumes/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const resume = await prisma.resume.findFirst({
      where: { id: parseInt(req.params.id), user_id: user.id }
    });
    if (!resume) {
      res.status(404).json({ error: 'Resume not found' });
      return;
    }
    // Parse skills JSON string to array if present
    let skills = null;
    if (resume.skills) {
      try { skills = JSON.parse(resume.skills); } catch { skills = resume.skills; }
    }
    res.json({
      id: resume.id,
      filename: resume.filename,
      name: resume.name,
      email: resume.email,
      phone: resume.phone,
      skills,
      work_experience: resume.work_experience,
      summary: resume.summary,
      upload_date: resume.upload_date
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resume', detail: err });
  }
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
