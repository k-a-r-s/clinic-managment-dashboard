import { MedicalData, MedicalFile } from "../entities/MedicalFile";

export interface IMedicalFileRepository {
    getMedicalFileByPatientId(patientId: string): Promise<any>;
    deleteMedicalFileById(id: string): Promise<void>;
    updateMedicalFile(id: string, data: MedicalData | null, doctorId?: string | null,): Promise<void>;
    createMedicalFile(medicalFile: MedicalFile): Promise<MedicalFile>;
}