import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UpdateUserDto } from "../../dto/requests/updateUserDto";
import { GetUserByIdResponseDto } from "../../dto/responses/users/getUserById";

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    id: string,
    updateData: UpdateUserDto
  ): Promise<GetUserByIdResponseDto> {
    return await this.userRepository.updateUser(id, updateData);
  }
}
