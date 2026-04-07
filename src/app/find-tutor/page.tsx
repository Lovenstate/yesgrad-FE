'use client';

import { useState, useEffect, useCallback } from 'react';
import { studentAPI, subjectAPI, sessionAPI } from '@/lib/api';
import { TutorSearchResult, SubjectNode, AvailableSlot, BookSessionRequest } from '@/types/api';

// ─── Booking Modal ────────────────────────────────────────────────────────────
function BookingModal({ tutor, onClose }: { tutor: TutorSearchResult; onClose: () => void }) {
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);
  const [error, setError] = useState('');

  // Min date = today
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!selectedDate) return;
    setSlots([]);
    setSelectedSlot(null);
    studentAPI.getTutorAvailability(tutor.tutorId, selectedDate)
      .then(res => setSlots(res.data ?? []))
      .catch(() => setSlots([]));
  }, [selectedDate, tutor.tutorId]);

  const handleBook = async () => {
    if (!selectedSlot || !subjectId) return;
    setLoading(true);
    setError('');
    try {
      const durationMinutes = (() => {
        const [sh, sm] = selectedSlot.startTime.split(':').map(Number);
        const [eh, em] = selectedSlot.endTime.split(':').map(Number);
        return (eh * 60 + em) - (sh * 60 + sm);
      })();

      const req: BookSessionRequest = {
        studentId: Number(localStorage.getItem('profileId')),
        subjectId,
        sessionDate: selectedSlot.date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        durationMinutes,
        hourlyRate: tutor.hourlyRate,
        amount: parseFloat(((durationMinutes / 60) * tutor.hourlyRate).toFixed(2)),
        lessonFormat: 'ONLINE',
        notes,
      };
      await sessionAPI.bookSession(req);
      setBooked(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Book with {tutor.name}</h2>
            <p className="text-sm text-gray-500">${tutor.hourlyRate}/hr</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        {booked ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Session Requested!</h3>
            <p className="text-gray-500 mb-6">Your session request has been sent to {tutor.name}. You'll be notified once they confirm.</p>
            <button onClick={onClose} className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 font-medium">
              Done
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={subjectId ?? ''}
                onChange={e => setSubjectId(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select subject</option>
                {tutor.subjects.map((s, i) => (
                  <option key={i} value={i + 1}>{s}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Times</label>
                {slots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {slots.map((slot, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2 text-sm rounded-lg border transition-colors
                          ${selectedSlot === slot
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'border-gray-300 hover:border-amber-400 text-gray-700'}`}
                      >
                        {slot.startTime}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No available slots for this date</p>
                )}
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes <span className="text-gray-400">(optional)</span></label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="What do you need help with?"
                rows={2}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Summary */}
            {selectedSlot && (
              <div className="bg-amber-50 rounded-lg p-4 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">{selectedSlot.date}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium">{selectedSlot.startTime} – {selectedSlot.endTime}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>${((() => {
                    const [sh, sm] = selectedSlot.startTime.split(':').map(Number);
                    const [eh, em] = selectedSlot.endTime.split(':').map(Number);
                    return ((eh * 60 + em - sh * 60 - sm) / 60 * tutor.hourlyRate).toFixed(2);
                  })())}</span>
                </div>
              </div>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              onClick={handleBook}
              disabled={!selectedSlot || !subjectId || loading}
              className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Booking...' : 'Request Session'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tutor Card ───────────────────────────────────────────────────────────────
function TutorCard({ tutor, onBook }: { tutor: TutorSearchResult; onBook: () => void }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {tutor.profilePhotoUrl
            ? <img src={tutor.profilePhotoUrl} alt={tutor.name} className="w-full h-full rounded-full object-cover" />
            : tutor.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{tutor.name}</h3>
            {tutor.instantBook && (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Instant Book</span>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">{tutor.headline}</p>
          <div className="flex items-center gap-1 mt-1">
            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium">{tutor.rating > 0 ? tutor.rating.toFixed(1) : 'New'}</span>
            {tutor.ratingCount > 0 && <span className="text-xs text-gray-400">({tutor.ratingCount})</span>}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {tutor.subjects.slice(0, 3).map((s, i) => (
          <span key={i} className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-200">{s}</span>
        ))}
        {tutor.subjects.length > 3 && (
          <span className="text-xs text-gray-400 px-2 py-1">+{tutor.subjects.length - 3} more</span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-gray-900">${tutor.hourlyRate}<span className="text-sm font-normal text-gray-500">/hr</span></span>
        <button
          onClick={onBook}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
        >
          Book Session
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FindTutor() {
  const [tutors, setTutors] = useState<TutorSearchResult[]>([]);
  const [subjects, setSubjects] = useState<SubjectNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingTutor, setBookingTutor] = useState<TutorSearchResult | null>(null);

  const [filters, setFilters] = useState({
    search: '',
    subjectId: '',
    minPrice: '',
    maxPrice: '',
    lessonFormat: '',
    sortBy: 'rating' as 'rating' | 'price_asc' | 'price_desc' | 'experience',
  });

  useEffect(() => {
    subjectAPI.getAllSubjects().then(res => {
      const flatten = (nodes: SubjectNode[]): SubjectNode[] =>
        nodes.reduce((acc: SubjectNode[], n) =>
          n.children.length > 0 ? [...acc, ...flatten(n.children)] : [...acc, n], []);
      setSubjects(flatten(res.data ?? []));
    });
    search();
  }, []);

  const search = useCallback(async () => {
    setLoading(true);
    try {
      const res = await studentAPI.searchTutors({
        search: filters.search || undefined,
        subjectId: filters.subjectId ? Number(filters.subjectId) : undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        lessonFormat: filters.lessonFormat || undefined,
        sortBy: filters.sortBy,
      });
      setTutors(res.data ?? []);
    } catch {
      setTutors([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Search */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-100 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Find Your Perfect Tutor</h1>
            <p className="text-gray-600 text-lg">Browse qualified tutors and book sessions instantly</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <input
                type="text"
                placeholder="Search by name or subject..."
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && search()}
                className="md:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
              <select
                value={filters.subjectId}
                onChange={e => setFilters({ ...filters, subjectId: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All Subjects</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select
                value={filters.lessonFormat}
                onChange={e => setFilters({ ...filters, lessonFormat: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Any Format</option>
                <option value="ONLINE">Online</option>
                <option value="IN_PERSON">In-Person</option>
              </select>
              <button
                onClick={search}
                className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 font-semibold"
              >
                Search
              </button>
            </div>

            {/* Price + Sort */}
            <div className="flex flex-wrap gap-3 mt-3">
              <input
                type="number"
                placeholder="Min $"
                value={filters.minPrice}
                onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
              />
              <input
                type="number"
                placeholder="Max $"
                value={filters.maxPrice}
                onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
              />
              <select
                value={filters.sortBy}
                onChange={e => setFilters({ ...filters, sortBy: e.target.value as typeof filters.sortBy })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
              >
                <option value="rating">Sort: Top Rated</option>
                <option value="price_asc">Sort: Price Low–High</option>
                <option value="price_desc">Sort: Price High–Low</option>
                <option value="experience">Sort: Most Sessions</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {loading ? 'Searching...' : `${tutors.length} Tutor${tutors.length !== 1 ? 's' : ''} Found`}
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                  <div className="flex gap-4 mb-4">
                    <div className="w-14 h-14 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded mb-4" />
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-200 rounded w-16" />
                    <div className="h-8 bg-gray-200 rounded w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : tutors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutors.map(tutor => (
                <TutorCard key={tutor.tutorId} tutor={tutor} onBook={() => setBookingTutor(tutor)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-2">No tutors found</p>
              <p className="text-gray-400 text-sm">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </section>

      {/* Booking Modal */}
      {bookingTutor && (
        <BookingModal tutor={bookingTutor} onClose={() => setBookingTutor(null)} />
      )}
    </div>
  );
}
