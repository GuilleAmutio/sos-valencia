import Link from 'next/link';
import NavigationMenu from './NavigationMenu';

export default function Header() {
  return (
    <div>
      <div className="text-center py-6">
        <div className="flex justify-center items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img 
              src="/aid-svgrepo-com.svg" 
              alt="SOS Valencia Icon" 
              className="w-8 md:w-10 h-8 md:h-10"
            />
            <h1 className="text-4xl md:text-5xl font-black tracking-wider">
              <span className="text-red-600">SOS</span>
              <span className="text-black ml-2">Valencia</span>
            </h1>
          </Link>
        </div>
        <p className="mt-2 text-gray-600">
          Cualquier incidencia reportar en{' '}
          <a 
            href="https://github.com/GuilleAmutio/sos-valencia/issues" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            @github/issues
          </a>
        </p>
      </div>
      <NavigationMenu />
    </div>
  );
} 