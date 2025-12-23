import { z } from "zod";

export const updateRoomDto = z.object({
  roomNumber: z.string().min(1).optional(),
  capacity: z.coerce.number().int().positive().optional(),
  type: z.string().optional(),
  isAvailable: z.boolean().optional(),
}).strict();

export type UpdateRoomDto = z.infer<typeof updateRoomDto>;
