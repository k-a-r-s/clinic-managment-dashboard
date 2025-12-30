import { IPatientRepository } from "../../../domain/repositories/IPatientRepository";
import { GetPatientsListResponseDto } from "../../dto/responses/patients/getPatientsList";

export class GetAllPatientsUseCase {
  constructor(private patientRepository: IPatientRepository) {}
  async execute() {
    const data = await this.patientRepository.getAllPatients();
    return data.map((patient) => ({
      id: patient.getId(),
      firstName: patient.getFirstName(),
      lastName: patient.getLastName(),
      email: patient.getEmail(),
      phoneNumber: patient.getPhoneNumber(),
      gender: patient.getGender(),
      birthDate: patient.getBirthDate(),
      address: patient.getAddress(),
      profession: patient.getProfession(),
      childrenNumber: patient.getChildrenNumber(),
      familySituation: patient.getFamilySituation(),
      insuranceNumber: patient.getInsuranceNumber(),
      emergencyContactName: patient.getEmergencyContactName(),
      emergencyContactPhone: patient.getEmergencyContactPhone(),
    })) satisfies GetPatientsListResponseDto;
  }
}
