import { User } from "../entities/User";

export interface IUserRepository {
    findByAuthUUID(authUUID: string): Promise<void>;
    findByEmail(email: string): Promise<void>;
    createUser(user: User, authUUID: string): Promise<void>;
    updateUserRole(userId: number, roleName: string): Promise<void>;
}