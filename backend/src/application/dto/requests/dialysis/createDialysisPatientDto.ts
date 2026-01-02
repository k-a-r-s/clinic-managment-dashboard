import { z } from "zod";

export const createDialysisPatientDto = z.object({
  patientId: z.string().uuid("Patient ID must be a valid UUID"),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format for start date",
  }),
  status: z.enum(["active", "paused", "stopped"]).optional().default("active"),
  notes: z.string().optional(),
});

export type CreateDialysisPatientDto = z.infer<typeof createDialysisPatientDto>;
