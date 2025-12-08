import { MachineRepository } from '../infrastructure/repositories/MachineRepository'
import { PrescriptionRepository } from '../infrastructure/repositories/PrescriptionRepository'

import { GetAllMachinesUseCase } from '../application/use-cases/machines/GetAllMachinesUseCase'
import { CreateMachineUseCase } from '../application/use-cases/machines/CreateMachineUseCase'
import { GetMachineByIdUseCase } from '../application/use-cases/machines/GetMachineByIdUseCase'

import { CreatePrescriptionUseCase } from '../application/use-cases/prescriptions/CreatePrescriptionUseCase'
import { GetPrescriptionsByPatientUseCase } from '../application/use-cases/prescriptions/GetPrescriptionsByPatientUseCase'


type Constructor<T> = new (...args: any[]) => T;

// Repositories
const machineRepository = new MachineRepository();
const prescriptionRepository = new PrescriptionRepository();

// Use Cases
const useCaseMap = new Map<any, any>([
  [GetAllMachinesUseCase, new GetAllMachinesUseCase(machineRepository)],
  [CreateMachineUseCase, new CreateMachineUseCase(machineRepository)],
  [GetMachineByIdUseCase, new GetMachineByIdUseCase(machineRepository)],

  [CreatePrescriptionUseCase, new CreatePrescriptionUseCase(prescriptionRepository)],
  [GetPrescriptionsByPatientUseCase, new GetPrescriptionsByPatientUseCase(prescriptionRepository)]
]);

// ✅ Fully typed container
export const container = {
  resolve<T>(UseCase: Constructor<T>): T {
    const instance = useCaseMap.get(UseCase);

    if (!instance) {
      throw new Error(`Use case ${UseCase.name} not found in container`);
    }

    return instance as T;
  }
};
