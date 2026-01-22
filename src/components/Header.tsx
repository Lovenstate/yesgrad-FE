'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check auth via API since cookie is HTTP-only
        const response = await fetch('http://localhost:8080/api/auth/me', {
          credentials: 'include'
        });
        if (response.ok) {
          const userData = await response.json();
          setIsLoggedIn(true);
          setUserRole(userData.data?.role || null);
          setUserName(userData.data?.firstName || 'User');
        } else {
          setIsLoggedIn(false);
          setUserRole(null);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setIsLoggedIn(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Y</span>
            </div>
            <span className="text-xl font-bold text-gray-900">YesGrad</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {isLoggedIn && userRole === 'TUTOR' ? (
              <>
                <Link href="/tutor/dashboard" className="px-4 py-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all font-medium">
                  Dashboard
                </Link>
                <Link href="/tutor/messages" className="px-4 py-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all font-medium">
                  Messages
                </Link>
              </>
            ) : (
              <>
                <Link href="/find-tutor" className="px-4 py-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all font-medium">
                  Find Tutors
                </Link>
                <Link href="/subjects" className="px-4 py-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all">
                  Subjects
                </Link>
                <Link href="/pricing" className="px-4 py-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all">
                  Pricing
                </Link>
                <Link href="/about" className="px-4 py-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all">
                  About
                </Link>
              </>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                {userRole === 'TUTOR' ? (
                  <>
                    <div className="relative">
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium transition-all"
                      >
                        <span>{userName}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                          <div className="py-1">
                            <Link href="/tutor/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              Profile
                            </Link>
                            <Link href="/tutor/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              Settings
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              Logout
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/student/dashboard" 
                      className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-medium transition-all"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium transition-all"
                    >
                      Logout
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <Link 
                  href="/become-tutor" 
                  className="px-4 py-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg font-medium transition-all"
                >
                  Teach with us
                </Link>
                <Link 
                  href="/auth/login" 
                  className="bg-amber-600 text-white px-6 py-2.5 rounded-lg hover:bg-amber-700 transition-all font-semibold shadow-sm hover:shadow-md"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-amber-600 hover:bg-gray-100 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t bg-gray-50">
            <div className="flex flex-col space-y-2">
              {isLoggedIn && userRole === 'TUTOR' ? (
                <>
                  <Link href="/tutor/dashboard" className="px-4 py-3 text-gray-700 hover:text-amber-600 hover:bg-white rounded-lg transition-all font-medium">
                    Dashboard
                  </Link>
                  <Link href="/tutor/messages" className="px-4 py-3 text-gray-700 hover:text-amber-600 hover:bg-white rounded-lg transition-all font-medium">
                    Messages
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/find-tutor" className="px-4 py-3 text-gray-700 hover:text-amber-600 hover:bg-white rounded-lg transition-all font-medium">
                    Find Tutors
                  </Link>
                  <Link href="/subjects" className="px-4 py-3 text-gray-700 hover:text-amber-600 hover:bg-white rounded-lg transition-all">
                    Subjects
                  </Link>
                  <Link href="/pricing" className="px-4 py-3 text-gray-700 hover:text-amber-600 hover:bg-white rounded-lg transition-all">
                    Pricing
                  </Link>
                  <Link href="/about" className="px-4 py-3 text-gray-700 hover:text-amber-600 hover:bg-white rounded-lg transition-all">
                    About
                  </Link>
                </>
              )}
              <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
                {isLoggedIn ? (
                  <>
                    <Link 
                      href={userRole === 'TUTOR' ? '/tutor/dashboard' : '/student/dashboard'} 
                      className="block px-4 py-3 text-blue-600 hover:text-blue-700 hover:bg-white rounded-lg font-medium transition-all"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-red-600 hover:text-red-700 hover:bg-white rounded-lg font-medium transition-all"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/become-tutor" 
                      className="block px-4 py-3 text-emerald-600 hover:text-emerald-700 hover:bg-white rounded-lg font-medium transition-all"
                    >
                      Teach with us
                    </Link>
                    <Link 
                      href="/auth/login" 
                      className="block bg-amber-600 text-white px-4 py-3 rounded-lg hover:bg-amber-700 transition-all text-center font-semibold"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}