import axiosInstance from "../../../lib/axios";
import type { Machine, MachineFormData } from "../../../types";

export const getMachines = async (): Promise<Machine[]> => {
  const response = await axiosInstance.get("/machines");
  const body = response.data;
  const raw = Array.isArray(body) ? body : body?.data ?? [];

  return (raw || []).map((m: any) => ({
    id: m.id,
    machineId: m.machine_id ?? m.machineId,
    manufacturer: m.manufacturer ?? null,
    model: m.model ?? null,
    status: m.status,
    lastMaintenanceDate: m.last_maintenance_date ?? m.lastMaintenanceDate,
    nextMaintenanceDate: m.next_maintenance_date ?? m.nextMaintenanceDate,
    
    isActive: m.is_active ?? true,
    room: m.room ?? null,
    // Accept room from various backends: roomId (API), room_id (DB direct), or legacy room (string)
    room: m.roomId ?? m.room_id ?? m.room ?? null,
    createdAt: m.created_at,
    updatedAt: m.updated_at,
  }));
};

export const getMachineById = async (id: string): Promise<Machine> => {
  const response = await axiosInstance.get(`/machines/${id}`);
  const body = response.data;
  return body?.data ?? body;
};

export const createMachine = async (data: MachineFormData): Promise<Machine> => {
  const response = await axiosInstance.post("/machines", data);
  return response.data?.data ?? response.data;
};

export const updateMachine = async (id: string, data: Partial<MachineFormData>): Promise<Machine> => {
  const response = await axiosInstance.put(`/machines/${id}`, data);
  return response.data?.data ?? response.data;
};

export const deactivateMachine = async (id: string): Promise<void> => {
  await axiosInstance.patch(`/machines/${id}/deactivate`);
};
