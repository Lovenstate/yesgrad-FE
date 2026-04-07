'use client';

interface Props {
  budgetMin: number | '';
  budgetMax: number | '';
  lessonFormat: 'ONLINE' | 'IN_PERSON' | 'BOTH' | '';
  onChange: (field: 'budgetMin' | 'budgetMax' | 'lessonFormat', value: number | string) => void;
  onFinish: () => void;
  onBack: () => void;
  saving: boolean;
}

const FORMATS = [
  { value: 'ONLINE', label: 'Online', icon: '💻' },
  { value: 'IN_PERSON', label: 'In-Person', icon: '🏫' },
  { value: 'BOTH', label: 'Both', icon: '🔄' },
] as const;

export default function StudentAvailabilityStep({ budgetMin, budgetMax, lessonFormat, onChange, onFinish, onBack, saving }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Your preferences</h2>
        <p className="text-gray-500">Set your budget and how you'd like to learn</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Hourly Budget: <span className="text-amber-600 font-semibold">
            {budgetMin !== '' ? `$${budgetMin}` : '$—'} – {budgetMax !== '' ? `$${budgetMax}/hr` : '$—/hr'}
          </span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Minimum</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="text"
                inputMode="numeric"
                value={budgetMin}
                onChange={e => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  onChange('budgetMin', raw === '' ? '' : Number(raw));
                }}
                placeholder="20"
                className="w-full pl-7 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Maximum</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="text"
                inputMode="numeric"
                value={budgetMax}
                onChange={e => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  onChange('budgetMax', raw === '' ? '' : Number(raw));
                }}
                placeholder="75"
                className="w-full pl-7 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Lesson Format</label>
        <div className="grid grid-cols-3 gap-3">
          {FORMATS.map(f => (
            <button
              key={f.value}
              type="button"
              onClick={() => onChange('lessonFormat', f.value)}
              className={`p-4 rounded-lg border text-center transition-colors
                ${lessonFormat === f.value
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-amber-300'}`}
            >
              <div className="text-2xl mb-1">{f.icon}</div>
              <div className="text-sm font-medium">{f.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <button onClick={onBack} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
          Back
        </button>
        <button
          onClick={onFinish}
          disabled={!lessonFormat || saving}
          className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Find My Tutors 🎉'}
        </button>
      </div>
    </div>
  );
}
