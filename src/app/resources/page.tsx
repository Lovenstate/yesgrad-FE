import Link from 'next/link';

export default function Resources() {
  const resourceCategories = [
    {
      title: 'Study Guides',
      description: 'Comprehensive guides for all subjects and grade levels',
      icon: '📚',
      resources: ['Math Study Guides', 'Science Notes', 'History Timelines', 'Language Arts Worksheets']
    },
    {
      title: 'Practice Tests',
      description: 'Mock exams and practice questions to test your knowledge',
      icon: '📝',
      resources: ['SAT Practice Tests', 'ACT Mock Exams', 'Subject-Specific Quizzes', 'Timed Practice Sessions']
    },
    {
      title: 'Video Tutorials',
      description: 'Free educational videos covering key concepts',
      icon: '🎥',
      resources: ['Math Concepts', 'Science Experiments', 'Language Learning', 'Test-Taking Strategies']
    },
    {
      title: 'Learning Tools',
      description: 'Interactive tools and calculators to aid your studies',
      icon: '🛠️',
      resources: ['Graphing Calculator', 'Formula Sheets', 'Flashcard Maker', 'Progress Tracker']
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Free Learning Resources
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access our collection of free study materials, practice tests, and educational tools to supplement your learning.
            </p>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {resourceCategories.map((category, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-8">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{category.title}</h3>
                    <p className="text-gray-600 mb-6">{category.description}</p>
                    <ul className="space-y-2 mb-6">
                      {category.resources.map((resource, idx) => (
                        <li key={idx} className="flex items-center text-gray-700">
                          <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          {resource}
                        </li>
                      ))}
                    </ul>
                    <Link 
                      href={`/resources/${category.title.toLowerCase().replace(' ', '-')}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Explore {category.title} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Resources */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Resources
              </h2>
              <p className="text-xl text-gray-600">
                Our most popular free resources to help you succeed
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">SAT Prep Guide</h3>
                <p className="text-gray-600 mb-4">Complete preparation guide with practice questions and strategies.</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium">Download PDF</button>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Math Formula Sheet</h3>
                <p className="text-gray-600 mb-4">Essential formulas for algebra, geometry, and calculus.</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium">Download PDF</button>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Study Planner</h3>
                <p className="text-gray-600 mb-4">Organize your study schedule and track your progress.</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium">Download PDF</button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Need Personalized Help?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              While our free resources are great for self-study, sometimes you need one-on-one guidance.
            </p>
            <Link 
              href="/find-tutor" 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Find a Tutor
            </Link>
          </div>
        </section>
      </main>
      
    </div>
  );
}