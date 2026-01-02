import { User } from "../entities/User";

export interface IUserRepository {
  findByAuthUUID(authUUID: string): Promise<User | null>;
  addUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: "doctor" | "receptionist",
    phoneNumber?: string,
    salary?: number,
    specialization?: string,
    isMedicalDirector?: boolean
  ): Promise<User>;
  countStaff(): Promise<{
    doctors: number;
    receptionists: number;
    total: number;
  }>;
  getAllUsers(roleFilter?: string): Promise<any[]>;
  getUserById(id: string): Promise<any | null>;
  updateUser(id: string, updateData: any): Promise<any>;
  softDeleteUser(id: string): Promise<void>;
}
