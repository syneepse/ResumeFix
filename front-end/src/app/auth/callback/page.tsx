"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AuthCallbackInner(){
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const token = searchParams.get("token");
    // NOTE: The backend should set the JWT as an HttpOnly, Secure cookie during the OAuth callback redirect.
    // The frontend should NOT set the JWT cookie via JavaScript for security reasons.
    if (token) {
      router.replace("/candidate/dashboard"); // Redirect to candidate dashboard after login
    }
  }, [searchParams, router]);
  return <div>Signing you in...</div>;
}

export default function AuthCallback() {
  return <Suspense fallback={<div>Loading...</div>}><AuthCallbackInner/></Suspense>;
}
