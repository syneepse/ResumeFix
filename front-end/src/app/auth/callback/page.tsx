"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return <div>Redirecting...</div>;
}
