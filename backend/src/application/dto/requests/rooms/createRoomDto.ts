import { z } from "zod";

export const createRoomDto = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  capacity: z.coerce.number().int().positive().default(1),
  type: z.string().default("consultation"),
  isAvailable: z.boolean().default(true),
});

export type CreateRoomDto = z.infer<typeof createRoomDto>;
