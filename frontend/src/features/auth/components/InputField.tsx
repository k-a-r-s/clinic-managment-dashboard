
import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface InputFieldProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  error?: string;
  icon: LucideIcon;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  onKeyPress,
  error,
  icon: Icon,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        className={`w-full pl-10 pr-4 py-3 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition`}
      />
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);
