import axiosInstance from "../../../lib/axios";
import type { Patient, PatientFormData } from "../../../types";

// Static mock data for testing
export const getPatients = async (): Promise<Patient[]> => {
  // Return mock data instead of API call
  // return new Promise((resolve) => {
    // setTimeout(() => resolve(mockPatients), 500);
  // });

  // Uncomment to use real API:
  const response = await axiosInstance.get("/patients");
  const body = response.data
  return body?.data ?? body;
};

export const getPatientById = async (id: number): Promise<Patient> => {
  // Return mock data with medical file information
  // return new Promise((resolve, reject) => {
    // setTimeout(() => {
      // const patient = mockPatients.find((p) => p.id === id);
      // if (patient) {
        // // Add medical file data
        // const patientWithMedicalFile: Patient = {
          // ...patient,
          // medicalInfo: {
            // initialNephropathy: "Diabetic Nephropathy",
            // firstDialysisDate: "2022-03-15",
            // careStartDate: "2024-01-10",
            // clinicalSummary: `Patient is a ${
              // new Date().getFullYear() -
              // new Date(patient.birthDate).getFullYear()
            // }-year-old ${patient.gender.toLowerCase()} with end-stage renal disease secondary to diabetic nephropathy. Currently on hemodialysis with good compliance to treatment schedule and medication regimen. Recent lab results show stable hemoglobin levels with adequate anemia management. Blood pressure is well-controlled. Patient reports good quality of life and minimal complications.`,
          // },
        // };
        // resolve(patientWithMedicalFile);
      // } else {
        // reject(new Error("Patient not found"));
      // }
    // }, 500);
  // });

  // Uncomment to use real API:
  const response = await axiosInstance.get(`/patients/${id}`);
  return response.data;
};

export const createPatient = async (
  data: PatientFormData
): Promise<Patient> => {
  const response = await axiosInstance.post("/patients/add-patient", data);
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
