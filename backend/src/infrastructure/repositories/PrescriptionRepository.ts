import { IPrescriptionRepository } from "../../domain/repositories/IPrescriptionRepository";
import { CreatePrescriptionDto } from "../../application/dto/requests/createPrescriptionDto";
import { UpdatePrescriptionDto } from "../../application/dto/requests/updatePrescriptionDto";
import { GetPrescriptionResponseDto } from "../../application/dto/responses/prescriptions/getPrescription";
import { supabaseAdmin } from "../database/supabase";
import { DatabaseError } from "../errors/DatabaseError";
import { Logger } from "../../shared/utils/Logger";

export class PrescriptionRepository implements IPrescriptionRepository {
  async createPrescription(
    data: CreatePrescriptionDto
  ): Promise<GetPrescriptionResponseDto> {
    try {
      // Create prescription record
      const { data: prescription, error: prescriptionError } =
        await supabaseAdmin
          .from("prescriptions")
          .insert({
            patient_id: data.patientId,
            doctor_id: data.doctorId,
            appointment_id: data.appointmentId || null,
            prescription_date: data.prescriptionDate,
          })
          .select()
          .single();

      if (prescriptionError || !prescription) {
        Logger.error("Failed to create prescription", {
          error: prescriptionError,
        });
        throw new DatabaseError(
          prescriptionError?.message || "Failed to create prescription"
        );
      }

      // Create prescription medications
      if (data.medications && data.medications.length > 0) {
        const medicationsToInsert = data.medications.map((med) => ({
          prescription_id: prescription.id,
          medication_name: med.medicationName,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          notes: med.notes || null,
        }));

        const { error: medicationsError } = await supabaseAdmin
          .from("prescription_medications")
          .insert(medicationsToInsert);

        if (medicationsError) {
          // Rollback: delete the prescription if medications failed
          await supabaseAdmin
            .from("prescriptions")
            .delete()
            .eq("id", prescription.id);

          Logger.error("Failed to create prescription medications", {
            error: medicationsError,
          });
          throw new DatabaseError(
            medicationsError.message ||
              "Failed to create prescription medications"
          );
        }
      }

      // Fetch and return the complete prescription
      return this.getPrescriptionById(prescription.id);
    } catch (error) {
      Logger.error("Error creating prescription", { error });
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError("Failed to create prescription");
    }
  }

  async getPrescriptions(): Promise<GetPrescriptionResponseDto[]> {
    try {
      // Get all prescriptions
      const { data: prescriptions, error: prescriptionsError } =
        await supabaseAdmin
          .from("prescriptions")
          .select("*")
          .order("prescription_date", { ascending: false });

      if (prescriptionsError) {
        Logger.error("Failed to get prescriptions", {
          error: prescriptionsError,
        });
        throw new DatabaseError(prescriptionsError.message);
      }

      if (!prescriptions || prescriptions.length === 0) {
        return [];
      }

      // Get all prescription IDs
      const prescriptionIds = prescriptions.map((p) => p.id);

      // Fetch all medications for these prescriptions
      const { data: medications, error: medicationsError } = await supabaseAdmin
        .from("prescription_medications")
        .select("*")
        .in("prescription_id", prescriptionIds);

      if (medicationsError) {
        Logger.error("Failed to get prescription medications", {
          error: medicationsError,
        });
        throw new DatabaseError(medicationsError.message);
      }

      // Fetch patient and doctor details for each prescription
      const results: GetPrescriptionResponseDto[] = [];

      for (const prescription of prescriptions) {
        // Fetch patient details
        let patient = null;
        if (prescription.patient_id) {
          const { data: patientData } = await supabaseAdmin
            .from("patients")
            .select("id, first_name, last_name")
            .eq("id", prescription.patient_id)
            .single();

          if (patientData) {
            patient = {
              id: patientData.id,
              firstName: patientData.first_name,
              lastName: patientData.last_name,
            };
          }
        }

        // Fetch doctor details
        let doctor = null;
        if (prescription.doctor_id) {
          const { data: doctorData } = await supabaseAdmin
            .from("doctors")
            .select("id, profiles(first_name, last_name)")
            .eq("id", prescription.doctor_id)
            .single();

          if (doctorData && doctorData.profiles) {
            doctor = {
              id: prescription.doctor_id,
              firstName: doctorData.profiles.first_name,
              lastName: doctorData.profiles.last_name,
            };
          }
        }

        // Get medications for this prescription
        const prescriptionMedications = (medications || [])
          .filter((med: any) => med.prescription_id === prescription.id)
          .map((med: any) => ({
            id: med.id,
            prescriptionId: med.prescription_id,
            medicationName: med.medication_name,
            dosage: med.dosage,
            frequency: med.frequency,
            duration: med.duration,
            notes: med.notes,
            createdAt: new Date(med.created_at),
            updatedAt: new Date(med.updated_at),
          }));

        results.push({
          id: prescription.id,
          patientId: prescription.patient_id,
          doctorId: prescription.doctor_id,
          appointmentId: prescription.appointment_id,
          prescriptionDate: new Date(prescription.prescription_date),
          medications: prescriptionMedications,
          patient,
          doctor,
          createdAt: new Date(prescription.created_at),
          updatedAt: new Date(prescription.updated_at),
        });
      }

      return results;
    } catch (error) {
      Logger.error("Error getting prescriptions", { error });
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError("Failed to get prescriptions");
    }
  }

  async getPrescriptionById(id: string): Promise<GetPrescriptionResponseDto> {
    try {
      // Get prescription
      const { data: prescription, error: prescriptionError } =
        await supabaseAdmin
          .from("prescriptions")
          .select("*")
          .eq("id", id)
          .single();

      if (prescriptionError || !prescription) {
        Logger.error("Prescription not found", { error: prescriptionError });
        throw new DatabaseError("Prescription not found");
      }

      // Get medications
      const { data: medications, error: medicationsError } = await supabaseAdmin
        .from("prescription_medications")
        .select("*")
        .eq("prescription_id", id);

      if (medicationsError) {
        Logger.error("Failed to get prescription medications", {
          error: medicationsError,
        });
        throw new DatabaseError(medicationsError.message);
      }

      // Fetch patient details
      let patient = null;
      if (prescription.patient_id) {
        const { data: patientData } = await supabaseAdmin
          .from("patients")
          .select("id, first_name, last_name")
          .eq("id", prescription.patient_id)
          .single();

        if (patientData) {
          patient = {
            id: patientData.id,
            firstName: patientData.first_name,
            lastName: patientData.last_name,
          };
        }
      }

      // Fetch doctor details
      let doctor = null;
      if (prescription.doctor_id) {
        const { data: doctorData } = await supabaseAdmin
          .from("doctors")
          .select("id, profiles(first_name, last_name)")
          .eq("id", prescription.doctor_id)
          .single();

        if (doctorData && doctorData.profiles) {
          doctor = {
            id: prescription.doctor_id,
            firstName: doctorData.profiles.first_name,
            lastName: doctorData.profiles.last_name,
          };
        }
      }

      return {
        id: prescription.id,
        patientId: prescription.patient_id,
        doctorId: prescription.doctor_id,
        appointmentId: prescription.appointment_id,
        prescriptionDate: new Date(prescription.prescription_date),
        medications: (medications || []).map((med: any) => ({
          id: med.id,
          prescriptionId: med.prescription_id,
          medicationName: med.medication_name,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          notes: med.notes,
          createdAt: new Date(med.created_at),
          updatedAt: new Date(med.updated_at),
        })),
        patient,
        doctor,
        createdAt: new Date(prescription.created_at),
        updatedAt: new Date(prescription.updated_at),
      };
    } catch (error) {
      Logger.error("Error getting prescription by ID", { error });
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError("Failed to get prescription");
    }
  }

  async getPrescriptionsByPatientId(
    patientId: string
  ): Promise<GetPrescriptionResponseDto[]> {
    try {
      // Get prescriptions for patient
      const { data: prescriptions, error: prescriptionsError } =
        await supabaseAdmin
          .from("prescriptions")
          .select("*")
          .eq("patient_id", patientId)
          .order("prescription_date", { ascending: false });

      if (prescriptionsError) {
        Logger.error("Failed to get prescriptions by patient", {
          error: prescriptionsError,
        });
        throw new DatabaseError(prescriptionsError.message);
      }

      if (!prescriptions || prescriptions.length === 0) {
        return [];
      }

      // Get medications for all these prescriptions
      const prescriptionIds = prescriptions.map((p) => p.id);
      const { data: medications, error: medicationsError } = await supabaseAdmin
        .from("prescription_medications")
        .select("*")
        .in("prescription_id", prescriptionIds);

      if (medicationsError) {
        Logger.error("Failed to get prescription medications", {
          error: medicationsError,
        });
        throw new DatabaseError(medicationsError.message);
      }

      // Build response
      const results: GetPrescriptionResponseDto[] = [];

      for (const prescription of prescriptions) {
        // Fetch patient details
        let patient = null;
        const { data: patientData } = await supabaseAdmin
          .from("patients")
          .select("id, first_name, last_name")
          .eq("id", prescription.patient_id)
          .single();

        if (patientData) {
          patient = {
            id: patientData.id,
            firstName: patientData.first_name,
            lastName: patientData.last_name,
          };
        }

        // Fetch doctor details
        let doctor = null;
        if (prescription.doctor_id) {
          const { data: doctorData } = await supabaseAdmin
            .from("doctors")
            .select("id, profiles(first_name, last_name)")
            .eq("id", prescription.doctor_id)
            .single();

          if (doctorData && doctorData.profiles) {
            doctor = {
              id: prescription.doctor_id,
              firstName: doctorData.profiles.first_name,
              lastName: doctorData.profiles.last_name,
            };
          }
        }

        const prescriptionMedications = (medications || [])
          .filter((med: any) => med.prescription_id === prescription.id)
          .map((med: any) => ({
            id: med.id,
            prescriptionId: med.prescription_id,
            medicationName: med.medication_name,
            dosage: med.dosage,
            frequency: med.frequency,
            duration: med.duration,
            notes: med.notes,
            createdAt: new Date(med.created_at),
            updatedAt: new Date(med.updated_at),
          }));

        results.push({
          id: prescription.id,
          patientId: prescription.patient_id,
          doctorId: prescription.doctor_id,
          appointmentId: prescription.appointment_id,
          prescriptionDate: new Date(prescription.prescription_date),
          medications: prescriptionMedications,
          patient,
          doctor,
          createdAt: new Date(prescription.created_at),
          updatedAt: new Date(prescription.updated_at),
        });
      }

      return results;
    } catch (error) {
      Logger.error("Error getting prescriptions by patient ID", { error });
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError("Failed to get prescriptions by patient");
    }
  }

  async updatePrescription(
    id: string,
    data: UpdatePrescriptionDto
  ): Promise<GetPrescriptionResponseDto> {
    try {
      // Update prescription if main fields provided
      if (
        data.patientId ||
        data.doctorId ||
        data.appointmentId !== undefined ||
        data.prescriptionDate
      ) {
        const updateData: any = {};
        if (data.patientId) updateData.patient_id = data.patientId;
        if (data.doctorId) updateData.doctor_id = data.doctorId;
        if (data.appointmentId !== undefined)
          updateData.appointment_id = data.appointmentId;
        if (data.prescriptionDate)
          updateData.prescription_date = data.prescriptionDate;

        const { error: prescriptionError } = await supabaseAdmin
          .from("prescriptions")
          .update(updateData)
          .eq("id", id);

        if (prescriptionError) {
          Logger.error("Failed to update prescription", {
            error: prescriptionError,
          });
          throw new DatabaseError(prescriptionError.message);
        }
      }

      // Update medications if provided
      if (data.medications) {
        // Delete existing medications
        const { error: deleteError } = await supabaseAdmin
          .from("prescription_medications")
          .delete()
          .eq("prescription_id", id);

        if (deleteError) {
          Logger.error("Failed to delete old medications", {
            error: deleteError,
          });
          throw new DatabaseError(deleteError.message);
        }

        // Insert new medications
        if (data.medications.length > 0) {
          const medicationsToInsert = data.medications.map((med) => ({
            prescription_id: id,
            medication_name: med.medicationName,
            dosage: med.dosage,
            frequency: med.frequency,
            duration: med.duration,
            notes: med.notes || null,
          }));

          const { error: insertError } = await supabaseAdmin
            .from("prescription_medications")
            .insert(medicationsToInsert);

          if (insertError) {
            Logger.error("Failed to insert new medications", {
              error: insertError,
            });
            throw new DatabaseError(insertError.message);
          }
        }
      }

      // Return updated prescription
      return this.getPrescriptionById(id);
    } catch (error) {
      Logger.error("Error updating prescription", { error });
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError("Failed to update prescription");
    }
  }

  async deletePrescription(id: string): Promise<void> {
    try {
      // Delete medications first (due to foreign key constraint)
      const { error: medicationsError } = await supabaseAdmin
        .from("prescription_medications")
        .delete()
        .eq("prescription_id", id);

      if (medicationsError) {
        Logger.error("Failed to delete prescription medications", {
          error: medicationsError,
        });
        throw new DatabaseError(medicationsError.message);
      }

      // Delete prescription
      const { error: prescriptionError } = await supabaseAdmin
        .from("prescriptions")
        .delete()
        .eq("id", id);

      if (prescriptionError) {
        Logger.error("Failed to delete prescription", {
          error: prescriptionError,
        });
        throw new DatabaseError(prescriptionError.message);
      }
    } catch (error) {
      Logger.error("Error deleting prescription", { error });
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError("Failed to delete prescription");
    }
  }
}
