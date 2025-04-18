// src/app/components/NavBar.tsx
"use client";
import { useSession, signOut } from "next-auth/react";

export default function NavBar({ appName }: { appName: string }) {
  const { data: session } = useSession();
  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 bg-gray-50 dark:bg-[#232326] border-b border-gray-200 dark:border-zinc-800 shadow-lg dark:shadow-lg">
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold text-black dark:text-white">{appName}</span>
      </div>
      <div className="flex items-center gap-4">
        {session?.user?.image && (
          <img
            src={session.user.image}
            alt="Profile"
            className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
          />
        )}
        <button
          className="px-3 py-1 rounded bg-red-500 hover:bg-red-700 text-white font-semibold text-sm shadow-sm"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
