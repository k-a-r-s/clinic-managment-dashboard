import { z } from 'zod';

export const createMedicalFileDtoSchema = z.object({
    userId: z.uuidv4(),
    doctorId: z.uuidv4(),
    data: z.record(z.string(), z.any()).nullable(),
});

export type CreateMedicalFileDto = z.infer<typeof createMedicalFileDtoSchema>;