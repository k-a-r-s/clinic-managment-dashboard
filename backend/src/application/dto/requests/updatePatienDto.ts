import { z } from 'zod';

export const updatePatientSchemaDto = z.object({
    firstName: z.string().min(1, 'First name is required').optional(),
    lastName: z.string().min(1, 'Last name is required').optional(),
    email: z.string().email('Invalid email address').optional(),
    phoneNumber: z.string().min(1, 'Phone number is required').optional(),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Birth date must be in YYYY-MM-DD format').optional(),
    gender: z.string().min(1, 'Gender is required').optional(),
    address: z.string().min(1, 'Address is required').optional(),
    profession: z.string().min(1, 'Profession is required').optional(),
    childrenNumber: z.number().int().min(0, 'Children number cannot be negative').optional(),
    familySituation: z.string().min(1, 'Family situation is required').optional(),
    insuranceNumber: z.string().min(1, 'Insurance number is required').optional(),
    emergencyContactName: z.string().min(1, 'Emergency contact name is required').optional(),
    emergencyContactPhone: z.string().min(1, 'Emergency contact phone is required').optional(),
    medicalFileId: z.string().uuid().optional()
});

export type UpdatePatientDto = z.infer<typeof updatePatientSchemaDto>;
