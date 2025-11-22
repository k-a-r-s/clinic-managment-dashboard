import { LoginResponseDto } from "../../application/dto/responses/LoginResponseDto";
import { RefreshTokenResponseDto } from "../../application/dto/responses/RefreshTokenResponseDto";
import { User } from "../entities/User";

export interface IUserAuthService {
    loginUser(email: string, password: string): Promise<LoginResponseDto>;
    logoutUser(userId: string): Promise<void>;
    createUser(user: User, password: string): Promise<User>;  // ✅ Add password parameter
    refreshToken(refreshToken: string): Promise<RefreshTokenResponseDto>;
}