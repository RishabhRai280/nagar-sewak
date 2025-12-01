'use client';

import { Link } from '@/navigation';
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Token, fetchCurrentUserProfile, UserProfile, UserStore } from '@/lib/api';
import {
  Menu, X, LogOut, MapPin, LayoutDashboard,
  ChevronDown, User as UserIcon, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';
import NotificationWrapper from './NotificationWrapper';
import { useTranslations } from 'next-intl';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement>(null);

  // Handle Scroll Effect for Glass Transition
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load User Data
  useEffect(() => {
    const loadUser = async () => {
      const token = Token.get();
      if (token) {
        const cached = UserStore.get();
        if (cached) {
          setUser(cached);
          return;
        }
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
    UserStore.remove();
    setUser(null);
    router.push('/');
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  // Role Logic
  const hasAdminAccess = user?.roles.some((role) => role === 'ADMIN' || role === 'SUPER_ADMIN');
  const isContractor = user?.roles.includes('CONTRACTOR');

  const dashboardPath = hasAdminAccess
    ? '/dashboard/admin'
    : isContractor
      ? '/dashboard/contractor'
      : '/dashboard/citizen';

  // Initials Helper
  const getUserInitials = (user: UserProfile) => {
    const name = user.fullName || user.username || 'U';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white/20 backdrop-blur-md border-b border-slate-200/50 shadow-sm h-16"
    >
      <nav className="h-full max-w-full px-4 lg:px-6">
        <div className="flex justify-between items-center h-full">

          {/* --- LOGO --- */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <MapPin className="text-white" size={18} />
            </div>
            <div className="text-xl font-bold">
              <span className="text-slate-900">Nagar</span>
              <span className="text-blue-600">Sewak</span>
            </div>
          </Link>

          {/* --- DESKTOP NAVIGATION --- */}
<div className="hidden md:flex items-center">
  <div className="grid grid-cols-3 gap-2">
    {[
      { name: t('home'), path: '/' },
      { name: t('map'), path: '/map' },
      { name: t('report'), path: '/report' }
    ].map((link) => {
      const active = pathname === link.path;
      return (
        <Link
          key={link.path}
          href={link.path}
          className={`
            px-4 py-2 text-[13px] font-medium text-center rounded-[18px]
            transition-all
            backdrop-blur-md bg-white/20 border border-white/30
            ${active
              ? 'text-blue-600 bg-white/40 shadow-sm'
              : 'text-slate-600 hover:bg-white/30 hover:shadow-sm hover:text-blue-600'
            }
          `}
        >
          {link.name}
        </Link>
      );
    })}
  </div>



            {/* Auth Section */}
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Notification Bell - Only show when logged in */}
              {user && <NotificationWrapper />}

              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {getUserInitials(user)}
                    </div>
                    <ChevronDown size={14} className={`text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1"
                      >
                        <div className="px-3 py-2 border-b border-slate-100">
                          <p className="text-sm font-semibold text-slate-900 truncate">{user.username}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>

                        <Link
                          href={dashboardPath}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <LayoutDashboard size={16} />
                          {t('dashboard')}
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-slate-100"
                        >
                          <LogOut size={16} />
                          {t('logout')}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-slate-600 hover:text-blue-600 px-3"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href="/register"
                    className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                  >
                    {t('register')}
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* --- MOBILE MENU BUTTON --- */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:bg-slate-50 rounded-md"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* --- MOBILE NAVIGATION OVERLAY --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden shadow-lg"
          >
            <div className="px-6 pt-4 pb-8 space-y-6">
              {/* Mobile Links */}
              <div className="space-y-2">
                {[
                  { name: t('home'), path: '/', icon: null },
                  { name: t('map'), path: '/map', icon: MapPin },
                  { name: t('report'), path: '/report', icon: ShieldAlert },
                ].map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-colors ${pathname === link.path
                      ? 'bg-blue-50/80 text-blue-600'
                      : 'text-slate-600 hover:bg-white/50'
                      }`}
                  >
                    {link.icon && <link.icon size={20} />}
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Language Switcher - Mobile */}
              <div className="pt-4 border-t border-slate-200/50">
                <LanguageSwitcher />
              </div>

              {/* Mobile Auth */}
              <div className="pt-4 border-t border-slate-200/50">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        {getUserInitials(user)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.fullName || user.username}</p>
                        <p className="text-xs text-slate-600">{user.email}</p>
                      </div>
                    </div>

                    <Link
                      href={dashboardPath}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      <LayoutDashboard size={20} className="text-blue-600" />
                      {t('dashboard')}
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3 rounded-xl font-semibold text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={20} />
                      {t('logout')}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-center p-3 rounded-xl font-semibold text-slate-600 hover:bg-white/50 border border-slate-200 transition"
                    >
                      {t('login')}
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-center p-3 rounded-xl font-semibold text-white bg-blue-600 shadow-lg hover:bg-blue-700 transition"
                    >
                      {t('register')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}