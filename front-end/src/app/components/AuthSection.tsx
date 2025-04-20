"use client";
// src/app/components/AuthSection.tsx
import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthSection() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-gray-500 dark:text-gray-300 text-sm">Loading...</div>;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn("google", { callbackUrl: "/candidate/dashboard" })}
        className="px-4 py-1 rounded bg-blue-500 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm"
      >
        Sign in with Google
      </button>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <span className="text-gray-800 dark:text-gray-200 text-sm font-semibold">{session.user?.name || session.user?.email}</span>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}

        className="ml-2 px-3 py-1 rounded bg-red-500 hover:bg-red-700 text-white font-semibold text-sm shadow-sm"
      >
        Sign out
      </button>
    </div>
  );
}
