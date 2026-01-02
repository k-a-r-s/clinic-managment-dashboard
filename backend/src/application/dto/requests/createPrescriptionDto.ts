import { z } from "zod";

const medicationSchema = z.object({
  medicationName: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  duration: z.string().min(1, "Duration is required"),
  notes: z.string().optional(),
});

export const createPrescriptionDto = z.object({
  patientId: z.string().uuid("Patient ID must be a valid UUID"),
  doctorId: z.string().uuid("Doctor ID must be a valid UUID"),
  appointmentId: z
    .string()
    .uuid("Appointment ID must be a valid UUID")
    .nullish()
    .transform((val) => (val === "" || val === undefined ? null : val)),
  prescriptionDate: z.string().refine(
    (val) => {
      // Accept both ISO date (YYYY-MM-DD) and ISO datetime formats
      return /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/.test(val);
    },
    { message: "Invalid date format. Use YYYY-MM-DD or ISO datetime" }
  ),
  medications: z
    .array(medicationSchema)
    .min(1, "At least one medication is required"),
});

export type CreatePrescriptionDto = z.infer<typeof createPrescriptionDto>;
export type CreatePrescriptionMedicationDto = z.infer<typeof medicationSchema>;
