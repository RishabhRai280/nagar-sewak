'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Token, fetchCurrentUserProfile, UserProfile } from '@/lib/api';
import { Menu, X, User, LogOut, MapPin, LayoutDashboard, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Determine the correct dashboard path based on user roles
  const dashboardPath = hasAdminAccess || isContractor ? '/dashboard/admin' : '/dashboard/citizen';

  // Utility function to get user initials
  const getUserInitials = (user: UserProfile) => {
    const name = user.fullName || user.username || 'U';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200/50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-700 transition">
              NagarSewak
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/map"
              className={`flex items-center gap-2 font-medium transition ${
                isActive('/map')
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <MapPin size={18} />
              Live Map
            </Link>

            {user ? (
              <>
                {/* FIX: Use specific dashboardPath for the main dashboard link */}
                <Link
                  href={dashboardPath}
                  className={`flex items-center gap-2 font-medium transition ${
                    pathname.startsWith('/dashboard')
                      ? 'text-blue-600 font-semibold'
                      : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                
                <Link
                  href="/report"
                  className={`font-medium transition ${
                    isActive('/report')
                      ? 'text-blue-600 font-semibold'
                      : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  Report Issue
                </Link>
                <div className="flex items-center gap-4 pl-8 border-l border-slate-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold cursor-default transition">
                    {getUserInitials(user)}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-slate-600 hover:text-red-600 transition"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`font-medium transition ${
                    isActive('/login')
                      ? 'text-blue-600 font-semibold'
                      : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-lg transition transform hover:scale-[1.02]"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-slate-600 hover:text-slate-900 transition"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden py-6 border-t border-slate-200"
            >
              <div className="flex flex-col gap-4">
                <Link
                  href="/map"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 font-medium text-slate-600 hover:text-blue-600"
                >
                  <MapPin size={18} />
                  Live Map
                </Link>

                {user ? (
                  <>
                    {/* FIX: Use specific dashboardPath for the mobile dashboard link */}
                    <Link
                      href={dashboardPath}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 font-medium text-slate-600 hover:text-blue-600"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>
                    
                    <Link
                      href="/report"
                      onClick={() => setIsMenuOpen(false)}
                      className="font-medium text-slate-600 hover:text-blue-600"
                    >
                      Report Issue
                    </Link>

                    {/* Mobile User/Logout Info */}
                    <div className="pt-4 mt-2 border-t border-slate-200 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {getUserInitials(user)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{user.fullName || user.username}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="text-left text-red-600 hover:text-red-700 font-medium flex items-center gap-2 w-full"
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
                      className="font-medium text-slate-600 hover:text-blue-600"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium text-center"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}