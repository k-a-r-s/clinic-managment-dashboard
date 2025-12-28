"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomDto = void 0;
const zod_1 = require("zod");
exports.updateRoomDto = zod_1.z.object({
    roomNumber: zod_1.z.string().min(1).optional(),
    capacity: zod_1.z.coerce.number().int().positive().optional(),
    type: zod_1.z.string().optional(),
    isAvailable: zod_1.z.boolean().optional(),
}).strict();
