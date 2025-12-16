'use client';

import { Link } from '@/navigation';
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Token, fetchCurrentUserProfile, UserProfile, UserStore } from '@/lib/api/api';
import {
  Menu, X, LogOut, MapPin, LayoutDashboard,
  ChevronDown, ShieldAlert, Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { useAccessibility } from '@/app/contexts/AccessibilityContext';
import NotificationWrapper from '../notifications/NotificationWrapper';
import { useLocale } from 'next-intl';

// Emblem/Logo Component
const GovLogo = () => (
  <div className="flex items-center gap-2">
    <div className="flex flex-col items-center justify-center">
      <div className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">Satyamev Jayate</div>
    </div>
    <div className="h-8 w-[1px] bg-slate-300"></div>
    <div className="flex flex-col">
      <span className="text-base font-bold text-slate-900 leading-tight">Nagar Sewak</span>
      <span className="text-[9px] font-medium text-slate-500 uppercase tracking-widest">Citizen Engagement Platform</span>
    </div>
  </div>
);

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const t = useTranslations('nav');
  const router = useRouter();
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();

  const { fontSize, setFontSize } = useAccessibility();

  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click Outside Profile Dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // User Load Logic
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

  const hasAdminAccess = user?.roles.some((role) => role === 'ADMIN' || role === 'SUPER_ADMIN');
  const isContractor = user?.roles.includes('CONTRACTOR');
  const dashboardPath = hasAdminAccess ? '/dashboard/admin' : isContractor ? '/dashboard/contractor' : '/dashboard/citizen';

  const getUserInitials = (user: UserProfile) => {
    const name = user.fullName || user.username || 'U';
    return name.substring(0, 2).toUpperCase();
  };

  const navLinks = [
    { name: t('home'), path: '/', icon: Home },
    { name: t('map'), path: '/map', icon: MapPin },
    { name: t('report'), path: '/report', icon: ShieldAlert },
  ];

  const switchLanguage = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(en|hi)/, '');
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <>
      <div className="flex flex-col w-full fixed top-0 left-0 right-0 z-[100]">
        {/* Government Top Strip - Compact */}
        <div className="bg-slate-900 text-white border-b border-slate-700 py-1 px-4 lg:px-6 flex justify-between items-center text-[11px]">
          {/* Left: Government Identity */}
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-wide uppercase">Government of India</span>
            <span className="hidden md:inline h-3 w-[1px] bg-slate-600"></span>
            <span className="hidden md:inline opacity-80 text-[10px]">Ministry of Urban Affairs</span>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-3">
            {/* Font Size */}
            <div className="hidden md:flex items-center gap-0.5 bg-slate-800/40 rounded px-1 py-0.5 border border-slate-700/50">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-1.5 py-0.5 rounded text-[10px] transition ${fontSize === 'normal' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Normal"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1.5 py-0.5 rounded text-[10px] transition ${fontSize === 'large' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Large"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('extra-large')}
                className={`px-1.5 py-0.5 rounded text-[10px] transition ${fontSize === 'extra-large' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Extra Large"
              >
                A+
              </button>
            </div>

            {/* Language */}
            <div className="flex items-center gap-0.5 bg-slate-800/40 rounded px-1 py-0.5 border border-slate-700/50">
              <button
                onClick={() => switchLanguage('en')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition ${locale === 'en' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                EN
              </button>
              <button
                onClick={() => switchLanguage('hi')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition ${locale === 'hi' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                HI
              </button>
            </div>
          </div>
        </div>

        {/* Main Header - Compact */}
        <header
          className="w-full bg-white py-2 shadow-sm border-b border-slate-200"
          role="banner"
          aria-label="Main navigation"
        >
          <div className="container mx-auto px-4 lg:px-6 flex justify-between items-center">
            {/* Logo Area */}
            <Link
              href="/"
              className="group"
              aria-label="Nagar Sewak - Go to homepage"
            >
              <GovLogo />
            </Link>

            {/* Actions Area */}
            <div className="flex items-center gap-2">
              {/* Desktop Navigation */}
              <nav
                className="hidden md:flex items-center gap-0.5"
                role="navigation"
                aria-label="Main navigation menu"
              >
                {navLinks.map(link => {
                  const isActive = pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      href={link.path}
                      className={cn(
                        "px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1.5",
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <link.icon size={14} />
                      {link.name}
                    </Link>
                  )
                })}
              </nav>

              {/* Notifications */}
              {user && <NotificationWrapper />}

              {/* Login/Profile */}
              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-1.5 pl-1.5 pr-0.5 py-0.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-all bg-white shadow-sm"
                    aria-expanded={isProfileOpen}
                    aria-haspopup="menu"
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-blue-700 border border-blue-100">
                      {getUserInitials(user)}
                    </div>
                    <ChevronDown size={12} className="text-slate-400 mr-1" />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden"
                        role="menu"
                      >
                        <div className="px-3 py-2 bg-slate-50 border-b border-slate-100">
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Signed in as</p>
                          <p className="text-xs font-semibold text-slate-800 truncate">{user.fullName || user.username}</p>
                        </div>
                        <div className="p-1">
                          <Link
                            href={dashboardPath}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-700 rounded hover:bg-blue-50 hover:text-blue-700 transition"
                            role="menuitem"
                          >
                            <LayoutDashboard size={14} />
                            {t('dashboard')}
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-red-600 rounded hover:bg-red-50 transition"
                            role="menuitem"
                          >
                            <LogOut size={14} />
                            {t('logout')}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-1.5 text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors border border-slate-300 rounded hover:border-blue-700 flex items-center"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-all flex items-center"
                  >
                    {t('register')}
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Spacer - Not needed on map page as it handles its own height */}
      {pathname !== '/map' && <div className="h-[60px]"></div>}

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[90] bg-white pt-16 px-4 pb-4 md:hidden overflow-y-auto"
            id="mobile-menu"
          >
            <div className="flex flex-col gap-4">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all",
                      pathname === link.path ? "bg-blue-50 text-blue-700 border border-blue-100" : "text-slate-600 border border-slate-100"
                    )}
                  >
                    <link.icon size={18} />
                    {link.name}
                  </Link>
                ))}
              </div>

              {!user && (
                <div className="flex flex-col gap-2 mt-4 border-t border-slate-100 pt-4">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full py-2.5 text-center rounded-lg border border-slate-200 font-semibold text-sm text-slate-700">
                    Log In
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)} className="w-full py-2.5 text-center rounded-lg bg-blue-700 text-white font-semibold text-sm shadow-lg">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}