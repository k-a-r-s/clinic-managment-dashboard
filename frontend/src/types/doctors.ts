// Doctor Types
export interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  salary: number;
  isMedicalDirector: boolean;
  specialization: string;
  createdAt?: string;
  updatedAt?: string;
}

//CreateDoctorDto
export interface DoctorFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  salary: number;
  isMedicalDirector?: boolean;
  specialization: string;
}
