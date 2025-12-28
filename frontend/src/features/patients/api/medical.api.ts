import axiosInstance from "../../../lib/axios";
import type { Vaccination , DialysisProtocol , Medication, VascularAccess} from "../../../types";

export const getmedicalFileId = async (patientId: string) => {
  const { data } = await axiosInstance.get(`/medical-files/patient/${patientId}`);
  return data.id;
};

export const getVascularAccess = async (patientId: string): Promise<VascularAccess> => {

  const response = await axiosInstance.get(`/medical-files/patient/${patientId}`);
  const body = response.data
  return body.data?.VascularAccess ?? [];
};

export const updateVascularAccess = async (
  patientId: string,
  vascularAccess: VascularAccess
) => {
  return axiosInstance.put(`/medical-files/${patientId}`, {
    "data": { vascularAccess },
  });
};

export const getVaccinations = async (patientId: string): Promise<Vaccination[]> => {

  const response = await axiosInstance.get(`/medical-files/patient/${patientId}`);
  const body = response.data
  return body.data?.vaccinations ?? [];
};

export const updateVaccinations = async (
  patientId: string,
  vaccinations: Vaccination[]
) => {
  return axiosInstance.put(`/medical-files/${patientId}`, {
    "data": { vaccinations },
  });
};

export const getMedications = async (patientId: string): Promise<Medication[]> => {

  const response = await axiosInstance.get(`/medical-files/patient/${patientId}`);
  const body = response.data
  return body.data?.Medications ?? [];

};

export const updateMedications = async (
  patientId: string,
  medications: Medication[]
) => {
  return axiosInstance.put(`/medical-files/${patientId}`, {
    "data": { medications },
  });
};

export const getDialysisProtocol = async (patientId: string): Promise<DialysisProtocol[]> => {

  const response = await axiosInstance.get(`/medical-files/patient/${patientId}`);
  const body = response.data
  return body.data?.DialysisProtocol ?? [];

};

export const updateDialysisProtocol = async (
  patientId: string,
  protocol: DialysisProtocol
) => {
  return axiosInstance.put(`/medical-files/${patientId}`, {
    "data": { protocol },
  });
};