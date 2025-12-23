import { IReceptionistRepository } from "../../../domain/repositories/IReceptionistRepository";
import { GetReceptionistsList } from "../../dto/responses/getReceptionistsList";

export class GetReceptionistsListUseCase {
  constructor(private receptionistRepository: IReceptionistRepository) {}

  async execute(page: number, limit: number): Promise<GetReceptionistsList> {
    const offset = (page - 1) * limit;
    return this.receptionistRepository.getReceptionists(offset, limit);
  }
}
