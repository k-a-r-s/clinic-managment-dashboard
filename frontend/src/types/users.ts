// User Types - Based on profiles, doctors, and receptionists tables

export type UserRole = "doctor" | "receptionist";

export interface BaseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface DoctorDetails {
  phoneNumber: string;
  salary: number;
  isMedicalDirector: boolean;
  specialization: string;
}

export interface ReceptionistDetails {
  phoneNumber: string;
}

export interface User extends BaseUser {
  // Role-specific details
  doctorDetails?: DoctorDetails;
  receptionistDetails?: ReceptionistDetails;
}

export interface UserFormData {
  // Common fields (profiles table)
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;

  // Doctor-specific fields
  phoneNumber?: string;
  salary?: number;
  isMedicalDirector?: boolean;
  specialization?: string;
}

export interface CreateUserPayload {
  profile: {
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    password: string;
  };
  doctorDetails?: {
    phoneNumber: string;
    salary: number;
    isMedicalDirector: boolean;
    specialization: string;
  };
  receptionistDetails?: {
    phoneNumber: string;
  };
}
