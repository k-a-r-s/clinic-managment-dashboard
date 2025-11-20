import { LoginResponseDto } from "../../application/dto/responses/LoginResponseDto";
import { User } from "../entities/User";

export interface IUserAuthService {
    loginUser(email: string, password: string): Promise<LoginResponseDto>;
    logoutUser(userId: string): Promise<void>;
    refreshToken(refreshToken: string): Promise<LoginResponseDto>;
    createUser(user: User): Promise<User>;
}