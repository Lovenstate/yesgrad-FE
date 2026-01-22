'use client';

import Link from 'next/link';

export default function TutorDashboard() {
  // TODO: Get from API
  const tutor = {
    name: 'Karlo S.',
    hoursTutored: 0,
    rating: 'n/a',
    ratingCount: 0,
    hasDirectDeposit: false,
    responseRate: 'N/A',
    responseTime: 'N/A',
    totalEarnings: 0,
    amountPaid: 0,
    amountOwed: 0,
    payPercent: 75
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-md p-6 mb-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{tutor.name}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                <span>{tutor.hoursTutored} hours tutored</span>
                <span>•</span>
                <span>{tutor.rating} ({tutor.ratingCount} ratings)</span>
              </div>
              <Link href="/tutor/profile" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                View public profile →
              </Link>
            </div>
            <div className="text-right">
              <div className="bg-green-50 border border-green-200 rounded-md px-3 py-2 mb-2">
                <span className="text-green-800 text-sm font-medium">Students love Instant Book</span>
              </div>
              <Link href="/tutor/settings" className="text-amber-600 hover:text-amber-700 text-sm">
                Update your settings
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <Link href="/tutor/schedule" className="bg-white border border-gray-200 p-3 rounded-md text-center hover:bg-amber-50 hover:border-amber-200 transition-colors">
            <div className="text-amber-600 font-medium text-sm">Schedule lesson</div>
          </Link>
          <Link href="/tutor/submit" className="bg-white border border-gray-200 p-3 rounded-md text-center hover:bg-amber-50 hover:border-amber-200 transition-colors">
            <div className="text-amber-600 font-medium text-sm">Submit lesson</div>
          </Link>
          <Link href="/tutor/messages" className="bg-white border border-gray-200 p-3 rounded-md text-center hover:bg-amber-50 hover:border-amber-200 transition-colors">
            <div className="text-amber-600 font-medium text-sm">Messages</div>
          </Link>
          <Link href="/tutor/jobs" className="bg-white border border-gray-200 p-3 rounded-md text-center hover:bg-amber-50 hover:border-amber-200 transition-colors">
            <div className="text-amber-600 font-medium text-sm">Jobs board</div>
          </Link>
        </div>

        {/* Direct Deposit Alert */}
        {!tutor.hasDirectDeposit && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-yellow-800">Complete your account now by adding your direct deposit details.</h3>
                <p className="mt-1 text-sm text-yellow-700">Tutors are paid through direct deposit. Direct deposits are processed on the 1st and 15th of each month, excluding weekends and holidays.</p>
                <div className="mt-3">
                  <Link href="/tutor/payment-settings" className="bg-amber-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-amber-700 transition-colors">
                    Add details now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Messages */}
          <div className="bg-white border border-gray-200 rounded-md">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">📧 No unread messages</h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-3">When students contact you, they'll expect a prompt response. Top tutors respond in 1 hour or less.</p>
              <Link href="/tutor/tips" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                More tips to succeed →
              </Link>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2 text-sm">Your response to new students</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Response Rate: <span className="font-medium">{tutor.responseRate}</span></div>
                  <div>Response Time: <span className="font-medium">{tutor.responseTime}</span></div>
                  <div className="text-gray-500">No Inquiries in 60 Days</div>
                </div>
              </div>
            </div>
          </div>

          {/* Jobs Board */}
          <div className="bg-white border border-gray-200 rounded-md">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">📋 Jobs board</h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-3">No new questions available for you to answer on Ask An Expert</p>
            </div>
          </div>

          {/* Upcoming Lessons */}
          <div className="bg-white border border-gray-200 rounded-md">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">📅 Upcoming</h3>
            </div>
            <div className="p-4">
              <div className="mb-3">
                <Link href="/tutor/schedule" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                  Schedule a lesson
                </Link>
              </div>
              <div className="text-sm">
                <h4 className="font-medium text-gray-900 mb-2">Scheduled lessons</h4>
                <p className="text-gray-600 mb-3">No scheduled lessons</p>
                <p className="text-xs text-gray-500 mb-3">Schedule upcoming lessons to automatically send your students lesson reminders and easily keep track of payments.</p>
                <Link href="/tutor/jobs" className="text-amber-600 hover:text-amber-700 text-xs">
                  Looking for more students? See new jobs in your area ›
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Availability & History Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div className="bg-white border border-gray-200 rounded-md">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">📝 Edit</h3>
            </div>
            <div className="p-4">
              <h4 className="font-medium text-gray-900 mb-2 text-sm">Availability</h4>
              <p className="text-sm text-gray-600 mb-3">Make it easier to find the right students for you. Tell us when you are available for lessons.</p>
              <Link href="/tutor/availability" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                Set your availability
              </Link>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-md">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">📊 History</h3>
            </div>
            <div className="p-4">
              <div className="mb-3">
                <Link href="/tutor/submit" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                  Submit a lesson
                </Link>
              </div>
              <div className="text-sm">
                <h4 className="font-medium text-gray-900 mb-2">Recent lessons</h4>
                <p className="text-gray-600 mb-2">No recent lessons</p>
                <p className="text-xs text-gray-500">Recently submitted lessons will appear here.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payments */}
        <div className="mt-4 bg-white border border-gray-200 rounded-md">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">💰 Payments</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-xl font-bold text-amber-600">${tutor.totalEarnings.toFixed(2)}</p>
                <p className="text-xs text-gray-600">Total earnings</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-emerald-600">${tutor.amountPaid.toFixed(2)}</p>
                <p className="text-xs text-gray-600">Amount paid</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-orange-600">${tutor.amountOwed.toFixed(2)}</p>
                <p className="text-xs text-gray-600">Amount Owed</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-amber-700">{tutor.payPercent}%</p>
                <p className="text-xs text-gray-600">Pay Percent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Banner */}
        <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-3">
          <p className="text-green-800 text-sm">
            Keep 100% of your hourly rate when you refer students to YesGrad. 
            <Link href="/tutor/referrals" className="font-medium hover:underline ml-1">
              Learn more
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}