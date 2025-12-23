import axiosInstance from "../../../lib/axios";
import type { Doctor, DoctorFormData } from "../../../types";

export const getDoctors = async (): Promise<Doctor[]> => {
  const response = await axiosInstance.get("/doctors");
  const body = response.data as any;
  console.log("Raw doctors data from API:", body);

  // Response may be paginated: { total, doctors } or direct array
  const raw = Array.isArray(body) ? body : body?.doctors ?? [];

  // Map server shape (snake_case) to frontend shape (camelCase)
  const mapped: Doctor[] = (raw || []).map((d: any) => ({
    id: d.id ?? d._id ?? d.uuid ?? "",
    firstName: d.first_name ?? d.firstName ?? "",
    lastName: d.last_name ?? d.lastName ?? "",
    email: d.email ?? "",
    phoneNumber: d.phone_number ?? d.phoneNumber ?? "",
    salary: typeof d.salary === "number" ? d.salary : Number(d.salary) || 0,
    isMedicalDirector: d.is_medical_director ?? d.isMedicalDirector ?? false,
    specialization: d.specialization ?? "",
  }));

  return mapped;
};

export const getDoctorById = async (id: number): Promise<Doctor> => {
  const response = await axiosInstance.get(`/doctors/${id}`);
  return response.data;
};

export const createDoctor = async (data: DoctorFormData): Promise<Doctor> => {
  const response = await axiosInstance.post("/doctors", data);
  return response.data;
};

export const updateDoctor = async (
  id: string,
  data: Partial<DoctorFormData>
): Promise<Doctor> => {
  const response = await axiosInstance.put(`/doctors/${id}`, data);
  return response.data;
};

export const deleteDoctor = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/doctors/${id}`);
};
