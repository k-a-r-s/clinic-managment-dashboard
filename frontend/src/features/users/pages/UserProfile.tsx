import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { Edit, ChevronDown, ChevronUp, Save, X, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { Loader } from "../../../components/shared/Loader";
import { Checkbox } from "../../../components/ui/checkbox";
import { getUserById, updateUser, deleteUser } from "../api/users.api";
import type { User, UserFormData } from "../../../types";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gradient-to-b from-[#1c8ca8] to-[#157a93] h-12 flex items-center justify-between px-6 hover:from-[#157a93] hover:to-[#136a7d] transition-colors"
      >
        <h2 className="text-base text-white font-normal">{title}</h2>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-white" />
        ) : (
          <ChevronDown className="w-5 h-5 text-white" />
        )}
      </button>
      {isOpen && <div className="p-6">{children}</div>}
    </div>
  );
}

interface UserProfileProps {
  userId: string;
  initialEditMode?: boolean;
  onBack?: () => void;
  onDeleted?: () => void;
}

export function UserProfile({
  userId,
  initialEditMode = false,
  onBack,
  onDeleted,
}: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(initialEditMode);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    role: "receptionist",
    password: "",
    phoneNumber: "",
    salary: 0,
    specialization: "",
    isMedicalDirector: false,
  });

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      setIsLoading(true);
      const data = await getUserById(userId);
      setUser(data);
      setFormData({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        password: "",
        phoneNumber: data.phoneNumber || "",
        salary: data.salary || 0,
        specialization: data.specialization || "",
        isMedicalDirector: data.isMedicalDirector || false,
      });
    } catch (error) {
      console.error("Failed to load user:", error);
      toast.error("Failed to load user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const updateData: Partial<UserFormData> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      };

      if (user?.role === "doctor") {
        updateData.phoneNumber = formData.phoneNumber;
        updateData.salary = formData.salary;
        updateData.specialization = formData.specialization;
        updateData.isMedicalDirector = formData.isMedicalDirector;
      } else if (user?.role === "receptionist") {
        updateData.phoneNumber = formData.phoneNumber;
      }

      await updateUser(userId, updateData);
      toast.success("User updated successfully");
      setIsEditMode(false);
      loadUser();
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user");
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        password: "",
        phoneNumber: user.phoneNumber || "",
        salary: user.salary || 0,
        specialization: user.specialization || "",
        isMedicalDirector: user.isMedicalDirector || false,
      });
    }
    setIsEditMode(false);
  };

  const handleDelete = async () => {
    if (!user) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        await deleteUser(userId);
        toast.success("User deleted successfully");
        if (onDeleted) {
          onDeleted();
        }
      } catch (error) {
        console.error("Failed to delete user:", error);
        toast.error("Failed to delete user");
      }
    }
  };

  const handleFormChange = (
    field: keyof UserFormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={onBack}>Users</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>User Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#101828] text-base font-normal">
            User Details — {user.firstName} {user.lastName}
          </h1>
        </div>
        <div className="flex gap-3">
          {isEditMode ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="gap-2 bg-white border-gray-200"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="gap-2 bg-[#1C8CA8] hover:bg-[#157A93]"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="gap-2 bg-white border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4" />
                Delete User
              </Button>
              <Button
                onClick={() => setIsEditMode(true)}
                className="gap-2 bg-[#1C8CA8] hover:bg-[#157A93]"
              >
                <Edit className="w-4 h-4" />
                Edit User
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Basic Information Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-b from-[#1c8ca8] to-[#157a93] h-12 flex items-center px-6">
          <h2 className="text-base text-white font-normal">
            Basic Information
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              {isEditMode ? (
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleFormChange("firstName", e.target.value)
                  }
                />
              ) : (
                <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                  <p className="text-sm text-gray-900">{formData.firstName}</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              {isEditMode ? (
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleFormChange("lastName", e.target.value)}
                />
              ) : (
                <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                  <p className="text-sm text-gray-900">{formData.lastName}</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {isEditMode ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                />
              ) : (
                <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                  <p className="text-sm text-gray-900">{formData.email}</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                <p className="text-sm text-gray-900 capitalize">{user.role}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              {isEditMode ? (
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber || ""}
                  onChange={(e) =>
                    handleFormChange("phoneNumber", e.target.value)
                  }
                />
              ) : (
                <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                  <p className="text-sm text-gray-900">
                    {formData.phoneNumber || "—"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Doctor-specific section */}
      {user.role === "doctor" && (
        <CollapsibleSection title="Doctor Information" defaultOpen={true}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              {isEditMode ? (
                <Input
                  id="specialization"
                  value={formData.specialization || ""}
                  onChange={(e) =>
                    handleFormChange("specialization", e.target.value)
                  }
                />
              ) : (
                <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                  <p className="text-sm text-gray-900">
                    {formData.specialization || "—"}
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              {isEditMode ? (
                <Input
                  id="salary"
                  type="number"
                  value={formData.salary || ""}
                  onChange={(e) =>
                    handleFormChange("salary", parseFloat(e.target.value) || 0)
                  }
                />
              ) : (
                <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                  <p className="text-sm text-gray-900">
                    {formData.salary
                      ? `$${formData.salary.toLocaleString()}`
                      : "—"}
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="isMedicalDirector">Medical Director</Label>
              {isEditMode ? (
                <div className="flex items-center h-9">
                  <Checkbox
                    id="isMedicalDirector"
                    checked={formData.isMedicalDirector || false}
                    onCheckedChange={(checked) =>
                      handleFormChange("isMedicalDirector", checked as boolean)
                    }
                  />
                  <label
                    htmlFor="isMedicalDirector"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Is Medical Director
                  </label>
                </div>
              ) : (
                <div className="bg-gray-50 h-9 rounded-lg px-3 flex items-center">
                  <p className="text-sm text-gray-900">
                    {formData.isMedicalDirector ? "Yes" : "No"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CollapsibleSection>
      )}

      {/* Receptionist-specific section */}
      {user.role === "receptionist" && (
        <CollapsibleSection title="Receptionist Information" defaultOpen={true}>
          <div className="text-sm text-gray-600">
            <p>No additional information for receptionists.</p>
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
}
