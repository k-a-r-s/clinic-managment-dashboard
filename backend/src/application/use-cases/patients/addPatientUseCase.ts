import { Patient } from "../../../domain/entities/Patient";
import { IPatientRepository } from "../../../domain/repositories/IPatientRepository";
import { AddPatientDto } from "../../dto/requests/addPatientDto";
import { v4 as uuidv4 } from "uuid";
import { createMedicalFileUseCase } from "../medicalFile/createMedicalFIleUseCase";
import { UUID } from "crypto";

export class AddPatientUseCase {
  constructor(
    private patientRepository: IPatientRepository,
    private createMedicalFileUseCase: createMedicalFileUseCase
  ) { }

  async execute(patientData: AddPatientDto) {
    const id = uuidv4();

    const patient = new Patient({
      id,
      ...patientData,
      medicalFileId: null,
    });

    await this.patientRepository.addPatient(patient);
  }
}
