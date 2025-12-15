import axios from "axios";
import type { ApiSuccessResponse, ApiErrorResponse } from "../types";

/**
 * Axios instance configured to handle standardized API responses.
 *
 * The backend returns all responses in this format:
 * Success: { success: true, status: 200, data: {...}, error: null }
 * Error: { success: false, status: 400, data: null, error: {...} }
 *
 * The response interceptor automatically unwraps successful responses,
 * so API functions receive the actual data directly (response.data).
 */
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Logs
    console.group(
      `HTTP Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    console.log("Base URL:", config.baseURL);
    console.log("Full URL:", `${config.baseURL}${config.url}`);
    console.log("Headers:", config.headers);
    if (config.data) console.log("Request Body:", config.data);
    if (config.params) console.log("Query Params:", config.params);
    console.groupEnd();

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    const body = response.data as ApiSuccessResponse | ApiErrorResponse;

    console.group(
      `OK HTTP Response: ${response.config.method?.toUpperCase()} ${
        response.config.url
      }`
    );
    console.log("Status:", response.status);
    console.log("Raw Response:", body);

    // SUCCESS: true
    if (body.success === true) {
      console.log("Unwrapped Data:", body.data);
      console.groupEnd();

      // Forward the unwrapped data to the consumer
      response.data = body.data;
      return response;
    }

    // SUCCESS: false (Error)
    console.error("Error Response:", body.error);
    console.groupEnd();

    return Promise.reject({
      status: body.status,
      type: body.error.type,
      subErrorType: body.error.subErrorType,
      context: body.error.context,
      message: body.error.message,
      details: body.error.details,
      hint: body.error.hint,
    });
  },

  // NETWORK / NON-STANDARD ERRORS

  (error) => {
    console.group(
      `HTTP Error: ${error.config?.method?.toUpperCase()} ${
        error.config?.url
      }`
    );
    console.log("Status:", error.response?.status);
    console.log("Error Response:", error.response?.data);

    // Handle unauthorized
    if (error.response?.status === 401) {
      console.log("Unauthorized - Redirecting to login");
      localStorage.removeItem("auth_token");
    }

    // Error matches APIErrorResponse
    if (error.response?.data?.error) {
      const e = error.response.data as ApiErrorResponse;

      const extracted = {
        status: e.status,
        type: e.error.type,
        subErrorType: e.error.subErrorType,
        context: e.error.context,
        message: e.error.message,
        details: e.error.details,
        hint: e.error.hint,
      };

      console.log("Extracted Error:", extracted);
      console.groupEnd();
      return Promise.reject(extracted);
    }

    // Fallback unknown error
    console.log("Raw Error:", error);
    console.groupEnd();
    return Promise.reject(error);
  }
);

export default axiosInstance;
