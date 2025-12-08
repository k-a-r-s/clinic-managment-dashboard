import axios from '../../../lib/axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const machinesApi = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE}/machines`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axios.get(`${API_BASE}/machines/${id}`);
    return response.data;
  },

  create: async (machineData: {
    machineId: string;
    serialNumber: string;
    room: string;
    status: 'available' | 'in-use' | 'maintenance' | 'out-of-service';
    lastMaintenanceDate: string;
    nextMaintenanceDate: string;
  }) => {
    const response = await axios.post(`${API_BASE}/machines`, machineData);
    return response.data;
  },

  update: async (id: string, machineData: any) => {
    const response = await axios.put(`${API_BASE}/machines/${id}`, machineData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axios.delete(`${API_BASE}/machines/${id}`);
    return response.data;
  }
};