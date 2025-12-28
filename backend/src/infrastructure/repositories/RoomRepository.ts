import { Room } from "../../domain/entities/Room";
import { IRoomRepository } from "../../domain/repositories/IRoomRepository";
import { supabaseAdmin } from "../database/supabase";
import { DatabaseError } from "../errors/DatabaseError";
import { Logger } from "../../shared/utils/logger";
import { startOfDay, endOfDay } from 'date-fns';

export class RoomRepository implements IRoomRepository {
  async createRoom(roomData: any): Promise<Room> {
    const { data, error } = await supabaseAdmin
      .from("rooms")
      .insert({
        room_number: roomData.roomNumber,
        capacity: roomData.capacity,
        type: roomData.type,
        is_available: roomData.isAvailable ?? true,
      })
      .select()
      .single();

    if (error) {
      Logger.error("Error creating room", { error });
      throw new DatabaseError(`Error creating room: ${error.message}`);
    }

    return new Room(
      data.id,
      data.room_number,
      data.capacity,
      data.type,
      data.is_available,
      new Date(data.created_at),
      new Date(data.updated_at)
    );
  }

  async getRoomById(id: string): Promise<Room | null> {
    const { data, error } = await supabaseAdmin
      .from("rooms")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      Logger.error("Error fetching room", { error });
      throw new DatabaseError(`Error fetching room: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return new Room(
      data.id,
      data.room_number,
      data.capacity,
      data.type,
      data.is_available,
      new Date(data.created_at),
      new Date(data.updated_at)
    );
  }

  async getAllRooms(): Promise<Room[]> {
    const { data, error } = await supabaseAdmin
      .from("rooms")
      .select("*")
      .order("room_number", { ascending: true });

    if (error) {
      Logger.error("Error fetching rooms", { error });
      throw new DatabaseError(`Error fetching rooms: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    return data.map(
      (room) =>
        new Room(
          room.id,
          room.room_number,
          room.capacity,
          room.type,
          room.is_available,
          new Date(room.created_at),
          new Date(room.updated_at)
        )
    );
  }

  async getAvailableRooms(): Promise<Room[]> {
    const { data, error } = await supabaseAdmin
      .from("rooms")
      .select("*")
      .eq("is_available", true)
      .order("room_number", { ascending: true });

    if (error) {
      Logger.error("Error fetching available rooms", { error });
      throw new DatabaseError(`Error fetching available rooms: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    return data.map(
      (room) =>
        new Room(
          room.id,
          room.room_number,
          room.capacity,
          room.type,
          room.is_available,
          new Date(room.created_at),
          new Date(room.updated_at)
        )
    );
  }

  async updateRoom(id: string, roomData: any): Promise<Room> {
    const updateData: any = {};
    
    if (roomData.roomNumber !== undefined) updateData.room_number = roomData.roomNumber;
    if (roomData.capacity !== undefined) updateData.capacity = roomData.capacity;
    if (roomData.type !== undefined) updateData.type = roomData.type;
    if (roomData.isAvailable !== undefined) updateData.is_available = roomData.isAvailable;

    const { data, error } = await supabaseAdmin
      .from("rooms")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      Logger.error("Error updating room", { error });
      throw new DatabaseError(`Error updating room: ${error.message}`);
    }

    return new Room(
      data.id,
      data.room_number,
      data.capacity,
      data.type,
      data.is_available,
      new Date(data.created_at),
      new Date(data.updated_at)
    );
  }

  async deleteRoom(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from("rooms")
      .delete()
      .eq("id", id);

    if (error) {
      Logger.error("Error deleting room", { error });
      throw new DatabaseError(`Error deleting room: ${error.message}`);
    }
  }

  async updateRoomAvailability(id: string, isAvailable: boolean): Promise<void> {
    const { error } = await supabaseAdmin
      .from("rooms")
      .update({ is_available: isAvailable })
      .eq("id", id);

    if (error) {
      Logger.error("Error updating room availability", { error });
      throw new DatabaseError(`Error updating room availability: ${error.message}`);
    }
  }

  async isAvailableFor(roomId: string, start: Date, end: Date): Promise<{ available: boolean; conflictingAppointmentId?: string | null }> {
    try {
      const room = await this.getRoomById(roomId);
      if (!room) return { available: false, conflictingAppointmentId: null };
      if (!room.getIsAvailable()) return { available: false, conflictingAppointmentId: null };

      const from = startOfDay(start);
      const to = endOfDay(start);

      const { data, error } = await supabaseAdmin
        .from('appointments')
        .select('*')
        .eq('room_id', roomId)
        .gte('appointment_date', from.toISOString())
        .lte('appointment_date', to.toISOString())
        .eq('status', 'SCHEDULED');

      if (error) {
        throw new DatabaseError(`Error fetching appointments: ${error.message}`);
      }

      if (!data || data.length === 0) return { available: true };

      for (const item of data) {
        const existingStart = new Date(item.appointment_date);
        const existingEnd = new Date(existingStart.getTime() + (item.estimated_duration || 0) * 60 * 1000);
        if (start < existingEnd && end > existingStart) {
          return { available: false, conflictingAppointmentId: item.id };
        }
      }

      return { available: true };
    } catch (err: any) {
      throw new DatabaseError(err);
    }
  }

  async isAvailable(roomId: string): Promise<boolean> {
    const room = await this.getRoomById(roomId);
    if (!room) return false;
    return room.getIsAvailable();
  }
}
