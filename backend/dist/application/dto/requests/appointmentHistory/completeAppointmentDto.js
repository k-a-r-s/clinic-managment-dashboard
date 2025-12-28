"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeAppointmentDto = void 0;
const zod_1 = require("zod");
exports.completeAppointmentDto = zod_1.z.object({
    patientId: zod_1.z.string().uuid().optional(),
    doctorId: zod_1.z.string().uuid().optional(),
    appointmentData: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional().describe("Appointment results/data object"),
});
