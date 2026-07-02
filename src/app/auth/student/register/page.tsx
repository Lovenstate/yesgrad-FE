'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authAPI } from '@/lib/api';

export default function StudentRegister() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', zipCode: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    try {
      await authAPI.register({ firstName: formData.firstName, lastName: formData.lastName, email: formData.email, zipCode: formData.zipCode, password: formData.password, role: 'STUDENT' });
      window.location.href = '/student/onboarding';
    } catch {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClass = "w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#1a237e]">Join as Student</h1>
          <p className="text-gray-600 mt-2 text-sm">Start your learning journey today</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
              <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
              <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" name="password" required value={formData.password} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">ZIP Code</label>
            <input type="text" name="zipCode" required value={formData.zipCode} onChange={handleChange} className={inputClass} />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#1a237e] text-white py-3 px-4 rounded-lg hover:bg-blue-900 transition-colors font-semibold disabled:opacity-50 text-sm">
            {loading ? 'Creating Account...' : 'Create Student Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">Already have an account?{' '}
            <Link href="/auth/login" className="text-[#1a237e] hover:text-blue-900 font-medium">Sign in</Link>
          </p>
        </div>
        <div className="mt-4 text-center">
          <Link href="/" className="text-gray-400 hover:text-gray-600 text-xs">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
