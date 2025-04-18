import request from 'supertest';
import app from '../index';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

jest.mock('@prisma/client');
jest.mock('pdf-parse', () => jest.fn().mockResolvedValue({ text: 'Fake resume text' }));
jest.mock('mammoth', () => ({
  convertToHtml: jest.fn().mockResolvedValue({ value: 'Fake resume text' })
}));
const prisma = new PrismaClient() as jest.Mocked<PrismaClient>;
(prisma as any).resume = {
  create: jest.fn(),
  findMany: jest.fn(),
  findFirst: jest.fn(),
  delete: jest.fn(),
};

// Patch global PrismaClient so app uses our mock
jest.mock('../index', () => {
  const actualApp = jest.requireActual('../index');
  actualApp.prisma = prisma;
  return actualApp;
});

// Mock Gemini extraction
jest.mock('../gemini', () => ({
  extractResumeInfoWithGemini: jest.fn().mockResolvedValue({
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    skills: ['JavaScript', 'Node.js'],
    work_experience: 'Test Company',
    summary: 'Test summary'
  })
}));

// Mock authentication middleware to always inject a test user
jest.mock('../middleware/auth', () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    req.user = { id: 1 };
    next();
  }
}));



describe('Resume API', () => {
  let resumeId: number;
  const testFilePath = path.join(__dirname, 'test_resume.pdf');

  beforeAll(() => {
    // Create a dummy PDF file for upload
    fs.writeFileSync(testFilePath, 'Dummy PDF content');

    // Mock Prisma methods
    (prisma.resume.create as jest.Mock).mockResolvedValue({
      id: 1,
      user_id: 1,
      filename: 'test_resume.pdf',
      skills: JSON.stringify(['JavaScript', 'Node.js']),
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      work_experience: 'Test Company',
      summary: 'Test summary',
      upload_date: new Date()
    });
    (prisma.resume.findMany as jest.Mock).mockResolvedValue([
      {
        id: 1,
        user_id: 1,
        filename: 'test_resume.pdf',
        skills: JSON.stringify(['JavaScript', 'Node.js']),
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        work_experience: 'Test Company',
        summary: 'Test summary',
        upload_date: new Date()
      }
    ]);
    (prisma.resume.findFirst as jest.Mock).mockImplementation(({ where }) => {
      if (where && (where.id === 1 || where.id === '1')) {
        return Promise.resolve({
          id: 1,
          user_id: 1,
          filename: 'test_resume.pdf',
          skills: JSON.stringify(['JavaScript', 'Node.js']),
          name: 'Test User',
          email: 'test@example.com',
          phone: '1234567890',
          work_experience: 'Test Company',
          summary: 'Test summary',
          upload_date: new Date()
        });
      }
      return Promise.resolve(undefined);
    });
    (prisma.resume.delete as jest.Mock).mockResolvedValue({});
  });

  afterAll(() => {
    fs.unlinkSync(testFilePath);
  });

  it('should upload a resume and extract info', async () => {
    const res = await request(app)
      .post('/resumes/upload')
      .attach('pdf', testFilePath)
      .set('Authorization', 'Bearer testtoken');
    expect(res.statusCode).toBe(201);
    expect(res.body.resume).toHaveProperty('id');
    expect(res.body.resume).toHaveProperty('filename');
    expect(res.body.resume).toHaveProperty('skills');
    expect(res.body.resume).toHaveProperty('summary');
    resumeId = res.body.resume.id;
  });

  it('should get all resumes for the user', async () => {
    const res = await request(app)
      .get('/resumes')
      .set('Authorization', 'Bearer testtoken');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get a specific resume by ID', async () => {
    const res = await request(app)
      .get(`/resumes/${resumeId}`)
      .set('Authorization', 'Bearer testtoken');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', resumeId);
    expect(res.body).toHaveProperty('summary');
  });

  it('should download the resume file', async () => {
    const res = await request(app)
      .get(`/resumes/${resumeId}/download`)
      .set('Authorization', 'Bearer testtoken');
    expect(res.statusCode).toBe(200);
    expect(res.header['content-disposition']).toContain('attachment');
  });

  it('should delete the resume', async () => {
    const res = await request(app)
      .delete(`/resumes/${resumeId}`)
      .set('Authorization', 'Bearer testtoken');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Resume deleted');
  });
});
