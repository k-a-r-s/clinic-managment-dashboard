import { IDialysisRepository } from "../../../domain/repositories/IDialysisRepository";

export class UpdateDialysisPatient {
  constructor(private dialysisRepository: IDialysisRepository) { }

  async execute(
    id: string,
    data: {
      status?: "active" | "paused" | "stopped";
      notes?: string;
    }
  ) {
    return this.dialysisRepository.updateDialysisPatient(id, data);
  }
}
