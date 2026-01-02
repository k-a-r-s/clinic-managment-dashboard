import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { GetUserByIdResponseDto } from "../../dto/responses/users/getUserById";
import { AppError } from "../../../infrastructure/errors/AppError";

export class GetUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<GetUserByIdResponseDto> {
    const user = await this.userRepository.getUserById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }
}
