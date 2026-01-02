import { z } from "zod";

const updateMedicationSchema = z.object({
  id: z.string().uuid().optional(),
  medicationName: z.string().optional(),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  duration: z.string().optional(),
  notes: z.string().optional(),
});

export const updatePrescriptionDto = z.object({
  patientId: z.string().uuid("Patient ID must be a valid UUID").optional(),
  doctorId: z.string().uuid("Doctor ID must be a valid UUID").optional(),
  appointmentId: z
    .string()
    .uuid("Appointment ID must be a valid UUID")
    .nullish()
    .transform((val) => (val === "" || val === undefined ? null : val)),
  prescriptionDate: z
    .string()
    .refine(
      (val) => {
        // Accept both ISO date (YYYY-MM-DD) and ISO datetime formats
        return /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/.test(val);
      },
      { message: "Invalid date format. Use YYYY-MM-DD or ISO datetime" }
    )
    .optional(),
  medications: z.array(updateMedicationSchema).optional(),
});

export type UpdatePrescriptionDto = z.infer<typeof updatePrescriptionDto>;
export type UpdatePrescriptionMedicationDto = z.infer<
  typeof updateMedicationSchema
>;
