"use client";
// src/app/components/AuthSection.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AuthSection() {
  const [jwt, setJwt] = useState<string | null>(typeof window !== 'undefined' ? localStorage.getItem('jwt') : null);
  interface UserInfo {
  displayName?: string;
  emails?: { value: string }[];
  [key: string]: unknown;
}
const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (jwt) {
      try {
        const base64Url = jwt.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        setUserInfo(JSON.parse(jsonPayload));
      } catch {
        setUserInfo(null);
      }
    } else {
      setUserInfo(null);
    }
  }, [jwt]);

  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    setJwt(null);
    setUserInfo(null);
    router.push('/');
  };

  if (!jwt) {
    return (
      <div className="flex items-center justify-center">
        <button
          className="px-6 py-2 rounded font-semibold shadow-sm transition-colors duration-200 bg-[#4285F4] hover:bg-[#1a73e8] text-white font-roboto"
          onClick={() => window.location.assign(`${API_URL}/auth/google`) }
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-green-700 dark:text-green-300 font-semibold">Signed in</span>
      {userInfo && (
        <span className="text-gray-700 dark:text-gray-200 text-sm">{userInfo.displayName || (userInfo.emails && userInfo.emails[0]?.value) || 'User'}</span>
      )}
      <button
        className="px-4 py-1 rounded bg-red-500 hover:bg-red-600 text-white font-semibold mt-2"
        onClick={handleSignOut}
      >
        Sign out
      </button>
    </div>
  );
}
