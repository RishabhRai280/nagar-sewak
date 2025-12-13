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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${scrolled || isMenuOpen
        ? 'bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm py-3'
        : 'bg-transparent py-5'
        }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center">

          {/* --- LOGO --- */}
          <Link href="/" className="flex items-center gap-2 group z-50">
            <div className="text-2xl font-extrabold tracking-tight">
              <span className="text-slate-900">Nagar</span>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:brightness-110 transition-all">Sewak</span>
            </div>
          </Link>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden md:flex items-center gap-8">
            {/* Nav Links - Glass Capsule */}
            <div className="flex items-center gap-1 bg-white/40 p-1 rounded-full border border-white/40 backdrop-blur-md shadow-sm">
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
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${active
                      ? 'bg-white text-blue-600 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Auth Section */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <LanguageSwitcher />

              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-white/50 transition border border-transparent hover:border-white/60 group"
                  >
                    <div className="text-right hidden lg:block">
                      <p className="text-xs font-bold text-slate-700 leading-none">{user.username}</p>
                      <p className="text-[10px] text-slate-500 leading-none mt-1 uppercase tracking-wider">
                        {hasAdminAccess ? tCommon('admin') : isContractor ? tCommon('contractor') : tCommon('citizen')}
                      </p>
                    </div>
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md group-hover:shadow-lg transition-all">
                      {getUserInitials(user)}
                    </div>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu - Glass Effect */}
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-60 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden py-2 ring-1 ring-black/5"
                      >
                        <div className="px-4 py-3 border-b border-slate-100/50 bg-white/30">
                          <p className="text-sm font-bold text-slate-800 truncate">{user.fullName || user.username}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>

                        <div className="py-2">
                          <Link
                            href={dashboardPath}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50/80 hover:text-blue-600 transition-colors"
                          >
                            <LayoutDashboard size={16} />
                            {t('dashboard')}
                          </Link>
                          <Link
                            href="/profile"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50/80 hover:text-blue-600 transition-colors"
                          >
                            <UserIcon size={16} />
                            {t('profile')}
                          </Link>
                        </div>

                        <div className="border-t border-slate-100/50 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/80 transition-colors"
                          >
                            <LogOut size={16} />
                            {t('logout')}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-bold text-slate-600 hover:text-blue-600 transition px-4"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href="/register"
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
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
            className="md:hidden p-2 text-slate-600 hover:bg-white/50 rounded-full transition z-50"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* --- MOBILE NAVIGATION OVERLAY (Glass) --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/90 backdrop-blur-xl border-b border-white/40 overflow-hidden shadow-xl"
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
                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-white/60">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        {getUserInitials(user)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.fullName || user.username}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>

                    <Link
                      href={dashboardPath}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl font-medium text-slate-700 hover:bg-white/50"
                    >
                      <LayoutDashboard size={20} className="text-blue-600" />
                      {t('dashboard')}
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3 rounded-xl font-medium text-red-600 hover:bg-red-50/50"
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