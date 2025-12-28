"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMachineSchemaDto = void 0;
const zod_1 = require("zod");
exports.createMachineSchemaDto = zod_1.z.object({
    machineId: zod_1.z.string().min(1).optional(),
    manufacturer: zod_1.z.string().optional(),
    model: zod_1.z.string().optional(),
    status: zod_1.z.enum(["available", "in-use", "maintenance", "out-of-service"]).optional(),
    lastMaintenanceDate: zod_1.z.string().refine((d) => !Number.isNaN(Date.parse(d)), {
        message: "Invalid date",
    }),
    nextMaintenanceDate: zod_1.z.string().refine((d) => !Number.isNaN(Date.parse(d)), {
        message: "Invalid date",
    }),
    // notes removed per new requirement
    // roomId: reference to rooms.id (UUID)
    roomId: zod_1.z.string().uuid('Room ID must be a valid UUID').optional().nullable(),
    isActive: zod_1.z.boolean().optional(),
});
