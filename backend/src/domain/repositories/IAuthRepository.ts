export interface IAuthRepository {
    login(email: string, password: string): Promise<{ data: any; error: any }>;
    logout(authUUID: string): Promise<void>;
}