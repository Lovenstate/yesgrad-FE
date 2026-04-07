'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sessionAPI } from '@/lib/api';
import { TutorStudent, TutorSubject } from '@/types/api';

const DURATIONS = [30, 45, 60, 90, 120];

export default function ScheduleLesson() {
  const router = useRouter();
  const [students, setStudents] = useState<TutorStudent[]>([]);
  const [subjects, setSubjects] = useState<TutorSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    studentId: '',
    subjectRowId: '',   // s.id — controls the select
    subjectId: '',      // s.subjectId — sent to backend
    sessionDate: '',
    startTime: '',
    durationMinutes: 60,
    lessonFormat: 'ONLINE' as 'ONLINE' | 'IN_PERSON',
    location: '',
    notes: '',
    hourlyRate: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [studentsRes, subjectsRes] = await Promise.all([
          sessionAPI.getTutorStudents(),
          sessionAPI.getTutorSubjetcs(),
        ]);
        setStudents(studentsRes.data);
        setSubjects(subjectsRes.data);
      } catch {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rowId = e.target.value;
    const selected = subjects.find(s => String(s.id) === rowId);
    setForm(prev => ({
      ...prev,
      subjectRowId: rowId,
      subjectId: selected ? String(selected.subjectId) : '',
      hourlyRate: selected ? Number(selected.hourlyRate) : 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const start = new Date(`${form.sessionDate}T${form.startTime}`);
      const end = new Date(start.getTime() + form.durationMinutes * 60000);
      const endTime = end.toTimeString().slice(0, 5);
      const amount = form.hourlyRate * (form.durationMinutes / 60);

      await sessionAPI.bookSession({
        studentId: Number(form.studentId),
        subjectId: Number(form.subjectId),
        sessionDate: form.sessionDate,
        startTime: form.startTime,
        endTime,
        durationMinutes: form.durationMinutes,
        hourlyRate: form.hourlyRate,
        amount,
        lessonFormat: form.lessonFormat,
        location: form.location,
        notes: form.notes,
      });
      router.push('/tutor/dashboard');
    } catch {
      setError('Failed to schedule lesson. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  const amount = form.hourlyRate * (form.durationMinutes / 60);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Schedule a Lesson</h1>
          <p className="text-gray-500 text-sm mt-1">Book a session with one of your existing students</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

          {students.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="font-medium text-gray-900">No students yet</p>
              <p className="text-sm text-gray-500 mt-1">You can only schedule lessons with students you've worked with before.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                  <select required value={form.studentId} onChange={e => setForm(prev => ({ ...prev, studentId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option value="">Select student</option>
                    {students.map(s => <option key={s.userId} value={s.userId}>{s.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select required value={form.subjectRowId} onChange={handleSubjectChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option value="">Select subject</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.subjectName} — ${s.hourlyRate}/hr</option>)}
                  </select>
                  {form.hourlyRate > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      ${form.hourlyRate}/hr · {form.durationMinutes} min = <span className="font-medium text-gray-700">${amount.toFixed(2)}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input required type="date" value={form.sessionDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setForm(prev => ({ ...prev, sessionDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input required type="time" value={form.startTime}
                    onChange={e => setForm(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <select value={form.durationMinutes} onChange={e => setForm(prev => ({ ...prev, durationMinutes: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                    {DURATIONS.map(d => <option key={d} value={d}>{d} minutes</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                  <div className="flex gap-2">
                    {(['ONLINE', 'IN_PERSON'] as const).map(f => (
                      <button key={f} type="button" onClick={() => setForm(prev => ({ ...prev, lessonFormat: f }))}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${form.lessonFormat === f ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-gray-700 border-gray-300 hover:border-amber-300'}`}>
                        {f === 'ONLINE' ? '🖥 Online' : '📍 In-Person'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {form.lessonFormat === 'IN_PERSON' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input type="text" value={form.location} placeholder="e.g. Library, Coffee shop..."
                    onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes <span className="text-gray-400">(optional)</span></label>
                <textarea value={form.notes} rows={3} placeholder="Topics to cover, materials needed..."
                  onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => router.back()}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-2.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50">
                  {submitting ? 'Scheduling...' : 'Schedule Lesson'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function PageLoader() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-pulse text-gray-400">Loading...</div>
    </div>
  );
}
