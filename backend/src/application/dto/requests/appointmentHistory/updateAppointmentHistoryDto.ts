import { z } from "zod";

export const updateAppointmentHistoryDto = z.object({
    appointmentData: z.record(z.string(), z.any()).describe("Updated medical data object"),
}).partial();

export type UpdateAppointmentHistoryDto = z.infer<typeof updateAppointmentHistoryDto>;
