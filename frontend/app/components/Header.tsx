'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Token, fetchCurrentUserProfile, UserProfile } from '@/lib/api';
import { Menu, X, User, LogOut, MapPin, LayoutDashboard } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loadUser = async () => {
      const token = Token.get();
      if (token) {
        try {
          const profile = await fetchCurrentUserProfile();
          setUser(profile);
        } catch {
          Token.remove();
          setUser(null);
        }
      }
    };
    loadUser();
  }, [pathname]);

  const handleLogout = () => {
    Token.remove();
    setUser(null);
    router.push('/');
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  const hasAdminAccess = user?.roles.some((role) => role === 'ADMIN' || role === 'SUPER_ADMIN');
  const isContractor = user?.roles.includes('CONTRACTOR');

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-2xl font-bold text-green-700 tracking-wider group-hover:text-green-800 transition duration-150">
              Nagar Sewak
            </div>
            <span className="text-xl">🇮🇳</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/map"
              className={`font-medium transition ${
                isActive('/map') ? 'text-green-700 font-semibold' : 'text-gray-600 hover:text-green-700'
              }`}
            >
              Live Map
            </Link>

            {user ? (
              <>
                {hasAdminAccess || isContractor ? (
                  <Link
                    href="/dashboard/admin"
                    className={`font-medium transition flex items-center gap-2 ${
                      isActive('/dashboard/admin') ? 'text-green-700 font-semibold' : 'text-gray-600 hover:text-green-700'
                    }`}
                  >
                    <LayoutDashboard size={18} />
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/dashboard/citizen"
                    className={`font-medium transition flex items-center gap-2 ${
                      isActive('/dashboard/citizen') ? 'text-green-700 font-semibold' : 'text-gray-600 hover:text-green-700'
                    }`}
                  >
                    <LayoutDashboard size={18} />
                    My Dashboard
                  </Link>
                )}
                <Link
                  href="/report"
                  className={`font-medium transition ${
                    isActive('/report') ? 'text-green-700 font-semibold' : 'text-gray-600 hover:text-green-700'
                  }`}
                >
                  Report Issue
                </Link>
                <div className="flex items-center gap-3 pl-4 border-l border-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <User className="text-white" size={18} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user.fullName || user.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-red-600 transition flex items-center gap-1"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`font-medium transition ${
                    isActive('/login') ? 'text-green-700 font-semibold' : 'text-gray-600 hover:text-green-700'
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <Link
                href="/map"
                onClick={() => setIsMenuOpen(false)}
                className={`font-medium transition ${
                  isActive('/map') ? 'text-green-700 font-semibold' : 'text-gray-600 hover:text-green-700'
                }`}
              >
                <MapPin size={18} className="inline mr-2" />
                Live Map
              </Link>

              {user ? (
                <>
                  {hasAdminAccess || isContractor ? (
                    <Link
                      href="/dashboard/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className={`font-medium transition ${
                        isActive('/dashboard/admin') ? 'text-green-700 font-semibold' : 'text-gray-600 hover:text-green-700'
                      }`}
                    >
                      <LayoutDashboard size={18} className="inline mr-2" />
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard/citizen"
                      onClick={() => setIsMenuOpen(false)}
                      className={`font-medium transition ${
                        isActive('/dashboard/citizen') ? 'text-green-700 font-semibold' : 'text-gray-600 hover:text-green-700'
                      }`}
                    >
                      <LayoutDashboard size={18} className="inline mr-2" />
                      My Dashboard
                    </Link>
                  )}
                  <Link
                    href="/report"
                    onClick={() => setIsMenuOpen(false)}
                    className={`font-medium transition ${
                      isActive('/report') ? 'text-green-700 font-semibold' : 'text-gray-600 hover:text-green-700'
                    }`}
                  >
                    Report Issue
                  </Link>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <User className="text-white" size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.fullName || user.username}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-red-600 hover:text-red-700 transition flex items-center gap-2"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className={`font-medium transition ${
                      isActive('/login') ? 'text-green-700 font-semibold' : 'text-gray-600 hover:text-green-700'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition text-center"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
