import { z } from "zod";
import { createDialysisPatientDto } from "./createDialysisPatientDto";

export const updateDialysisPatientDto = createDialysisPatientDto.partial();

export type UpdateDialysisPatientDto = z.infer<typeof updateDialysisPatientDto>;
