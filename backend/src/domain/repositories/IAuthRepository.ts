export interface IAuthRepository {
    login(email: string, password: string): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        token_type: string;
        user: any;
    }>;
    logout(authUUID: string): Promise<void>;
}