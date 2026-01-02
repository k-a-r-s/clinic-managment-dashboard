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
    roomId: m.room_id ?? m.roomId ?? null,
    isActive: m.is_active ?? m.isActive ?? true,
    room: m.room ?? null,
    createdAt: m.created_at ?? m.createdAt,
    updatedAt: m.updated_at ?? m.updatedAt,
  }));
};

export const getMachineById = async (id: string): Promise<Machine> => {
  const response = await axiosInstance.get(`/machines/${id}`);
  const body = response.data;
  const m = body?.data ?? body;

  return {
    id: m.id,
    machineId: m.machine_id ?? m.machineId,
    manufacturer: m.manufacturer ?? null,
    model: m.model ?? null,
    status: m.status,
    lastMaintenanceDate: m.last_maintenance_date ?? m.lastMaintenanceDate,
    nextMaintenanceDate: m.next_maintenance_date ?? m.nextMaintenanceDate,
    roomId: m.room_id ?? m.roomId ?? null,
    isActive: m.is_active ?? m.isActive ?? true,
    room: m.room ?? null,
    createdAt: m.created_at ?? m.createdAt,
    updatedAt: m.updated_at ?? m.updatedAt,
  };
};

export const createMachine = async (
  data: MachineFormData
): Promise<Machine> => {
  const response = await axiosInstance.post("/machines", {
    machineId: data.machineId,
    manufacturer: data.manufacturer || null,
    model: data.model || null,
    status: data.status,
    lastMaintenanceDate: data.lastMaintenanceDate,
    nextMaintenanceDate: data.nextMaintenanceDate,
    roomId: data.roomId || null,
    isActive: data.isActive ?? true,
  });
  const m = response.data?.data ?? response.data;

  return {
    id: m.id,
    machineId: m.machine_id ?? m.machineId,
    manufacturer: m.manufacturer ?? null,
    model: m.model ?? null,
    status: m.status,
    lastMaintenanceDate: m.last_maintenance_date ?? m.lastMaintenanceDate,
    nextMaintenanceDate: m.next_maintenance_date ?? m.nextMaintenanceDate,
    roomId: m.room_id ?? m.roomId ?? null,
    isActive: m.is_active ?? m.isActive ?? true,
    room: m.room ?? null,
    createdAt: m.created_at ?? m.createdAt,
    updatedAt: m.updated_at ?? m.updatedAt,
  };
};

export const updateMachine = async (
  id: string,
  data: Partial<MachineFormData>
): Promise<Machine> => {
  const payload: any = {};

  if (data.machineId !== undefined) payload.machineId = data.machineId;
  if (data.manufacturer !== undefined)
    payload.manufacturer = data.manufacturer || null;
  if (data.model !== undefined) payload.model = data.model || null;
  if (data.status !== undefined) payload.status = data.status;
  if (data.lastMaintenanceDate !== undefined)
    payload.lastMaintenanceDate = data.lastMaintenanceDate;
  if (data.nextMaintenanceDate !== undefined)
    payload.nextMaintenanceDate = data.nextMaintenanceDate;
  if (data.roomId !== undefined) payload.roomId = data.roomId || null;
  if (data.isActive !== undefined) payload.isActive = data.isActive;

  const response = await axiosInstance.put(`/machines/${id}`, payload);
  const m = response.data?.data ?? response.data;

  return {
    id: m.id,
    machineId: m.machine_id ?? m.machineId,
    manufacturer: m.manufacturer ?? null,
    model: m.model ?? null,
    status: m.status,
    lastMaintenanceDate: m.last_maintenance_date ?? m.lastMaintenanceDate,
    nextMaintenanceDate: m.next_maintenance_date ?? m.nextMaintenanceDate,
    roomId: m.room_id ?? m.roomId ?? null,
    isActive: m.is_active ?? m.isActive ?? true,
    room: m.room ?? null,
    createdAt: m.created_at ?? m.createdAt,
    updatedAt: m.updated_at ?? m.updatedAt,
  };
};

export const deactivateMachine = async (id: string): Promise<void> => {
  await axiosInstance.post(`/machines/${id}/deactivate`);
};

export const deleteMachine = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/machines/${id}`);
};

export const getMachineStats = async (): Promise<{
  total: number;
  available: number;
  inUse: number;
  maintenance: number;
  outOfService: number;
}> => {
  const response = await axiosInstance.get("/machines/stats");
  const body = response.data;
  return body?.data ?? body;
};
