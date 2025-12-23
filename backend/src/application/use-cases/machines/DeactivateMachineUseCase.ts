import { IMachineRepository } from '../../../domain/repositories/IMachineRepository';

export class DeactivateMachineUseCase {
  constructor(private machineRepository: IMachineRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.machineRepository.getMachineById(id);
    if (!existing) {
      throw new Error('Machine not found');
    }

    await this.machineRepository.deactivateMachine(id);
  }
}
