import { z } from "zod";
import { createProtocolDto } from "./createProtocolDto";

export const updateProtocolDto = createProtocolDto
  .omit({ dialysisPatientId: true })
  .partial();

export type UpdateProtocolDto = z.infer<typeof updateProtocolDto>;
