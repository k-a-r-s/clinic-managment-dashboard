import { IUserAuthService } from "../../domain/services/IUserAuthService";
import { AuthRequest } from "../middlewares/authMiddleware";
import { Response } from "express";
import { ResponseFormatter } from "../utils/ResponseFormatter";
import { GetAllUsersUseCase } from "../../application/use-cases/users/GetAllUsersUseCase";
import { GetUserByIdUseCase } from "../../application/use-cases/users/GetUserByIdUseCase";
import { UpdateUserUseCase } from "../../application/use-cases/users/UpdateUserUseCase";
import { DeleteUserUseCase } from "../../application/use-cases/users/DeleteUserUseCase";

export class UserController {
  constructor(
    private userAuthService: IUserAuthService,
    private getAllUsersUseCase: GetAllUsersUseCase,
    private getUserByIdUseCase: GetUserByIdUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase
  ) {}

  async addUser(req: AuthRequest, res: Response) {
    const {
      email,
      password,
      firstName,
      lastName,
      role,
      phoneNumber,
      salary,
      specialization,
      isMedicalDirector,
    } = req.body;
    const user = await this.userAuthService.addUser(
      firstName,
      lastName,
      email,
      password,
      role,
      phoneNumber,
      salary,
      specialization,
      isMedicalDirector
    );
    return ResponseFormatter.success(
      res,
      user,
      "User created successfully",
      201
    );
  }

  async getAllUsers(req: AuthRequest, res: Response) {
    const { role } = req.query;
    const users = await this.getAllUsersUseCase.execute(role as string);
    return ResponseFormatter.success(
      res,
      users,
      "Users retrieved successfully"
    );
  }

  async getUserById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const user = await this.getUserByIdUseCase.execute(id);
    return ResponseFormatter.success(res, user, "User retrieved successfully");
  }

  async updateUser(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const updateData = req.body;
    const user = await this.updateUserUseCase.execute(id, updateData);
    return ResponseFormatter.success(res, user, "User updated successfully");
  }

  async deleteUser(req: AuthRequest, res: Response) {
    const { id } = req.params;
    await this.deleteUserUseCase.execute(id);
    return ResponseFormatter.success(res, null, "User deleted successfully");
  }
}
