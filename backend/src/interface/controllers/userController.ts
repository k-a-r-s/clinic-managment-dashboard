import { IUserAuthService } from "../../domain/services/IUserAuthService";
import { AuthRequest } from "../middlewares/authMiddleware";
import { Response } from "express";

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
    res.json({
      success: true,
      status: 200,
      data: user,
      error: null,
    });
  }
}
