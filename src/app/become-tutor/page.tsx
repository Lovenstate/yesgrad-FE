import Link from 'next/link';

const benefits = [
  { icon: '💰', title: 'Competitive Earnings', description: 'Earn $25–$75+ per hour based on your expertise and experience' },
  { icon: '⏰', title: 'Flexible Schedule', description: 'Set your own hours and work when it\'s convenient for you' },
  { icon: '🌍', title: 'Work from Anywhere', description: 'Teach students from around the world from the comfort of your home' },
  { icon: '📈', title: 'Grow Your Impact', description: 'Help students achieve their academic goals and make a real difference' },
  { icon: '🛠️', title: 'Full Support', description: 'Access to teaching tools, resources, and a dedicated support team' },
  { icon: '👥', title: 'Join Community', description: 'Connect with other educators and share best practices' },
];

const steps = [
  { number: '1', title: 'Apply Online', description: 'Complete our application form with your qualifications and experience' },
  { number: '2', title: 'Interview Process', description: 'Participate in a video interview to assess your teaching skills' },
  { number: '3', title: 'Background Check', description: 'Complete a background check and provide references' },
  { number: '4', title: 'Start Teaching', description: 'Set up your profile and begin connecting with students' },
];

export default function BecomeTutor() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#1a237e] mb-6">
              Become a <span className="text-[#f5a623]">Tutor</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Share your knowledge, inspire students, and earn competitive income while making a meaningful impact on education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/tutor/register" className="bg-[#1a237e] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-900 transition-colors">Apply Now</Link>
              <Link href="#learn-more" className="border-2 border-[#1a237e] text-[#1a237e] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#1a237e] hover:text-white transition-colors">Learn More</Link>
            </div>
          </div>
        </section>

        <section id="learn-more" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[#1a237e] mb-4 text-center">Why Teach with YesGrad?</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Join thousands of educators who have found success and fulfillment on our platform.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-lg font-semibold text-[#1a237e] mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[#1a237e] mb-4 text-center">Tutor Requirements</h2>
            <p className="text-gray-600 text-center mb-8">We maintain high standards to ensure the best learning experience for our students.</p>
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <ul className="space-y-4">
                {["Bachelor's degree or higher in your subject area", "Minimum 2 years of teaching or tutoring experience", "Strong communication skills and patience", "Reliable internet connection and quiet teaching space", "Passion for helping students succeed"].map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[#1a237e] mb-4 text-center">How to Get Started</h2>
            <p className="text-gray-600 text-center mb-12">Our simple 4-step process to become a YesGrad tutor.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step) => (
                <div key={step.number} className="text-center">
                  <div className="w-14 h-14 bg-[#1a237e] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">{step.number}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#1a237e] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Earning Potential</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-8">
              {[
                { range: '$25–$35', level: 'Elementary & Middle School' },
                { range: '$35–$55', level: 'High School & Test Prep' },
                { range: '$55–$75+', level: 'College & Professional' },
              ].map((e) => (
                <div key={e.level}>
                  <div className="text-4xl font-bold text-[#f5a623] mb-2">{e.range}</div>
                  <div className="text-blue-200 text-sm">{e.level}</div>
                </div>
              ))}
            </div>
            <p className="text-blue-200 max-w-2xl mx-auto text-sm mb-10">Top tutors earn over $3,000 per month. Your earnings depend on expertise, availability, and student ratings.</p>
            <Link href="/auth/tutor/register" className="bg-[#f5a623] text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-500 transition-colors inline-block">
              Start Your Application
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
