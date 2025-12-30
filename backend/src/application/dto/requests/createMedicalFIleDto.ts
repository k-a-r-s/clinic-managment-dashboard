import { z } from 'zod';

export const createMedicalFileDtoSchema = z.object({
    patientId: z.uuidv4(),
    // doctorId can be omitted or null when creating the file (e.g., on patient creation)
    doctorId: z.uuidv4().optional().nullable(),
    data: z.record(z.string(), z.any()).nullable(),
});

export type CreateMedicalFileDto = z.infer<typeof createMedicalFileDtoSchema>;