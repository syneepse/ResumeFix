// src/app/components/NavBar.tsx
"use client";
import AuthSection from "./AuthSection";
import Image from "next/image";

export default function NavBar({ appName }: { appName: string }) {
  // const { data: session } = useSession();
  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 bg-gray-50 dark:bg-[#232326] border-b border-gray-200 dark:border-zinc-800 shadow-lg dark:shadow-lg">
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold text-black dark:text-white">{appName}</span>
      </div>
      <div className="flex items-center gap-4">
        <AuthSection />
      </div>
    </nav>
  );
}
