import { IDialysisRepository } from "../../../domain/repositories/IDialysisRepository";

export class DeleteSession {
  constructor(private dialysisRepository: IDialysisRepository) {}

  async execute(id: string): Promise<void> {
    return this.dialysisRepository.deleteSession(id);
  }
}
