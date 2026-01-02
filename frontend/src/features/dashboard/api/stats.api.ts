import axiosInstance from "../../../lib/axios";

export type DashboardStats = {
  totalPatients: number;
  activeSessions: number;
  activemachines: number;
  staffCount: number;
  staffSublabel: string;
  patientsThisWeek: number;
  appointmentsThisWeek: number;
  patientsPerDay: { date: string; count: number }[];
  appointmentsPerDay: { date: string; count: number }[];
};

export type MachineStatsFormatted = {
  In_Use: number;
  Available: number;
  Out_of_Service: number;
  Maintenance: number;
  total: number;
};

export const getStats = async (): Promise<DashboardStats> => {
  const response = await axiosInstance.get("/stats");
  return response.data;
};

export const getPatientsPerDay = async (): Promise<
  { date: string; count: number }[]
> => {
  const response = await axiosInstance.get("/stats/patients-per-day");
  return response.data;
};

export const getAppointmentsPerDay = async (): Promise<
  { date: string; count: number }[]
> => {
  const response = await axiosInstance.get("/stats/appointments-per-day");
  return response.data;
};

export const getSummary = async () => {
  const response = await axiosInstance.get("/stats/summary");
  return response.data;
};

export const getMachineStats = async (): Promise<MachineStatsFormatted> => {
  const response = await axiosInstance.get("/machines/machine-stats");
  return response.data;
};
