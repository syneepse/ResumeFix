import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const api_key = process.env.GEMINI_API_KEY as string;

if (!api_key) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
} 

export interface ResumeExtractedInfo {
  name?: string;
  email?: string;
  phone?: string;
  skills?: string[];
  work_experience?: string;
  summary?: string;
  [key: string]: any;
}

export async function extractResumeInfoWithGemini(resumeText: string): Promise<ResumeExtractedInfo> {
  if (!api_key) throw new Error('GEMINI_API_KEY is not set in environment variables');
  const prompt = `Extract the following information from this resume text and return ONLY a valid JSON object as described below. Do NOT include any explanation, Markdown, or text before or after the JSON. Use null for missing fields.\n\nIMPORTANT: Pay special attention to generating a concise, professional, and complete summary that best represents the candidate's qualifications and experience. The summary should be clear, well-written, and highlight the candidate's most relevant strengths.\n\nFormat:\n{\n  \"name\": string or null,\n  \"email\": string or null,\n  \"phone\": string or null,\n  \"skills\": array of strings or null,\n  \"work_experience\": string or null,\n  \"summary\": string or null\n}\n\nExamples:\n\nResume:\nJohn Doe\nEmail: john@example.com\nPhone: 123-456-7890\nSkills: JavaScript, Python, Java\nExperience: Software Engineer at Acme Corp for 5 years\nSummary: Experienced developer with a focus on web technologies.\n\nOutput:\n{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"phone\": \"123-456-7890\",\n  \"skills\": [\"JavaScript\", \"Python\", \"Java\"],\n  \"work_experience\": \"Software Engineer at Acme Corp for 5 years\",\n  \"summary\": \"Experienced developer with a focus on web technologies.\"\n}\n\nResume:\nJane Smith\nSkills: Python\nSummary: Recent graduate.\n\nOutput:\n{\n  \"name\": \"Jane Smith\",\n  \"email\": null,\n  \"phone\": null,\n  \"skills\": [\"Python\"],\n  \"work_experience\": null,\n  \"summary\": \"Recent graduate.\"\n}\n\nNow, extract the information from this resume:\n\nResume:\n${resumeText}`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.2 }
  };

  const { data } = await axios.post(
    `${GEMINI_API_URL}?key=${api_key}`,
    body,
    { headers: { 'Content-Type': 'application/json' } }
  );

  // Gemini returns a string, try to robustly extract JSON from it
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '')
                   .replace(/^```/, '')
                   .replace(/^json\s*/i, '')
                   .replace(/```$/g, '');

  // Try to extract JSON object using regex (matches first {...})
  const match = cleaned.match(/{[\s\S]*}/);
  if (match) {
    cleaned = match[0];
  }
  console.log(cleaned);
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    throw new Error('Failed to parse Gemini response as JSON: ' + text);
  }
}
