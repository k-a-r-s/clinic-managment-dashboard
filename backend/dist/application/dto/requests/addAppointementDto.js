"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAppointmentDto = exports.StatusEnum = void 0;
const zod_1 = require("zod");
exports.StatusEnum = zod_1.z.enum(['SCHEDULED', 'COMPLETED', 'CANCELED', 'NO_SHOW']);
exports.addAppointmentDto = zod_1.z.object({
    patientId: zod_1.z.uuid('Patient ID must be a valid UUID'),
    doctorId: zod_1.z.uuid('Doctor ID must be a valid UUID'),
    roomId: zod_1.z.uuid('Room ID must be a valid UUID'),
    createdByDoctorId: zod_1.z.uuid().nullable(),
    createdByReceptionId: zod_1.z.uuid().nullable(),
    appointmentDate: zod_1.z.coerce.date(),
    estimatedDurationInMinutes: zod_1.z.number().int().positive('Duration must be positive'),
    status: exports.StatusEnum,
});
