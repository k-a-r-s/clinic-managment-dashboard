import { IDialysisRepository } from "../../../domain/repositories/IDialysisRepository";
import { DialysisSession } from "../../../domain/entities/DialysisSession";

export class GetSessionsByPatientId {
  constructor(private dialysisRepository: IDialysisRepository) {}

  async execute(dialysisPatientId: string): Promise<DialysisSession[]> {
    return await this.dialysisRepository.getSessionsByPatientId(
      dialysisPatientId
    );
  }
}
