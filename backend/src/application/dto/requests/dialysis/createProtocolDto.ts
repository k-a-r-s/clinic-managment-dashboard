import { z } from "zod";

export const createProtocolDto = z.object({
  dialysisPatientId: z
    .string()
    .uuid("Dialysis patient ID must be a valid UUID"),
  dialysisType: z.enum(["hemodialysis", "peritoneal"]),
  sessionsPerWeek: z.number().int().positive(),
  sessionDurationMinutes: z.number().int().positive(),
  accessType: z.enum(["fistula", "catheter", "graft"]),
  targetWeightKg: z.number().positive().optional(),
  notes: z.string().optional(),
});

export type CreateProtocolDto = z.infer<typeof createProtocolDto>;
