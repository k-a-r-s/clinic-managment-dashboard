interface PatientList {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    age: number;
    gender: string;
}
export type GetPatientsListResponseDto = PatientList[];