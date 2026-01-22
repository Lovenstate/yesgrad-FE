'use client';

import { useEffect, useState } from "react";
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import Toast from '@/components/ui/toast';

export default function ForgotPassword() {
  const [ipAddress, setIpAddress]  = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error'; isVisible: boolean}>({
    message: '', type: 'success', isVisible: false
  });
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const fetchIP = async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            console.log("Ip: ", data.ip);
            setIpAddress(data.ip);
        } catch (err) {
        console.error(err);
        }
    };

    fetchIP();

  }, [])

  const validateEmail = (email: string): string => {
    if (!email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateEmail(email);
    if (error) {
      setValidationError(error);
      return;
    }
    
    setLoading(true);
    setValidationError('');
    
    try {
      await authAPI.forgotPassword({ email, ipAddress });
      setEmailSent(true);
      setToast({
        message: 'Password reset email sent successfully!',
        type: 'success',
        isVisible: true
      });
    } catch (error: any) {
      setToast({
        message: error.message || 'Failed to send reset email. Please try again.',
        type: 'error',
        isVisible: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (validationError) {
      setValidationError('');
    }
  };

  if (emailSent) {
    return (
      <>
        <Toast 
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => setToast(prev => ({...prev, isVisible: false}))}
        />
        
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900">Check your email</h2>
              <p className="mt-2 text-sm text-gray-600">
                We've sent a password reset link to <span className="font-medium">{email}</span>
              </p>
            </div>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Click the link in the email to reset your password. If you don't see the email, check your spam folder.
                </p>
                
                <div className="flex items-center justify-between">
                  <Link 
                    href="/auth/login" 
                    className="text-sm text-amber-600 hover:text-amber-500 font-medium"
                  >
                    ← Back to login
                  </Link>
                  
                  <button
                    onClick={() => {
                      setEmailSent(false);
                      setEmail('');
                    }}
                    className="text-sm text-gray-600 hover:text-gray-500"
                  >
                    Try different email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({...prev, isVisible: false}))}
      />
      
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Forgot your password?</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm ${
                      validationError ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {validationError && (
                    <p className="mt-1 text-xs text-red-600">{validationError}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
              </div>

              <div className="text-center">
                <Link 
                  href="/auth/login" 
                  className="text-sm text-amber-600 hover:text-amber-500 font-medium"
                >
                  ← Back to login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}