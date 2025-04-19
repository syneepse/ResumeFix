import AuthSection from "./components/AuthSection";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB] dark:bg-[#18181B] p-6 transition-colors duration-300 font-roboto">
      <header className="mb-8 flex flex-col items-center">
        <Image
          src="/logo.svg"
          alt="Resume Skill Extractor Logo"
          width={80}
          height={80}
        />
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-indigo-500 dark:text-indigo-200 text-center font-roboto">
          Resume Skill Extractor
        </h1>
        <p className="mt-2 text-lg text-gray-700 dark:text-gray-200 text-center max-w-xl font-roboto">
          Extract, analyze, and manage resume data using AI. Tailored for candidates and hiring managers.
        </p>
      </header>

      <section className="w-full max-w-md flex items-center justify-center bg-white dark:bg-[#232326] rounded-lg shadow-md p-6 mb-10 transition-colors duration-300 font-roboto">
        <AuthSection />
      </section>

      <section className="w-full max-w-3xl bg-white dark:bg-[#232326] rounded-lg shadow p-6 transition-colors duration-300 font-roboto">
        <h2 className="text-xl font-semibold mb-4 text-indigo-500 dark:text-indigo-200 font-roboto">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-200 font-roboto">
          <li>Upload your resume in PDF, DOC, or DOCX format.</li>
          <li>Automatically extract your skills, name, phone number, and email from your resume.</li>
          <li>Generate a concise professional summary based on your resume content.</li>
        </ul>
      </section>

      <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400 font-roboto">
        &copy; {new Date().getFullYear()} Resume Skill Extractor. All rights reserved.
      </footer>
    </div>
  );
}
