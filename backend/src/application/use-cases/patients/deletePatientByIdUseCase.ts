import { IPatientRepository } from "../../../domain/repositories/IPatientRepository";

export class DeletePatientByIdUseCase {
  constructor(private patientRepository: IPatientRepository) {}
  async execute(id: string) {
    await this.patientRepository.deletePatientByid(id);
  }
}
