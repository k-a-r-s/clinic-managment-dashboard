import axiosInstance from "../../../lib/axios";

export const getVascularAccess = async (patientId: string) => {
  const { data } = await axiosInstance.get(`/medical-files/patient/${patientId}`);
  return data?.medicalFile?.vascularAccess ?? [];
};

export const updateVascularAccess = async (
  patientId: string,
  vascularAccess: any[]
) => {
  return axiosInstance.patch(`/medical-files/patient/${patientId}`, {
    medicalFile: {
      vascularAccess,
    },
  });
};


export const getVaccinations = async (patientId: string) => {
  const { data } = await axiosInstance.get(`/medical-files/patient/${patientId}`);
  return data?.medicalFile?.vaccinations ?? [];
};

export const updateVaccinations = async (
  patientId: string,
  vaccinations: any[]
) => {
  return axiosInstance.patch(`/medical-files/patient/${patientId}`, {
    medicalFile: { vaccinations },
  });
};

export const getMedications = async (patientId: string) => {
  const { data } = await axiosInstance.get(`/medical-files/patient/${patientId}`);
  return data?.medicalFile?.medications ?? [];
};

export const updateMedications = async (
  patientId: string,
  medications: any[]
) => {
  return axiosInstance.patch(`/medical-files/patient/${patientId}`, {
    medicalFile: { medications },
  });
};

export const getDialysisProtocol = async (patientId: string) => {
  const { data } = await axiosInstance.get(`/patients/${patientId}/medical`);
  return data?.medicalFile?.dialysisProtocol ?? null;
};

export const updateDialysisProtocol = async (
  patientId: string,
  protocol: any
) => {
  return axiosInstance.patch(`/patients/${patientId}/medical`, {
    medicalFile: { dialysisProtocol: protocol },
  });
};
