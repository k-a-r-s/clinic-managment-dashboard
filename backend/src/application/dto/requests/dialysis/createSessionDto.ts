import { z } from "zod";

export const createSessionDto = z.object({
  dialysisPatientId: z
    .string()
    .uuid("Dialysis patient ID must be a valid UUID"),
  sessionDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format for session date",
  }),
  durationMinutes: z.number().int().positive().optional(),
  completed: z.boolean().optional().default(false),
  complications: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateSessionDto = z.infer<typeof createSessionDto>;
