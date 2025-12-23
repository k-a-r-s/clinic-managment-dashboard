import { z } from "zod";

export const createAppointmentHistoryDto = z.object({
    appointmentId: z.string().uuid(),
    appointmentData: z.record(z.string(), z.any()).describe("Appointment results/data object"),
});

export type CreateAppointmentHistoryDto = z.infer<typeof createAppointmentHistoryDto>;
