import { Machine } from "../../domain/entities/Machine";
import { IMachineRepository } from "../../domain/repositories/IMachineRepository";
import { supabaseAdmin } from "../database/supabase";
import { DatabaseError } from "../errors/DatabaseError";

export class MachineRepository implements IMachineRepository {
  async createMachine(machine: Machine): Promise<Machine> {
    const payload: any = {
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

    const { data, error } = await supabaseAdmin
      .from("machines")
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new DatabaseError(error);
    }
    if (!data) {
      throw new DatabaseError("Failed to create machine");
    }

    return new Machine({
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

  async getMachineById(id: string): Promise<Machine | null> {
    const { data, error } = await supabaseAdmin
      .from("machines")
      .select()
      .eq("id", id)
      .single();

    if (error) {
      throw new DatabaseError(error);
    }
    if (!data) {
      return null;
    }

    return new Machine({
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
  async getAllMachines(filters?: { status?: string; roomId?: string }): Promise<Machine[]> {
    let query = supabaseAdmin.from("machines").select();
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.roomId) {
      query = query.eq("room_id", filters.roomId);
    }
    const { data, error } = await query;
    if (error) {
      throw new DatabaseError(error);
    }
    if (!data) {
      return [];
    }

    return data.map((m: any) =>
      new Machine({
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
      })
    );
  }

  async updateMachine(machine: Machine): Promise<Machine> {
    const { data, error } = await supabaseAdmin
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
      throw new DatabaseError(error);
    }
    if (!data) {
      throw new DatabaseError("Failed to update machine");
    }

    return new Machine({
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

  async getMachineStats(): Promise<{ total: number; available: number; inUse: number; maintenance: number; outOfService: number }> {
    const { data, error } = await supabaseAdmin.from('machines').select('status');
    if (error) {
      throw new DatabaseError(error);
    }
    const counts = { total: 0, available: 0, inUse: 0, maintenance: 0, outOfService: 0 };
    if (!data) return counts;
    counts.total = data.length;
    for (const row of data) {
      const status = row.status;
      if (status === 'available') counts.available++;
      else if (status === 'in-use') counts.inUse++;
      else if (status === 'maintenance') counts.maintenance++;
      else if (status === 'out-of-service') counts.outOfService++;
    }
    return counts;
  }

  async deactivateMachine(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from("machines")
      .update({ is_active: false, status: "out-of-service" })
      .eq("id", id);

    if (error) {
      throw new DatabaseError(error);
    }
  }
}
