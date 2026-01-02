import { IDialysisRepository } from "../../../domain/repositories/IDialysisRepository";

export class GetSessionById {
  constructor(private dialysisRepository: IDialysisRepository) {}

  async execute(id: string) {
    return this.dialysisRepository.getSessionById(id);
  }
}
