export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  role: 'doctor' | 'receptionist';
  tempPassword?: string; // optional temp password
}