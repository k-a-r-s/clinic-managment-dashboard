import { Machine } from "../../domain/entities/Machine";
import { IMachineRepository } from "../../domain/repositories/IMachineRepository";
import { supabaseAdmin } from "../database/supabase";
import { DatabaseError } from "../errors/DatabaseError";

export class MachineRepository implements IMachineRepository {
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
      serialNumber: data.serial_number,
      room: data.room,
      status: data.status as 'available' | 'in-use' | 'maintenance' | 'out-of-service',
      lastMaintenanceDate: data.last_maintenance_date,
      nextMaintenanceDate: data.next_maintenance_date,
      createdAt: data.created_at
    });
  }

  async getMachines(): Promise<Machine[]> {
    const { data, error } = await supabaseAdmin
      .from("machines")
      .select()
      .order('machine_id');

    if (error) {
      throw new DatabaseError(error);
    }
    if (!data) {
      throw new DatabaseError("Failed to get machines");
    }

    return data.map((machine: any) => {  // Add type annotation here
      return new Machine({
        id: machine.id,
        machineId: machine.machine_id,
        serialNumber: machine.serial_number,
        room: machine.room,
        status: machine.status as 'available' | 'in-use' | 'maintenance' | 'out-of-service',
        lastMaintenanceDate: machine.last_maintenance_date,
        nextMaintenanceDate: machine.next_maintenance_date,
        createdAt: machine.created_at
      });
    });
  }

  async createMachine(machine: Machine): Promise<Machine> {
    const machineData = {
      machine_id: machine.getMachineId(),
      serial_number: machine.getSerialNumber(),
      room: machine.getRoom(),
      status: machine.getStatus(),
      last_maintenance_date: machine.getLastMaintenanceDate(),
      next_maintenance_date: machine.getNextMaintenanceDate()
    };

    const { data, error } = await supabaseAdmin
      .from("machines")
      .insert(machineData)
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
      serialNumber: data.serial_number,
      room: data.room,
      status: data.status as 'available' | 'in-use' | 'maintenance' | 'out-of-service',
      lastMaintenanceDate: data.last_maintenance_date,
      nextMaintenanceDate: data.next_maintenance_date,
      createdAt: data.created_at
    });
  }

  async updateMachine(machine: Machine): Promise<void> {
    const machineData = {
      machine_id: machine.getMachineId(),
      serial_number: machine.getSerialNumber(),
      room: machine.getRoom(),
      status: machine.getStatus(),
      last_maintenance_date: machine.getLastMaintenanceDate(),
      next_maintenance_date: machine.getNextMaintenanceDate()
    };

    const { error } = await supabaseAdmin
      .from("machines")
      .update(machineData)
      .eq("id", machine.getId());

    if (error) {
      throw new DatabaseError(error);
    }
  }

  async deleteMachine(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from("machines")
      .delete()
      .eq("id", id);

    if (error) {
      throw new DatabaseError(error);
    }
  }
}