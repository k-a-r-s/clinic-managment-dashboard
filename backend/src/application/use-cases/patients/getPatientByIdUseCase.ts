import { IPatientRepository } from "../../../domain/repositories/IPatientRepository";
import { GetPatientByIdResponseDto } from "../../dto/responses/patients/getPatient";

export class GetPatientByIdUseCase {
  constructor(private patientRepository: IPatientRepository) { }
  async execute(id: string) {
    const patient = await this.patientRepository.getPatientByid(id);
    return {
      id: patient.getId(),
      firstName: patient.getFirstName(),
      lastName: patient.getLastName(),
      email: patient.getEmail(),
      phoneNumber: patient.getPhoneNumber(),
      birthDate: patient.getBirthDate(),
      gender: patient.getGender(),
      address: patient.getAddress(),
      profession: patient.getProfession(),
      childrenNumber: patient.getChildrenNumber(),
      familySituation: patient.getFamilySituation(),
      insuranceNumber: patient.getInsuranceNumber(),
      emergencyContactName: patient.getEmergencyContactName(),
      emergencyContactPhone: patient.getEmergencyContactPhone(),
      medicalFileId: patient.getMedicalFileId(),
    } satisfies GetPatientByIdResponseDto;
  }
}
