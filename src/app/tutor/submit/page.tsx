'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sessionAPI, subjectAPI } from '@/lib/api';
import { TutorStudent, SubjectNode } from '@/types/api';

const DURATIONS = [30, 45, 60, 90, 120];

function flattenSubjects(nodes: SubjectNode[]): SubjectNode[] {
  return nodes.reduce((acc: SubjectNode[], node) => {
    if (node.children.length > 0) return [...acc, ...flattenSubjects(node.children)];
    return [...acc, node];
  }, []);
}

export default function SubmitLesson() {
  const router = useRouter();
  const [students, setStudents] = useState<TutorStudent[]>([]);
  const [subjects, setSubjects] = useState<SubjectNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    studentId: '',
    subjectId: '',
    sessionDate: '',
    startTime: '',
    durationMinutes: 60,
    notes: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [studentsRes, subjectsRes] = await Promise.all([
          sessionAPI.getTutorStudents(),
          subjectAPI.getAllSubjects(),
        ]);
        setStudents(studentsRes.data);
        setSubjects(flattenSubjects(subjectsRes.data));
      } catch {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await sessionAPI.submitLesson({
        studentId: Number(form.studentId),
        subjectId: Number(form.subjectId),
        sessionDate: form.sessionDate,
        startTime: form.startTime,
        durationMinutes: form.durationMinutes,
        notes: form.notes,
      });
      setSuccess(true);
    } catch {
      setError('Failed to submit lesson. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-pulse text-gray-400">Loading...</div></div>;

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Lesson Submitted!</h2>
          <p className="text-gray-500 text-sm mb-6">The lesson has been logged and the student will be notified for confirmation.</p>
          <div className="flex gap-3">
            <button onClick={() => { setSuccess(false); setForm({ studentId: '', subjectId: '', sessionDate: '', startTime: '', durationMinutes: 60, notes: '' }); }}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Submit Another
            </button>
            <button onClick={() => router.push('/tutor/dashboard')}
              className="flex-1 py-2.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Submit a Lesson</h1>
          <p className="text-gray-500 text-sm mt-1">Log a completed lesson that happened outside the scheduled system</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-amber-800">The student will receive a notification to confirm this lesson before payment is processed.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                <select required value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="">Select student</option>
                  {students.map(s => <option key={s.userId} value={s.userId}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select required value={form.subjectId} onChange={e => setForm({ ...form, subjectId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="">Select subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input required type="date" value={form.sessionDate}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={e => setForm({ ...form, sessionDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input required type="time" value={form.startTime}
                  onChange={e => setForm({ ...form, startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <div className="flex gap-2 flex-wrap">
                  {DURATIONS.map(d => (
                    <button key={d} type="button" onClick={() => setForm({ ...form, durationMinutes: d })}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${form.durationMinutes === d ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-gray-700 border-gray-300 hover:border-amber-300'}`}>
                      {d} min
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes <span className="text-gray-400">(optional)</span></label>
              <textarea value={form.notes} rows={3} placeholder="Topics covered, homework assigned..."
                onChange={e => setForm({ ...form, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => router.back()}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                className="flex-1 py-2.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Submit Lesson'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
