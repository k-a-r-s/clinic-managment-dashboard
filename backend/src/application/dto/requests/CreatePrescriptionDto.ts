import { z } from 'zod';

export const createPrescriptionSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  doctorId: z.string().uuid('Invalid doctor ID'),
  appointmentId: z.string().uuid('Invalid appointment ID').optional(),
  prescriptionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').optional(),
  medications: z.array(z.object({
    medicationName: z.string().min(1, 'Medication name is required'),
    dosage: z.string().min(1, 'Dosage is required'),
    frequency: z.string().min(1, 'Frequency is required'),
    duration: z.string().min(1, 'Duration is required'),
    notes: z.string().optional()
  })).min(1, 'At least one medication is required')
});

export type CreatePrescriptionDto = z.infer<typeof createPrescriptionSchema>;