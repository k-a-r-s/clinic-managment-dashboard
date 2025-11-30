import { z } from "zod";

export const PatientResponseSchemaDto = z.object({
  id: z.number().int().positive(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(1),
  address: z.string().min(1),
  profession: z.string().min(1),
  childrenNumber: z.number().int().min(0),
  familySituation: z.string().min(1),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD"),
  gender: z.string().min(1),
  insuranceNumber: z.string().min(1),
  emergencyContactName: z.string().min(1),
  emergencyContactPhone: z.string().min(1),
  allergies: z.array(z.string()),
  currentMedications: z.array(z.string()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type PatientResponseDto = z.infer<typeof PatientResponseSchemaDto>;
