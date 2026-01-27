"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPrescriptionDto = void 0;
const zod_1 = require("zod");
const medicationSchema = zod_1.z.object({
    medicationName: zod_1.z.string().min(1, "Medication name is required"),
    dosage: zod_1.z.string().min(1, "Dosage is required"),
    frequency: zod_1.z.string().min(1, "Frequency is required"),
    duration: zod_1.z.string().min(1, "Duration is required"),
    notes: zod_1.z.string().optional(),
});
exports.createPrescriptionDto = zod_1.z.object({
    patientId: zod_1.z.string().uuid("Patient ID must be a valid UUID"),
    doctorId: zod_1.z.string().uuid("Doctor ID must be a valid UUID"),
    appointmentId: zod_1.z
        .string()
        .uuid("Appointment ID must be a valid UUID")
        .nullish()
        .transform((val) => (val === "" || val === undefined ? null : val)),
    prescriptionDate: zod_1.z.string().refine((val) => {
        // Accept both ISO date (YYYY-MM-DD) and ISO datetime formats
        return /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/.test(val);
    }, { message: "Invalid date format. Use YYYY-MM-DD or ISO datetime" }),
    medications: zod_1.z
        .array(medicationSchema)
        .min(1, "At least one medication is required"),
});
