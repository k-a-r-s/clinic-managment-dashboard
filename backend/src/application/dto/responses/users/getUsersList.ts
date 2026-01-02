export interface UserListDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber?: string;
  createdAt: string;
  isActive: boolean;
  // Role-specific fields
  salary?: number;
  specialization?: string;
  isMedicalDirector?: boolean;
}

export type GetUsersListResponseDto = UserListDto[];
