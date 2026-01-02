import axios from "../../../lib/axios";
import type { Prescription, PrescriptionFormData } from "../../../types";

// Get all prescriptions
export const getPrescriptions = async (): Promise<Prescription[]> => {
  try {
    const { data } = await axios.get("/prescriptions");
    return data.map((p: any) => ({
      id: p.id,
      patientId: p.patientId,
      doctorId: p.doctorId,
      appointmentId: p.appointmentId,
      prescriptionDate: p.prescriptionDate,
      medications: p.medications || [],
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      patientName: p.patient
        ? `${p.patient.firstName} ${p.patient.lastName}`
        : "N/A",
      doctorName: p.doctor
        ? `${p.doctor.firstName} ${p.doctor.lastName}`
        : "N/A",
    }));
  } catch (error) {
    console.error("Failed to fetch prescriptions:", error);
    throw error;
  }
};

// Get prescriptions by patient ID
export const getPrescriptionsByPatient = async (
  patientId: string
): Promise<Prescription[]> => {
  try {
    const { data } = await axios.get(`/prescriptions/patient/${patientId}`);
    return data.map((p: any) => ({
      id: p.id,
      patientId: p.patientId,
      doctorId: p.doctorId,
      appointmentId: p.appointmentId,
      prescriptionDate: p.prescriptionDate,
      medications: p.medications || [],
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      patientName: p.patient
        ? `${p.patient.firstName} ${p.patient.lastName}`
        : "N/A",
      doctorName: p.doctor
        ? `${p.doctor.firstName} ${p.doctor.lastName}`
        : "N/A",
    }));
  } catch (error) {
    console.error("Failed to fetch prescriptions by patient:", error);
    throw error;
  }
};

// Get single prescription by ID
export const getPrescriptionById = async (
  id: string
): Promise<Prescription> => {
  try {
    const { data } = await axios.get(`/prescriptions/${id}`);
    return {
      id: data.id,
      patientId: data.patientId,
      doctorId: data.doctorId,
      appointmentId: data.appointmentId,
      prescriptionDate: data.prescriptionDate,
      medications: data.medications || [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      patientName: data.patient
        ? `${data.patient.firstName} ${data.patient.lastName}`
        : "N/A",
      doctorName: data.doctor
        ? `${data.doctor.firstName} ${data.doctor.lastName}`
        : "N/A",
    };
  } catch (error) {
    console.error("Failed to fetch prescription:", error);
    throw error;
  }
};

// Create new prescription
export const createPrescription = async (
  data: PrescriptionFormData
): Promise<Prescription> => {
  try {
    // Transform the data to handle empty strings
    const transformedData = {
      ...data,
      appointmentId:
        data.appointmentId && data.appointmentId.trim() !== ""
          ? data.appointmentId
          : undefined,
    };

    const { data: response } = await axios.post(
      "/prescriptions",
      transformedData
    );
    return {
      id: response.id,
      patientId: response.patientId,
      doctorId: response.doctorId,
      appointmentId: response.appointmentId,
      prescriptionDate: response.prescriptionDate,
      medications: response.medications || [],
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      patientName: response.patient
        ? `${response.patient.firstName} ${response.patient.lastName}`
        : "N/A",
      doctorName: response.doctor
        ? `${response.doctor.firstName} ${response.doctor.lastName}`
        : "N/A",
    };
  } catch (error) {
    console.error("Failed to create prescription:", error);
    throw error;
  }
};

// Update prescription
export const updatePrescription = async (
  id: string,
  data: Partial<PrescriptionFormData>
): Promise<Prescription> => {
  try {
    // Transform the data to handle empty strings
    const transformedData = {
      ...data,
      appointmentId:
        data.appointmentId && data.appointmentId.trim() !== ""
          ? data.appointmentId
          : undefined,
    };

    const { data: response } = await axios.put(
      `/prescriptions/${id}`,
      transformedData
    );
    return {
      id: response.id,
      patientId: response.patientId,
      doctorId: response.doctorId,
      appointmentId: response.appointmentId,
      prescriptionDate: response.prescriptionDate,
      medications: response.medications || [],
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      patientName: response.patient
        ? `${response.patient.firstName} ${response.patient.lastName}`
        : "N/A",
      doctorName: response.doctor
        ? `${response.doctor.firstName} ${response.doctor.lastName}`
        : "N/A",
    };
  } catch (error) {
    console.error("Failed to update prescription:", error);
    throw error;
  }
};

// Delete prescription
export const deletePrescription = async (id: string): Promise<void> => {
  try {
    await axios.delete(`/prescriptions/${id}`);
  } catch (error) {
    console.error("Failed to delete prescription:", error);
    throw error;
  }
};
