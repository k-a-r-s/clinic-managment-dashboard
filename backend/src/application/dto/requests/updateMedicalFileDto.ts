import { z } from 'zod';

export const updateMedicalFileDtoSchema = z.object({
    doctorId: z.string().optional(),
    data: z.record(z.string(), z.any()).optional(),
});

export type UpdateMedicalFileDto = z.infer<typeof updateMedicalFileDtoSchema>;