"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCurrentUserUseCase = void 0;
class UpdateCurrentUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userId, updateData) {
        // Only allow updating specific fields for current user
        const allowedFields = {
            firstName: updateData.firstName,
            lastName: updateData.lastName,
            email: updateData.email,
            phoneNumber: updateData.phoneNumber,
        };
        // Remove undefined fields
        const filteredData = Object.fromEntries(Object.entries(allowedFields).filter(([_, value]) => value !== undefined));
        return await this.userRepository.updateUser(userId, filteredData);
    }
}
exports.UpdateCurrentUserUseCase = UpdateCurrentUserUseCase;
