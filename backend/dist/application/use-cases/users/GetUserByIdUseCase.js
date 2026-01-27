"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserByIdUseCase = void 0;
const AppError_1 = require("../../../infrastructure/errors/AppError");
class GetUserByIdUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(id) {
        const user = await this.userRepository.getUserById(id);
        if (!user) {
            throw new AppError_1.AppError("User not found", 404);
        }
        return user;
    }
}
exports.GetUserByIdUseCase = GetUserByIdUseCase;
