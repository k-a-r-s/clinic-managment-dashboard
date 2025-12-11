import { MedicalData, MedicalFile } from "../../domain/entities/MedicalFile";
import { IMedicalFileRepository } from "../../domain/repositories/IMedicalFileRepository";
import { supabaseAdmin } from "../database/supabase";
export class MedicalFileRepository implements IMedicalFileRepository {
    async getMedicalFileByPatientId(patientId: string): Promise<void> {
        const { data, error } = await supabaseAdmin.from("patient_medical_files").select().eq("patient_id", patientId).single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    };
    async deleteMedicalFileById(id: string): Promise<void> {
        const { error } = await supabaseAdmin.from("patient_medical_files").delete().eq("id", id);
        if (error) {
            throw new Error(error.message);
        }
    }
    async updateMedicalFile(patientId: string, data: MedicalData): Promise<void> {
        // Fetch existing medical file
        const { data: existingFile, error: fetchError } = await supabaseAdmin
            .from('patient_medical_files')
            .select('medical_data')
            .eq('patient_id', patientId)
            .single();

        if (fetchError) {
            throw new Error(`Failed to fetch medical file: ${fetchError.message}`);
        }

        // Merge new data with existing data
        const mergedData = {
            ...existingFile.medical_data,
            ...data
        };

        // Update with merged data
        const { error } = await supabaseAdmin
            .from('medical_files')
            .update({
                medical_data: mergedData,
                updated_at: new Date().toISOString(),
            })
            .eq('patient_id', patientId)
        
        if (error) {
            throw new Error(`Failed to update medical file: ${error.message}`)
        }
    }

    async createMedicalFile(medicalFile: MedicalFile): Promise<MedicalFile> {
        const { data, error } = await supabaseAdmin.from('patient_medical_files')
            .insert({
                doctor_id: medicalFile.getDoctorId(),
                data: medicalFile.getData(),
                updated_at:new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
}