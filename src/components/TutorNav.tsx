"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface TutorNavProps {
  profileCompletion: number;
}

export default function TutorNav({ profileCompletion }: TutorNavProps) {
  const pathname = usePathname();
  const isComplete = profileCompletion === 100;

  const navItems = [
    { name: "Profile", href: "/tutor/profile", restricted: false },
    { name: "Dashboard", href: "/tutor/dashboard", restricted: !isComplete },
    { name: "Messages", href: "/tutor/messages", restricted: !isComplete },
    { name: "Bookings", href: "/tutor/bookings", restricted: !isComplete },
    { name: "Settings", href: "/tutor/settings", restricted: false },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          <div className="flex items-center gap-4 md:gap-8 overflow-x-auto">
            <Link href="/" className="text-lg md:text-xl font-bold text-emerald-600 whitespace-nowrap">
              YesGrad
            </Link>
            
            <div className="flex gap-1 overflow-x-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const isDisabled = item.restricted;

                return (
                  <div key={item.name} className="relative">
                    {isDisabled ? (
                      <div className="px-2 md:px-4 py-2 text-gray-400 cursor-not-allowed flex items-center gap-1 md:gap-2 text-xs md:text-base whitespace-nowrap">
                        <span className="hidden sm:inline">{item.name}</span>
                        <span className="sm:hidden">{item.name.slice(0, 3)}</span>
                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={`px-2 md:px-4 py-2 rounded-lg font-medium transition-colors text-xs md:text-base whitespace-nowrap ${
                          isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <span className="hidden sm:inline">{item.name}</span>
                        <span className="sm:hidden">{item.name.slice(0, 3)}</span>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/auth/login";
            }}
            className="px-3 md:px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium text-xs md:text-base whitespace-nowrap"
          >
            Logout
          </button>
        </div>

        {!isComplete && (
          <div className="pb-3 md:pb-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 md:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <p className="text-xs md:text-sm font-semibold text-amber-900">
                  ⚠️ Complete your profile to receive booking requests
                </p>
                <span className="text-xs md:text-sm font-bold text-amber-700">{profileCompletion}%</span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-2">
                <div
                  className="bg-amber-600 h-2 rounded-full transition-all"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <Link
                  href="/tutor/onboarding"
                  className="text-sm text-amber-700 hover:text-amber-800 font-medium"
                >
                  Continue setup →
                </Link>
                <span className="text-xs text-amber-600">
                  {profileCompletion < 100 ? 'Profile incomplete' : 'Profile complete'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
