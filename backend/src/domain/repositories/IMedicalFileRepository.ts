import { MedicalData, MedicalFile } from "../entities/MedicalFile";

export interface IMedicalFileRepository {
    getMedicalFileByPatientId(patientId: string): Promise<any>;
    deleteMedicalFileById(id: string): Promise<void>;
    updateMedicalFile(doctorId: string | null, data: MedicalData | null): Promise<void>;
    createMedicalFile(medicalFile: MedicalFile): Promise<MedicalFile>;
}