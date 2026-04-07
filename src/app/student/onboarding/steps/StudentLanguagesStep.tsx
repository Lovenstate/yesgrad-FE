'use client';

import { useState } from 'react';
import { StudentLanguageRequest } from '@/types/api';

interface Props {
  selected: StudentLanguageRequest[];
  onChange: (languages: StudentLanguageRequest[]) => void;
  onNext: () => void;
  onBack: () => void;
  saving: boolean;
}

const LANGUAGES = [
  'English', 'Spanish', 'French', 'Mandarin', 'Arabic', 'Portuguese',
  'Russian', 'Japanese', 'German', 'Korean', 'Italian', 'Hindi',
];

const PROFICIENCIES = [
  { value: 'NATIVE', label: 'Native' },
  { value: 'FLUENT', label: 'Fluent' },
  { value: 'CONVERSATIONAL', label: 'Conversational' },
  { value: 'BASIC', label: 'Basic' },
];

export default function StudentLanguagesStep({ selected, onChange, onNext, onBack, saving }: Props) {
  const [pickingFor, setPickingFor] = useState<string | null>(null);

  const getEntry = (lang: string) => selected.find(s => s.language === lang);

  const toggle = (lang: string) => {
    if (getEntry(lang)) {
      onChange(selected.filter(s => s.language !== lang));
      if (pickingFor === lang) setPickingFor(null);
    } else {
      setPickingFor(lang);
    }
  };

  const setProficiency = (lang: string, proficiency: string) => {
    const existing = getEntry(lang);
    if (existing) {
      onChange(selected.map(s => s.language === lang ? { ...s, proficiency } : s));
    } else {
      onChange([...selected, { language: lang, proficiency }]);
    }
    setPickingFor(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Languages you speak</h2>
      <p className="text-gray-500 mb-6">Select languages and your proficiency level</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {LANGUAGES.map(lang => {
          const entry = getEntry(lang);
          const isPicking = pickingFor === lang;

          if (isPicking) {
            return (
              <div key={lang} className="rounded-lg border border-amber-400 bg-amber-50 p-2">
                <p className="text-xs font-semibold text-amber-700 mb-2">{lang}</p>
                <div className="flex flex-col gap-1">
                  {PROFICIENCIES.map(p => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setProficiency(lang, p.value)}
                      className="text-xs py-1 px-2 rounded bg-white border border-amber-300 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-colors text-left"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <button
              key={lang}
              type="button"
              onClick={() => toggle(lang)}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors text-left
                ${entry
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-amber-300'}`}
            >
              <span className="block">{lang}</span>
              {entry && (
                <span className="text-xs opacity-80">
                  {PROFICIENCIES.find(p => p.value === entry.proficiency)?.label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <p className="text-sm text-amber-700 mt-4">
          {selected.length} language{selected.length !== 1 ? 's' : ''} selected
        </p>
      )}

      <div className="flex justify-between mt-6">
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
