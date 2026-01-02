import { z } from "zod";

export const updateUserSchemaDto = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  phoneNumber: z.string().optional(),
  // Doctor-specific fields
  salary: z.number().positive("Salary must be positive").optional(),
  specialization: z.string().optional(),
  isMedicalDirector: z.boolean().optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchemaDto>;
