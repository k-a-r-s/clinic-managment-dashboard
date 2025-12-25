import { IPatientRepository } from "../../../domain/repositories/IPatientRepository";
import { GetPatientsListResponseDto } from "../../dto/responses/patients/getPatientsList";

export class GetAllPatientsUseCase {
  constructor(private patientRepository: IPatientRepository) { }
  async execute() {
    const data = await this.patientRepository.getAllPatients();
    return data.map(patient => ({
      id: patient.getId(),
      firstName: patient.getFirstName(),
      lastName: patient.getLastName(),
      email: patient.getEmail(),
      phoneNumber: patient.getPhoneNumber(),
      age: patient.getAge(),
      gender: patient.getGender(),
    })) satisfies GetPatientsListResponseDto;
  }
}
