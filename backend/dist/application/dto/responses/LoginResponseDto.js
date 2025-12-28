"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginResponseDto = void 0;
class LoginResponseDto {
    constructor(accessToken, refreshToken, expiresIn, tokenType, user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
        this.tokenType = tokenType;
        this.user = user;
    }
    toJSON() {
        return {
            status: 200,
            success: true,
            data: {
                accessToken: this.accessToken,
                refreshToken: this.refreshToken,
                expiresIn: this.expiresIn,
                tokenType: this.tokenType,
                user: {
                    id: this.user.getId(),
                    email: this.user.getEmail(),
                    firstName: this.user.getFirstName(),
                    lastName: this.user.getLastName(),
                    role: this.user.getRole(),
                },
            },
            error: null,
        };
    }
}
exports.LoginResponseDto = LoginResponseDto;
