"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAppointmentDto = exports.StatusEnum = void 0;
const zod_1 = require("zod");
exports.StatusEnum = zod_1.z.enum([
    "SCHEDULED",
    "COMPLETED",
    "CANCELED",
    "NO_SHOW",
]);
exports.updateAppointmentDto = zod_1.z.object({
    patientId: zod_1.z.uuid("Patient ID must be a valid UUID").optional(),
    doctorId: zod_1.z.uuid("Doctor ID must be a valid UUID").optional(),
    roomId: zod_1.z.uuid("Room ID must be a valid UUID").optional(),
    appointmentDate: zod_1.z.coerce.date().optional(),
    estimatedDurationInMinutes: zod_1.z
        .number()
        .int()
        .positive("Duration must be positive")
        .optional(),
    status: exports.StatusEnum.optional(),
});
