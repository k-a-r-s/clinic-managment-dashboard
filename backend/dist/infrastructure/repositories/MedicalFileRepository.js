"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalFileRepository = void 0;
const supabase_1 = require("../database/supabase");
class MedicalFileRepository {
    async getMedicalFileByPatientId(patientId) {
        const { data: Patient, error: errorPatient } = await supabase_1.supabaseAdmin.from("patients").select().eq("id", patientId).single();
        if (errorPatient) {
            throw new Error(errorPatient.message);
        }
        if (!Patient) {
            return null;
        }
        const medicalFileId = Patient.medical_file_id;
        const { data, error } = await supabase_1.supabaseAdmin.from("patient_medical_files").select().eq("id", medicalFileId).single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    ;
    async deleteMedicalFileById(id) {
        const { error } = await supabase_1.supabaseAdmin.from("patient_medical_files").delete().eq("id", id);
        if (error) {
            throw new Error(error.message);
        }
    }
    async updateMedicalFile(id, data, doctorId) {
        // Fetch existing medical file
        const { data: existingFile, error: fetchError } = await supabase_1.supabaseAdmin
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
        const updateData = {
            data: mergedData,
            updated_at: new Date().toISOString(),
        };
        if (doctorId !== null && doctorId !== undefined) {
            updateData.doctor_id = doctorId;
        }
        // Update with merged data
        const { error } = await supabase_1.supabaseAdmin
            .from('patient_medical_files')
            .update(updateData)
            .eq('id', id);
        if (error) {
            throw new Error(`Failed to update medical file: ${error.message}`);
        }
    }
    async createMedicalFile(medicalFile) {
        const { data, error } = await supabase_1.supabaseAdmin.from('patient_medical_files')
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
exports.MedicalFileRepository = MedicalFileRepository;
