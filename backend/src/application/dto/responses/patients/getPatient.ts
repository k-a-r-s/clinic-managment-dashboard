export interface GetPatientResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  gender: string;
  address: string;
  profession: string;
  childrenNumber: number;
  familySituation: string;
  insuranceNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalFileId: string | null;
}

export type GetPatientByIdResponseDto = GetPatientResponseDto;
