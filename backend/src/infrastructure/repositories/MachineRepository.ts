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
      room: machine.getRoom(),
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
      room: data.room,
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
      room: data.room,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  }

  async getAllMachines(): Promise<Machine[]> {
    const { data, error } = await supabaseAdmin.from("machines").select();
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
        room: m.room,
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
        room: machine.getRoom(),
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
      room: data.room,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
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
