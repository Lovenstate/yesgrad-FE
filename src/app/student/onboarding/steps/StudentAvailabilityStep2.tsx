'use client';

import { StudentAvailabilityeRequest } from '@/types/api';

interface Props {
  selected: StudentAvailabilityeRequest[];
  onChange: (availability: StudentAvailabilityeRequest[]) => void;
  onNext: () => void;
  onBack: () => void;
  saving: boolean;
}

const DAYS = [
  { value: 'MONDAY', label: 'Mon' },
  { value: 'TUESDAY', label: 'Tue' },
  { value: 'WEDNESDAY', label: 'Wed' },
  { value: 'THURSDAY', label: 'Thu' },
  { value: 'FRIDAY', label: 'Fri' },
  { value: 'SATURDAY', label: 'Sat' },
  { value: 'SUNDAY', label: 'Sun' },
];

const DEFAULT_START = '09:00';
const DEFAULT_END = '17:00';

export default function StudentAvailabilityStep2({ selected, onChange, onNext, onBack, saving }: Props) {
  const getEntry = (day: string) => selected.find(s => s.dayOfWeek === day);

  const toggleDay = (day: string) => {
    if (getEntry(day)) {
      onChange(selected.filter(s => s.dayOfWeek !== day));
    } else {
      onChange([...selected, { dayOfWeek: day, startTime: DEFAULT_START, endTime: DEFAULT_END }]);
    }
  };

  const updateTime = (day: string, field: 'startTime' | 'endTime', value: string) => {
    onChange(selected.map(s => s.dayOfWeek === day ? { ...s, [field]: value } : s));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Your availability</h2>
      <p className="text-gray-500 mb-6">When are you generally available for tutoring sessions?</p>

      {/* Day toggles */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {DAYS.map(day => {
          const active = !!getEntry(day.value);
          return (
            <button
              key={day.value}
              type="button"
              onClick={() => toggleDay(day.value)}
              className={`w-12 h-12 rounded-full text-sm font-semibold transition-colors
                ${active
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {day.label}
            </button>
          );
        })}
      </div>

      {/* Time pickers for selected days */}
      {selected.length > 0 && (
        <div className="space-y-3">
          {DAYS.filter(d => getEntry(d.value)).map(day => {
            const entry = getEntry(day.value)!;
            return (
              <div key={day.value} className="flex items-center gap-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
                <span className="w-24 text-sm font-semibold text-gray-700">{day.value.charAt(0) + day.value.slice(1).toLowerCase()}</span>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="time"
                    value={entry.startTime}
                    onChange={e => updateTime(day.value, 'startTime', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <span className="text-gray-400 text-sm">to</span>
                  <input
                    type="time"
                    value={entry.endTime}
                    onChange={e => updateTime(day.value, 'endTime', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">Select the days you're available</p>
      )}

      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={selected.length === 0 || saving}
          className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
