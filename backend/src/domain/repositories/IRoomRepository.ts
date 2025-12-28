import { Room } from "../entities/Room";

export interface IRoomRepository {
  createRoom(roomData: any): Promise<Room>;
  getRoomById(id: string): Promise<Room | null>;
  getAllRooms(): Promise<Room[]>;
  getAvailableRooms(): Promise<Room[]>;
  updateRoom(id: string, roomData: any): Promise<Room>;
  deleteRoom(id: string): Promise<void>;
  updateRoomAvailability(id: string, isAvailable: boolean): Promise<void>;
  isAvailableFor(roomId: string, start: Date, end: Date): Promise<{ available: boolean; conflictingAppointmentId?: string | null }>;
  isAvailable(roomId: string): Promise<boolean>;
}
