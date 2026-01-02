import { z } from "zod";
import { createSessionDto } from "./createSessionDto";

export const updateSessionDto = createSessionDto
  .omit({ dialysisPatientId: true })
  .partial();

export type UpdateSessionDto = z.infer<typeof updateSessionDto>;
