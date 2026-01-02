import axiosInstance from "../../../lib/axios";

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const updateProfile = async (data: UpdateProfileData): Promise<any> => {
  const response = await axiosInstance.put("/auth/profile", data);
  return response.data;
};

export const changePassword = async (
  data: ChangePasswordData
): Promise<void> => {
  const response = await axiosInstance.post("/auth/change-password", data);
  return response.data;
};
