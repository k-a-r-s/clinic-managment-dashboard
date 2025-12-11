import { MedicalData, MedicalFile } from "../../domain/entities/MedicalFile";
import { IMedicalFileRepository } from "../../domain/repositories/IMedicalFileRepository";
import { supabaseAdmin } from "../database/supabase";
export class MedicalFileRepository implements IMedicalFileRepository {
    async getMedicalFileByPatientId(patientId: string): Promise<any> {
        const { data: Patient, error:errorPatient } = await supabaseAdmin.from("patients").select().eq("id", patientId).single();
        if (errorPatient) {
            throw new Error(errorPatient.message);
        }
        if (!Patient) {
            return null;
        }
        const medicalFileId = Patient.medical_file_id;
        const { data, error } = await supabaseAdmin.from("patient_medical_files").select().eq("id", medicalFileId).single();
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
    async updateMedicalFile(id: string, doctorId: string | null, data: MedicalData | null): Promise<void> {
        // Fetch existing medical file
        const { data: existingFile, error: fetchError } = await supabaseAdmin
            .from('patient_medical_files')
            .select('data')
            .eq('id', id)
            .single();

        if (fetchError) {
            throw new Error(`Failed to fetch medical file: ${fetchError.message}`);
        }

        // Merge new data with existing data
        const mergedData = data ? {
            ...existingFile.data,
            ...data
        } : existingFile.data;

        // Prepare update object
        const updateData: any = {
            data: mergedData,
            updated_at: new Date().toISOString(),
        };

        if (doctorId !== null) {
            updateData.doctor_id = doctorId;
        }

        // Update with merged data
        const { error } = await supabaseAdmin
            .from('patient_medical_files')
            .update(updateData)
            .eq('id', id)

        if (error) {
            throw new Error(`Failed to update medical file: ${error.message}`)
        }
    }

    async createMedicalFile(medicalFile: MedicalFile): Promise<MedicalFile> {
        const { data, error } = await supabaseAdmin.from('patient_medical_files')
            .insert({
                doctor_id: medicalFile.getDoctorId(),
                data: medicalFile.getData(),
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
}