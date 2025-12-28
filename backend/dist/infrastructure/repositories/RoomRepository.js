"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomRepository = void 0;
const Room_1 = require("../../domain/entities/Room");
const supabase_1 = require("../database/supabase");
const DatabaseError_1 = require("../errors/DatabaseError");
const logger_1 = require("../../shared/utils/logger");
const date_fns_1 = require("date-fns");
class RoomRepository {
    async createRoom(roomData) {
        const { data, error } = await supabase_1.supabaseAdmin
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
            logger_1.Logger.error("Error creating room", { error });
            throw new DatabaseError_1.DatabaseError(`Error creating room: ${error.message}`);
        }
        return new Room_1.Room(data.id, data.room_number, data.capacity, data.type, data.is_available, new Date(data.created_at), new Date(data.updated_at));
    }
    async getRoomById(id) {
        const { data, error } = await supabase_1.supabaseAdmin
            .from("rooms")
            .select("*")
            .eq("id", id)
            .single();
        if (error) {
            if (error.code === "PGRST116") {
                return null;
            }
            logger_1.Logger.error("Error fetching room", { error });
            throw new DatabaseError_1.DatabaseError(`Error fetching room: ${error.message}`);
        }
        if (!data) {
            return null;
        }
        return new Room_1.Room(data.id, data.room_number, data.capacity, data.type, data.is_available, new Date(data.created_at), new Date(data.updated_at));
    }
    async getAllRooms() {
        const { data, error } = await supabase_1.supabaseAdmin
            .from("rooms")
            .select("*")
            .order("room_number", { ascending: true });
        if (error) {
            logger_1.Logger.error("Error fetching rooms", { error });
            throw new DatabaseError_1.DatabaseError(`Error fetching rooms: ${error.message}`);
        }
        if (!data) {
            return [];
        }
        return data.map((room) => new Room_1.Room(room.id, room.room_number, room.capacity, room.type, room.is_available, new Date(room.created_at), new Date(room.updated_at)));
    }
    async getAvailableRooms() {
        const { data, error } = await supabase_1.supabaseAdmin
            .from("rooms")
            .select("*")
            .eq("is_available", true)
            .order("room_number", { ascending: true });
        if (error) {
            logger_1.Logger.error("Error fetching available rooms", { error });
            throw new DatabaseError_1.DatabaseError(`Error fetching available rooms: ${error.message}`);
        }
        if (!data) {
            return [];
        }
        return data.map((room) => new Room_1.Room(room.id, room.room_number, room.capacity, room.type, room.is_available, new Date(room.created_at), new Date(room.updated_at)));
    }
    async updateRoom(id, roomData) {
        const updateData = {};
        if (roomData.roomNumber !== undefined)
            updateData.room_number = roomData.roomNumber;
        if (roomData.capacity !== undefined)
            updateData.capacity = roomData.capacity;
        if (roomData.type !== undefined)
            updateData.type = roomData.type;
        if (roomData.isAvailable !== undefined)
            updateData.is_available = roomData.isAvailable;
        const { data, error } = await supabase_1.supabaseAdmin
            .from("rooms")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();
        if (error) {
            logger_1.Logger.error("Error updating room", { error });
            throw new DatabaseError_1.DatabaseError(`Error updating room: ${error.message}`);
        }
        return new Room_1.Room(data.id, data.room_number, data.capacity, data.type, data.is_available, new Date(data.created_at), new Date(data.updated_at));
    }
    async deleteRoom(id) {
        const { error } = await supabase_1.supabaseAdmin
            .from("rooms")
            .delete()
            .eq("id", id);
        if (error) {
            logger_1.Logger.error("Error deleting room", { error });
            throw new DatabaseError_1.DatabaseError(`Error deleting room: ${error.message}`);
        }
    }
    async updateRoomAvailability(id, isAvailable) {
        const { error } = await supabase_1.supabaseAdmin
            .from("rooms")
            .update({ is_available: isAvailable })
            .eq("id", id);
        if (error) {
            logger_1.Logger.error("Error updating room availability", { error });
            throw new DatabaseError_1.DatabaseError(`Error updating room availability: ${error.message}`);
        }
    }
    async isAvailableFor(roomId, start, end) {
        try {
            const room = await this.getRoomById(roomId);
            if (!room)
                return { available: false, conflictingAppointmentId: null };
            if (!room.getIsAvailable())
                return { available: false, conflictingAppointmentId: null };
            const from = (0, date_fns_1.startOfDay)(start);
            const to = (0, date_fns_1.endOfDay)(start);
            const { data, error } = await supabase_1.supabaseAdmin
                .from('appointments')
                .select('*')
                .eq('room_id', roomId)
                .gte('appointment_date', from.toISOString())
                .lte('appointment_date', to.toISOString())
                .eq('status', 'SCHEDULED');
            if (error) {
                throw new DatabaseError_1.DatabaseError(`Error fetching appointments: ${error.message}`);
            }
            if (!data || data.length === 0)
                return { available: true };
            for (const item of data) {
                const existingStart = new Date(item.appointment_date);
                const existingEnd = new Date(existingStart.getTime() + (item.estimated_duration || 0) * 60 * 1000);
                if (start < existingEnd && end > existingStart) {
                    return { available: false, conflictingAppointmentId: item.id };
                }
            }
            return { available: true };
        }
        catch (err) {
            throw new DatabaseError_1.DatabaseError(err);
        }
    }
    async isAvailable(roomId) {
        const room = await this.getRoomById(roomId);
        if (!room)
            return false;
        return room.getIsAvailable();
    }
}
exports.RoomRepository = RoomRepository;
