import { Machine } from "../entities/Machine";

export interface IMachineRepository {
  createMachine(machine: Machine): Promise<Machine>;
  getMachineById(id: string): Promise<Machine | null>;
  getAllMachines(): Promise<Machine[]>;
  updateMachine(machine: Machine): Promise<Machine>;
  deactivateMachine(id: string): Promise<void>;
}
