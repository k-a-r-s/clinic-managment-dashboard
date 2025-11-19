import { Request, Response } from "express";
import { UserAuthService } from "../../application/services/UserAuthService";

export class AuthController {
    constructor(private userAuthService: UserAuthService) {}

    async signUp(req: Request, res: Response) {
        // TODO: Implement signup logic
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        const result = await this.userAuthService.loginUser(email, password);

        res.json({
            status: 200,
            success: true,
            data: result
        });
    }

    async logout(req: Request, res: Response) {
        // TODO: Implement logout logic
    }
}