"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserUseCase = void 0;
class UpdateUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(id, updateData) {
        return await this.userRepository.updateUser(id, updateData);
    }
}
exports.UpdateUserUseCase = UpdateUserUseCase;
