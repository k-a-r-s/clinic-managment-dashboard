import axiosInstance from "../../../lib/axios";
import type {
  Appointment,
  AppointmentFormData,
  AppointmentWithDetails,
} from "../../../types";

export const getAppointments = async (): Promise<AppointmentWithDetails[]> => {
  const response = await axiosInstance.get("/appointments");
  return response.data;
};

export const getAppointmentById = async (
  id: string
): Promise<AppointmentWithDetails> => {
  const response = await axiosInstance.get(`/appointments/${id}`);
  return response.data;
};

export const createAppointment = async (
  data: AppointmentFormData
): Promise<Appointment> => {
  console.log(data) 
  const response = await axiosInstance.post("/appointments", data);
  return response.data;
};

export const updateAppointment = async (
  id: string,
  data: Partial<AppointmentFormData>
): Promise<Appointment> => {
  const response = await axiosInstance.put(`/appointments/${id}`, data);
  return response.data;
};

export const deleteAppointment = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/appointments/${id}`);
};
