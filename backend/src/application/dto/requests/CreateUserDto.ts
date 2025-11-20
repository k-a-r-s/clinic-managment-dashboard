import { z } from 'zod';

export const CreateUserDtoSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(['doctor', 'receptionist']),
  tempPassword: z.string().optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;
