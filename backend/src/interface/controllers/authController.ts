import { Request, Response } from "express";
import { UserAuthService } from "../../application/services/UserAuthService";
import { AuthRequest } from "../middlewares/authMiddleware";

export class AuthController {
    constructor(private userAuthService: UserAuthService) { }



    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        const result = await this.userAuthService.loginUser(email, password);

        res.json(result.toJSON());
    }

    async logout(req: AuthRequest, res: Response) {
        const userId = req.user?.id;
        await this.userAuthService.logoutUser(userId);
        res.json({
            status: 200,
            success: true,
            data: { message: 'Logged out successfully' }
        });
    }
    async createUser(req: Request, res: Response) {
        const userData = req.body;
        const newUser = await this.userAuthService.createUser(userData);
        res.status(201).json({
            status: 201,
            success: true,
            data: newUser
        });
    }
}