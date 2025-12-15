'use client';

import { Link } from '@/navigation';
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Token, fetchCurrentUserProfile, UserProfile, UserStore } from '@/lib/api/api';
import {
  Menu, X, LogOut, MapPin, LayoutDashboard,
  ChevronDown, User as UserIcon, ShieldAlert, FileText, Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import TopBar from './TopBar';
import NotificationWrapper from '../notifications/NotificationWrapper';

// Emblem/Logo Component
const GovLogo = () => (
  <div className="flex items-center gap-3">
    {/* Ashoka Emblem Placeholder - Use an actual Image in prod if available */}
    <div className="flex flex-col items-center justify-center">
      {/* Use a simple CSS representation or just text if no image asset is available yet */}
      {/* <img src="/emblem.png" alt="Satyamev Jayate" className="h-10 w-auto" />  Assuming no asset for now, using text/icon */}
      <div className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">Satyamev Jayate</div>
    </div>
    <div className="h-10 w-[1px] bg-slate-300 mx-1"></div>
    <div className="flex flex-col">
      <span className="text-lg font-bold text-slate-900 leading-tight">Nagar Sewak</span>
      <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Citizen Engagement Platform</span>
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
    // Add more official links if needed
  ];

  return (
    <>
      <div className="flex flex-col w-full fixed top-0 left-0 right-0 z-[100]">

        {/* 1. Government Top Strip */}
        <TopBar />

        {/* 2. Main Header */}
        <header
          className="w-full bg-white py-3 shadow-md border-b-4 border-orange-500/20"
          role="banner"
          aria-label="Main navigation"
        >
          <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center">

            {/* Logo Area */}
            <Link 
              href="/" 
              className="group"
              aria-label="Nagar Sewak - Go to homepage"
            >
              <GovLogo />
            </Link>

            {/* Actions Area - Navigation moved here to be near notifications */}
            <div className="flex items-center gap-3">
              
              {/* Desktop Navigation - Now positioned near notifications */}
              <nav 
                className="hidden md:flex items-center gap-1 mr-2"
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
                        "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2",
                        isActive
                          ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                          : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
                      )}
                      aria-current={isActive ? "page" : undefined}
                      aria-label={`Navigate to ${link.name}`}
                    >
                      <link.icon size={16} />
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
                    className="flex items-center gap-2 pl-2 pr-1 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-all bg-white shadow-sm"
                    aria-expanded={isProfileOpen}
                    aria-haspopup="menu"
                    aria-label={`User menu for ${user.fullName || user.username}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-blue-700 border border-blue-100">
                      {getUserInitials(user)}
                    </div>
                    <ChevronDown size={14} className="text-slate-400 mr-2" />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden ring-1 ring-black/5"
                        role="menu"
                        aria-label="User account menu"
                      >
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                          <p className="text-xs font-bold text-slate-500 uppercase">Signed in as</p>
                          <p className="text-sm font-semibold text-slate-800 truncate">{user.fullName || user.username}</p>
                        </div>
                        <div className="p-1">
                          <Link 
                            href={dashboardPath} 
                            onClick={() => setIsProfileOpen(false)} 
                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition"
                            role="menuitem"
                            aria-label="Go to dashboard"
                          >
                            <LayoutDashboard size={16} />
                            {t('dashboard')}
                          </Link>
                          <button 
                            onClick={handleLogout} 
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition"
                            role="menuitem"
                            aria-label="Sign out of your account"
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
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors">
                    {t('login')}
                  </Link>
                  <Link href="/register" className="px-5 py-2 text-sm font-medium bg-blue-700 text-white rounded-md shadow-sm hover:bg-blue-800 transition-all hover:shadow-md">
                    {t('register')}
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

            </div>
          </div>
        </header>
      </div>

      {/* Spacer to prevent content overlap with fixed header */}
      <div className={cn("transition-all duration-300", scrolled ? "h-[100px]" : "h-[110px]")}></div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[90] bg-white pt-28 px-6 pb-6 md:hidden overflow-y-auto"
            id="mobile-menu"
            role="navigation"
            aria-label="Mobile navigation menu"
          >
            <div className="flex flex-col gap-6">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl text-lg font-medium transition-all",
                      pathname === link.path ? "bg-blue-50 text-blue-700 border border-blue-100" : "text-slate-600 border border-slate-100"
                    )}
                  >
                    <link.icon size={20} />
                    {link.name}
                  </Link>
                ))}
              </div>

              {!user && (
                <div className="flex flex-col gap-3 mt-4 border-t border-slate-100 pt-6">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full py-3 text-center rounded-xl border border-slate-200 font-semibold text-slate-700">
                    Log In
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)} className="w-full py-3 text-center rounded-xl bg-blue-700 text-white font-semibold shadow-lg shadow-blue-200">
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