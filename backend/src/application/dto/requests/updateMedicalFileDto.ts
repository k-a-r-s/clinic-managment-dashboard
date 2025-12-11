import { z } from 'zod';

export const updateMedicalFileDtoSchema = z.object({
    doctorId: z.string().nullable(),
    data: z.record(z.string(), z.any()).nullable(),
});

export type UpdateMedicalFileDto = z.infer<typeof updateMedicalFileDtoSchema>;