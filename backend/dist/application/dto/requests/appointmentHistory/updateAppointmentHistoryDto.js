"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAppointmentHistoryDto = void 0;
const zod_1 = require("zod");
exports.updateAppointmentHistoryDto = zod_1.z.object({
    appointmentData: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).describe("Updated medical data object"),
}).partial();
