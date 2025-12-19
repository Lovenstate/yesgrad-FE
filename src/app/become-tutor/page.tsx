import Link from 'next/link';

export default function BecomeTutor() {
  const benefits = [
    {
      icon: '💰',
      title: 'Competitive Earnings',
      description: 'Earn $25-$75+ per hour based on your expertise and experience'
    },
    {
      icon: '⏰',
      title: 'Flexible Schedule',
      description: 'Set your own hours and work when its convenient for you'
    },
    {
      icon: '🌍',
      title: 'Work from Anywhere',
      description: 'Teach students from around the world from the comfort of your home'
    },
    {
      icon: '📈',
      title: 'Grow Your Impact',
      description: 'Help students achieve their academic goals and make a real difference'
    },
    {
      icon: '🛠️',
      title: 'Full Support',
      description: 'Access to teaching tools, resources, and dedicated support team'
    },
    {
      icon: '👥',
      title: 'Join Community',
      description: 'Connect with other educators and share best practices'
    }
  ];

  const requirements = [
    'Bachelor\'s degree or higher in your subject area',
    'Minimum 2 years of teaching or tutoring experience',
    'Strong communication skills and patience',
    'Reliable internet connection and quiet teaching space',
    'Passion for helping students succeed'
  ];

  const steps = [
    {
      number: '1',
      title: 'Apply Online',
      description: 'Complete our application form with your qualifications and experience'
    },
    {
      number: '2',
      title: 'Interview Process',
      description: 'Participate in a video interview to assess your teaching skills'
    },
    {
      number: '3',
      title: 'Background Check',
      description: 'Complete a background check and provide references'
    },
    {
      number: '4',
      title: 'Start Teaching',
      description: 'Set up your profile and begin connecting with students'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Become a
                <span className="text-blue-600"> Tutor</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Share your knowledge, inspire students, and earn competitive income while making a meaningful impact on education.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="#apply" 
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Apply Now
                </Link>
                <Link 
                  href="#learn-more" 
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="learn-more" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Teach with YesGrad?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join thousands of educators who have found success and fulfillment teaching on our platform.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center p-6">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Tutor Requirements
                </h2>
                <p className="text-xl text-gray-600">
                  We maintain high standards to ensure the best learning experience for our students
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-8">
                <ul className="space-y-4">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-lg">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How to Get Started
              </h2>
              <p className="text-xl text-gray-600">
                Our simple 4-step process to become a YesGrad tutor
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Earnings Section */}
        <section className="bg-blue-600 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Earning Potential
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div>
                  <div className="text-4xl font-bold mb-2">$25-35</div>
                  <div className="text-blue-100">Elementary & Middle School</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">$35-55</div>
                  <div className="text-blue-100">High School & Test Prep</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">$55-75+</div>
                  <div className="text-blue-100">College & Professional</div>
                </div>
              </div>
              <p className="text-blue-100 mt-8 max-w-2xl mx-auto">
                Top tutors earn over $3,000 per month. Your earnings depend on your expertise, availability, and student ratings.
              </p>
            </div>
          </div>
        </section>

        {/* Application CTA */}
        <section id="apply" className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Start Teaching?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join our community of educators and start making a difference today.
            </p>
            
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Application Form
              </h3>
              <p className="text-gray-600 mb-6">
                Click the button below to access our tutor application form. The process takes about 10-15 minutes to complete.
              </p>
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
                Start Application
              </button>
              <p className="text-sm text-gray-500 mt-4">
                Have questions? <Link href="/contact" className="text-blue-600 hover:text-blue-700">Contact our team</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}