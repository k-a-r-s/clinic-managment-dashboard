"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MachineRepository = void 0;
const Machine_1 = require("../../domain/entities/Machine");
const supabase_1 = require("../database/supabase");
const DatabaseError_1 = require("../errors/DatabaseError");
class MachineRepository {
    async createMachine(machine) {
        const payload = {
            id: machine.getId(),
            manufacturer: machine.getManufacturer(),
            model: machine.getModel(),
            status: machine.getStatus(),
            last_maintenance_date: machine.getLastMaintenanceDate(),
            next_maintenance_date: machine.getNextMaintenanceDate(),
            is_active: machine.getIsActive(),
            room_id: machine.getRoomId(),
        };
        // include machine_id only if provided (DB has default generator)
        if (machine.getMachineId()) {
            payload.machine_id = machine.getMachineId();
        }
        const { data, error } = await supabase_1.supabaseAdmin
            .from("machines")
            .insert(payload)
            .select()
            .single();
        if (error) {
            throw new DatabaseError_1.DatabaseError(error);
        }
        if (!data) {
            throw new DatabaseError_1.DatabaseError("Failed to create machine");
        }
        return new Machine_1.Machine({
            id: data.id,
            machineId: data.machine_id,
            manufacturer: data.manufacturer,
            model: data.model,
            status: data.status,
            lastMaintenanceDate: data.last_maintenance_date,
            nextMaintenanceDate: data.next_maintenance_date,
            isActive: data.is_active,
            roomId: data.room_id,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        });
    }
    async getMachineById(id) {
        const { data, error } = await supabase_1.supabaseAdmin
            .from("machines")
            .select()
            .eq("id", id)
            .single();
        if (error) {
            throw new DatabaseError_1.DatabaseError(error);
        }
        if (!data) {
            return null;
        }
        return new Machine_1.Machine({
            id: data.id,
            machineId: data.machine_id,
            manufacturer: data.manufacturer,
            model: data.model,
            status: data.status,
            lastMaintenanceDate: data.last_maintenance_date,
            nextMaintenanceDate: data.next_maintenance_date,
            isActive: data.is_active,
            roomId: data.room_id,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        });
    }
    async getAllMachines(filters) {
        let query = supabase_1.supabaseAdmin.from("machines").select();
        if (filters?.status) {
            query = query.eq("status", filters.status);
        }
        if (filters?.roomId) {
            query = query.eq("room_id", filters.roomId);
        }
        const { data, error } = await query;
        if (error) {
            throw new DatabaseError_1.DatabaseError(error);
        }
        if (!data) {
            return [];
        }
        return data.map((m) => new Machine_1.Machine({
            id: m.id,
            machineId: m.machine_id,
            manufacturer: m.manufacturer,
            model: m.model,
            status: m.status,
            lastMaintenanceDate: m.last_maintenance_date,
            nextMaintenanceDate: m.next_maintenance_date,
            isActive: m.is_active,
            roomId: m.room_id,
            createdAt: m.created_at,
            updatedAt: m.updated_at,
        }));
    }
    async updateMachine(machine) {
        const { data, error } = await supabase_1.supabaseAdmin
            .from("machines")
            .update({
            machine_id: machine.getMachineId(),
            manufacturer: machine.getManufacturer(),
            model: machine.getModel(),
            status: machine.getStatus(),
            last_maintenance_date: machine.getLastMaintenanceDate(),
            next_maintenance_date: machine.getNextMaintenanceDate(),
            is_active: machine.getIsActive(),
            room_id: machine.getRoomId(),
        })
            .eq("id", machine.getId())
            .select()
            .single();
        if (error) {
            throw new DatabaseError_1.DatabaseError(error);
        }
        if (!data) {
            throw new DatabaseError_1.DatabaseError("Failed to update machine");
        }
        return new Machine_1.Machine({
            id: data.id,
            machineId: data.machine_id,
            manufacturer: data.manufacturer,
            model: data.model,
            status: data.status,
            lastMaintenanceDate: data.last_maintenance_date,
            nextMaintenanceDate: data.next_maintenance_date,
            isActive: data.is_active,
            roomId: data.room_id,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        });
    }
    async getMachineStats() {
        const { data, error } = await supabase_1.supabaseAdmin.from('machines').select('status');
        if (error) {
            throw new DatabaseError_1.DatabaseError(error);
        }
        const counts = { total: 0, available: 0, inUse: 0, maintenance: 0, outOfService: 0 };
        if (!data)
            return counts;
        counts.total = data.length;
        for (const row of data) {
            const status = row.status;
            if (status === 'available')
                counts.available++;
            else if (status === 'in-use')
                counts.inUse++;
            else if (status === 'maintenance')
                counts.maintenance++;
            else if (status === 'out-of-service')
                counts.outOfService++;
        }
        return counts;
    }
    async deactivateMachine(id) {
        const { error } = await supabase_1.supabaseAdmin
            .from("machines")
            .update({ is_active: false, status: "out-of-service" })
            .eq("id", id);
        if (error) {
            throw new DatabaseError_1.DatabaseError(error);
        }
    }
}
exports.MachineRepository = MachineRepository;
