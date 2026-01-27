"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllUsersUseCase = void 0;
class GetAllUsersUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(roleFilter) {
        return await this.userRepository.getAllUsers(roleFilter);
    }
}
exports.GetAllUsersUseCase = GetAllUsersUseCase;
