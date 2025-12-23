import { IMachineRepository } from '../../../domain/repositories/IMachineRepository';

export class GetMachineByIdUseCase {
  constructor(private machineRepository: IMachineRepository) {}

  async execute(id: string) {
    return await this.machineRepository.getMachineById(id);
  }
}
