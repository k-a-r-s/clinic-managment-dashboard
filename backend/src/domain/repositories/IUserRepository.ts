import { User } from "../entities/User";

export interface IUserRepository {
  findByAuthUUID(authUUID: string): Promise<User | null>;
  addUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: "doctor" | "receptionist"
  ): Promise<User>;
}
