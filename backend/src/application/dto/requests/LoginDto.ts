import { z } from 'zod';

export const LoginDto = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(4, 'Password must be at least 8 characters'),
});

export type LoginDtoType = z.infer<typeof LoginDto>;
