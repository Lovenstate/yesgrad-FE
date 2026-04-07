'use client';

import { useState, useEffect } from 'react';
import { subjectAPI } from '@/lib/api';
import { SubjectNode, StudentSubjectRequest } from '@/types/api';

interface Props {
  selected: StudentSubjectRequest[];
  onChange: (subjects: StudentSubjectRequest[]) => void;
  onNext: () => void;
  onSkip: () => void;
  saving: boolean;
}

const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

function flatten(nodes: SubjectNode[]): SubjectNode[] {
  return nodes.reduce((acc: SubjectNode[], node) => {
    if (node.children.length > 0) return [...acc, ...flatten(node.children)];
    return [...acc, node];
  }, []);
}

export default function StudentSubjectsStep({ selected, onChange, onNext, onSkip, saving }: Props) {
  const [subjects, setSubjects] = useState<SubjectNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelPickerId, setLevelPickerId] = useState<number | null>(null);

  useEffect(() => {
    subjectAPI.getAllSubjects()
      .then(res => setSubjects(flatten(res.data ?? [])))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getEntry = (id: number) => selected.find(s => s.subjectId === id);

  const toggle = (id: number) => {
    if (getEntry(id)) {
      onChange(selected.filter(s => s.subjectId !== id));
      if (levelPickerId === id) setLevelPickerId(null);
    } else {
      setLevelPickerId(id);
    }
  };

  const setLevel = (id: number, level: string) => {
    const existing = getEntry(id);
    if (existing) {
      onChange(selected.map(s => s.subjectId === id ? { ...s, level } : s));
    } else {
      onChange([...selected, { subjectId: id, level }]);
    }
    setLevelPickerId(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">What do you need help with?</h2>
      <p className="text-gray-500 mb-6">Select subjects and your current level</p>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-11 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {subjects.map(subject => {
            const entry = getEntry(subject.id);
            const isPicking = levelPickerId === subject.id;

            if (isPicking) {
              return (
                <div key={subject.id} className="col-span-1 rounded-lg border border-amber-400 bg-amber-50 p-2">
                  <p className="text-xs font-semibold text-amber-700 mb-2 truncate">{subject.name}</p>
                  <div className="flex flex-col gap-1">
                    {LEVELS.map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setLevel(subject.id, level)}
                        className="text-xs py-1 px-2 rounded bg-white border border-amber-300 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-colors text-left"
                      >
                        {level.charAt(0) + level.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <button
                key={subject.id}
                type="button"
                onClick={() => toggle(subject.id)}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors text-left
                  ${entry
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-amber-300'}`}
              >
                <span className="block truncate">{subject.name}</span>
                {entry && (
                  <span className="text-xs opacity-80">
                    {entry.level.charAt(0) + entry.level.slice(1).toLowerCase()}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {selected.length > 0 && (
        <p className="text-sm text-amber-700 mt-4">{selected.length} subject{selected.length !== 1 ? 's' : ''} selected</p>
      )}

      <div className="flex justify-between mt-6">
        <button onClick={onSkip} className="px-6 py-3 text-gray-500 hover:text-gray-700 font-medium">
          Skip for now
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
