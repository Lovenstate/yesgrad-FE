'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { studentAPI } from '@/lib/api';
import { StudentSubjectRequest, StudentLanguageRequest, StudentAvailabilityeRequest } from '@/types/api';
import StudentSubjectsStep from './steps/StudentSubjectsStep';
import StudentProfileStep from './steps/StudentProfileStep';
import StudentLanguagesStep from './steps/StudentLanguagesStep';
import StudentAvailabilityStep2 from './steps/StudentAvailabilityStep2';
import StudentAvailabilityStep from './steps/StudentAvailabilityStep';

const STEPS = ['Subjects', 'About You', 'Languages', 'Availability', 'Preferences'];

export default function StudentOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    subjects: [] as StudentSubjectRequest[],
    gradeLevel: '',
    learningGoals: '',
    languages: [] as StudentLanguageRequest[],
    availability: [] as StudentAvailabilityeRequest[],
    budgetMin: 20 as number | '',
    budgetMax: 75 as number | '',
    lessonFormat: '' as 'ONLINE' | 'IN_PERSON' | 'BOTH' | '',
  });

  const update = (field: keyof typeof form, value: unknown) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const save = async (fn: () => Promise<unknown>, nextStep: number) => {
    setSaving(true);
    setError('');
    try {
      await fn();
      setStep(nextStep);
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    setError('');
    try {
      await studentAPI.updateProfile({
        budgetMin: form.budgetMin === '' ? 0 : form.budgetMin,
        budgetMax: form.budgetMax === '' ? 0 : form.budgetMax,
        lessonFormat: form.lessonFormat as 'ONLINE' | 'IN_PERSON' | 'BOTH',
        onboardingCompleted: true,
      });
      router.push('/find-tutor');
    } catch {
      setError('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((name, i) => (
              <div key={i} className="flex items-center flex-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm shrink-0
                  ${step >= i ? 'bg-amber-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  {step > i ? '✓' : i + 1}
                </div>
                <span className="ml-1 text-xs font-medium text-gray-600 flex-1 hidden sm:block">{name}</span>
                {i < STEPS.length - 1 && (
                  <div className={`h-1 flex-1 mx-1 rounded ${step > i ? 'bg-amber-600' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {step === 0 && (
            <StudentSubjectsStep
              selected={form.subjects}
              onChange={subjects => update('subjects', subjects)}
              onNext={() => save(() => studentAPI.saveSubjects(form.subjects), 1)}
              onSkip={() => router.push('/find-tutor')}
              saving={saving}
            />
          )}

          {step === 1 && (
            <StudentProfileStep
              gradeLevel={form.gradeLevel}
              learningGoals={form.learningGoals}
              onChange={(field, value) => update(field, value)}
              onNext={() => save(() => studentAPI.saveBasicProfileInfo({
                gradeLevel: form.gradeLevel,
                learningGoals: form.learningGoals,
              }), 2)}
              onBack={() => setStep(0)}
              saving={saving}
            />
          )}

          {step === 2 && (
            <StudentLanguagesStep
              selected={form.languages}
              onChange={languages => update('languages', languages)}
              onNext={() => save(() => studentAPI.saveLanguages(form.languages), 3)}
              onBack={() => setStep(1)}
              saving={saving}
            />
          )}

          {step === 3 && (
            <StudentAvailabilityStep2
              selected={form.availability}
              onChange={availability => update('availability', availability)}
              onNext={() => save(() => studentAPI.saveAvailability(form.availability), 4)}
              onBack={() => setStep(2)}
              saving={saving}
            />
          )}

          {step === 4 && (
            <StudentAvailabilityStep
              budgetMin={form.budgetMin}
              budgetMax={form.budgetMax}
              lessonFormat={form.lessonFormat}
              onChange={(field, value) => update(field as keyof typeof form, value)}
              onFinish={handleFinish}
              onBack={() => setStep(3)}
              saving={saving}
            />
          )}
        </div>
      </div>
    </div>
  );
}
