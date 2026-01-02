import { IDialysisRepository } from "../../../domain/repositories/IDialysisRepository";
import { DialysisProtocol } from "../../../domain/entities/DialysisProtocol";

export class GetProtocolByPatientId {
  constructor(private dialysisRepository: IDialysisRepository) {}

  async execute(dialysisPatientId: string): Promise<DialysisProtocol | null> {
    return await this.dialysisRepository.getProtocolByPatientId(
      dialysisPatientId
    );
  }
}
