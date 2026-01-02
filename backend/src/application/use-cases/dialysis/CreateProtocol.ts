import { v4 as uuidv4 } from "uuid";
import { IDialysisRepository } from "../../../domain/repositories/IDialysisRepository";
import { DialysisProtocol } from "../../../domain/entities/DialysisProtocol";
import { CreateProtocolDto } from "../../dto/requests/dialysis/createProtocolDto";

export class CreateProtocol {
  constructor(private dialysisRepository: IDialysisRepository) {}

  async execute(data: CreateProtocolDto): Promise<DialysisProtocol> {
    const protocol = new DialysisProtocol({
      id: uuidv4(),
      dialysisPatientId: data.dialysisPatientId,
      dialysisType: data.dialysisType,
      sessionsPerWeek: data.sessionsPerWeek,
      sessionDurationMinutes: data.sessionDurationMinutes,
      accessType: data.accessType,
      targetWeightKg: data.targetWeightKg,
      notes: data.notes,
    });

    return await this.dialysisRepository.createProtocol(protocol);
  }
}
