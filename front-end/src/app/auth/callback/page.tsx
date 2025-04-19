"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AuthCallbackInner(){
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      document.cookie = `jwt=${token}; path=/;`;
      // Optionally keep localStorage for legacy, or remove the line below if not needed
      // localStorage.setItem("jwt", token);
      router.replace("/candidate/dashboard"); // Redirect to candidate dashboard after login
    }
  }, [searchParams, router]);
  return <div>Signing you in...</div>;
}

export default function AuthCallback() {
  return <Suspense fallback={<div>Loading...</div>}><AuthCallbackInner/></Suspense>;
}
