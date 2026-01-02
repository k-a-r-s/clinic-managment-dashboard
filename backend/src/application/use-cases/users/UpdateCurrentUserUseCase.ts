import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class UpdateCurrentUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    userId: string,
    updateData: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phoneNumber?: string;
    }
  ): Promise<any> {
    // Only allow updating specific fields for current user
    const allowedFields = {
      firstName: updateData.firstName,
      lastName: updateData.lastName,
      email: updateData.email,
      phoneNumber: updateData.phoneNumber,
    };

    // Remove undefined fields
    const filteredData = Object.fromEntries(
      Object.entries(allowedFields).filter(([_, value]) => value !== undefined)
    );

    return await this.userRepository.updateUser(userId, filteredData);
  }
}
