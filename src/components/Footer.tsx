import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} SOS Valencia. Todos los derechos reservados.
          </div>
          <div className="flex gap-6 text-sm text-gray-600">
            <Link 
              href="/politica-privacidad" 
              className="hover:text-gray-900 transition-colors"
            >
              Política de Privacidad
            </Link>
            {/* Add more footer links as needed */}
          </div>
        </div>
      </div>
    </footer>
  );
} 