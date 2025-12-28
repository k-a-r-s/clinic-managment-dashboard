"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppointmentHistoryDto = void 0;
const zod_1 = require("zod");
exports.createAppointmentHistoryDto = zod_1.z.object({
    appointmentId: zod_1.z.string().uuid(),
    appointmentData: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).describe("Appointment results/data object"),
});
