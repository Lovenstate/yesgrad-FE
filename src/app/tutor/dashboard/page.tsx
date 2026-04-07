'use client';

import { TutorDashboardResponse, Session } from '@/types/api';
import { tutorProfileAPI } from '@/lib/api';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function TutorDashboard() {
  const [dashboard, setDashboard] = useState<TutorDashboardResponse>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await tutorProfileAPI.getTutorDashboard();
        setDashboard(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back, {dashboard?.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" /></svg>
                  {dashboard?.hoursTutored ?? 0} hours tutored
                </span>
                <span className="hidden sm:inline text-gray-300">|</span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  {dashboard?.rating ?? 0} ({dashboard?.ratingCount ?? 0} ratings)
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/tutor/profile" className="px-4 py-2 text-sm font-medium text-amber-600 border border-amber-600 rounded-lg hover:bg-amber-50 transition-colors">
                View Profile
              </Link>
              <Link href="/tutor/settings" className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors">
                Settings
              </Link>
            </div>
          </div>
        </div>

        {/* Direct Deposit Alert */}
        {!dashboard?.hasDirectDeposit && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-amber-800">Add your direct deposit details to get paid</p>
              <p className="text-sm text-amber-700 mt-0.5">Deposits are processed on the 1st and 15th of each month.</p>
            </div>
            <Link href="/tutor/payment-settings" className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap">
              Add details
            </Link>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Earnings" value={`$${(dashboard?.totalEarnings ?? 0).toFixed(2)}`} color="text-emerald-600" bg="bg-emerald-50" />
          <StatCard label="Amount Paid" value={`$${(dashboard?.amountPaid ?? 0).toFixed(2)}`} color="text-blue-600" bg="bg-blue-50" />
          <StatCard label="Amount Owed" value={`$${(dashboard?.amountOwed ?? 0).toFixed(2)}`} color="text-amber-600" bg="bg-amber-50" />
          <StatCard label="Unread Messages" value={String(dashboard?.unreadMessages ?? 0)} color="text-purple-600" bg="bg-purple-50" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <QuickAction href="/tutor/requests" icon="📋" label="Requests" />
          <QuickAction href="/tutor/schedule" icon="📅" label="Schedule Lesson" />
          <QuickAction href="/tutor/submit" icon="✅" label="Submit Lesson" />
          <QuickAction href="/tutor/messages" icon="💬" label="Messages" />
          <QuickAction href="/tutor/students" icon="👥" label="My Students" />
          <QuickAction href="/tutor/availability" icon="🕐" label="Availability" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Upcoming Lessons */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Lessons</h2>
              <Link href="/tutor/schedule" className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                + Schedule
              </Link>
            </div>
            <div className="p-6">
              {dashboard?.upcomingLessons && dashboard.upcomingLessons.length > 0 ? (
                <div className="space-y-3">
                  {dashboard.upcomingLessons.map((lesson) => (
                    <LessonCard key={lesson.id} session={lesson} variant="upcoming" />
                  ))}
                </div>
              ) : (
                <EmptyState
                  message="No upcoming lessons"
                  description="Schedule lessons to send students reminders and track payments."
                />
              )}
            </div>
          </div>

          {/* Recent Lessons */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Lessons</h2>
              <Link href="/tutor/submit" className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                + Submit
              </Link>
            </div>
            <div className="p-6">
              {dashboard?.recentLessons && dashboard.recentLessons.length > 0 ? (
                <div className="space-y-3">
                  {dashboard.recentLessons.map((lesson) => (
                    <LessonCard key={lesson.id} session={lesson} variant="recent" />
                  ))}
                </div>
              ) : (
                <EmptyState
                  message="No recent lessons"
                  description="Submitted lessons will appear here."
                />
              )}
            </div>
          </div>
        </div>

        {/* Response Stats + Availability */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Response Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{dashboard?.responseRate ?? 'N/A'}</p>
                <p className="text-xs text-gray-500 mt-1">Response Rate</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{dashboard?.responseTime ?? 'N/A'}</p>
                <p className="text-xs text-gray-500 mt-1">Avg. Response Time</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4">Top tutors respond within 1 hour. Quick responses lead to more bookings.</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Availability</h2>
            <p className="text-sm text-gray-600 mb-4">Let students know when you're available for lessons to get more bookings.</p>
            <Link href="/tutor/availability" className="inline-flex px-4 py-2 text-sm font-medium text-amber-600 border border-amber-600 rounded-lg hover:bg-amber-50 transition-colors">
              Set your availability
            </Link>
          </div>
        </div>

        {/* Referral Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-lg">
            🎁
          </div>
          <div className="flex-1">
            <p className="font-medium text-emerald-800">Keep 100% of your hourly rate when you refer students to YesGrad.</p>
          </div>
          <Link href="/tutor/referrals" className="text-sm font-medium text-emerald-700 hover:text-emerald-800 whitespace-nowrap">
            Learn more →
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, bg }: { label: string; value: string; color: string; bg: string }) {
  return (
    <div className={`${bg} rounded-xl shadow-sm border border-gray-200 p-5`}>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function QuickAction({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link href={href} className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-amber-300 hover:shadow-sm transition-all group">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-sm font-medium text-gray-700 group-hover:text-amber-600 transition-colors">{label}</div>
    </Link>
  );
}

function LessonCard({ session: session, variant }: { session: Session; variant: 'upcoming' | 'recent' }) {
  const statusColors = variant === 'upcoming'
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-emerald-50 text-emerald-700 border-emerald-200';

  const rawTime = session.startTime.split('.')[0];
  const date = new Date(`${session.sessionDate}T${rawTime}`);

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-lg flex flex-col items-center justify-center">
        <span className="text-xs font-bold text-gray-900 uppercase">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
        <span className="text-lg font-bold text-gray-900 leading-none">{date.getDate()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-gray-900 truncate">{session.subjectName}</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusColors}`}>{session.status}</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} · {session.durationMinutes} min · ${session.amount}
        </div>
        {session.notes && <p className="text-xs text-gray-400 mt-1 truncate">{session.notes}</p>}
      </div>
    </div>
  );
}

function EmptyState({ message, description }: { message: string; description: string }) {
  return (
    <div className="text-center py-6">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-900">{message}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
}
