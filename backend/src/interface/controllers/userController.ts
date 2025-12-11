import { IUserAuthService } from "../../domain/services/IUserAuthService";
import { AuthRequest } from "../middlewares/authMiddleware";
import { Response } from "express";
import { ResponseFormatter } from "../utils/ResponseFormatter";

export class UserController {
  constructor(private userAuthService: IUserAuthService) {}
  async addUser(req: AuthRequest, res: Response) {
    const { email, password, firstName, lastName, role } = req.body;
    const user = await this.userAuthService.addUser(
      firstName,
      lastName,
      email,
      password,
      role
    );
    return ResponseFormatter.success(res, user, "User created successfully", 201);
  }
}
