'use client';

import { useState } from 'react';

export default function FindTutor() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  // Mock tutor data
  const tutors = [
    {
      id: 1,
      name: 'Sarah Johnson',
      subject: 'Mathematics',
      rating: 4.9,
      reviews: 127,
      price: 45,
      level: 'High School',
      experience: '5 years',
      image: '/api/placeholder/100/100'
    },
    {
      id: 2,
      name: 'Michael Chen',
      subject: 'Computer Science',
      rating: 4.8,
      reviews: 89,
      price: 60,
      level: 'University',
      experience: '8 years',
      image: '/api/placeholder/100/100'
    },
    {
      id: 3,
      name: 'Emily Davis',
      subject: 'English',
      rating: 4.9,
      reviews: 156,
      price: 40,
      level: 'Middle School',
      experience: '6 years',
      image: '/api/placeholder/100/100'
    },
    {
      id: 4,
      name: 'David Wilson',
      subject: 'Science',
      rating: 4.7,
      reviews: 93,
      price: 50,
      level: 'High School',
      experience: '4 years',
      image: '/api/placeholder/100/100'
    }
  ];

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Computer Science', 'Languages'];
  const levels = ['Elementary', 'Middle School', 'High School', 'University'];

  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutor.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !selectedSubject || tutor.subject === selectedSubject;
    const matchesLevel = !selectedLevel || tutor.level === selectedLevel;
    
    return matchesSearch && matchesSubject && matchesLevel;
  });

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1">
        {/* Search Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Find Your Perfect Tutor
              </h1>
              <p className="text-xl text-gray-600">
                Search through our network of qualified tutors
              </p>
            </div>
            
            {/* Search Filters */}
            <div className="bg-white p-6 rounded-lg shadow-sm max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Search tutors or subjects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">All Levels</option>
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                
                <button className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold">
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredTutors.length} Tutors Found
              </h2>
              <select className="px-4 py-2 border border-gray-300 rounded-lg">
                <option>Sort by Rating</option>
                <option>Sort by Price (Low to High)</option>
                <option>Sort by Price (High to Low)</option>
                <option>Sort by Experience</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutors.map(tutor => (
                <div key={tutor.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                        <span className="text-xl font-bold text-gray-600">
                          {tutor.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{tutor.name}</h3>
                        <p className="text-amber-600 font-medium">{tutor.subject}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-600 text-sm">{tutor.rating} ({tutor.reviews} reviews)</span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-4">
                      <p>Level: {tutor.level}</p>
                      <p>Experience: {tutor.experience}</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-900">${tutor.price}/hr</span>
                      <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                        Book Session
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredTutors.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No tutors found matching your criteria.</p>
                <p className="text-gray-400 mt-2">Try adjusting your search filters.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}