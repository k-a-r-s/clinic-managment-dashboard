import axiosInstance from "../../../lib/axios";
import type { Patient, PatientFormData } from "../../../types";

// Static mock data for testing
const mockPatients: Patient[] = [
  {
    id: 1,
    firstName: "Mohamed Ayoub",
    lastName: "BELHIMER",
    email: "mohamed.ayoub.belhimer@ensia.edu.dz",
    phoneNumber: "0555123456",
    address: "123 Rue de la Liberté, Algiers",
    profession: "Engineer",
    childrenNumber: 0,
    familySituation: "Single",
    birthDate: "2005-08-16",
    gender: "Male",
    insuranceNumber: "INS-2024-001",
    emergencyContactName: "Fatima BELHIMER",
    emergencyContactPhone: "0555654321",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-11-20T14:20:00Z",
  },
  {
    id: 2,
    firstName: "Anis",
    lastName: "MEZIANE",
    email: "anis.meziane@gmail.com",
    phoneNumber: "0666789012",
    address: "45 Boulevard Mohammed V, Oran",
    profession: "Teacher",
    childrenNumber: 2,
    familySituation: "Married",
    birthDate: "1985-03-22",
    gender: "Male",
    insuranceNumber: "INS-2024-002",
    emergencyContactName: "Samira MEZIANE",
    emergencyContactPhone: "0666789013",
    createdAt: "2024-02-10T09:15:00Z",
    updatedAt: "2024-11-25T16:45:00Z",
  },
  {
    id: 3,
    firstName: "Amina",
    lastName: "BOUDIAF",
    email: "amina.boudiaf@outlook.com",
    phoneNumber: "0777345678",
    address: "78 Avenue de l'Indépendance, Constantine",
    profession: "Pharmacist",
    childrenNumber: 1,
    familySituation: "Married",
    birthDate: "1990-11-05",
    gender: "Female",
    insuranceNumber: "INS-2024-003",
    emergencyContactName: "Karim BOUDIAF",
    emergencyContactPhone: "0777345679",
    createdAt: "2024-03-05T11:00:00Z",
    updatedAt: "2024-11-28T10:30:00Z",
  },
  {
    id: 4,
    firstName: "Yacine",
    lastName: "SALEM",
    email: "yacine.salem@yahoo.fr",
    phoneNumber: "0555987654",
    address: "12 Rue des Martyrs, Annaba",
    profession: "Accountant",
    childrenNumber: 3,
    familySituation: "Married",
    birthDate: "1978-07-14",
    gender: "Male",
    insuranceNumber: "INS-2024-004",
    emergencyContactName: "Nadia SALEM",
    emergencyContactPhone: "0555987655",
    createdAt: "2024-04-12T08:45:00Z",
    updatedAt: "2024-11-30T13:15:00Z",
  },
];

export const getPatients = async (): Promise<Patient[]> => {
  // Return mock data instead of API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockPatients), 500);
  });

  // Uncomment to use real API:
  // const response = await axiosInstance.get("/patients");
  // return response.data;
};

export const getPatientById = async (id: number): Promise<Patient> => {
  // Return mock data with medical file information
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const patient = mockPatients.find((p) => p.id === id);
      if (patient) {
        // Add medical file data
        const patientWithMedicalFile: Patient = {
          ...patient,
          medicalInfo: {
            initialNephropathy: "Diabetic Nephropathy",
            firstDialysisDate: "2022-03-15",
            careStartDate: "2024-01-10",
            clinicalSummary: `Patient is a ${
              new Date().getFullYear() -
              new Date(patient.birthDate).getFullYear()
            }-year-old ${patient.gender.toLowerCase()} with end-stage renal disease secondary to diabetic nephropathy. Currently on hemodialysis with good compliance to treatment schedule and medication regimen. Recent lab results show stable hemoglobin levels with adequate anemia management. Blood pressure is well-controlled. Patient reports good quality of life and minimal complications.`,
          },
        };
        resolve(patientWithMedicalFile);
      } else {
        reject(new Error("Patient not found"));
      }
    }, 500);
  });

  // Uncomment to use real API:
  // const response = await axiosInstance.get(`/patients/${id}`);
  // return response.data;
};

export const createPatient = async (
  data: PatientFormData
): Promise<Patient> => {
  const response = await axiosInstance.post("/patients", data);
  return response.data;
};

export const updatePatient = async (
  id: number,
  data: Partial<PatientFormData>
): Promise<Patient> => {
  const response = await axiosInstance.put(`/patients/${id}`, data);
  return response.data;
};

export const deletePatient = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/patients/${id}`);
};
