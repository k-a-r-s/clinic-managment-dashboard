import { z } from 'zod';

export const StatusEnum = z.enum(['SCHEDULED', 'COMPLETED', 'CANCELED', 'NO_SHOW']);

export const addAppointmentDto = z.object({
    patientId: z.string().min(1, 'Patient ID is required'),
    doctorId: z.string().min(1, 'Doctor ID is required'),
    roomId: z.string().min(1, 'Room ID is required'),
    createdByDoctorId: z.string().nullable(),
    createdByReceptionId: z.string().nullable(),
    appointmentDate: z.coerce.date(),
    estimatedDurationInMinutes: z.number().int().positive('Duration must be positive'),
    status: StatusEnum,
});

export type AddAppointmentDto = z.infer<typeof addAppointmentDto>;
export type Status = z.infer<typeof StatusEnum>;