import { z } from "zod";

export const CreateUserDtoSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["doctor", "receptionist"]),
  password: z.string().min(2, "Password must be at least 2 characters"),
  // Optional fields
  phoneNumber: z.string().optional(),
  salary: z.number().optional(),
  specialization: z.string().optional(),
  isMedicalDirector: z.boolean().optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;
