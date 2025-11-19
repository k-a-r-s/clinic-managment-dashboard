import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
export class UserRepository implements IUserRepository {
    
    async findByAuthUUID(authUUID: string): Promise<void> {
        // Implementation here
    }
    async findByEmail(email: string): Promise<void> {
        // Implementation here
    }
    async createUser(user: User, authUUID: string): Promise<void> {
        // Implementation here
    }
    async updateUserRole(userId: number, roleName: string): Promise<void> {
        // Implementation here
    }

}
