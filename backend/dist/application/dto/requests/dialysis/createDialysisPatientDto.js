"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDialysisPatientDto = void 0;
const zod_1 = require("zod");
exports.createDialysisPatientDto = zod_1.z.object({
    patientId: zod_1.z.string().uuid("Patient ID must be a valid UUID"),
    startDate: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format for start date",
    }),
    status: zod_1.z.enum(["active", "paused", "stopped"]).optional().default("active"),
    notes: zod_1.z.string().optional(),
});
