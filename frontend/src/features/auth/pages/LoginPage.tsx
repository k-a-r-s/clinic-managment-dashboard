
import React, { useState } from 'react';
import { Mail, Lock, Info } from 'lucide-react';
import { Logo } from '../components/Logo';
import { BrandSection } from '../components/BrandSection';
import { InputField } from '../components/InputField';
import { authApi, type LoginFormData } from '../api/authApi';
import { validateLoginForm, type ValidationErrors } from '../utils/validation';

interface LoginPageProps {
  onForgotPassword: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onForgotPassword }) => {
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleSubmit = async () => {
    const validationErrors = validateLoginForm(formData.email, formData.password);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    try {
      const response = await authApi.login(formData);
      console.log('Login successful:', response);
      alert('Login successful!');
      // Redirect to dashboard or handle successful login
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Login failed');
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
    <div className="min-h-screen flex">
      <BrandSection />

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Logo />
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Welcome Back to SmartClinic</h2>
                <p className="text-gray-600 mt-2">Sign in to access your dashboard</p>
              </div>
            </div>

            <div className="space-y-5">
              <InputField
                label="Email Address"
                type="email"
                placeholder="your.email@smartclinic.com"
                value={formData.email}
                onChange={(value) => {
                  setFormData({ ...formData, email: value });
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                onKeyPress={handleKeyPress}
                error={errors.email}
                icon={Mail}
              />

              <InputField
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(value) => {
                  setFormData({ ...formData, password: value });
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                onKeyPress={handleKeyPress}
                error={errors.password}
                icon={Lock}
              />

              <div className="flex justify-end">
                <button
                  onClick={onForgotPassword}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Info className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600">
                Only authorized staff can access this system. All activities are monitored and logged for security purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
