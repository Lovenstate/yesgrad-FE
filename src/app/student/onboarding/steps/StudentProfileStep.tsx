'use client';

interface Props {
  gradeLevel: string;
  learningGoals: string;
  onChange: (field: 'gradeLevel' | 'learningGoals', value: string) => void;
  onNext: () => void;
  onBack: () => void;
  saving: boolean;
}

const GRADES = [
  { value: 'ELEMENTARY', label: 'Elementary (K–5)' },
  { value: 'MIDDLE', label: 'Middle School (6–8)' },
  { value: 'HIGH_SCHOOL', label: 'High School (9–12)' },
  { value: 'COLLEGE', label: 'College' },
  { value: 'ADULT', label: 'Adult Learner' },
];

export default function StudentProfileStep({ gradeLevel, learningGoals, onChange, onNext, onBack, saving }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Tell us about yourself</h2>
        <p className="text-gray-500">This helps us match you with the right tutors</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Grade Level</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {GRADES.map(g => (
            <button
              key={g.value}
              type="button"
              onClick={() => onChange('gradeLevel', g.value)}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors text-left
                ${gradeLevel === g.value
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-amber-300'}`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Learning Goals <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={learningGoals}
          onChange={e => onChange('learningGoals', e.target.value)}
          placeholder="e.g., Improve math grades, prepare for SAT, learn to code..."
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
        />
      </div>

      <div className="flex justify-between pt-2">
        <button onClick={onBack} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!gradeLevel || saving}
          className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
