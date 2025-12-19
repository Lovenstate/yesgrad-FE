import Link from 'next/link';

export default function Subjects() {
  const subjects = [
    {
      name: 'Mathematics',
      description: 'Algebra, Calculus, Geometry, Statistics',
      tutors: 245,
      icon: '📊',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      name: 'Science',
      description: 'Physics, Chemistry, Biology, Earth Science',
      tutors: 189,
      icon: '🔬',
      color: 'bg-green-100 text-green-600'
    },
    {
      name: 'English',
      description: 'Literature, Writing, Grammar, Reading',
      tutors: 156,
      icon: '📚',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      name: 'History',
      description: 'World History, US History, Government',
      tutors: 98,
      icon: '🏛️',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      name: 'Computer Science',
      description: 'Programming, Web Development, Data Science',
      tutors: 134,
      icon: '💻',
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      name: 'Languages',
      description: 'Spanish, French, German, Mandarin',
      tutors: 167,
      icon: '🌍',
      color: 'bg-red-100 text-red-600'
    },
    {
      name: 'Test Preparation',
      description: 'SAT, ACT, GRE, GMAT, TOEFL',
      tutors: 89,
      icon: '📝',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      name: 'Music',
      description: 'Piano, Guitar, Voice, Music Theory',
      tutors: 76,
      icon: '🎵',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      name: 'Art & Design',
      description: 'Drawing, Painting, Digital Art, Photography',
      tutors: 54,
      icon: '🎨',
      color: 'bg-teal-100 text-teal-600'
    },
    {
      name: 'Business',
      description: 'Economics, Finance, Marketing, Management',
      tutors: 112,
      icon: '💼',
      color: 'bg-gray-100 text-gray-600'
    },
    {
      name: 'Engineering',
      description: 'Mechanical, Electrical, Civil, Software',
      tutors: 87,
      icon: '⚙️',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      name: 'Health Sciences',
      description: 'Anatomy, Physiology, Nursing, Medicine',
      tutors: 65,
      icon: '🏥',
      color: 'bg-green-100 text-green-600'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Browse All Subjects
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find expert tutors in any subject. From elementary to advanced levels, we have qualified instructors ready to help you succeed.
            </p>
          </div>
        </section>

        {/* Subjects Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {subjects.map((subject) => (
                <Link
                  key={subject.name}
                  href={`/find-tutor?subject=${encodeURIComponent(subject.name)}`}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className={`w-16 h-16 ${subject.color} rounded-full flex items-center justify-center mb-4 text-2xl`}>
                      {subject.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {subject.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {subject.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {subject.tutors} tutors available
                      </span>
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Categories */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Most Popular Categories
              </h2>
              <p className="text-xl text-gray-600">
                These subjects have the highest demand among students
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  📊
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">STEM Subjects</h3>
                <p className="text-gray-600">Mathematics, Science, Engineering, and Technology</p>
                <Link href="/find-tutor?category=stem" className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block">
                  Find STEM Tutors →
                </Link>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  📚
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Language Arts</h3>
                <p className="text-gray-600">English, Literature, Writing, and Foreign Languages</p>
                <Link href="/find-tutor?category=languages" className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block">
                  Find Language Tutors →
                </Link>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  📝
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Test Prep</h3>
                <p className="text-gray-600">SAT, ACT, GRE, GMAT, and other standardized tests</p>
                <Link href="/find-tutor?category=test-prep" className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block">
                  Find Test Prep Tutors →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Can't Find Your Subject?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              We're constantly adding new subjects and tutors. Contact us to request a specific subject or tutor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Request a Subject
              </Link>
              <Link 
                href="/become-tutor" 
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Become a Tutor
              </Link>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}