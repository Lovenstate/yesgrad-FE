import Link from 'next/link';

export default function Pricing() {
  const plans = [
    {
      name: 'Basic',
      price: 29,
      period: 'month',
      description: 'Perfect for occasional tutoring sessions',
      features: [
        '4 tutoring sessions per month',
        'Access to basic subjects',
        'Email support',
        'Session recordings',
        'Basic progress tracking'
      ],
      popular: false,
      buttonText: 'Get Started',
      buttonStyle: 'border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white'
    },
    {
      name: 'Premium',
      price: 59,
      period: 'month',
      description: 'Most popular choice for regular learners',
      features: [
        '8 tutoring sessions per month',
        'Access to all subjects',
        'Priority support',
        'Session recordings',
        'Advanced progress tracking',
        'Homework help',
        'Study materials included'
      ],
      popular: true,
      buttonText: 'Start Premium',
      buttonStyle: 'bg-amber-600 text-white hover:bg-amber-700'
    },
    {
      name: 'Unlimited',
      price: 99,
      period: 'month',
      description: 'For intensive learning and exam preparation',
      features: [
        'Unlimited tutoring sessions',
        'Access to all subjects',
        '24/7 priority support',
        'Session recordings',
        'Advanced progress tracking',
        'Homework help',
        'Study materials included',
        'Test prep resources',
        'Personal learning coordinator'
      ],
      popular: false,
      buttonText: 'Go Unlimited',
      buttonStyle: 'border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white'
    }
  ];

  const payAsYouGo = [
    { subject: 'Elementary (K-5)', price: 25, description: 'Basic subjects for young learners' },
    { subject: 'Middle School (6-8)', price: 35, description: 'Core subjects with increased complexity' },
    { subject: 'High School (9-12)', price: 45, description: 'Advanced subjects and test preparation' },
    { subject: 'College/University', price: 60, description: 'Specialized subjects and research help' },
    { subject: 'Professional/Certification', price: 75, description: 'Career-focused and certification prep' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that works best for your learning goals. No hidden fees, cancel anytime.
            </p>
          </div>
        </section>

        {/* Subscription Plans */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Monthly Subscription Plans
              </h2>
              <p className="text-xl text-gray-600">
                Get the best value with our subscription plans
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative bg-white rounded-lg shadow-sm border-2 ${
                    plan.popular ? 'border-amber-600' : 'border-gray-200'
                  } hover:shadow-md transition-shadow`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-amber-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                        <span className="text-gray-600">/{plan.period}</span>
                      </div>
                      <p className="text-gray-600">{plan.description}</p>
                    </div>
                    
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${plan.buttonStyle}`}>
                      {plan.buttonText}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pay-as-you-go */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Pay-As-You-Go Rates
              </h2>
              <p className="text-xl text-gray-600">
                Prefer flexibility? Pay per session with no commitment
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Hourly Rates by Level</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {payAsYouGo.map((item, index) => (
                    <div key={index} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{item.subject}</h4>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-gray-900">${item.price}</span>
                        <span className="text-gray-600">/hour</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I cancel my subscription anytime?
                </h3>
                <p className="text-gray-600">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What happens if I don't use all my sessions?
                </h3>
                <p className="text-gray-600">
                  Unused sessions from your monthly plan will roll over to the next month, up to a maximum of 2 months worth of sessions.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Do you offer refunds?
                </h3>
                <p className="text-gray-600">
                  We offer a 7-day money-back guarantee for new subscribers. If you're not satisfied, we'll refund your first payment.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I switch between plans?
                </h3>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at your next billing cycle.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-amber-600 to-orange-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students who have improved their grades with YesGrad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/find-tutor" 
                className="bg-white text-amber-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Find a Tutor
              </Link>
              <Link 
                href="/contact" 
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-amber-600 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
      </main>
      
    </div>
  );
}