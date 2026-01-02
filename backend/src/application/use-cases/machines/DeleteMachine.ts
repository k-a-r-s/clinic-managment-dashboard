import { IMachineRepository } from "../../../domain/repositories/IMachineRepository";
import { AppError } from "../../../infrastructure/errors/AppError";

export class DeleteMachine {
  constructor(private machineRepository: IMachineRepository) {}

  async execute(id: string): Promise<void> {
    const existingMachine = await this.machineRepository.getMachineById(id);
    if (!existingMachine) {
      throw new AppError("Machine not found", 404);
    }

    await this.machineRepository.deleteMachine(id);
  }
}
