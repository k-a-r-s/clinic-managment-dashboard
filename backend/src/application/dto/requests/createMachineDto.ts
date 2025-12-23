import { z } from "zod";

export const createMachineSchemaDto = z.object({
  machineId: z.string().min(1).optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  status: z.enum(["available", "in-use", "maintenance", "out-of-service"]).optional(),
  lastMaintenanceDate: z.string().refine((d) => !Number.isNaN(Date.parse(d)), {
    message: "Invalid date",
  }),
  nextMaintenanceDate: z.string().refine((d) => !Number.isNaN(Date.parse(d)), {
    message: "Invalid date",
  }),
  // notes removed per new requirement
  // roomId: reference to rooms.id (UUID)
  roomId: z.string().uuid('Room ID must be a valid UUID').optional().nullable(),
  isActive: z.boolean().optional(),
});

export type CreateMachineDto = z.infer<typeof createMachineSchemaDto>;
