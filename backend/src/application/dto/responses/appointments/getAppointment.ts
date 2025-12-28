export interface AppointmentPatientDto {
  id: string;
  firstName?: string;
  lastName?: string;
  [key: string]: any;
}

export interface AppointmentDoctorDto {
  id: string;
  firstName?: string;
  lastName?: string;
  [key: string]: any;
}

export interface GetAppointmentByIdResponseDto {
  id: string;
  patient: AppointmentPatientDto | null;
  doctor: AppointmentDoctorDto | null;
  roomId: string | null;
  createdByReceptionistId: string | null;
  createdByDoctorId: string | null;
  appointmentDate: Date;
  estimatedDurationInMinutes: number | null;
  status: string;
}

export type GetAppointmentResponseDto = GetAppointmentByIdResponseDto;
