"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoomDto = void 0;
const zod_1 = require("zod");
exports.createRoomDto = zod_1.z.object({
    roomNumber: zod_1.z.string().min(1, "Room number is required"),
    capacity: zod_1.z.coerce.number().int().positive().default(1),
    type: zod_1.z.string().default("consultation"),
    isAvailable: zod_1.z.boolean().default(true),
});
