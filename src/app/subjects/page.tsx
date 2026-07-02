import Link from 'next/link';

const subjects = [
  { name: 'Mathematics', description: 'Algebra, Calculus, Geometry, Statistics', tutors: 245, icon: '📊' },
  { name: 'Science', description: 'Physics, Chemistry, Biology, Earth Science', tutors: 189, icon: '🔬' },
  { name: 'English', description: 'Literature, Writing, Grammar, Reading', tutors: 156, icon: '📚' },
  { name: 'History', description: 'World History, US History, Government', tutors: 98, icon: '🏛️' },
  { name: 'Computer Science', description: 'Programming, Web Development, Data Science', tutors: 134, icon: '💻' },
  { name: 'Languages', description: 'Spanish, French, German, Mandarin', tutors: 167, icon: '🌍' },
  { name: 'Test Preparation', description: 'SAT, ACT, GRE, GMAT, TOEFL', tutors: 89, icon: '📝' },
  { name: 'Music', description: 'Piano, Guitar, Voice, Music Theory', tutors: 76, icon: '🎵' },
  { name: 'Art & Design', description: 'Drawing, Painting, Digital Art, Photography', tutors: 54, icon: '🎨' },
  { name: 'Business', description: 'Economics, Finance, Marketing, Management', tutors: 112, icon: '💼' },
  { name: 'Engineering', description: 'Mechanical, Electrical, Civil, Software', tutors: 87, icon: '⚙️' },
  { name: 'Health Sciences', description: 'Anatomy, Physiology, Nursing, Medicine', tutors: 65, icon: '🏥' },
];

export default function Subjects() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a237e] mb-4">Browse All Subjects</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find expert tutors in any subject. From elementary to advanced levels, qualified instructors are ready to help you succeed.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {subjects.map((subject) => (
                <Link
                  key={subject.name}
                  href={`/find-tutor?subject=${encodeURIComponent(subject.name)}`}
                  className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 hover:-translate-y-1 p-6 group"
                >
                  <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-2xl group-hover:bg-blue-100 transition-colors">
                    {subject.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-[#1a237e] mb-1">{subject.name}</h3>
                  <p className="text-gray-500 text-sm mb-3">{subject.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{subject.tutors} tutors</span>
                    <svg className="w-4 h-4 text-[#1a237e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#1a237e] mb-8 text-center">Most Popular Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: '📊', title: 'STEM Subjects', desc: 'Mathematics, Science, Engineering, and Technology', href: '/find-tutor?category=stem' },
                { icon: '📚', title: 'Language Arts', desc: 'English, Literature, Writing, and Foreign Languages', href: '/find-tutor?category=languages' },
                { icon: '📝', title: 'Test Prep', desc: 'SAT, ACT, GRE, GMAT, and other standardized tests', href: '/find-tutor?category=test-prep' },
              ].map((cat) => (
                <div key={cat.title} className="text-center bg-white rounded-xl p-6 border border-gray-200">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">{cat.icon}</div>
                  <h3 className="text-lg font-semibold text-[#1a237e] mb-2">{cat.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{cat.desc}</p>
                  <Link href={cat.href} className="text-[#1a237e] hover:text-blue-900 font-medium text-sm inline-flex items-center gap-1">
                    Find Tutors <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#1a237e] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Can't Find Your Subject?</h2>
            <p className="text-blue-200 mb-8 max-w-2xl mx-auto">We're constantly adding new subjects and tutors. Contact us to request a specific subject.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-[#f5a623] text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">Request a Subject</Link>
              <Link href="/become-tutor" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#1a237e] transition-colors">Become a Tutor</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
