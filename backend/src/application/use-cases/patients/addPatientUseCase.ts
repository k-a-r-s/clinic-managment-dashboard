import { Patient } from "../../../domain/entities/Patient";
import { IPatientRepository } from "../../../domain/repositories/IPatientRepository";
import { AddPatientDto } from "../../dto/requests/addpatientDto";
import { v4 as uuidv4 } from "uuid";

export class AddPatientUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  async execute(patientData: AddPatientDto) {
    const id = uuidv4();
    const patient = new Patient({
      id,
      ...patientData,
      allergies: patientData.allergies || [],
      currentMedications: patientData.currentMedications || [],
    });
    return (await this.patientRepository.addPatient(patient)).toJson();
  }
}
