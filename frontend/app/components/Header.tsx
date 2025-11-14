// frontend/app/components/Header.tsx

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-green-700 tracking-wider hover:text-green-800 transition duration-150">
            Nagar Sewak 🇮🇳
          </Link>
        </div>
        <div className="space-x-4 flex items-center">
          <Link href="/map" className="text-gray-600 hover:text-green-700 font-medium hidden sm:inline">
            Live Map
          </Link>
          <Link href="/login" className="text-gray-600 hover:text-green-700 font-medium">
            Login
          </Link>
          <Link 
            href="/register" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
          >
            Register
          </Link>
        </div>
      </nav>
    </header>
  );
}