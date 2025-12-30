import { useState } from "react";
import {
  User,
  Mail,
  Key,
  Save,
  X,
  Phone,
  DollarSign,
  Stethoscope,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { FormCard } from "../../../components/shared/FormCard";
import type { UserFormData } from "../../../types";

interface UserFormProps {
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function UserForm({
  initialData = {},
  onSubmit,
  isLoading = false,
  submitLabel = "Create User",
}: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    email: initialData.email || "",
    password: initialData.password || "",
    role: initialData.role || "receptionist",
    phoneNumber: initialData.phoneNumber || "",
    salary: initialData.salary || 0,
    isMedicalDirector: initialData.isMedicalDirector || false,
    specialization: initialData.specialization || "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof UserFormData, string>>
  >({});

  const handleInputChange = (
    field: keyof UserFormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!["doctor", "receptionist"].includes(formData.role))
      newErrors.role = "Role must be doctor or receptionist";

    // Role-specific validation
    if (!formData.phoneNumber?.trim())
      newErrors.phoneNumber = "Phone number is required";

    if (formData.role === "doctor") {
      if (!formData.specialization?.trim())
        newErrors.specialization = "Specialization is required for doctors";
      if (!formData.salary || formData.salary <= 0)
        newErrors.salary = "Salary must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormCard title="User Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              First Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={`pl-10 ${errors.firstName ? "border-red-500" : ""}`}
              />
            </div>
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={`pl-10 ${errors.lastName ? "border-red-500" : ""}`}
              />
            </div>
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>
              Role <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-4">
              <label
                className={`px-4 py-2 border rounded cursor-pointer transition-colors ${
                  formData.role === "doctor"
                    ? "bg-[#1C8CA8] text-white border-[#1C8CA8]"
                    : "hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="doctor"
                  checked={formData.role === "doctor"}
                  onChange={(e) =>
                    handleInputChange(
                      "role",
                      e.target.value as "doctor" | "receptionist"
                    )
                  }
                  className="mr-2"
                />{" "}
                Doctor
              </label>
              <label
                className={`px-4 py-2 border rounded cursor-pointer transition-colors ${
                  formData.role === "receptionist"
                    ? "bg-[#1C8CA8] text-white border-[#1C8CA8]"
                    : "hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="receptionist"
                  checked={formData.role === "receptionist"}
                  onChange={(e) =>
                    handleInputChange(
                      "role",
                      e.target.value as "doctor" | "receptionist"
                    )
                  }
                  className="mr-2"
                />{" "}
                Receptionist
              </label>
            </div>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+1234567890"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                className={`pl-10 ${
                  errors.phoneNumber ? "border-red-500" : ""
                }`}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </div>
        </div>
      </FormCard>

      {formData.role === "doctor" && (
        <FormCard title="Doctor-Specific Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="specialization">
                Specialization <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="specialization"
                  placeholder="e.g., Nephrology"
                  value={formData.specialization || ""}
                  onChange={(e) =>
                    handleInputChange("specialization", e.target.value)
                  }
                  className={`pl-10 ${
                    errors.specialization ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.specialization && (
                <p className="text-sm text-red-500">{errors.specialization}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">
                Salary <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="salary"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.salary || ""}
                  onChange={(e) =>
                    handleInputChange("salary", parseFloat(e.target.value) || 0)
                  }
                  className={`pl-10 ${errors.salary ? "border-red-500" : ""}`}
                />
              </div>
              {errors.salary && (
                <p className="text-sm text-red-500">{errors.salary}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isMedicalDirector"
                  checked={formData.isMedicalDirector || false}
                  onChange={(e) =>
                    handleInputChange("isMedicalDirector", e.target.checked)
                  }
                  className="w-4 h-4 text-[#1C8CA8] border-gray-300 rounded focus:ring-[#1C8CA8]"
                />
                <Label htmlFor="isMedicalDirector" className="cursor-pointer">
                  Medical Director
                </Label>
              </div>
            </div>
          </div>
        </FormCard>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" className="gap-2">
          <X className="w-4 h-4" />
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="gap-2 bg-[#1C8CA8] hover:bg-[#157A93]"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {submitLabel}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
