import { z } from 'zod';

export const addPatientSchemaDto = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Birth date must be in YYYY-MM-DD format'),
  gender: z.string().min(1, 'Gender is required'),
  address: z.string().min(1, 'Address is required'),
  profession: z.string().min(1, 'Profession is required'),
  childrenNumber: z.number().int().min(0, 'Children number cannot be negative'),
  familySituation: z.string().min(1, 'Family situation is required'),
  insuranceNumber: z.string().min(1, 'Insurance number is required'),
  emergencyContactName: z.string().min(1, 'Emergency contact name is required'),
  emergencyContactPhone: z.string().min(1, 'Emergency contact phone is required'),
  
});

export type AddPatientDto = z.infer<typeof addPatientSchemaDto>;
