"use client";

import NavBar from "../../components/NavBar";
import ResumeCard from "./ResumeCard";
import SkillSearchBar from "./SkillSearchBar";
import ResumeSkeleton from "./ResumeSkeleton";
import { AddResumeIcon, CloseIcon } from "./icons";
import axios from 'axios';
import { useEffect, useState } from 'react';
import React from 'react';

type Resume = {
  id: number;
  name: string;
  email: string;
  phone: string;
  fileName: string;
  uploadDate: string;
  skills: string[];
  summary?: string;
  work_experience?: string;
  matchedSkills?: string[];
  rating?: string;
};

import { useRef } from "react";

export default function CandidateDashboard() {
  // --- Additional state and handlers for new features ---
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [addDisabled, setAddDisabled] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [filteredResumes, setFilteredResumes] = useState<Resume[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]); // <-- moved up
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep filteredResumes in sync with resumes if no skills are selected
  React.useEffect(() => {
    if (selectedSkills.length === 0) {
      setFilteredResumes(resumes);
    }
  }, [resumes, selectedSkills]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Upload handler
  const handleUploadResume = async (file: File) => {
    console.log('[handleUploadResume] User:', user);
    if (!user?.email) {
      console.warn('[handleUploadResume] No user or user.email, aborting upload. user:', user );
      return;
    }

    setUploading(true);
    setAddDisabled(true);
    setSelectedSkills([]); // Clear filters on upload
    const formData = new FormData();
    formData.append('pdf', file);
    try {
      console.log('[handleUploadResume] Uploading resume for user.email:', user.email);
      const uploadRes = await axios.post(`${API_URL}/resumes/upload`, formData, {
        headers: { 'x-user-id': user.email },
      });
      console.log('[handleUploadResume] Upload response:', uploadRes);
      await fetchResumes();
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
      setShowUpload(false);
      setTimeout(() => setAddDisabled(false), 1500); // Prevent rapid re-upload
    }
  };

  // Fetch all resumes
  const fetchResumes = async () => {
    console.log('[fetchResumes] Called. user:', user);
    if (!user?.email) {
      console.warn('[fetchResumes] No user or user.email, aborting fetch. user:', user, typeof(user));  
      return;
    }
    try {
      console.log('[fetchResumes] Fetching resumes for user.email:', user.email);
      const res = await axios.get(`${API_URL}/resumes`, {
        headers: { 'x-user-id': user.email },
      });
      console.log('[fetchResumes] API response:', res);
      // Normalize backend fields to frontend expectations
      const normalized = (res.data as Array<Record<string, unknown>>).map(r => ({
        id: r["id"] as number,
        name: r["name"] as string ?? "",
        email: r["email"] as string ?? "",
        phone: r["phone"] as string ?? "",
        fileName: r["filename"] as string ?? "",
        uploadDate: r["upload_date"] as string ?? "",
        skills: (r["skills"] as string[]) ?? [],
        summary: r["summary"] as string ?? "",
        work_experience: r["work_experience"] as string ?? "",
        matchedSkills: (r["matchedSkills"] as string[]) ?? [],
        rating: r["rating"] as string ?? "",
      }));

      setResumes(normalized);
    } catch (err) {
      console.error(err);
    }
  };

  interface User {
  id?: string;
  name: string;
  email: string;
  image?: string;
}
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/me`, { credentials: 'include' })
      .then(async (res) => {
        if (res.ok) {
          const userObj = await res.json();
          console.log('[useEffect /api/me] Got user:', userObj);
          setUser(userObj.user);
        } else {
          console.log('[useEffect /api/me] Not authenticated');
          setUser(null);
        }
      })
      .catch((e) => {
        console.error('[useEffect /api/me] Error:', e);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    console.log('[useEffect user, loading] loading:', loading, 'user:', user);
    if (!loading && user) fetchResumes();
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in to access your dashboard.</div>;

  const handleDeleteResume = async (id: number): Promise<void> => {
    if (!user?.email) return;
    try {
      await axios.delete(`${API_URL}/resumes/${id}`, {
        headers: { 'x-user-id': user.email },
      });
      fetchResumes();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownloadResume = async (id: number): Promise<void> => {
    if (!user?.email) return;
    try {
      const response = await axios.get(`${API_URL}/resumes/${id}/download`, {
        headers: { 'x-user-id': user.email },
        responseType: 'blob',
      });
      const url = URL.createObjectURL(response.data as Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) { console.error(error); }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#18181B] transition-colors duration-200 font-roboto">
      <NavBar appName="ResumeFix" />
      <main className="max-w-5xl mx-auto p-4">
        <section className="bg-white dark:bg-[#232326] rounded-xl shadow-lg p-8 mt-10 border border-gray-200 dark:border-[#232326] transition-colors duration-200">
          {/* Add New Resume Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2 text-indigo-500 dark:text-indigo-200 transition-colors">Add New Resume</h3>
            <button
  className={`flex items-center gap-3 px-5 py-2 bg-[#C7D2FE] dark:bg-indigo-200 text-gray-800 dark:text-gray-900 rounded-full shadow font-bold hover:bg-indigo-300 dark:hover:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4 ${addDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
  onClick={() => setShowUpload(v => !v)}
  disabled={addDisabled}
  type="button"
  aria-label={showUpload ? 'Cancel Add Resume' : 'Add Resume'}
>
  <span className="flex items-center justify-center" style={{ fontSize: 28 }}>
    {showUpload ? <CloseIcon /> : <AddResumeIcon />}
  </span>
  <span className="font-semibold">
    {showUpload ? 'Cancel' : 'Add Resume'}
  </span>
</button>
            {showUpload && (
              <div
                className="w-full border-2 border-dashed border-indigo-300 dark:border-indigo-400 rounded-xl p-8 text-center cursor-pointer bg-[#F9FAFB] dark:bg-[#232326] hover:bg-indigo-50 dark:hover:bg-[#232326] mb-4 transition-colors duration-200"
                tabIndex={0}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) handleUploadResume(file);
                  setShowUpload(false);
                }}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
              >
                <span className="block text-lg font-semibold mb-2 text-indigo-500 dark:text-indigo-200">Drag and drop a resume file here</span>
                <span className="block text-sm text-gray-500 dark:text-gray-300 mb-2">or click to select a file</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) handleUploadResume(e.target.files[0]);
                  }}
                />
              </div>
            )}
          </div>

          {/* Skill Search Bar Section */}
          <SkillSearchBar resumes={resumes} setFilteredResumes={setFilteredResumes} selectedSkills={selectedSkills} setSelectedSkills={setSelectedSkills} />

          <h2 className="text-2xl font-bold text-indigo-500 dark:text-indigo-200 mb-4">Your Resumes</h2>
        <div className="flex flex-col gap-4">
          {uploading && (
            <ResumeSkeleton />
          )}
          {filteredResumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              resumeId={resume.id}
              name={resume.name}
              email={resume.email}
              phone={resume.phone}
              fileName={resume.fileName}
              uploadDate={resume.uploadDate}
              skills={resume.skills}
              onDownload={handleDownloadResume}
              onDelete={() => handleDeleteResume(resume.id)}
              highlightSkills={selectedSkills}
              summary={resume.summary}
              work_experience={resume.work_experience}
            />
          ))}
        </div>
      </section>
    </main>
  </div>
);
}
