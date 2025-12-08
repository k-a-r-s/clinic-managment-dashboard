import axios from '../../../lib/axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const prescriptionsApi = {
  create: async (prescriptionData: {
    patientId: string;
    doctorId: string;
    appointmentId?: string;
    prescriptionDate?: string;
    medications: Array<{
      medicationName: string;
      dosage: string;
      frequency: string;
      duration: string;
      notes?: string;
    }>;
  }) => {
    const response = await axios.post(`${API_BASE}/prescriptions`, prescriptionData);
    return response.data;
  },

  getByPatient: async (patientId: string) => {
    const response = await axios.get(`${API_BASE}/prescriptions/patient/${patientId}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axios.get(`${API_BASE}/prescriptions/${id}`);
    return response.data;
  },

  update: async (id: string, prescriptionData: any) => {
    const response = await axios.put(`${API_BASE}/prescriptions/${id}`, prescriptionData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axios.delete(`${API_BASE}/prescriptions/${id}`);
    return response.data;
  }
};