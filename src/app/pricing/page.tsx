import Link from 'next/link';

const plans = [
  {
    name: 'Basic', price: 29, description: 'Perfect for occasional tutoring sessions',
    features: ['4 tutoring sessions per month', 'Access to basic subjects', 'Email support', 'Session recordings', 'Basic progress tracking'],
    popular: false,
  },
  {
    name: 'Premium', price: 59, description: 'Most popular choice for regular learners',
    features: ['8 tutoring sessions per month', 'Access to all subjects', 'Priority support', 'Session recordings', 'Advanced progress tracking', 'Homework help', 'Study materials included'],
    popular: true,
  },
  {
    name: 'Unlimited', price: 99, description: 'For intensive learning and exam preparation',
    features: ['Unlimited tutoring sessions', 'Access to all subjects', '24/7 priority support', 'Session recordings', 'Advanced progress tracking', 'Homework help', 'Study materials included', 'Test prep resources', 'Personal learning coordinator'],
    popular: false,
  },
];

const payAsYouGo = [
  { subject: 'Elementary (K-5)', price: 25, description: 'Basic subjects for young learners' },
  { subject: 'Middle School (6-8)', price: 35, description: 'Core subjects with increased complexity' },
  { subject: 'High School (9-12)', price: 45, description: 'Advanced subjects and test preparation' },
  { subject: 'College/University', price: 60, description: 'Specialized subjects and research help' },
  { subject: 'Professional/Certification', price: 75, description: 'Career-focused and certification prep' },
];

const faqs = [
  { q: 'Can I cancel my subscription anytime?', a: "Yes, you can cancel at any time. You'll continue to have access until the end of your current billing period." },
  { q: "What happens if I don't use all my sessions?", a: 'Unused sessions roll over to the next month, up to a maximum of 2 months worth of sessions.' },
  { q: 'Do you offer refunds?', a: "We offer a 7-day money-back guarantee for new subscribers. If you're not satisfied, we'll refund your first payment." },
  { q: 'Can I switch between plans?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.' },
];

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a237e] mb-4">Simple, Transparent Pricing</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Choose the plan that works best for your learning goals. No hidden fees, cancel anytime.</p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#1a237e] mb-10 text-center">Monthly Subscription Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div key={plan.name} className={`relative bg-white rounded-xl border-2 hover:shadow-md transition-shadow ${plan.popular ? 'border-[#1a237e]' : 'border-gray-200'}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-[#f5a623] text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
                    </div>
                  )}
                  <div className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-[#1a237e] mb-2">{plan.name}</h3>
                      <div className="mb-3">
                        <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                        <span className="text-gray-500">/month</span>
                      </div>
                      <p className="text-gray-600 text-sm">{plan.description}</p>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full py-3 rounded-lg font-semibold transition-colors text-sm ${plan.popular ? 'bg-[#1a237e] text-white hover:bg-blue-900' : 'border-2 border-[#1a237e] text-[#1a237e] hover:bg-[#1a237e] hover:text-white'}`}>
                      {plan.popular ? 'Start Premium' : plan.name === 'Basic' ? 'Get Started' : 'Go Unlimited'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#1a237e] mb-3 text-center">Pay-As-You-Go Rates</h2>
            <p className="text-gray-600 text-center mb-8">Prefer flexibility? Pay per session with no commitment.</p>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b">
                <h3 className="font-semibold text-[#1a237e]">Hourly Rates by Level</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {payAsYouGo.map((item, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.subject}</h4>
                      <p className="text-gray-500 text-sm">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-[#1a237e]">${item.price}</span>
                      <span className="text-gray-500 text-sm">/hr</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#1a237e] mb-10 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-gray-100 pb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#1a237e] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Learning?</h2>
            <p className="text-blue-200 mb-8 max-w-2xl mx-auto">Join thousands of students who have improved their grades with YesGrad.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/find-tutor" className="bg-[#f5a623] text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">Find a Tutor</Link>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#1a237e] transition-colors">Contact Sales</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
