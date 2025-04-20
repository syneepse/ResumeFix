import React from 'react';

declare global {
  interface Window {
    google?: any;
  }
}

// You must provide your Google Client ID here
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

interface GoogleLoginButtonProps {
  onSuccess: (idToken: string) => void;
}

export default function GoogleLoginButton({ onSuccess }: GoogleLoginButtonProps) {
  const buttonRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!window.google && !(window as any).google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.body.appendChild(script);
    } else {
      initializeGoogle();
    }
    function initializeGoogle() {
      if (!(window as any).google || !buttonRef.current) return;
      (window as any).google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: any) => {
          if (response.credential) {
            onSuccess(response.credential);
          }
        },
      });
      (window as any).google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
      });
    }
  }, [onSuccess]);

  return <div ref={buttonRef}></div>;
}
