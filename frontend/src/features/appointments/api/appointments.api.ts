import axiosInstance from "../../../lib/axios";
import type { Appointment, AppointmentFormData } from "../../../types";

export const getAppointments = async (): Promise<Appointment[]> => {
  const response = await axiosInstance.get("/appointments");
  return response.data.map((a: any) => ({
    id: a.id,
    patientId: a.patient?.id || "",
    doctorId: a.doctor?.id || "",
    roomId: a.roomId || "",
    createdByReceptionistId: a.createdByReceptionistId || null,
    createdByDoctorId: a.createdByDoctorId || null,
    appointmentDate: a.appointmentDate,
    estimatedDurationInMinutes: a.estimatedDurationInMinutes || 30,
    status: a.status,
    patient: a.patient,
    doctor: a.doctor,
    room: a.room,
  }));
};

export const getAppointmentById = async (id: string): Promise<Appointment> => {
  const response = await axiosInstance.get(`/appointments/${id}`);
  const a = response.data;
  return {
    id: a.id,
    patientId: a.patient?.id || "",
    doctorId: a.doctor?.id || "",
    roomId: a.roomId || "",
    createdByReceptionistId: a.createdByReceptionistId || null,
    createdByDoctorId: a.createdByDoctorId || null,
    appointmentDate: a.appointmentDate,
    estimatedDurationInMinutes: a.estimatedDurationInMinutes || 30,
    status: a.status,
    patient: a.patient,
    doctor: a.doctor,
    room: a.room,
  };
};

export const createAppointment = async (
  data: AppointmentFormData
): Promise<Appointment> => {
  const response = await axiosInstance.post("/appointments", data);
  return response.data;
};

export const updateAppointment = async (
  id: string,
  data: Partial<AppointmentFormData>
): Promise<void> => {
  await axiosInstance.put(`/appointments/${id}`, data);
};

export const deleteAppointment = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/appointments/${id}`);
};
