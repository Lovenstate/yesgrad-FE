'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { studentAPI } from '@/lib/api';
import { StudentDashboardResponse, Session } from '@/types/api';

export default function StudentDashboard() {
  const [data, setData] = useState<StudentDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(true);

  useEffect(() => {
    setEmailVerified(localStorage.getItem('emailVerified') !== 'false');
    studentAPI.getDashboard()
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  const upcoming = data?.upcomingLessons ?? [];
  const recent = data?.recentLessons ?? [];

  // Derive unique tutors from session history
  const tutorMap = new Map<number, { name: string; subject: string }>();
  [...upcoming, ...recent].forEach(s => {
    if (s.tutorId && s.tutorName && !tutorMap.has(s.tutorId))
      tutorMap.set(s.tutorId, { name: s.tutorName!, subject: s.subjectName });
  });
  const myTutors = Array.from(tutorMap.entries());

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome back, {data?.name ?? 'there'}!
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                  </svg>
                  {data?.totalHours ?? 0} hours learned
                </span>
                <span className="hidden sm:inline text-gray-300">|</span>
                <span>{data?.totalSessions ?? 0} sessions completed</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/student/sessions" className="px-4 py-2 text-sm font-medium text-amber-600 border border-amber-600 rounded-lg hover:bg-amber-50 transition-colors">
                My Sessions
              </Link>
              <Link href="/find-tutor" className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors">
                Find a Tutor
              </Link>
            </div>
          </div>
        </div>

        {/* Email verification banner */}
        {!emailVerified && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-blue-800">Please verify your email address</p>
              <p className="text-sm text-blue-700 mt-0.5">Check your inbox for a verification link to unlock all features.</p>
            </div>
            <Link href="/auth/verify-email" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
              Resend Email
            </Link>
          </div>
        )}

        {/* Payment method banner */}
        {data && !data.hasPaymentMethod && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-amber-800">Add a payment method to book sessions</p>
              <p className="text-sm text-amber-700 mt-0.5">Required before confirming any session with a tutor.</p>
            </div>
            <Link href="/student/wallet" className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap">
              Add Payment Method
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Upcoming Sessions" value={String(upcoming.length)} color="text-amber-600" bg="bg-amber-50" />
          <StatCard label="Total Hours" value={String(data?.totalHours ?? 0)} color="text-emerald-600" bg="bg-emerald-50" />
          <StatCard label="Sessions Completed" value={String(data?.totalSessions ?? 0)} color="text-blue-600" bg="bg-blue-50" />
          <StatCard label="Active Tutors" value={String(data?.activeTutors ?? myTutors.length)} color="text-purple-600" bg="bg-purple-50" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <QuickAction href="/find-tutor" icon="🔍" label="Find a Tutor" />
          <QuickAction href="/student/messages" icon="💬" label="Messages" />
          <QuickAction href="/student/sessions" icon="📅" label="My Sessions" />
          <QuickAction href="/student/wallet" icon="💳" label="Wallet" />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Upcoming Sessions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h2>
              <Link href="/find-tutor" className="text-sm text-amber-600 hover:text-amber-700 font-medium">+ Book New</Link>
            </div>
            <div className="p-6">
              {upcoming.length > 0 ? (
                <div className="space-y-3">
                  {upcoming.slice(0, 4).map(s => <SessionCard key={s.id} session={s} />)}
                  {upcoming.length > 4 && (
                    <Link href="/student/sessions" className="block text-center text-sm text-amber-600 hover:text-amber-700 font-medium pt-2">
                      View all {upcoming.length} sessions →
                    </Link>
                  )}
                </div>
              ) : (
                <EmptyState
                  message="No upcoming sessions"
                  description="Find a tutor and book your first session."
                  action={{ label: 'Find a Tutor', href: '/find-tutor' }}
                />
              )}
            </div>
          </div>

          {/* My Tutors */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">My Tutors</h2>
              <Link href="/find-tutor" className="text-sm text-amber-600 hover:text-amber-700 font-medium">Find More</Link>
            </div>
            <div className="p-6">
              {myTutors.length > 0 ? (
                <div className="space-y-3">
                  {myTutors.slice(0, 4).map(([tutorId, tutor]) => (
                    <div key={tutorId} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0">
                          {tutor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{tutor.name}</p>
                          <p className="text-xs text-gray-500">{tutor.subject}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/student/messages?tutor=${tutorId}`}
                          className="text-xs px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600 transition-colors">
                          Message
                        </Link>
                        <Link href={`/find-tutor/${tutorId}`}
                          className="text-xs px-3 py-1.5 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors">
                          Book
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  message="No tutors yet"
                  description="Book a session to start working with a tutor."
                  action={{ label: 'Find a Tutor', href: '/find-tutor' }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        {recent.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Recent Sessions</h2>
            </div>
            <div className="p-6 space-y-3">
              {recent.slice(0, 5).map(s => <SessionCard key={s.id} session={s} />)}
            </div>
          </div>
        )}

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

function SessionCard({ session }: { session: Session }) {
  const statusColors: Record<string, string> = {
    CONFIRMED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    COMPLETED: 'bg-gray-50 text-gray-600 border-gray-200',
    CANCELLED: 'bg-red-50 text-red-600 border-red-200',
    DECLINED: 'bg-red-50 text-red-600 border-red-200',
  };

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const [, month, day] = session.sessionDate.split('-');
  const monthLabel = MONTHS[Number(month) - 1];
  const startTime = session.startTime.slice(0, 5);
  const endTime = session.endTime.slice(0, 5);

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="shrink-0 w-12 h-12 bg-gray-50 rounded-lg flex flex-col items-center justify-center border border-gray-200">
        <span className="text-xs font-bold text-gray-500 uppercase">{monthLabel}</span>
        <span className="text-lg font-bold text-gray-900 leading-none">{day}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-gray-900 truncate">{session.subjectName} with {session.tutorName}</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border shrink-0 ${statusColors[session.status] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
            {session.status.charAt(0) + session.status.slice(1).toLowerCase()}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {startTime} – {endTime} · {session.durationMinutes} min · ${(session.amount ?? session.hourlyRate ?? 0).toFixed(2)}
        </p>
      </div>
    </div>
  );
}

function EmptyState({ message, description, action }: { message: string; description: string; action: { label: string; href: string } }) {
  return (
    <div className="text-center py-6">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-900">{message}</p>
      <p className="text-xs text-gray-500 mt-1 mb-3">{description}</p>
      <Link href={action.href} className="text-sm text-amber-600 hover:text-amber-700 font-medium">{action.label} →</Link>
    </div>
  );
}
