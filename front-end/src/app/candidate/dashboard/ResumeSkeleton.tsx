import React from "react";

export default function ResumeSkeleton() {
  return (
    <div className="rounded-2xl shadow-md bg-gray-100 dark:bg-gray-800 transition-colors duration-200 cursor-pointer mb-2 animate-pulse">
      <div className="flex items-center px-6 py-4 gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 items-center mb-1">
            <span className="h-6 w-32 bg-indigo-200 dark:bg-indigo-700 rounded block"></span>
            <span className="ml-2 h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded block"></span>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-200 flex flex-wrap gap-2">
            <span className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded block"></span>
            <span className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded block"></span>
            <span className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded block"></span>
          </div>
        </div>
        <div>
          <span className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full block"></span>
        </div>
      </div>
    </div>
  );
}
