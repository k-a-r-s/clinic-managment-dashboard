"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const ResponseFormatter_1 = require("../utils/ResponseFormatter");
class UserController {
    constructor(userAuthService, getAllUsersUseCase, getUserByIdUseCase, updateUserUseCase, deleteUserUseCase) {
        this.userAuthService = userAuthService;
        this.getAllUsersUseCase = getAllUsersUseCase;
        this.getUserByIdUseCase = getUserByIdUseCase;
        this.updateUserUseCase = updateUserUseCase;
        this.deleteUserUseCase = deleteUserUseCase;
    }
    async addUser(req, res) {
        const { email, password, firstName, lastName, role, phoneNumber, salary, specialization, isMedicalDirector, } = req.body;
        const user = await this.userAuthService.addUser(firstName, lastName, email, password, role, phoneNumber, salary, specialization, isMedicalDirector);
        return ResponseFormatter_1.ResponseFormatter.success(res, user, "User created successfully", 201);
    }
    async getAllUsers(req, res) {
        const { role } = req.query;
        const users = await this.getAllUsersUseCase.execute(role);
        return ResponseFormatter_1.ResponseFormatter.success(res, users, "Users retrieved successfully");
    }
    async getUserById(req, res) {
        const { id } = req.params;
        const user = await this.getUserByIdUseCase.execute(id);
        return ResponseFormatter_1.ResponseFormatter.success(res, user, "User retrieved successfully");
    }
    async updateUser(req, res) {
        const { id } = req.params;
        const updateData = req.body;
        const user = await this.updateUserUseCase.execute(id, updateData);
        return ResponseFormatter_1.ResponseFormatter.success(res, user, "User updated successfully");
    }
    async deleteUser(req, res) {
        const { id } = req.params;
        await this.deleteUserUseCase.execute(id);
        return ResponseFormatter_1.ResponseFormatter.success(res, null, "User deleted successfully");
    }
}
exports.UserController = UserController;
