import React, { useMemo, useState } from "react";

// Copy Resume type here for local usage
export type Resume = {
  id: number;
  name: string;
  email: string;
  phone: string;
  fileName: string;
  uploadDate: string;
  skills: string[];
  matchedSkills?: string[];
  rating?: string;
};

interface SkillSearchBarProps {
  resumes: Resume[];
  setFilteredResumes: (resumes: Resume[]) => void;
  selectedSkills: string[];
  setSelectedSkills: React.Dispatch<React.SetStateAction<string[]>>;
}

const SkillSearchBar: React.FC<SkillSearchBarProps> = ({ resumes, setFilteredResumes, selectedSkills, setSelectedSkills }) => {
  const [mode, setMode] = useState<'AND' | 'OR'>('OR');

  // Collect all unique skills
  const allSkills = useMemo(() => {
    const skillSet = new Set<string>();
    resumes.forEach((r: Resume) => r.skills?.forEach((s: string) => skillSet.add(s)));
    return Array.from(skillSet).sort((a, b) => a.localeCompare(b));
  }, [resumes]);

  // Filter and sort resumes
  React.useEffect(() => {
    let filtered = resumes;
    if (selectedSkills.length > 0) {
      filtered = resumes.filter((r: Resume) => {
        if (!r.skills) return false;
        if (mode === 'AND') {
          return selectedSkills.every((skill: string) => r.skills.includes(skill));
        } else {
          return selectedSkills.some((skill: string) => r.skills.includes(skill));
        }
      });
      // Sort by number of matched skills (descending)
      filtered = filtered.slice().sort((a: Resume, b: Resume) => {
        const aMatches = a.skills.filter((s: string) => selectedSkills.includes(s)).length;
        const bMatches = b.skills.filter((s: string) => selectedSkills.includes(s)).length;
        return bMatches - aMatches;
      });
    }
    setFilteredResumes(filtered);
  }, [selectedSkills, resumes, setFilteredResumes, mode]);

  return (
    <div className="mb-8">
      <div className="mb-2">
        <span className="flex items-center font-semibold text-gray-700 dark:text-gray-200 mb-1">
          <svg className="w-4 h-4 mr-1 text-indigo-500 dark:text-indigo-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 019 18v-4.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V4z"></path></svg>
          Filter by Skills:
        </span>
        <div className="flex flex-wrap gap-2 mt-1">
          {allSkills.map((skill: string) => (
            <button
              key={skill}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${selectedSkills.includes(skill)
                ? 'bg-indigo-500 text-white border-indigo-600'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-indigo-100 dark:hover:bg-indigo-800'}
              `}
              onClick={() => setSelectedSkills((s: string[]) => s.includes(skill) ? s.filter((x: string) => x !== skill) : [...s, skill])}
              type="button"
            >
              {skill}
            </button>
          ))}
          {selectedSkills.length > 0 && (
            <button
              className="ml-2 px-4 py-1 rounded-full text-xs font-bold border-2 border-red-500 bg-gradient-to-r from-red-200 via-red-100 to-red-200 text-red-800 dark:bg-gradient-to-r dark:from-red-900 dark:via-red-800 dark:to-red-900 dark:text-red-100 shadow-lg hover:bg-red-300 dark:hover:bg-red-700 flex items-center gap-1 transition-all duration-200"
              onClick={() => setSelectedSkills([])}
              type="button"
              aria-label="Clear skill filters"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
              Clear Filters
            </button>
          )}
        </div>
      </div>
      <div className="flex gap-2 items-center mt-2">
        <span className="font-semibold text-gray-700 dark:text-gray-200">Mode:</span>
        <button
          className={`px-3 py-1 rounded-l-full border text-xs font-semibold transition-colors duration-150 ${mode === 'AND' ? 'bg-indigo-500 text-white border-indigo-600' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-indigo-100 dark:hover:bg-indigo-800'}`}
          onClick={() => setMode('AND')}
          type="button"
        >AND</button>
        <button
          className={`px-3 py-1 rounded-r-full border text-xs font-semibold transition-colors duration-150 ${mode === 'OR' ? 'bg-indigo-500 text-white border-indigo-600' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-indigo-100 dark:hover:bg-indigo-800'}`}
          onClick={() => setMode('OR')}
          type="button"
        >OR</button>
      </div>
    </div>
  );
};

export default SkillSearchBar;
