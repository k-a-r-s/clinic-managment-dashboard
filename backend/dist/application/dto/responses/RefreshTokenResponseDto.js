"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenResponseDto = void 0;
class RefreshTokenResponseDto {
    constructor(refresh_token, access_token, expires_in, token_type) {
        this.refresh_token = refresh_token;
        this.access_token = access_token;
        this.expires_in = expires_in;
        this.token_type = token_type;
    }
    toJSON() {
        return {
            status: 200,
            success: true,
            data: {
                refresh_token: this.refresh_token,
                access_token: this.access_token,
                expires_in: this.expires_in,
                token_type: this.token_type,
            },
            error: null,
        };
    }
}
exports.RefreshTokenResponseDto = RefreshTokenResponseDto;
