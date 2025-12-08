import { Prescription, PrescriptionMedication, PrescriptionProps, PrescriptionMedicationProps } from "../../domain/entities/Prescription";
import { IPrescriptionRepository } from "../../domain/repositories/IPrescriptionRepository";
import { supabaseAdmin } from "../database/supabase";
import { DatabaseError } from "../errors/DatabaseError";

export class PrescriptionRepository implements IPrescriptionRepository {
  async getPrescriptionById(id: string): Promise<Prescription | null> {
    const { data, error } = await supabaseAdmin
      .from("prescriptions")
      .select(`
        *,
        prescription_medications (*)
      `)
      .eq("id", id)
      .single();

    if (error) {
      throw new DatabaseError(error);
    }
    if (!data) {
      return null;
    }

    const medications = (data.prescription_medications || []).map((med: any) => ({
      id: med.id,
      prescriptionId: med.prescription_id,
      medicationName: med.medication_name,
      dosage: med.dosage,
      frequency: med.frequency,
      duration: med.duration,
      notes: med.notes,
      createdAt: med.created_at,
      updatedAt: med.updated_at
    }));

    const prescriptionProps: PrescriptionProps = {
      id: data.id,
      patientId: data.patient_id,
      doctorId: data.doctor_id,
      appointmentId: data.appointment_id,
      prescriptionDate: data.prescription_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      medications: medications
    };

    return new Prescription(prescriptionProps);
  }

  async getPrescriptionsByPatientId(patientId: string): Promise<Prescription[]> {
    const { data, error } = await supabaseAdmin
      .from("prescriptions")
      .select(`
        *,
        prescription_medications (*)
      `)
      .eq("patient_id", patientId)
      .order('prescription_date', { ascending: false });

    if (error) {
      throw new DatabaseError(error);
    }
    if (!data) {
      throw new DatabaseError("Failed to get prescriptions");
    }

    return data.map((prescription: any) => {
      const medications = (prescription.prescription_medications || []).map((med: any) => ({
        id: med.id,
        prescriptionId: med.prescription_id,
        medicationName: med.medication_name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
        notes: med.notes,
        createdAt: med.created_at,
        updatedAt: med.updated_at
      }));

      const prescriptionProps: PrescriptionProps = {
        id: prescription.id,
        patientId: prescription.patient_id,
        doctorId: prescription.doctor_id,
        appointmentId: prescription.appointment_id,
        prescriptionDate: prescription.prescription_date,
        createdAt: prescription.created_at,
        updatedAt: prescription.updated_at,
        medications: medications
      };

      return new Prescription(prescriptionProps);
    });
  }

  async getPrescriptionsByDoctorId(doctorId: string): Promise<Prescription[]> {
    const { data, error } = await supabaseAdmin
      .from("prescriptions")
      .select(`
        *,
        prescription_medications (*)
      `)
      .eq("doctor_id", doctorId)
      .order('prescription_date', { ascending: false });

    if (error) {
      throw new DatabaseError(error);
    }
    if (!data) {
      throw new DatabaseError("Failed to get prescriptions");
    }

    return data.map((prescription: any) => {
      const medications = (prescription.prescription_medications || []).map((med: any) => ({
        id: med.id,
        prescriptionId: med.prescription_id,
        medicationName: med.medication_name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
        notes: med.notes,
        createdAt: med.created_at,
        updatedAt: med.updated_at
      }));

      const prescriptionProps: PrescriptionProps = {
        id: prescription.id,
        patientId: prescription.patient_id,
        doctorId: prescription.doctor_id,
        appointmentId: prescription.appointment_id,
        prescriptionDate: prescription.prescription_date,
        createdAt: prescription.created_at,
        updatedAt: prescription.updated_at,
        medications: medications
      };

      return new Prescription(prescriptionProps);
    });
  }

  async createPrescription(prescription: Prescription): Promise<Prescription> {
    // Start transaction for prescription and medications
    const { data: prescriptionData, error: prescriptionError } = await supabaseAdmin
      .from("prescriptions")
      .insert({
        patient_id: prescription.getPatientId(),
        doctor_id: prescription.getDoctorId(),
        appointment_id: prescription.getAppointmentId(),
        prescription_date: prescription.getPrescriptionDate()
      })
      .select()
      .single();

    if (prescriptionError) {
      throw new DatabaseError(prescriptionError);
    }
    if (!prescriptionData) {
      throw new DatabaseError("Failed to create prescription");
    }

    // Insert medications
    const medications = prescription.getMedications();
    if (medications && medications.length > 0) {
      const medicationData = medications.map(med => ({
        prescription_id: prescriptionData.id,
        medication_name: med.getMedicationName(),
        dosage: med.getDosage(),
        frequency: med.getFrequency(),
        duration: med.getDuration(),
        notes: med.getNotes()
      }));

      const { error: medsError } = await supabaseAdmin
        .from("prescription_medications")
        .insert(medicationData);

      if (medsError) {
        throw new DatabaseError(medsError);
      }
    }

    // Fetch the complete prescription with medications
    return this.getPrescriptionById(prescriptionData.id) as Promise<Prescription>;
  }

  async updatePrescription(prescription: Prescription): Promise<void> {
    const { error } = await supabaseAdmin
      .from("prescriptions")
      .update({
        patient_id: prescription.getPatientId(),
        doctor_id: prescription.getDoctorId(),
        appointment_id: prescription.getAppointmentId(),
        prescription_date: prescription.getPrescriptionDate()
      })
      .eq("id", prescription.getId());

    if (error) {
      throw new DatabaseError(error);
    }
  }

  async deletePrescription(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from("prescriptions")
      .delete()
      .eq("id", id);

    if (error) {
      throw new DatabaseError(error);
    }
  }
}