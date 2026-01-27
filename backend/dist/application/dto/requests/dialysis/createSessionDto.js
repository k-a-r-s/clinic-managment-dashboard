"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSessionDto = void 0;
const zod_1 = require("zod");
exports.createSessionDto = zod_1.z.object({
    dialysisPatientId: zod_1.z
        .string()
        .uuid("Dialysis patient ID must be a valid UUID"),
    sessionDate: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format for session date",
    }),
    durationMinutes: zod_1.z.number().int().positive().optional(),
    completed: zod_1.z.boolean().optional().default(false),
    complications: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
