import axiosInstance from "../../../lib/axios";
import type { MachineStats, Stats, DialysisSession, patientsperDay  } from "../../../types";

export const getStats = async (): Promise<Stats> => {
  const response = await axiosInstance.get("/stats");
  const body = response.data
  return body?.data ?? body;
};

export const getMachinesStats = async (): Promise<MachineStats> => {
  const response = await axiosInstance.get("/machines/machine-stats");
  const body = response.data
  return body?.data ?? body;
};

export const getDialysisSessionsStats = async (): Promise<DialysisSession[]> => {
  const response = await axiosInstance.get("/stats/patients-per-day");
  const body = response.data
  return body?.data ?? body;
};

export const getPatientVisistsStats = async (): Promise<patientsperDay[]> => {
  const response = await axiosInstance.get("/stats/patients-per-day");
  const body = response.data
  return body?.data ?? body;
};


// export const getPatientById = async (id: string): Promise<Patient> => {
//   const response = await axiosInstance.get(`/patients/${id}`);
//   const body = response.data;
//   return body?.data ?? body;
// };

// export const createPatient = async (
//   data: PatientFormData
// ): Promise<Patient> => {
//   const response = await axiosInstance.post("/patients/add-patient", data);
//   return response.data;
// };

// export const updatePatient = async (
//   id: string,
//   data: Partial<PatientFormData>
// ): Promise<Patient> => {
//   const response = await axiosInstance.put(`/patients/${id}`, data);
//   return response.data;
// };

// export const deletePatient = async (id: string): Promise<void> => {
//   await axiosInstance.delete(`/patients/${id}`);
// };
