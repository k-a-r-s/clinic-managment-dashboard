"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePrescriptionDto = void 0;
const zod_1 = require("zod");
const updateMedicationSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    medicationName: zod_1.z.string().optional(),
    dosage: zod_1.z.string().optional(),
    frequency: zod_1.z.string().optional(),
    duration: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
exports.updatePrescriptionDto = zod_1.z.object({
    patientId: zod_1.z.string().uuid("Patient ID must be a valid UUID").optional(),
    doctorId: zod_1.z.string().uuid("Doctor ID must be a valid UUID").optional(),
    appointmentId: zod_1.z
        .string()
        .uuid("Appointment ID must be a valid UUID")
        .nullish()
        .transform((val) => (val === "" || val === undefined ? null : val)),
    prescriptionDate: zod_1.z
        .string()
        .refine((val) => {
        // Accept both ISO date (YYYY-MM-DD) and ISO datetime formats
        return /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/.test(val);
    }, { message: "Invalid date format. Use YYYY-MM-DD or ISO datetime" })
        .optional(),
    medications: zod_1.z.array(updateMedicationSchema).optional(),
});
