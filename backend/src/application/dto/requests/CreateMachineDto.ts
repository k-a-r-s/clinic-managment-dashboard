import { z } from 'zod';

export const createMachineSchema = z.object({
  machineId: z.string().min(1, 'Machine ID is required'),
  serialNumber: z.string().min(1, 'Serial number is required'),
  room: z.string().min(1, 'Room is required'),
  status: z.enum(['available', 'in-use', 'maintenance', 'out-of-service']),
  lastMaintenanceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  nextMaintenanceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')
});

export type CreateMachineDto = z.infer<typeof createMachineSchema>;