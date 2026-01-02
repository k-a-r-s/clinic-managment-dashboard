import { z } from "zod";

export const StatusEnum = z.enum([
  "SCHEDULED",
  "COMPLETED",
  "CANCELED",
  "NO_SHOW",
]);

export const addAppointmentDto = z.object({
  patientId: z.uuid("Patient ID must be a valid UUID"),
  doctorId: z.uuid("Doctor ID must be a valid UUID"),
  roomId: z.uuid("Room ID must be a valid UUID"),
  createdByDoctorId: z
    .uuid()
    .nullish()
    .transform((val) => (val === undefined ? null : val)),
  createdByReceptionId: z
    .uuid()
    .nullish()
    .transform((val) => (val === undefined ? null : val)),
  appointmentDate: z.coerce.date(),
  estimatedDurationInMinutes: z
    .number()
    .int()
    .positive("Duration must be positive")
    .optional()
    .default(30),
  status: StatusEnum,
});

export type AddAppointmentDto = z.infer<typeof addAppointmentDto>;
export type Status = z.infer<typeof StatusEnum>;
