"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function PrivacyCheck() {
  const router = useRouter();
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('privacyAccepted');

    if (pathname === '/politica-privacidad' || accepted === 'true') {
      return;
    }

    setShowBanner(true);

  }, [pathname]);

  const handleAccept = () => {
    localStorage.setItem('privacyAccepted', 'true');
    setShowBanner(false);
  };

  const handleDecline = () => {
    window.location.href = 'https://google.es';
    localStorage.removeItem('privacyAccepted');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <p className="text-sm text-gray-900">
          Para continuar usando nuestro sitio, necesitamos que aceptes nuestra{' '}
          <Link href="/politica-privacidad" className="text-blue-600 hover:text-blue-800">
            política de privacidad
          </Link>
          .
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleDecline}
            className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300"
          >
            Rechazar (Ir a Google)
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
} 