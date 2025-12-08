import { Machine } from "../entities/Machine";

export interface IMachineRepository {
  getMachineById(id: string): Promise<Machine | null>;
  getMachines(): Promise<Machine[]>;
  createMachine(machine: Machine): Promise<Machine>;
  updateMachine(machine: Machine): Promise<void>;
  deleteMachine(id: string): Promise<void>;
}