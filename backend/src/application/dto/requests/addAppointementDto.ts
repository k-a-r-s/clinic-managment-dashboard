import { z } from 'zod';

export const StatusEnum = z.enum(['SCHEDULED', 'COMPLETED', 'CANCELED', 'NO_SHOW']);

export const addAppointmentDto = z.object({
    patientId: z.uuid('Patient ID must be a valid UUID'),
    doctorId: z.uuid('Doctor ID must be a valid UUID'),
    roomId: z.uuid('Room ID must be a valid UUID'),
    createdByDoctorId: z.uuid().nullable(),
    createdByReceptionId: z.uuid().nullable(),
    appointmentDate: z.coerce.date(),
    estimatedDurationInMinutes: z.number().int().positive('Duration must be positive'),
    status: StatusEnum,
});

export type AddAppointmentDto = z.infer<typeof addAppointmentDto>;
export type Status = z.infer<typeof StatusEnum>;