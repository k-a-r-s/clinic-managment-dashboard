export interface UserDetailDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  // Doctor-specific fields
  salary?: number;
  specialization?: string;
  isMedicalDirector?: boolean;
}

export type GetUserByIdResponseDto = UserDetailDto;
