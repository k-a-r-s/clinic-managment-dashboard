import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit,
  UserCircle,
  Mail,
  Phone,
  DollarSign,
  Stethoscope,
  Calendar,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { getUserById, updateUser } from "../api/users.api";
import type { User, UserFormData } from "../../../types";
import { toast } from "react-hot-toast";
import { UserForm } from "../components/UserForm";

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
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userId) loadUser(userId);
  }, [userId]);

  useEffect(() => {
    setIsEditing(initialEditMode);
  }, [initialEditMode]);

  const loadUser = async (userId: string) => {
    try {
      setIsLoading(true);
      const data = await getUserById(userId);
      setUser(data);
    } catch (error) {
      console.error("Failed to load user:", error);
      toast.error("Failed to load user");
      if (onBack) {
        onBack();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (formData: UserFormData) => {
    if (!userId) return;

    try {
      setIsSaving(true);
      await updateUser(userId, formData);
      toast.success("User updated successfully");
      setIsEditing(false);
      loadUser(userId);
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#1C8CA8] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <UserCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          User not found
        </h3>
        <Button
          onClick={handleBack}
          className="bg-[#1C8CA8] hover:bg-[#157A93]"
        >
          Back to Users
        </Button>
      </div>
    );
  }

  if (isEditing) {
    const initialData: Partial<UserFormData> = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      password: "", // Password required for form but won't be changed if empty
      ...(user.role === "doctor" && user.doctorDetails
        ? {
            phoneNumber: user.doctorDetails.phoneNumber,
            salary: user.doctorDetails.salary,
            isMedicalDirector: user.doctorDetails.isMedicalDirector,
            specialization: user.doctorDetails.specialization,
          }
        : {}),
      ...(user.role === "receptionist" && user.receptionistDetails
        ? {
            phoneNumber: user.receptionistDetails.phoneNumber,
          }
        : {}),
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setIsEditing(false)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Cancel
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit {user.firstName} {user.lastName}
          </h1>
        </div>

        <UserForm
          initialData={initialData}
          onSubmit={handleUpdate}
          isLoading={isSaving}
          submitLabel="Update User"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
        <Button
          onClick={() => setIsEditing(true)}
          className="gap-2 bg-[#1C8CA8] hover:bg-[#157A93]"
        >
          <Edit className="w-4 h-4" />
          Edit User
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-[#1C8CA8] rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <Badge
                  variant={user.role === "doctor" ? "default" : "secondary"}
                  className="text-sm"
                >
                  {user.role === "doctor" ? "Doctor" : "Receptionist"}
                </Badge>
                {user.role === "doctor" &&
                  user.doctorDetails?.isMedicalDirector && (
                    <Badge variant="default" className="bg-green-600 text-sm">
                      Medical Director
                    </Badge>
                  )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="text-gray-900 font-medium">{user.email}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Phone Number</div>
                  <div className="text-gray-900 font-medium">
                    {user.doctorDetails?.phoneNumber ||
                      user.receptionistDetails?.phoneNumber ||
                      "—"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Joined Date</div>
                  <div className="text-gray-900 font-medium">
                    {formatDate(user.createdAt)}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Last Updated</div>
                  <div className="text-gray-900 font-medium">
                    {formatDate(user.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {user.role === "doctor" && user.doctorDetails && (
            <div className="pt-6 border-t">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Doctor-Specific Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Stethoscope className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Specialization</div>
                    <div className="text-gray-900 font-medium">
                      {user.doctorDetails.specialization}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Salary</div>
                    <div className="text-gray-900 font-medium">
                      ${user.doctorDetails.salary.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <UserCircle className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">
                      Medical Director Status
                    </div>
                    <div className="text-gray-900 font-medium">
                      {user.doctorDetails.isMedicalDirector ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
