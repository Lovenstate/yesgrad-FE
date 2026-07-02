'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const services = [
  {
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Tutoring',
    desc: 'Find expert tutors for all subjects and grade levels.',
    href: '/find-tutor',
    color: 'bg-blue-50',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'Test Prep',
    desc: 'SAT, ACT, GRE, TEAS, HESI, NCLEX and more.',
    href: '/subjects',
    color: 'bg-purple-50',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: 'Academic Support',
    desc: 'Homework help, study plans, writing, projects and more.',
    href: '/resources',
    color: 'bg-emerald-50',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: 'Events & Competitions',
    desc: 'Join workshops, contests, spelling bees and more.',
    href: '/events',
    color: 'bg-yellow-50',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    title: 'Store',
    desc: 'Study guides, supplies, merch and more.',
    href: '/supplies',
    color: 'bg-rose-50',
  },
];

const subjects = ['Mathematics', 'English', 'Science', 
  'Accounting', 'Economics', 'Nursing', 'Computer Science', 'Finance'];

const trustItems = [
  {
    icon: (
      <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    label: 'Verified Tutors',
    sub: 'Carefully screened',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    label: 'Safe & Secure',
    sub: 'Your safety is our priority',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    label: 'Affordable Pricing',
    sub: 'Quality help at the right price',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    label: 'Student Success',
    sub: "We're with you every step",
  },
];

export default function Home() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (subject) params.set('subject', subject);
    if (gradeLevel) params.set('grade', gradeLevel);
    router.push(`/find-tutor${params.toString() ? '?' + params.toString() : ''}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">

        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-10 lg:py-14 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
                  <span className="text-[#1a237e]">Yes</span><span className="text-[#f5a623]">Grad</span>
                  <br />
                  <span className="text-[#1a237e]">Say Yes to Success</span>
                </h1>
                <p className="mt-4 text-lg text-gray-600 max-w-md">
                  The all-in-one platform for tutoring, test prep, student support, events and more.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/find-tutor" className="inline-flex items-center gap-2 bg-[#1a237e] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors">
                    Find a Tutor
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                  <Link href="/subjects" className="inline-flex items-center gap-2 border-2 border-[#1a237e] text-[#1a237e] px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Explore Services
                  </Link>
                </div>
              </div>

              {/* Hero image — flush to the right edge */}
              <div className="relative lg:translate-x-8 xl:translate-x-16">
                <img
                  src="/static/banner.png"
                  alt="YesGrad students"
                  className="w-full h-full object-cover object-left rounded-l-2xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section className="bg-white border-y py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trustItems.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a237e] text-sm">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Explore Services */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[#1a237e]">Explore Our Services</h2>
              <Link href="/subjects" className="text-sm text-blue-600 hover:underline font-medium">View all services</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {services.map((s) => (
                <Link key={s.title} href={s.href} className={`${s.color} rounded-xl p-5 hover:shadow-md transition-shadow group`}>
                  <div className="mb-3">{s.icon}</div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{s.title}</h3>
                  <p className="text-xs text-gray-500 mb-3 leading-relaxed">{s.desc}</p>
                  <span className="text-xs font-semibold text-blue-600 group-hover:underline inline-flex items-center gap-1">
                    Learn more
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Find Tutor + Popular Subjects + CTA */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-6">

              {/* Find the Right Tutor */}
              <div className="bg-gray-50 rounded-2xl p-6 border">
                <h3 className="text-lg font-bold text-[#1a237e] mb-4">Find the Right Tutor</h3>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
                    <div className="relative">
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Subject</option>
                        {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <svg className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Grade Level</label>
                    <div className="relative">
                      <select
                        value={gradeLevel}
                        onChange={(e) => setGradeLevel(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Grade Level</option>
                        <option value="elementary">Elementary (K-5)</option>
                        <option value="middle">Middle School (6-8)</option>
                        <option value="high">High School (9-12)</option>
                        <option value="college">College / University</option>
                        <option value="adult">Adult Learner</option>
                      </select>
                      <svg className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-[#1a237e] text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors text-sm">
                    Search Tutors
                  </button>
                </form>
              </div>

              {/* Popular Subjects */}
              <div className="bg-gray-50 rounded-2xl p-6 border">
                <h3 className="text-lg font-bold text-[#1a237e] mb-4">Popular Subjects</h3>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((s) => (
                    <Link
                      key={s}
                      href={`/find-tutor?subject=${encodeURIComponent(s)}`}
                      className="px-4 py-2 border border-gray-200 rounded-full text-sm text-gray-700 bg-white hover:border-blue-400 hover:text-blue-700 transition-colors"
                    >
                      {s}
                    </Link>
                  ))}
                </div>
                <Link href="/subjects" className="mt-4 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline font-medium">
                  View all subjects
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>

              {/* Join CTA */}
              <div className="bg-[#1a237e] rounded-2xl p-6 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 50%)' }} />
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">
                    Join <span className="text-[#f5a623]">YesGrad</span> Today!
                  </h3>
                  <p className="text-blue-200 text-sm leading-relaxed mb-6">
                    Unlock your potential. Get the support you need to achieve your goals.
                  </p>
                  <Link
                    href="/auth/student/register"
                    className="inline-flex items-center gap-2 bg-[#f5a623] text-white px-5 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors text-sm"
                  >
                    Sign Up Now
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
