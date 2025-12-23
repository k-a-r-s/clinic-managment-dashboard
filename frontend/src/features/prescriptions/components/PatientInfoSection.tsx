// frontend/src/app/prescriptions/components/PatientInfoSection.tsx
import React from 'react';

interface PatientInfoSectionProps {
  name: string;
  onNameChange: (v: string) => void;
  age?: string;
  onAgeChange?: (v: string) => void;
  gender?: string;
  onGenderChange?: (v: string) => void;
}

const PatientInfoSection: React.FC<PatientInfoSectionProps> = ({
  name,
  onNameChange,
  age = "",
  onAgeChange,
  gender = "",
  onGenderChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-teal-600 text-white px-6 py-4">
        <h2 className="text-lg font-semibold">Patient Information</h2>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900"
            />
          </div>

          {/* Patient ID removed per requirements */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            <input
              type="text"
              value={age}
              onChange={(e) => onAgeChange && onAgeChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <input
              type="text"
              value={gender}
              onChange={(e) => onGenderChange && onGenderChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoSection;