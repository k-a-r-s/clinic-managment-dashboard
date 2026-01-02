import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { GetUsersListResponseDto } from "../../dto/responses/users/getUsersList";

export class GetAllUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(roleFilter?: string): Promise<GetUsersListResponseDto> {
    return await this.userRepository.getAllUsers(roleFilter);
  }
}
