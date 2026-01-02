import { IDialysisRepository } from "../../../domain/repositories/IDialysisRepository";

export class UpdateProtocol {
  constructor(private dialysisRepository: IDialysisRepository) {}

  async execute(id: string, data: any) {
    return this.dialysisRepository.updateProtocol(id, data);
  }
}
