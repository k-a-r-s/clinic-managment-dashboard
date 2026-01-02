import { z } from "zod";

export const StatusEnum = z.enum([
  "SCHEDULED",
  "COMPLETED",
  "CANCELED",
  "NO_SHOW",
]);

export const updateAppointmentDto = z.object({
  patientId: z.uuid("Patient ID must be a valid UUID").optional(),
  doctorId: z.uuid("Doctor ID must be a valid UUID").optional(),
  roomId: z.uuid("Room ID must be a valid UUID").optional(),
  appointmentDate: z.coerce.date().optional(),
  estimatedDurationInMinutes: z
    .number()
    .int()
    .positive("Duration must be positive")
    .optional(),
  status: StatusEnum.optional(),
});

export type UpdateAppointmentDto = z.infer<typeof updateAppointmentDto>;
