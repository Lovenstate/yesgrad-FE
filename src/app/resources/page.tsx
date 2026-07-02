import Link from 'next/link';

const resourceCategories = [
  { title: 'Study Guides', description: 'Comprehensive guides for all subjects and grade levels', icon: '📚', resources: ['Math Study Guides', 'Science Notes', 'History Timelines', 'Language Arts Worksheets'] },
  { title: 'Practice Tests', description: 'Mock exams and practice questions to test your knowledge', icon: '📝', resources: ['SAT Practice Tests', 'ACT Mock Exams', 'Subject-Specific Quizzes', 'Timed Practice Sessions'] },
  { title: 'Video Tutorials', description: 'Free educational videos covering key concepts', icon: '🎥', resources: ['Math Concepts', 'Science Experiments', 'Language Learning', 'Test-Taking Strategies'] },
  { title: 'Learning Tools', description: 'Interactive tools and calculators to aid your studies', icon: '🛠️', resources: ['Graphing Calculator', 'Formula Sheets', 'Flashcard Maker', 'Progress Tracker'] },
];

const featured = [
  { title: 'SAT Prep Guide', desc: 'Complete preparation guide with practice questions and strategies.' },
  { title: 'Math Formula Sheet', desc: 'Essential formulas for algebra, geometry, and calculus.' },
  { title: 'Study Planner', desc: 'Organize your study schedule and track your progress.' },
];

export default function Resources() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a237e] mb-4">Free Learning Resources</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Access our collection of free study materials, practice tests, and educational tools to supplement your learning.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resourceCategories.map((category, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow p-8">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-semibold text-[#1a237e] mb-2">{category.title}</h3>
                  <p className="text-gray-600 text-sm mb-5">{category.description}</p>
                  <ul className="space-y-2 mb-5">
                    {category.resources.map((resource, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-4 h-4 text-[#1a237e] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        {resource}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/resources/${category.title.toLowerCase().replace(' ', '-')}`} className="text-[#1a237e] hover:text-blue-900 font-medium text-sm inline-flex items-center gap-1">
                    Explore {category.title} <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#1a237e] mb-8 text-center">Featured Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{item.desc}</p>
                  <button className="text-[#1a237e] hover:text-blue-900 font-medium text-sm inline-flex items-center gap-1">
                    Download PDF <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#1a237e] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Need Personalized Help?</h2>
            <p className="text-blue-200 mb-8 max-w-2xl mx-auto">While our free resources are great for self-study, sometimes you need one-on-one guidance.</p>
            <Link href="/find-tutor" className="bg-[#f5a623] text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors inline-block">Find a Tutor</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
