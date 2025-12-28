export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  age: number;
  gender : string;
}

export interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phoneNumber: string;
  profession: string;
  childrenNumber: number;
  familySituation: string;
  birthDate: string;
  gender: string;
  insuranceNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}
