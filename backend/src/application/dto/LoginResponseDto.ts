export class LoginResponseDto {
    constructor(
        public accessToken: string,
        public refreshToken: string,
        public expiresIn: number,
        public tokenType: string,
        public user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
        }
    ) {}

    toJSON() {
        return {
            status: 200,
            success: true,
            data: {
                accessToken: this.accessToken,
                refreshToken: this.refreshToken,
                expiresIn: this.expiresIn,
                tokenType: this.tokenType,
                user: this.user
            }
        };
    }
}
