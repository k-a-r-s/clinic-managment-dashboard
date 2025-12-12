import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { Logo } from '../components/Logo';
import { InputField } from '../components/InputField';
import { authApi } from '../api/authApi';
import { validateResetForm } from '../utils/validation';

interface ResetPasswordPageProps {
  onBackToLogin: () => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const validationError = validateResetForm(email);
    
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);
    try {
      await authApi.resetPassword({ email });
      setSubmitted(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Logo />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">Reset Your Password</h2>
              <p className="text-gray-600 mt-2">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <InputField
              label="Email Address"
              type="email"
              placeholder="your.email@smartclinic.com"
              value={email}
              onChange={(value) => {
                setEmail(value);
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              error={error}
              icon={Mail}
            />

            {submitted && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  A password reset link will be sent to your registered email address. Please check your inbox and follow the instructions.
                </p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <button
              onClick={onBackToLogin}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg border border-gray-300 transition flex items-center justify-center gap-2"
            >
              <span>←</span>
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
