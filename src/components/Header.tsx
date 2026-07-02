'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { authAPI, API_BASE_URL } from '@/lib/api';
import { useUnreadCount } from '@/hooks/useMessaging';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const unreadCount = useUnreadCount(isLoggedIn ? userId : null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, { credentials: 'include' });
        if (response.ok) {
          const userData = await response.json();
          const data = userData.data;
          setIsLoggedIn(true);
          setUserRole(data?.role || null);
          setUserName(data?.firstName || 'User');
          if (data?.id) {
            setUserId(data.id);
            localStorage.setItem('userId', String(data.id));
          }
          if (data?.emailVerified !== undefined) {
            localStorage.setItem('emailVerified', String(data.emailVerified));
          }
        } else if (response.status === 401) {
          const wasLoggedIn = !!localStorage.getItem('userId');
          localStorage.removeItem('userId');
          localStorage.removeItem('tutorId');
          localStorage.removeItem('emailVerified');
          localStorage.removeItem('onboardingStatus');
          setIsLoggedIn(false);
          setUserRole(null);
          const protectedPaths = ['/student/', '/tutor/'];
          const isProtected = protectedPaths.some(p => window.location.pathname.startsWith(p));
          if (wasLoggedIn && isProtected) window.location.href = '/auth/login';
        }
      } catch {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    closeMenu();
    try {
      await authAPI.logout();
      setIsLoggedIn(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/find-tutor?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  // Secondary nav tabs (public)
  const navTabs = [
    { label: 'Home', href: '/' },
    { label: 'Tutoring', href: '/find-tutor' },
    { label: 'Test Prep', href: '/subjects' },
    { label: 'Academic Support', href: '/resources' },
    { label: 'Events & Competitions', href: '/events' },
    { label: 'Resources', href: '/resources' },
    { label: 'Store', href: '/supplies' },
  ];

  // Tutor-specific nav tabs
  const tutorTabs = [
    { label: 'Dashboard', href: '/tutor/dashboard' },
    { label: 'Messages', href: '/tutor/messages', badge: unreadCount },
    { label: 'Schedule', href: '/tutor/schedule' },
    { label: 'Students', href: '/tutor/students' },
    { label: 'Profile', href: '/tutor/profile' },
  ];

  // Student-specific nav tabs
  const studentTabs = [
    { label: 'Dashboard', href: '/student/dashboard' },
    { label: 'Find Tutors', href: '/find-tutor' },
    { label: 'Subjects', href: '/subjects' },
    { label: 'Events', href: '/events' },
    { label: 'Resources', href: '/resources' },
    { label: 'Store', href: '/supplies' },
  ];

  const activeTabs = isLoggedIn && userRole === 'TUTOR' ? tutorTabs : isLoggedIn ? studentTabs : navTabs;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      <div className="border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1 shrink-0" onClick={closeMenu}>
              <span className="text-2xl font-extrabold text-[#1a237e]">Yes</span>
              <span className="text-2xl font-extrabold text-[#f5a623]">Grad</span>
              <span className="hidden sm:block text-[10px] text-gray-400 font-medium ml-1 leading-none mt-1 self-end">Say Yes to Success</span>
            </Link>

            {/* Search bar — desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
              <div className="relative w-full">
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for tutors, subjects, test prep and more..."
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
              </div>
            </form>

            {/* Desktop right actions */}
            <div className="hidden lg:flex items-center gap-1 shrink-0">
              {isLoggedIn ? (
                userRole === 'TUTOR' ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(o => !o)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-100 text-[#1a237e] rounded-full flex items-center justify-center font-bold text-sm">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{userName}</span>
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                        <Link href="/tutor/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          Profile
                        </Link>
                        <Link href="/tutor/settings" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          Settings
                        </Link>
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link href="/student/dashboard" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#1a237e] hover:bg-blue-50 rounded-lg transition-colors">Dashboard</Link>
                    <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">Logout</button>
                  </>
                )
              ) : (
                <>
                  <Link href="/become-tutor" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#1a237e] transition-colors">Become a Tutor</Link>
                  <Link href="/contact" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#1a237e] transition-colors">Help</Link>
                  <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Log In</Link>
                  <Link href="/auth/student/register" className="bg-[#1a237e] text-white px-5 py-2 rounded-lg hover:bg-blue-900 transition-colors text-sm font-semibold">Sign Up</Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMenuOpen(o => !o)}
              className="lg:hidden ml-auto p-2 rounded-lg text-gray-600 hover:text-[#1a237e] hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {/* Secondary nav tabs */}
      <div className="bg-white border-b border-gray-100 hidden lg:block">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {activeTabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.label}
                  href={tab.href}
                  className={`relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                    isActive
                      ? 'border-[#1a237e] text-[#1a237e]'
                      : 'border-transparent text-gray-600 hover:text-[#1a237e] hover:border-blue-200'
                  }`}
                >
                  {tab.label}
                  {'badge' in tab && (tab as { badge: number }).badge > 0 && (
                    <span className="bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">
                      {(tab as { badge: number }).badge > 9 ? '9+' : (tab as { badge: number }).badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 lg:hidden" onClick={closeMenu}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile menu panel */}
      <div className={`lg:hidden fixed top-16 left-0 right-0 z-50 bg-white border-b shadow-xl transition-all duration-200 ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">

          {/* Mobile search */}
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tutors, subjects..."
                className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
          </form>

          {isLoggedIn && (
            <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-blue-50 rounded-xl">
              <div className="w-9 h-9 bg-blue-100 text-[#1a237e] rounded-full flex items-center justify-center font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500 capitalize">{userRole?.toLowerCase()}</p>
              </div>
            </div>
          )}

          {activeTabs.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              onClick={closeMenu}
              className="flex items-center justify-between px-4 py-3 text-base font-medium text-gray-700 hover:text-[#1a237e] hover:bg-blue-50 rounded-xl transition-colors"
            >
              {tab.label}
              {'badge' in tab && (tab as { badge: number }).badge > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {(tab as { badge: number }).badge}
                </span>
              )}
            </Link>
          ))}

          <div className="pt-3 mt-3 border-t border-gray-100 space-y-2">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                Logout
              </button>
            ) : (
              <>
                <Link href="/become-tutor" onClick={closeMenu} className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 rounded-xl transition-colors">
                  Become a Tutor
                </Link>
                <Link href="/auth/login" onClick={closeMenu} className="flex items-center justify-center border border-gray-200 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Log In
                </Link>
                <Link href="/auth/student/register" onClick={closeMenu} className="flex items-center justify-center bg-[#1a237e] text-white px-4 py-3 rounded-xl hover:bg-blue-900 transition-colors text-base font-semibold">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
