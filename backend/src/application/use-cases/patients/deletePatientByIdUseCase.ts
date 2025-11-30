import { IPatientRepository } from "../../../domain/repositories/IPatientRepository";

export class DeletePatientByIdUseCase {
  constructor(private patientRepository: IPatientRepository) {}
  async execute(id: string) {
    return await this.patientRepository.deletePatientByid(id);
  }
}
