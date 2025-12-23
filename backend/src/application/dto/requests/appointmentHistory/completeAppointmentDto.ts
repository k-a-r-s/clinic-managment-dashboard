import { z } from "zod";

export const completeAppointmentDto = z.object({
    patientId: z.string().uuid().optional(),
    doctorId: z.string().uuid().optional(),
    appointmentData: z.record(z.string(), z.any()).optional().describe("Appointment results/data object"),
});

export type CompleteAppointmentDto = z.infer<typeof completeAppointmentDto>;
