'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactItems = [
    { icon: '✉️', bg: 'bg-blue-50', label: 'Email', lines: ['support@yesgrad.com', 'partnerships@yesgrad.com'] },
    { icon: '📞', bg: 'bg-blue-50', label: 'Phone', lines: ['+1 (555) 123-4567', 'Mon-Fri 9AM-6PM EST'] },
    { icon: '📍', bg: 'bg-blue-50', label: 'Office', lines: ['123 Education Street', 'Learning City, LC 12345'] },
    { icon: '🕐', bg: 'bg-blue-50', label: 'Hours', lines: ['Mon–Fri: 9:00 AM – 6:00 PM', 'Saturday: 10:00 AM – 4:00 PM'] },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a237e] mb-4">Get in Touch</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Have questions? We're here to help. Reach out and we'll get back to you as soon as possible.</p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold text-[#1a237e] mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                    <select name="subject" value={formData.subject} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="tutor">Become a Tutor</option>
                      <option value="technical">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                    <textarea name="message" rows={5} value={formData.message} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
                  </div>
                  <button type="submit" className="w-full bg-[#1a237e] text-white py-3 px-6 rounded-lg hover:bg-blue-900 transition-colors font-semibold text-sm">
                    Send Message
                  </button>
                </form>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#1a237e] mb-6">Contact Information</h2>
                <div className="space-y-5">
                  {contactItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className={`w-11 h-11 ${item.bg} rounded-xl flex items-center justify-center text-xl shrink-0`}>{item.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{item.label}</h3>
                        {item.lines.map((line, j) => (
                          <p key={j} className="text-gray-600 text-sm">{line}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                  <h3 className="font-semibold text-[#1a237e] mb-1">Looking for Quick Answers?</h3>
                  <p className="text-gray-600 text-sm mb-3">Check out our FAQ section for immediate answers to common questions.</p>
                  <a href="/faq" className="text-[#1a237e] hover:text-blue-900 font-medium text-sm inline-flex items-center gap-1">
                    Visit FAQ <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
