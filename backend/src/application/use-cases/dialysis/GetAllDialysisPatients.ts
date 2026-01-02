import { IDialysisRepository } from "../../../domain/repositories/IDialysisRepository";
import { DialysisPatient } from "../../../domain/entities/DialysisPatient";

export class GetAllDialysisPatients {
  constructor(private dialysisRepository: IDialysisRepository) {}

  async execute(filters?: { status?: string }): Promise<DialysisPatient[]> {
    return await this.dialysisRepository.getAllDialysisPatients(filters);
  }
}
