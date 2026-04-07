'use client';

import { useState, useEffect } from 'react';
import { useSettingsQuery, useUpdateSettingsMutation  } from '@/hooks/use-settings';
import { TutorCompleteSettings } from '@/types/api';
import { FormSkeleton } from '@/components/ui/skeletons';
import Toast from '@/components/ui/toast';
import PasswordInput from '@/components/ui/password-input';

type Section = 'basic' | 'preferences' | 'notifications' | 'payment' | 'password';


export default function TutorSettings() {
  const [activeSection, setActiveSection] = useState<Section>('basic');
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error' | 'warning'; isVisible: boolean}>(
    {message: '', type: 'success', isVisible: false}
  );
  const [formData, setFormData] = useState<TutorCompleteSettings | null>(null);
  
  const { data: settings, isLoading, error } = useSettingsQuery();
  const updateMutation = useUpdateSettingsMutation();

  // Helper function to format response time for display
  const formatResponseTime = (hours: number): string => {
    if (hours === 1) return 'Within 1 hour';
    return `Within ${hours} hours`;
  };

  // Validation functions
  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
        return '';
      case 'phone':
        if (value && !/^[\d\s\-\(\)\+]+$/.test(value)) return 'Invalid phone format';
        return '';
      case 'bio':
        if (value && value.length > 500) return 'Bio must be 500 characters or less';
        return '';
      case 'currentPassword':
        if (activeSection === 'password' && !value) return 'Current password is required';
        return '';
      case 'newPassword':
        if (activeSection === 'password') {
          if (!value) return 'New password is required';
          if (value.length < 8) return 'Password must be at least 8 characters';
          if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(value)) {
            return 'Password must contain uppercase, lowercase, number, and special character';
          }
        }
        return '';
      case 'confirmPassword':
        if (activeSection === 'password') {
          if (!value) return 'Please confirm your password';
          if (formData?.newPassword && value !== formData.newPassword) {
            return 'Passwords do not match';
          }
        }
        return '';
      default:
        return '';
    }
  };

  useEffect(() => {
    if (settings && !formData) {
      setFormData(settings);
    }
  }, [settings, formData]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!formData) return;

    const { name, value, type } = e.target;
    
    // Safe type checking instead of unsafe casting
    let inputValue: string | boolean | number = value;
    if (type === 'checkbox') {
      const checkboxElement = e.target as HTMLInputElement;
      inputValue = checkboxElement.checked;
    } else if (name === 'responseTime') {
      // Convert string to number for responseTime
      inputValue = parseInt(value, 10);
    }

    // Update form data
    setFormData(prev => prev ? ({
      ...prev,
      [name]: inputValue
    }) : null);
    
    // Validate field and update errors
    const error = validateField(name, inputValue);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    // Also validate confirmPassword when newPassword changes
    if (name === 'newPassword' && formData.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      setValidationErrors(prev => ({
        ...prev,
        confirmPassword: confirmError
      }));
    }
    
    setHasChanges(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    // Validate all fields before submission
    const errors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof TutorCompleteSettings]);
      if (error) errors[key] = error;
    });
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setToast({
        message: 'Please fix the validation errors before saving',
        type: 'warning',
        isVisible: true
      });
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    
    try {
      await updateMutation.mutateAsync(formData);
      setHasChanges(false);
      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Clear password fields after successful update
      if (activeSection === 'password') {
        setFormData(prev => prev ? ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }) : null);
        setValidationErrors(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
    } catch (error: any) {
      console.error('Failed to save settings:', error);
      
      // Extract error message from API response
      let errorMessage = 'Failed to save settings. Please try again.';
      
      // Check if it's our custom error with response data
      if (error?.response?.data) {
        const apiResponse = error.response.data;
        errorMessage = apiResponse.message || apiResponse.error?.message || errorMessage;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setToast({
        message: errorMessage,
        type: 'error',
        isVisible: true
      });
      setErrorMessage(errorMessage);
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  if(isLoading) return <FormSkeleton />;
  if(error) return <div>Error loading settings.</div>;
  if (!formData) return null;

  return (
    <>
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({...prev, isVisible: false}))}
      />
      
      <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account and tutoring preferences</p>
          </div>
          {hasChanges && (
            <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              Unsaved changes
            </span>
          )}
          {errorMessage && (
            <span className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
              {errorMessage}
            </span>
          )}
          {successMessage && (
            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              {successMessage}
            </span>
          )}
        </div>
        
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-56 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-20">
              {(['basic', 'preferences', 'notifications', 'payment', 'password'] as Section[]).map(section => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`w-full text-left px-5 py-3.5 transition-all border-l-4 ${
                    activeSection === section ? 'bg-amber-50 text-amber-700 font-semibold border-amber-600' : 'text-gray-700 hover:bg-gray-50 border-transparent'
                  }`}
                >
                  {section === 'basic' && 'Basic Information'}
                  {section === 'preferences' && 'Tutoring Preferences'}
                  {section === 'notifications' && 'Notifications'}
                  {section === 'payment' && 'Payment Method'}
                  {section === 'password' && 'Change Password'}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <form onSubmit={handleSave}>
                {/* Basic Information Section */}
                {activeSection === 'basic' && (
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
                    <p className="text-gray-600 text-sm mb-8">Update your contact information and profile details</p>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email || ''}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            validationErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-amber-500'
                          }`}
                          placeholder="your@email.com"
                        />
                        {validationErrors.email && (
                          <p className="text-xs text-red-600 mt-1">{validationErrors.email}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Your email is used for login and important notifications</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone || ''}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            validationErrors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-amber-500'
                          }`}
                          placeholder="(555) 123-4567"
                        />
                        {validationErrors.phone && (
                          <p className="text-xs text-red-600 mt-1">{validationErrors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                        <textarea
                          name="bio"
                          value={formData.bio || ''}
                          onChange={handleInputChange}
                          rows={5}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            validationErrors.bio ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-amber-500'
                          }`}
                          placeholder="Tell students about yourself, your teaching style, and experience..."
                        />
                        {validationErrors.bio && (
                          <p className="text-xs text-red-600 mt-1">{validationErrors.bio}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">{(formData.bio || '').length}/500 characters</p>
                      </div>

                      <div className="pt-6 border-t">
                        <button
                          type="submit"
                          disabled={!hasChanges || loading}
                          className="bg-amber-600 text-white px-6 py-2.5 rounded-lg hover:bg-amber-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tutoring Preferences Section */}
                {activeSection === 'preferences' && (
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Tutoring Preferences</h2>
                    <p className="text-gray-600 text-sm mb-8">Configure how students can book sessions with you</p>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900">Instant Book</label>
                          <p className="text-xs text-gray-600 mt-1">Allow students to book lessons immediately without approval</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="instantBook"
                            checked={formData.instantBook}
                            onChange={handleInputChange}
                            className="w-6 h-6 cursor-pointer"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Typical Response Time</label>
                        <select
                          name="responseTime"
                          value={formData.responseTime || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                        >
                          <option value={1}>Within 1 hour</option>
                          <option value={2}>Within 2 hours</option>
                          <option value={3}>Within 3 hours</option>
                          <option value={4}>Within 4 hours</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-2">This helps students understand when they can expect to hear from you</p>
                      </div>

                      <div className="pt-6 border-t">
                        <button
                          type="submit"
                          disabled={!hasChanges || loading}
                          className="bg-amber-600 text-white px-6 py-2.5 rounded-lg hover:bg-amber-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Section */}
                {activeSection === 'notifications' && (
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Notification Preferences</h2>
                    <p className="text-gray-600 text-sm mb-8">Control how and when you receive notifications</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900">Email Notifications</label>
                          <p className="text-xs text-gray-600 mt-1">Receive updates about new bookings and messages</p>
                        </div>
                        <input
                          type="checkbox"
                          name="emailNotifications"
                          checked={formData.emailNotifications}
                          onChange={handleInputChange}
                          className="w-5 h-5 cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900">SMS Notifications</label>
                          <p className="text-xs text-gray-600 mt-1">Get text messages for important updates</p>
                        </div>
                        <input
                          type="checkbox"
                          name="smsNotifications"
                          checked={formData.smsNotifications}
                          onChange={handleInputChange}
                          className="w-5 h-5 cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900">Lesson Reminders</label>
                          <p className="text-xs text-gray-600 mt-1">Get reminders 24 hours before scheduled lessons</p>
                        </div>
                        <input
                          type="checkbox"
                          name="lessonReminders"
                          checked={formData.lessonReminders}
                          onChange={handleInputChange}
                          className="w-5 h-5 cursor-pointer"
                        />
                      </div>

                      <div className="pt-6 border-t">
                        <button
                          type="submit"
                          disabled={!hasChanges || loading}
                          className="bg-amber-600 text-white px-6 py-2.5 rounded-lg hover:bg-amber-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Section */}
                {activeSection === 'payment' && (
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Settings</h2>
                    <p className="text-gray-600 text-sm mb-8">Manage how and when you receive payments</p>
                    
                    <div className="space-y-6">
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <p className="text-sm text-emerald-800"><strong>Current Balance:</strong> $1,250.00</p>
                        <p className="text-xs text-emerald-700 mt-2">Next payout: December 31, 2025</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Payment Method</label>
                        <select
                          name="paymentMethod"
                          value={formData.paymentMethod || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                        >
                          <option value="direct-deposit">Direct Deposit</option>
                          <option value="paypal">PayPal</option>
                          <option value="check">Check</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Payout Frequency</label>
                        <select
                          name="payoutFrequency"
                          value={formData.payoutFrequency || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                        >
                          <option value="weekly">Weekly</option>
                          <option value="bi-weekly">Bi-Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-2">Payouts are processed on the 1st and 15th of each month</p>
                      </div>

                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800"><strong>Note:</strong> To change your payment method, contact our support team at support@yesgrad.com</p>
                      </div>

                      <div className="pt-6 border-t">
                        <button
                          type="submit"
                          disabled={!hasChanges || loading}
                          className="bg-amber-600 text-white px-6 py-2.5 rounded-lg hover:bg-amber-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Password Section */}
                {activeSection === 'password' && (
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Change Password</h2>
                    <p className="text-gray-600 text-sm mb-8">Keep your account secure by using a strong password</p>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                        <PasswordInput
                          name="currentPassword"
                          value={formData.currentPassword || ''}
                          onChange={handleInputChange}
                          placeholder="Enter your current password"
                          hasError={!!validationErrors.currentPassword}
                        />
                        {validationErrors.currentPassword && (
                          <p className="text-xs text-red-600 mt-1">{validationErrors.currentPassword}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                        <PasswordInput
                          name="newPassword"
                          value={formData.newPassword || ''}
                          onChange={handleInputChange}
                          placeholder="Enter your new password"
                          hasError={!!validationErrors.newPassword}
                        />
                        {validationErrors.newPassword && (
                          <p className="text-xs text-red-600 mt-1">{validationErrors.newPassword}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                        <PasswordInput
                          name="confirmPassword"
                          value={formData.confirmPassword || ''}
                          onChange={handleInputChange}
                          placeholder="Confirm your new password"
                          hasError={!!validationErrors.confirmPassword}
                        />
                        {validationErrors.confirmPassword && (
                          <p className="text-xs text-red-600 mt-1">{validationErrors.confirmPassword}</p>
                        )}
                      </div>

                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800 font-semibold mb-2">Password requirements:</p>
                        <ul className="list-disc list-inside text-xs text-blue-700 space-y-1">
                          <li>At least 8 characters long</li>
                          <li>Contains uppercase and lowercase letters</li>
                          <li>Contains at least one number</li>
                          <li>Contains at least one special character (!@#$%^&*)</li>
                        </ul>
                      </div>

                      <div className="pt-6 border-t">
                        <button
                          type="submit"
                          disabled={!formData.currentPassword || !formData.newPassword || !formData.confirmPassword || loading}
                          className="bg-amber-600 text-white px-6 py-2.5 rounded-lg hover:bg-amber-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                          {loading ? 'Updating...' : 'Update Password'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}