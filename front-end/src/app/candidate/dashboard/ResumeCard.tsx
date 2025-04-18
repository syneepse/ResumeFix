import React, { useState } from "react";
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import './ResumeCardAnimations.css';
import './ResumeCardHideScrollbar.css';

interface ResumeCardProps {
  resumeId: number;
  name: string;
  email: string;
  phone: string;
  fileName: string;
  uploadDate: string;
  skills: string[];
  onDownload: (id: number) => void;
  onDelete: () => void;
  highlightSkills?: string[];
  summary?: string;
  work_experience?: string;
}

const ResumeCard: React.FC<ResumeCardProps> = ({
  resumeId,
  name,
  email,
  phone,
  fileName,
  uploadDate,
  skills,
  onDownload,
  onDelete,
  highlightSkills,
  summary,
  work_experience
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false); // controls DOM presence
  const [modalAnim, setModalAnim] = useState<'in' | 'out'>('in');
  const [deleting, setDeleting] = useState(false);
  const [pulseBtn, setPulseBtn] = useState<{ download: boolean, delete: boolean }>({ download: false, delete: false });

  // Open modal with animation
  const openConfirm = () => {
    setConfirmVisible(true);
    setModalAnim('in');
    setTimeout(() => setShowConfirm(true), 10); // allow render
  };

  // Close modal with animation
  const closeConfirm = () => {
    setModalAnim('out');
    setShowConfirm(false);
    setTimeout(() => setConfirmVisible(false), 280); // match animation duration
  };

  // Handle delete with animation
  const handleDelete = async () => {
    setDeleting(true);
    setTimeout(() => {
      onDelete();
    }, 400); // Match animation duration
  };


  // Pulsate button helper
  const triggerPulse = (type: 'download' | 'delete') => {
    setPulseBtn(prev => ({ ...prev, [type]: true }));
    setTimeout(() => setPulseBtn(prev => ({ ...prev, [type]: false })), 250);
  };


  const cardRef = React.useRef<HTMLDivElement>(null);

  // Scroll to top when collapsing
  React.useEffect(() => {
    if (!expanded && cardRef.current) {
      cardRef.current.scrollTop = 0;
    }
  }, [expanded]);

  return (
    <div
      ref={cardRef}
      className={`relative rounded-2xl shadow-md bg-gray-100 dark:bg-gray-800 transition-colors duration-200 cursor-pointer mb-2
        ${deleting ? 'animate-fade-slide-out' : 'animate-fade-slide-in'} hide-scrollbar ${expanded ? 'overflow-auto' : 'overflow-hidden'}`}
      style={{ maxHeight: expanded ? '500px' : '120px', transition: 'max-height 0.5s' }}
      onClick={() => setExpanded((prev) => !prev)}
    >
      <div className="flex items-center px-6 py-4 gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 items-center mb-1">
            <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-200">{name}</span>
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{new Date(uploadDate).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-200 flex flex-wrap gap-2">
            <span>{email}</span> | <span>{phone}</span> | <span className="font-mono">{fileName}</span>
          </div>
        </div>
        <div>
          <svg
            className={`w-6 h-6 transition-transform duration-200 ${expanded ? "rotate-180" : "rotate-0"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <div
        className={`transition-all duration-500 ease-in-out px-6 ${expanded ? 'opacity-100 pb-4' : 'opacity-0 pb-0'}`}
        aria-hidden={!expanded}
        style={{ pointerEvents: expanded ? 'auto' : 'none', maxHeight: expanded ? 'none' : 0, overflow: 'visible' }}
      >
        {skills && skills.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {skills.map(skill => {
              const isHighlighted = highlightSkills && highlightSkills.includes(skill);
              return (
                <span
                  key={skill}
                  className={
                    "px-2 py-1 rounded-full text-xs font-semibold " +
                    (isHighlighted
                      ? "bg-yellow-300 text-yellow-900 dark:bg-yellow-400 dark:text-yellow-900"
                      : "bg-indigo-200 text-indigo-900 dark:bg-indigo-700 dark:text-indigo-100")
                  }
                >
                  {skill}
                </span>
              );
            })}
          </div>
        )}
        <div className="flex gap-2">
          <span className="group relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerPulse('download');
                onDownload(resumeId);
              }}
              className={`p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-800 focus:outline-none ${pulseBtn.download ? 'animate-pulse-once' : ''}`}
              aria-label="Download"
              tabIndex={0}
            >
              <DownloadIcon className="text-indigo-700 dark:text-indigo-200" />
            </button>
            <span className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 z-50 whitespace-nowrap pointer-events-auto transition-opacity duration-200">Download</span>
          </span>
          <span className="group relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openConfirm();
                triggerPulse('delete');
              }}
              className={`p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-800 focus:outline-none ${pulseBtn.delete ? 'animate-pulse-once' : ''}`}
              aria-label="Delete"
              tabIndex={0}
            >
              <DeleteIcon className="text-red-700 dark:text-red-200" />
            </button>
            <span className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 z-50 whitespace-nowrap pointer-events-auto transition-opacity duration-200">Delete</span>
          </span>
        </div>
        <div className="mb-3 text-sm text-gray-800 dark:text-gray-300">
          <span className="font-semibold">Summary:</span>{' '}
          {summary && summary.split(/\r?\n/).map((line, idx) => (
            <span key={idx} style={{ display: 'block', whiteSpace: 'pre-line' }}>{line}</span>
          ))}
        </div>
        {work_experience && (
          <div className="mb-3 text-sm text-gray-800 dark:text-gray-300">
            <span className="font-semibold">Work Experience:</span>{' '}
            {work_experience && work_experience.split(/\r?\n/).map((line, idx) => (
              <span key={idx} style={{ display: 'block', whiteSpace: 'pre-line' }}>{line}</span>
            ))}
          </div>
        )}


        {/* Confirm Delete Modal */}
        {confirmVisible && (
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center ${modalAnim === 'in' ? 'modal-backdrop-in' : 'modal-backdrop-out'} bg-black bg-opacity-30`}
            onClick={() => { if (!deleting) closeConfirm(); }}
          >
            <div
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 min-w-[300px] flex flex-col items-center ${modalAnim === 'in' ? 'modal-animate-in' : 'modal-animate-out'}`}
              onClick={e => e.stopPropagation()}
            >
              <span className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Delete Resume?</span>
              <span className="text-sm text-gray-600 dark:text-gray-300 mb-4">Are you sure you want to delete this resume?</span>
              <div className="flex gap-4">
                <button className="px-4 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold" onClick={closeConfirm}>Cancel</button>
                <button className="px-4 py-1 rounded bg-red-500 text-white hover:bg-red-700 font-semibold" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeCard;
