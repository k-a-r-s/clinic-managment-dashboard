import { IPatientRepository } from "../../../domain/repositories/IPatientRepository";

export class GetPatientByIdUseCase {
  constructor(private patientRepository: IPatientRepository) {}
  async execute(id: string) {
    return (await this.patientRepository.getPatientByid(id)).toJson();
  }
}
