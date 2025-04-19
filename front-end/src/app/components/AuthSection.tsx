"use client";
// src/app/components/AuthSection.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AuthSection() {
  interface UserInfo {
    displayName?: string;
    emails?: { value: string }[];
    name?: string;
    email?: string;
    picture?: string;
    [key: string]: unknown;
  }
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Only fetch user info once on mount
  useEffect(() => {
    let mounted = true;
    async function fetchUser() {
      try {
        const res = await fetch(`${API_URL}`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          if (mounted) setUserInfo(data);
        } else {
          if (mounted) setUserInfo(null);
        }
      } catch {
        if (mounted) setUserInfo(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchUser();
    return () => { mounted = false; };
  }, []);

  const handleSignOut = async () => {
    // Call backend to clear the HttpOnly cookie
    await fetch(`${API_URL}/logout`, { credentials: 'include', method: 'POST' });
    setUserInfo(null);
    router.push('/');
  };

  if (loading) {
    return <div className="text-gray-500 dark:text-gray-300 text-sm">Loading...</div>;
  }

  // Only show sign-in if not authenticated
  if (!userInfo) {
    return (
      <div className="flex gap-2">
        <a
          href={`${API_URL}/auth/google`}
          className="px-4 py-1 rounded bg-blue-500 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm"
        >
          Sign in with Google
        </a>
      </div>
    );
  }

  // Only show sign-out if authenticated
  return (
    <div className="flex items-center gap-2">
      <span className="text-green-700 dark:text-green-300 font-semibold text-sm">
        {userInfo?.displayName || userInfo?.name || userInfo?.email || 'User'}
      </span>
      <button
        className="px-3 py-1 rounded bg-red-500 hover:bg-red-700 text-white font-semibold text-sm shadow-sm"
        onClick={handleSignOut}
      >
        Sign out
      </button>
    </div>
  );
}
