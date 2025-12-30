import axios from "../../../lib/axios";
import type { Prescription, PrescriptionFormData } from "../../../types";

// Mock data for frontend development while backend is being built
const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: "1",
    patientId: "1",
    doctorId: "1",
    prescriptionDate: "2025-12-20",
    patientName: "John Doe",
    doctorName: "Dr. Smith",
    medications: [
      {
        id: "1",
        prescriptionId: "1",
        medicationName: "Erythropoietin (EPO)",
        dosage: "4000 IU",
        frequency: "3 times per week",
        duration: "Ongoing",
        notes: "Administer after dialysis session",
        createdAt: "2025-12-20T10:00:00Z",
      },
      {
        id: "2",
        prescriptionId: "1",
        medicationName: "Iron Sucrose",
        dosage: "100 mg",
        frequency: "Weekly",
        duration: "12 weeks",
        notes: "IV administration",
        createdAt: "2025-12-20T10:00:00Z",
      },
    ],
    createdAt: "2025-12-20T10:00:00Z",
  },
  {
    id: "2",
    patientId: "2",
    doctorId: "1",
    prescriptionDate: "2025-12-22",
    patientName: "Jane Smith",
    doctorName: "Dr. Smith",
    medications: [
      {
        id: "3",
        prescriptionId: "2",
        medicationName: "Calcium Carbonate",
        dosage: "500 mg",
        frequency: "3 times daily with meals",
        duration: "Ongoing",
        notes: "Phosphate binder",
        createdAt: "2025-12-22T14:00:00Z",
      },
    ],
    createdAt: "2025-12-22T14:00:00Z",
  },
];

// Get all prescriptions
export const getPrescriptions = async (): Promise<Prescription[]> => {
  try {
    // When backend is ready, use this:
    // const { data } = await axios.get("/prescriptions");
    // return data;

    // For now, return mock data
    return Promise.resolve(MOCK_PRESCRIPTIONS);
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
    // When backend is ready, use this:
    // const { data } = await axios.get(`/prescriptions/patient/${patientId}`);
    // return data;

    // For now, filter mock data
    return Promise.resolve(
      MOCK_PRESCRIPTIONS.filter((p) => p.patientId === patientId)
    );
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
    // When backend is ready, use this:
    // const { data } = await axios.get(`/prescriptions/${id}`);
    // return data;

    // For now, find in mock data
    const prescription = MOCK_PRESCRIPTIONS.find((p) => p.id === id);
    if (!prescription) {
      throw new Error("Prescription not found");
    }
    return Promise.resolve(prescription);
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
    // When backend is ready, use this:
    // const { data: response } = await axios.post("/prescriptions", data);
    // return response;

    // For now, create mock prescription
    const newPrescription: Prescription = {
      id: String(MOCK_PRESCRIPTIONS.length + 1),
      ...data,
      medications: data.medications.map((med, idx) => ({
        ...med,
        id: String(idx + 1),
        prescriptionId: String(MOCK_PRESCRIPTIONS.length + 1),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_PRESCRIPTIONS.push(newPrescription);
    return Promise.resolve(newPrescription);
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
    // When backend is ready, use this:
    // const { data: response } = await axios.put(`/prescriptions/${id}`, data);
    // return response;

    // For now, update mock data
    const index = MOCK_PRESCRIPTIONS.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Prescription not found");
    }
    MOCK_PRESCRIPTIONS[index] = {
      ...MOCK_PRESCRIPTIONS[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return Promise.resolve(MOCK_PRESCRIPTIONS[index]);
  } catch (error) {
    console.error("Failed to update prescription:", error);
    throw error;
  }
};

// Delete prescription
export const deletePrescription = async (id: string): Promise<void> => {
  try {
    // When backend is ready, use this:
    // await axios.delete(`/prescriptions/${id}`);

    // For now, remove from mock data
    const index = MOCK_PRESCRIPTIONS.findIndex((p) => p.id === id);
    if (index !== -1) {
      MOCK_PRESCRIPTIONS.splice(index, 1);
    }
    return Promise.resolve();
  } catch (error) {
    console.error("Failed to delete prescription:", error);
    throw error;
  }
};
