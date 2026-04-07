'use client';

import { useState, useEffect } from 'react';
import { sessionAPI } from '@/lib/api';
import { TutorAvailability } from '@/types/api';

const DAYS: TutorAvailability['dayOfWeek'][] = [
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'
];

const DAY_LABELS: Record<string, string> = {
  MONDAY: 'Monday', TUESDAY: 'Tuesday', WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday', FRIDAY: 'Friday', SATURDAY: 'Saturday', SUNDAY: 'Sunday'
};

const DEFAULT_AVAILABILITY: TutorAvailability[] = DAYS.map(day => ({
  dayOfWeek: day,
  startTime: '09:00',
  endTime: '17:00',
  isAvailable: false,
}));

export default function TutorAvailabilityPage() {
  const [availability, setAvailability] = useState<TutorAvailability[]>(DEFAULT_AVAILABILITY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await sessionAPI.getTutorAvailability();
        if (res.data?.availabilities?.length) {
          // Merge with defaults to ensure all days are present
          const merged = DAYS.map(day => {
            const existing = res.data.availabilities.find((a: TutorAvailability) => a.dayOfWeek === day);
            return existing ?? { dayOfWeek: day, startTime: '09:00', endTime: '17:00', isAvailable: false };
          });
          setAvailability(merged);
        }
      } catch {
        // Use defaults
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggle = (day: string) => {
    setAvailability(prev => prev.map(a => a.dayOfWeek === day ? { ...a, isAvailable: !a.isAvailable } : a));
  };

  const updateTime = (day: string, field: 'startTime' | 'endTime', value: string) => {
    setAvailability(prev => prev.map(a => a.dayOfWeek === day ? { ...a, [field]: value } : a));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await sessionAPI.updateTutorAvailability({ availabilities: availability });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Failed to save availability. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const enabledCount = availability.filter(a => a.isAvailable).length;

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-pulse text-gray-400">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
            <p className="text-gray-500 text-sm mt-1">
              {enabledCount === 0 ? 'No days selected' : `Available ${enabledCount} day${enabledCount !== 1 ? 's' : ''} a week`}
            </p>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="px-5 py-2.5 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center gap-2">
            {saving ? (
              <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Saving...</>
            ) : saved ? (
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Saved!</>
            ) : 'Save Changes'}
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
          {availability.map(day => (
            <div key={day.dayOfWeek} className={`p-4 transition-colors ${day.isAvailable ? 'bg-white' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-4">
                {/* Toggle */}
                <button type="button" onClick={() => toggle(day.dayOfWeek)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${day.isAvailable ? 'bg-amber-600' : 'bg-gray-200'}`}>
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${day.isAvailable ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>

                {/* Day label */}
                <span className={`w-24 text-sm font-medium ${day.isAvailable ? 'text-gray-900' : 'text-gray-400'}`}>
                  {DAY_LABELS[day.dayOfWeek]}
                </span>

                {/* Time pickers */}
                {day.isAvailable ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input type="time" value={day.startTime}
                      onChange={e => updateTime(day.dayOfWeek, 'startTime', e.target.value)}
                      className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    <span className="text-gray-400 text-sm">to</span>
                    <input type="time" value={day.endTime}
                      onChange={e => updateTime(day.dayOfWeek, 'endTime', e.target.value)}
                      className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">Unavailable</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Students will only be able to book sessions during your available hours.
        </p>
      </div>
    </div>
  );
}
