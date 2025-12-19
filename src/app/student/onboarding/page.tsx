'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentOnboarding() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    subjects: [] as string[],
    gradeLevel: '',
    learningGoals: '',
    budget: '',
    lessonFormat: ''
  });

  const subjects = [
    'Math', 'Science', 'English', 'History', 'Physics', 'Chemistry', 
    'Biology', 'Computer Science', 'Foreign Languages', 'SAT/ACT Prep'
  ];

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save onboarding data to backend
    console.log('Onboarding data:', formData);
    router.push('/find-tutor');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Let's personalize your learning</h1>
          <p className="text-gray-600 mt-2">Help us find the perfect tutor for you</p>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-4">
                What subjects do you need help with?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {subjects.map(subject => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => handleSubjectToggle(subject)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      formData.subjects.includes(subject)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-900 mb-4">
                What's your grade level?
              </label>
              <select
                value={formData.gradeLevel}
                onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select grade level</option>
                <option value="elementary">Elementary (K-5)</option>
                <option value="middle">Middle School (6-8)</option>
                <option value="high">High School (9-12)</option>
                <option value="college">College</option>
                <option value="adult">Adult Learner</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-900 mb-4">
                What are your learning goals?
              </label>
              <textarea
                value={formData.learningGoals}
                onChange={(e) => setFormData({...formData, learningGoals: e.target.value})}
                placeholder="e.g., Improve math grades, prepare for SAT, learn programming basics..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-900 mb-4">
                What's your budget per hour?
              </label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select budget range</option>
                <option value="20-30">$20 - $30</option>
                <option value="30-50">$30 - $50</option>
                <option value="50-75">$50 - $75</option>
                <option value="75+">$75+</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-900 mb-4">
                Preferred lesson format?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {['Online', 'In-Person', 'Both'].map(format => (
                  <button
                    key={format}
                    type="button"
                    onClick={() => setFormData({...formData, lessonFormat: format})}
                    className={`p-4 rounded-lg border text-center font-medium transition-colors ${
                      formData.lessonFormat === format
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Find My Tutors
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}