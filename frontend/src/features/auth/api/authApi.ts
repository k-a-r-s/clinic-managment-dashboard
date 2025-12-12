import axiosInstance from "../../../lib/axios";

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ResetFormData {
  email: string;
}

export const authApi = {
  login: async (data: LoginFormData) => {
    // Axios auto-handles success/error unwrapping
    const response = await axiosInstance.post("/auth/login", data, {
      withCredentials: true, 
    });
    // Because interceptor unwraps response -> response.data = actual "data"
    return response.data;
  },

  resetPassword: async (data: ResetFormData) => {
    const response = await axiosInstance.post(
      "/auth/reset-password",
      data,
      {
        withCredentials: true, // if your backend sets cookies here too
      }
    );

    return response.data;
  },
};
