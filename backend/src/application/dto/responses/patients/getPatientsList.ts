interface PatientList {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  birthDate: string;
  address: string;
  profession: string;
  childrenNumber: number;
  familySituation: string;
  insuranceNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}
export type GetPatientsListResponseDto = PatientList[];
