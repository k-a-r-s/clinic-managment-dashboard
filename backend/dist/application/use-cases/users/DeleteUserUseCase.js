"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserUseCase = void 0;
class DeleteUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(id) {
        await this.userRepository.softDeleteUser(id);
    }
}
exports.DeleteUserUseCase = DeleteUserUseCase;
