'use client';

import { useState, useEffect } from 'react';
import { tutorProfileAPI, API_BASE_URL } from '@/lib/api';
import { TutorProfileRequest } from '@/types/api';

type Section = 'photo' | 'education' | 'rates' | 'availability' | 'subjects' | 'languages';

export default function TutorProfile() {
  const [activeSection, setActiveSection] = useState<Section>('photo');
  const [formData, setFormData] = useState<TutorProfileRequest>({});
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<Record<string, string>>({});
  const [availability, setAvailability] = useState<Record<string, { startTime: string; endTime: string; isAvailable: boolean }>>({});
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const SUBJECTS = ['Math', 'Science', 'English', 'History', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];
  const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];
  const PROFICIENCY_LEVELS = ['Native', 'Fluent', 'Conversational', 'Basic'];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await tutorProfileAPI.getProfile();
      if (response.data) {
        const data = response.data;
        
        // Set form data
        setFormData({
          school: data.school,
          degree: data.degree,
          fieldOfStudy: data.fieldOfStudy,
          graduationYear: data.graduationYear,
          hourlyRate: data.hourlyRate,
          cancellationPolicy: data.cancellationPolicy,
          travelPolicy: data.travelPolicy,
        });

        // Set subjects
        setSelectedSubjects(data.subjects || []);

        // Set languages
        const langMap: Record<string, string> = {};
        data.languages?.forEach(lang => {
          langMap[lang.language] = lang.proficiency;
        });
        setSelectedLanguages(langMap);

        // Set availability
        const availMap: Record<string, { startTime: string; endTime: string; isAvailable: boolean }> = {};
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].forEach(day => {
          const dayAvail = data.availability?.find(a => a.dayOfWeek === day);
          availMap[day] = dayAvail ? { startTime: dayAvail.startTime, endTime: dayAvail.endTime, isAvailable: dayAvail.isAvailable ?? false } : { startTime: '09:00', endTime: '17:00', isAvailable: false };
        });
        setAvailability(availMap);

        // Set photo
        if (data.profilePhotoUrl) {
          setPhotoPreview(data.profilePhotoUrl);
        }
        
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      alert('Failed to load profile');
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoPreview(URL.createObjectURL(file));
    setHasChanges(true);
    
    try {
      setLoading(true);
      const response = await tutorProfileAPI.uploadPhoto(file);
      setPhotoPreview(response.data);
      alert('Photo uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload photo:', error);
      alert('Failed to upload photo');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.school || !formData.degree || !formData.fieldOfStudy || !formData.graduationYear || !formData.hourlyRate || !formData.cancellationPolicy) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const updateRequest: TutorProfileRequest = {
        ...formData,
        subjects: selectedSubjects,
        languages: LANGUAGES
          .filter(lang => lang in selectedLanguages)
          .map(lang => ({
            language: lang,
            proficiency: selectedLanguages[lang],
          })),
        availability: Object.entries(availability)
          .filter(([, avail]) => avail.isAvailable)
          .map(([day, avail]) => ({
            dayOfWeek: day,
            startTime: avail.startTime,
            endTime: avail.endTime,
            isAvailable: true,
          })),
      };

      await tutorProfileAPI.updateProfile(updateRequest);
      setHasChanges(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    );
    setHasChanges(true);
  };

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev => {
      const updated = { ...prev };
      if (language in updated) {
        delete updated[language];
      } else {
        updated[language] = 'Fluent';
      }
      return updated;
    });
    setHasChanges(true);
  };

  const updateLanguageProficiency = (language: string, proficiency: string) => {
    setSelectedLanguages(prev => ({
      ...prev,
      [language]: proficiency,
    }));
    setHasChanges(true);
  };

  const toggleAvailability = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], isAvailable: !prev[day].isAvailable },
    }));
    setHasChanges(true);
  };

  const updateAvailabilityTime = (day: string, field: 'startTime' | 'endTime', value: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
    setHasChanges(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your profile information and settings</p>
          </div>
          {hasChanges && (
            <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              Unsaved changes
            </span>
          )}
        </div>
        
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-56 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-20">
              {(['photo', 'education', 'rates', 'availability', 'subjects', 'languages'] as Section[]).map(section => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`w-full text-left px-5 py-3.5 transition-all border-l-4 capitalize ${
                    activeSection === section ? 'bg-amber-50 text-amber-700 font-semibold border-amber-600' : 'text-gray-700 hover:bg-gray-50 border-transparent'
                  }`}
                >
                  {section === 'photo' ? 'Profile Photo' : section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <form onSubmit={handleSave}>
                {activeSection === 'photo' && (
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Photo</h2>
                    <p className="text-gray-600 text-sm mb-8">A photo helps students connect with you. Upload a clear, professional headshot.</p>
                    <div className="space-y-6">
                      <div className="flex items-start gap-8">
                        <div className="w-40 h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                          {photoPreview ? (
                            <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <input type="file" accept="image/*" className="hidden" id="photo-upload" onChange={handlePhotoChange} />
                          <label htmlFor="photo-upload" className="cursor-pointer bg-amber-600 text-white px-6 py-2.5 rounded-lg hover:bg-amber-700 transition-all inline-block font-medium shadow-sm">
                            Choose Photo
                          </label>
                          <p className="text-sm text-gray-500 mt-3">JPG, PNG or GIF. Max size 5MB.</p>
                          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800"><strong>Tip:</strong> Use a high-quality, recent photo where your face is clearly visible. Profiles with photos get 3x more responses!</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'education' && (
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Education</h2>
                    <p className="text-gray-600 text-sm mb-8">Share your educational background to build credibility with students.</p>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">School/University *</label>
                        <input type="text" placeholder="e.g., Harvard University" value={formData.school ?? ''} 
                        onChange={(e) => { setFormData({...formData, school: e.target.value}); setHasChanges(true); }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Degree *</label>
                        <input type="text" placeholder="e.g., Bachelor of Science" value={formData.degree ?? ''} 
                        onChange={(e) => { setFormData({...formData, degree: e.target.value}); setHasChanges(true); }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Field of Study *</label>
                        <input type="text" placeholder="e.g., Computer Science" value={formData.fieldOfStudy ?? ''} 
                        onChange={(e) => { setFormData({...formData, fieldOfStudy: e.target.value}); setHasChanges(true); }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Graduation Year *</label>
                        <input type="number" placeholder="e.g., 2020" value={formData.graduationYear ?? ''} 
                        onChange={(e) => { setFormData({...formData, graduationYear: Number(e.target.value)}); setHasChanges(true); }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" />
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'rates' && (
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Rates & Policies</h2>
                    <p className="text-gray-600 text-sm mb-8">Set your hourly rate and define your policies for cancellations and travel.</p>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate ($) *</label>
                        <div className="relative">
                          <span className="absolute left-4 top-3.5 text-gray-500 font-medium">$</span>
                          <input type="number" placeholder="45" 
                          value={formData.hourlyRate ?? ''} 
                          onChange={(e) => { setFormData({...formData, hourlyRate: Number(e.target.value)}); setHasChanges(true); }} className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Average rate for tutors: $40-60/hour</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Cancellation Policy *</label>
                        <select value={formData.cancellationPolicy ?? ''} 
                        onChange={(e) => { setFormData({...formData, cancellationPolicy: e.target.value}); setHasChanges(true); }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all">
                          <option value="">Select policy</option>
                          <option value="24 hours notice required">24 hours notice required</option>
                          <option value="48 hours notice required">48 hours notice required</option>
                          <option value="1 week notice required">1 week notice required</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Travel Policy</label>
                        <textarea rows={4} value={formData.travelPolicy ?? ''} 
                        onChange={(e) => { setFormData({...formData, travelPolicy: e.target.value}); setHasChanges(true); }} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" placeholder="Describe your travel policy and any additional fees..."></textarea>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'availability' && (
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Availability</h2>
                    <p className="text-gray-600 text-sm mb-8">Set your weekly availability to help students book sessions with you.</p>
                    <div className="space-y-3">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                        <div key={day} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-all">
                          <input
                            type="checkbox"
                            id={day}
                            checked={availability[day]?.isAvailable || false}
                            onChange={() => toggleAvailability(day)}
                            className="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                          />
                          <label htmlFor={day} className="w-24 font-semibold text-gray-700">{day}</label>
                          <input
                            type="time"
                            value={availability[day]?.startTime || '09:00'}
                            onChange={(e) => updateAvailabilityTime(day, 'startTime', e.target.value)}
                            disabled={!availability[day]?.isAvailable}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                          <span className="text-gray-400 font-medium">to</span>
                          <input
                            type="time"
                            value={availability[day]?.endTime || '17:00'}
                            onChange={(e) => updateAvailabilityTime(day, 'endTime', e.target.value)}
                            disabled={!availability[day]?.isAvailable}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'subjects' && (
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Subjects</h2>
                    <p className="text-gray-600 text-sm mb-8">Select all subjects you&apos;re qualified to teach.</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-4">Select Subjects You Teach *</label>
                        <div className="grid grid-cols-2 gap-3">
                          {SUBJECTS.map(subject => (
                            <label key={subject} className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 cursor-pointer transition-all">
                              <input
                                type="checkbox"
                                checked={selectedSubjects.includes(subject)}
                                onChange={() => toggleSubject(subject)}
                                className="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                              />
                              <span className="text-gray-700 font-medium">{subject}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'languages' && (
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Languages</h2>
                    <p className="text-gray-600 text-sm mb-8">Select languages you can teach in and your proficiency level.</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-4">Languages You Speak *</label>
                        <div className="space-y-3">
                          {LANGUAGES.map(lang => (
                            <label key={lang} className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 cursor-pointer transition-all">
                              <input
                                type="checkbox"
                                checked={lang in selectedLanguages}
                                onChange={() => toggleLanguage(lang)}
                                className="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                              />
                              <span className="text-gray-700 font-medium flex-1">{lang}</span>
                              {lang in selectedLanguages && (
                                <select
                                  value={selectedLanguages[lang]}
                                  onChange={(e) => updateLanguageProficiency(lang, e.target.value)}
                                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                >
                                  {PROFICIENCY_LEVELS.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                  ))}
                                </select>
                              )}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                  <p className="text-sm text-gray-500">* Required fields</p>
                  <button type="submit" disabled={loading || !hasChanges} className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
