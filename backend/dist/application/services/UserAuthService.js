"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthService = void 0;
const DatabaseError_1 = require("../../infrastructure/errors/DatabaseError");
const logger_1 = require("../../shared/utils/logger");
const LoginResponseDto_1 = require("../dto/responses/LoginResponseDto");
const RefreshTokenResponseDto_1 = require("../dto/responses/RefreshTokenResponseDto");
class UserAuthService {
    constructor(userRepository, authRepository) {
        this.userRepository = userRepository;
        this.authRepository = authRepository;
    }
    async loginUser(email, password) {
        logger_1.Logger.info("🔐 Login attempt", { email });
        const authResponse = await this.authRepository.login(email, password);
        // Get full user profile from database
        const profile = await this.userRepository.findByAuthUUID(authResponse.user.getId());
        if (!profile) {
            logger_1.Logger.error("❌ Profile not found", {
                userId: authResponse.user.getId(),
            });
            throw new DatabaseError_1.DatabaseError("User profile not found");
        }
        logger_1.Logger.info("✅ Login successful", {
            email,
            userId: profile.getId(),
            role: profile.getRole(),
        });
        return new LoginResponseDto_1.LoginResponseDto(authResponse.access_token, authResponse.refresh_token, authResponse.expires_in || 3600, authResponse.token_type || "Bearer", profile // Pass the User instance directly
        );
    }
    async logoutUser(userId) {
        logger_1.Logger.info("🔐 Logout attempt", { userId });
        await this.authRepository.logout(userId);
    }
    async refreshToken(refreshToken) {
        logger_1.Logger.info("🔄 Refresh token attempt", { refreshToken });
        const authResponse = await this.authRepository.refreshToken(refreshToken);
        logger_1.Logger.info("✅ Refresh token successful", {
            access_token: authResponse.access_token,
        });
        return new RefreshTokenResponseDto_1.RefreshTokenResponseDto(authResponse.refresh_token, authResponse.access_token, authResponse.expires_in || 3600, authResponse.token_type || "Bearer");
    }
    async addUser(firstName, lastName, email, password, role) {
        logger_1.Logger.info("🔐 Create user attempt", { email });
        return await this.userRepository.addUser(firstName, lastName, email, password, role);
    }
}
exports.UserAuthService = UserAuthService;
