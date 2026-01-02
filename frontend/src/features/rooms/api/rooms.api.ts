import axiosInstance from "../../../lib/axios";
import type { Room } from "../../../types";

export const getRooms = async (): Promise<Room[]> => {
  const response = await axiosInstance.get("/rooms");
  const body = response.data;
  const raw = Array.isArray(body) ? body : body?.data ?? [];
  return (raw || []).map((r: any) => ({
    id: r.id,
    roomNumber: r.room_number ?? r.roomNumber,
    capacity: r.capacity ?? undefined,
    type: r.type ?? undefined,
    isAvailable: r.is_available ?? r.isAvailable ?? true,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
};

export const getRoomById = async (id: string): Promise<Room> => {
  const response = await axiosInstance.get(`/rooms/${id}`);
  const r = response.data?.data ?? response.data;
  return {
    id: r.id,
    roomNumber: r.room_number ?? r.roomNumber,
    capacity: r.capacity ?? undefined,
    type: r.type ?? undefined,
    isAvailable: r.is_available ?? r.isAvailable ?? true,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
};

export const createRoom = async (data: {
  roomNumber: string;
  capacity?: number;
  type?: string;
  isAvailable?: boolean;
}): Promise<Room> => {
  const response = await axiosInstance.post("/rooms", {
    roomNumber: data.roomNumber,
    capacity: data.capacity,
    type: data.type,
    isAvailable: data.isAvailable,
  });
  const r = response.data?.data ?? response.data;
  return {
    id: r.id,
    roomNumber: r.room_number ?? r.roomNumber,
    capacity: r.capacity ?? undefined,
    type: r.type ?? undefined,
    isAvailable: r.is_available ?? r.isAvailable ?? true,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
};

export const updateRoom = async (
  id: string,
  data: {
    roomNumber?: string;
    capacity?: number;
    type?: string;
    isAvailable?: boolean;
  }
): Promise<Room> => {
  const response = await axiosInstance.post(`/rooms/${id}`, {
    roomNumber: data.roomNumber,
    capacity: data.capacity,
    type: data.type,
    isAvailable: data.isAvailable,
  });
  const r = response.data?.data ?? response.data;
  return {
    id: r.id,
    roomNumber: r.room_number ?? r.roomNumber,
    capacity: r.capacity ?? undefined,
    type: r.type ?? undefined,
    isAvailable: r.is_available ?? r.isAvailable ?? true,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
};

export const getAvailableRooms = async (): Promise<Room[]> => {
  const response = await axiosInstance.get("/rooms/available");
  const body = response.data;
  const raw = Array.isArray(body) ? body : body?.data ?? [];
  return (raw || []).map((r: any) => ({
    id: r.id,
    roomNumber: r.room_number ?? r.roomNumber,
    capacity: r.capacity ?? undefined,
    type: r.type ?? undefined,
    isAvailable: r.is_available ?? r.isAvailable ?? true,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
};

export const deleteRoom = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/rooms/${id}`);
};
