import { v4 as uuidv4 } from "uuid";
import { IDialysisRepository } from "../../../domain/repositories/IDialysisRepository";
import { DialysisPatient } from "../../../domain/entities/DialysisPatient";
import { CreateDialysisPatientDto } from "../../dto/requests/dialysis/createDialysisPatientDto";

export class CreateDialysisPatient {
  constructor(private dialysisRepository: IDialysisRepository) {}

  async execute(data: CreateDialysisPatientDto): Promise<DialysisPatient> {
    const dialysisPatient = new DialysisPatient({
      id: uuidv4(),
      patientId: data.patientId,
      startDate: new Date(data.startDate),
      status: data.status || "active",
      notes: data.notes,
    });

    return await this.dialysisRepository.createDialysisPatient(dialysisPatient);
  }
}
