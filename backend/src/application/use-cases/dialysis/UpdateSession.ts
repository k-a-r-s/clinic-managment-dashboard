import { IDialysisRepository } from "../../../domain/repositories/IDialysisRepository";

export class UpdateSession {
  constructor(private dialysisRepository: IDialysisRepository) {}

  async execute(id: string, data: any) {
    return this.dialysisRepository.updateSession(id, data);
  }
}
