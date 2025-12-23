import z from "zod";

export const updateDoctorDtoSchema = z.object({
  firstName: z.string().min(3).max(255).optional().nullable(),
  lastName: z.string().min(3).max(255).optional().nullable(),
  email: z.string().email().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  role: z.enum(["DOCTOR"]).optional().nullable(),
  salary: z.coerce.number().positive().optional().nullable(),
  isMedicalDirector: z.boolean().optional().nullable(),
  specialization: z.string().min(1).max(255).optional().nullable(),
  is_medical_director: z.boolean().optional().nullable(),
  // Allow snake_case from database
}).passthrough();

export type updateDoctorDto = z.infer<typeof updateDoctorDtoSchema>;
