"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PrivacyPolicy() {
  const router = useRouter();
  const [hasAccepted, setHasAccepted] = useState<boolean | null>(null);

  useEffect(() => {
    const accepted = localStorage.getItem('privacyAccepted');
    if (accepted === null) {
      setHasAccepted(null);
    } else {
      setHasAccepted(accepted === 'true');
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('privacyAccepted', 'true');
    setHasAccepted(true);
  };

  const handleDecline = () => {
    localStorage.setItem('privacyAccepted', 'false');
    window.location.href = 'https://google.es';
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        {/* Add your privacy policy content here */}
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Información que Recopilamos</h2>
          <p className="text-gray-900">
            [Your privacy policy content here]
          </p>
        </section>

        {/* Add more sections as needed */}

        {hasAccepted === null && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <p className="text-sm text-gray-900">
                Para continuar usando nuestro sitio, necesitamos que aceptes nuestra política de privacidad.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDecline}
                  className="px-4 py-2 text-gray-900 hover:text-black"
                >
                  Rechazar
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
        )}
      </div>
    </main>
  );
} 