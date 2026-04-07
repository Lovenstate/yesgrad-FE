
'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authAPI } from '@/lib/api';
import Toast from '@/components/ui/toast';
import Link from 'next/link';


export default function ResetPassword() {

    const searchParams = useSearchParams();
    const router = useRouter();
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{message: string; type: 'success' | 'error'; isVisible: boolean}>({
    message: '', type: 'success', isVisible: false
  });
  const [validationError, setValidationError] = useState('');
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
        setToken(tokenFromUrl);
        verifyToken(tokenFromUrl);
    } else {
        setToast({
        message:  'Invalid link. Please try again.',
        type: 'error',
        isVisible: true
      });
    }
  }, [searchParams]);

  const validatePassword = (password: string, confirmPassword: string): string => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 6 characters';
    if (password !== confirmPassword) return 'Passwords do not match';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return 'Password must contain uppercase, lowercase and number';
    return '';
  };

  const verifyToken = async (token: string) => {
    try {
        const response = await authAPI.verifyResetToken(token);
        setTokenValid(response.data);
    } catch (error) {
        setToast({
        message: 'Invalid or expired token. Please request a new password reset link.',
        type: 'error',
        isVisible: true
      });
    } finally {
        setValidatingToken(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validatePassword(newPassword, confirmPassword);

    if (error) {
        setValidationError(error);
        return;
    }

    setLoading(true);
    setValidationError('');

    try {
        await authAPI.resetPassword({token, newPassword});
        setToast({
            message: 'Password updated successfully!',
            type: 'success',
            isVisible: true
        });
        setTimeout(() => router.push('/auth/login'), 2000);
    } catch (error) {
        setToast({
            message:'Failed to update password. Please try again.',
            type: 'error',
            isVisible: true
        });
    } finally {
        setLoading(false);
    }

  }

  if (validatingToken) {
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
            <div className="mx-auto h-12 w-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Verifying Token</h2>
            <p className="mt-2 text-sm text-gray-600">Please wait while we verify your reset link...</p>
          </div>
        </div>
      </div>
      </>
    );

  }

  if (!tokenValid) {
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
            <h2 className="text-2xl font-bold text-gray-900">Invalid Link</h2>
            <p className="mt-2 text-sm text-gray-600">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <button
              onClick={() => router.push('/auth/forgot-password')}
              className="mt-4 text-sm text-amber-600 hover:text-amber-500 font-medium"
            >
              Request new reset link →
            </button>
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
            <h2 className="text-3xl font-bold text-gray-900">Reset your password</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your new password below
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm ${
                      validationError ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm ${
                      validationError ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Confirm new password"
                  />
                  {validationError && (
                    <p className="mt-1 text-xs text-red-600">{validationError}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || !newPassword || !confirmPassword}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
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