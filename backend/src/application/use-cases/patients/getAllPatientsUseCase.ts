import { IPatientRepository } from "../../../domain/repositories/IPatientRepository";

export class GetAllPatientsUseCase {
  constructor(private patientRepository: IPatientRepository) {}
  async execute() {
    return await this.patientRepository.getAllPatients();
  }
}
