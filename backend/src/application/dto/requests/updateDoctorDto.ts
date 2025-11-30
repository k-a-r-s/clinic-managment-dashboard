import z from "zod";

export const updateDoctorDtoSchema = z.object({
  firstName: z.string().min(3).max(255).optional(),
  lastName: z.string().min(3).max(255).optional(),
  email: z.string().email().optional(),
  role: z.enum(["DOCTOR"]).optional(),
  salary: z.number().positive().optional(),
  isMedicalDirector: z.boolean().optional(),
  specialization: z.string().min(3).max(255).optional(),
});

export type updateDoctorDto = z.infer<typeof updateDoctorDtoSchema>;
