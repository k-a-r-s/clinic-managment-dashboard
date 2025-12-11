interface PatientList {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;

}
export type GetPatientsListResponseDto = PatientList[];