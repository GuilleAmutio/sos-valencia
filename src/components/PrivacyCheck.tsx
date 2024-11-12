"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function PrivacyCheck() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const accepted = localStorage.getItem('privacyAccepted');
    
    // Skip check if already on privacy policy page or if already accepted
    if (pathname === '/politica-privacidad' || accepted === 'true') {
      return;
    }
    
    // If not accepted, redirect to privacy policy
    if (accepted === null) {
      router.push('/politica-privacidad');
    } else if (accepted === 'false') {
      window.location.href = 'https://google.es';
    }
  }, [pathname, router]);

  return null; // This component doesn't render anything
} 