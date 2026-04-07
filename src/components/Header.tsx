'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { authAPI, API_BASE_URL } from '@/lib/api';
import { useUnreadCount } from '@/hooks/useMessaging';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
          const protectedPaths = ['/student/', '/tutor/', '/student/onboarding'];
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Prevent body scroll when mobile menu is open
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

  const navLinkClass = 'px-4 py-2 text-sm font-medium text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors';
  const mobileNavLinkClass = 'flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 shrink-0" onClick={closeMenu}>
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">Y</span>
            </div>
            <span className="text-xl font-bold text-gray-900">YesGrad</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {isLoggedIn && userRole === 'TUTOR' ? (
              <>
                <Link href="/tutor/dashboard" className={navLinkClass}>Dashboard</Link>
                <Link href="/tutor/messages" className={`${navLinkClass} relative`}>
                  Messages
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              </>
            ) : (
              <>
                <Link href="/find-tutor" className={navLinkClass}>Find Tutors</Link>
                <Link href="/subjects" className={navLinkClass}>Subjects</Link>
                <Link href="/pricing" className={navLinkClass}>Pricing</Link>
                <Link href="/about" className={navLinkClass}>About</Link>
              </>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-2">
            {isLoggedIn ? (
              userRole === 'TUTOR' ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(o => !o)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold text-sm">
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
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Profile
                      </Link>
                      <Link href="/tutor/settings" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Settings
                      </Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/student/dashboard" className={navLinkClass}>Dashboard</Link>
                  <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    Logout
                  </button>
                </>
              )
            ) : (
              <>
                <Link href="/become-tutor" className="px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                  Teach with us
                </Link>
                <Link href="/auth/login" className="bg-amber-600 text-white px-5 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm font-semibold shadow-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMenuOpen(o => !o)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-amber-600 hover:bg-gray-100 transition-colors"
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

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 lg:hidden" onClick={closeMenu}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile menu panel */}
      <div className={`lg:hidden fixed top-16 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-xl transition-all duration-200 ease-in-out ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">

          {isLoggedIn && (
            <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-amber-50 rounded-xl">
              <div className="w-9 h-9 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500 capitalize">{userRole?.toLowerCase()}</p>
              </div>
            </div>
          )}

          {isLoggedIn && userRole === 'TUTOR' ? (
            <>
              <Link href="/tutor/dashboard" onClick={closeMenu} className={mobileNavLinkClass}>
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                Dashboard
              </Link>
              <Link href="/tutor/messages" onClick={closeMenu} className={`${mobileNavLinkClass} relative`}>
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                Messages
                {unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              <Link href="/tutor/profile" onClick={closeMenu} className={mobileNavLinkClass}>
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Profile
              </Link>
              <Link href="/tutor/settings" onClick={closeMenu} className={mobileNavLinkClass}>
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Settings
              </Link>
            </>
          ) : !isLoggedIn ? (
            <>
              <Link href="/find-tutor" onClick={closeMenu} className={mobileNavLinkClass}>
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                Find Tutors
              </Link>
              <Link href="/subjects" onClick={closeMenu} className={mobileNavLinkClass}>
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                Subjects
              </Link>
              <Link href="/pricing" onClick={closeMenu} className={mobileNavLinkClass}>
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Pricing
              </Link>
              <Link href="/about" onClick={closeMenu} className={mobileNavLinkClass}>
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                About
              </Link>
            </>
          ) : (
            <Link href="/student/dashboard" onClick={closeMenu} className={mobileNavLinkClass}>
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Dashboard
            </Link>
          )}

          <div className="pt-3 mt-3 border-t border-gray-100 space-y-2">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Logout
              </button>
            ) : (
              <>
                <Link href="/become-tutor" onClick={closeMenu} className="flex items-center px-4 py-3 text-base font-medium text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  Teach with us
                </Link>
                <Link href="/auth/login" onClick={closeMenu} className="flex items-center justify-center bg-amber-600 text-white px-4 py-3 rounded-xl hover:bg-amber-700 transition-colors text-base font-semibold">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
