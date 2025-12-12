
export interface LoginFormData {
  email: string;
  password: string;
}

export interface ResetFormData {
  email: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const authApi = {
  login: async (data: LoginFormData): Promise<ApiResponse> => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:3000/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log("Response received from login API:", response);
      if (!response.ok) {
        throw new Error('Login failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.log("Response received from login API:", data);
      throw new Error('Login failed. Please check your credentials.');
    }
  },

  resetPassword: async (data: ResetFormData): Promise<ApiResponse> => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Password reset failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw new Error('Failed to send reset link. Please try again.');
    }
  },
};

