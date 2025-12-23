import axiosInstance from "../../../lib/axios";
import type { Room } from "../../../types";

export const getRooms = async (): Promise<Room[]> => {
  const response = await axiosInstance.get("/rooms");
  const body = response.data;
  const raw = Array.isArray(body) ? body : body?.data ?? [];
  return (raw || []).map((r: any) => ({
    id: r.id,
    roomNumber: r.room_number ?? r.roomNumber,
    type: r.type ?? undefined,
    isAvailable: r.is_available ?? r.isAvailable ?? true,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
};

export const createRoom = async (data: { roomNumber: string; type?: string }): Promise<Room> => {
  const response = await axiosInstance.post("/rooms", data);
  return response.data?.data ?? response.data;
};

export const getAvailableRooms = async (): Promise<Room[]> => {
  const response = await axiosInstance.get("/rooms/available");
  return response.data?.data ?? response.data;
};
