"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProtocolDto = void 0;
const zod_1 = require("zod");
exports.createProtocolDto = zod_1.z.object({
    dialysisPatientId: zod_1.z
        .string()
        .uuid("Dialysis patient ID must be a valid UUID"),
    dialysisType: zod_1.z.enum(["hemodialysis", "peritoneal"]),
    sessionsPerWeek: zod_1.z.number().int().positive(),
    sessionDurationMinutes: zod_1.z.number().int().positive(),
    accessType: zod_1.z.enum(["fistula", "catheter", "graft"]),
    targetWeightKg: zod_1.z.number().positive().optional(),
    notes: zod_1.z.string().optional(),
});
