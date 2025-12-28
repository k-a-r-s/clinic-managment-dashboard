"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientRepository = void 0;
const Patient_1 = require("../../domain/entities/Patient");
const supabase_1 = require("../database/supabase");
const DatabaseError_1 = require("../errors/DatabaseError");
const date_fns_1 = require("date-fns");
class PatientRepository {
    async addPatient(patient) {
        const { data, error } = await supabase_1.supabaseAdmin
            .from("patients")
            .insert({
            id: patient.getId(),
            first_name: patient.getFirstName(),
            last_name: patient.getLastName(),
            email: patient.getEmail(),
            phone_number: patient.getPhoneNumber(),
            birth_date: patient.getBirthDate(),
            gender: patient.getGender(),
            address: patient.getAddress(),
            profession: patient.getProfession(),
            children_number: patient.getChildrenNumber(),
            family_situation: patient.getFamilySituation(),
            insurance_number: patient.getInsuranceNumber(),
            emergency_contact_name: patient.getEmergencyContactName(),
            emergency_contact_phone: patient.getEmergencyContactPhone(),
        })
            .select()
            .single();
        if (error) {
            throw new DatabaseError_1.DatabaseError(error);
        }
        if (!data) {
            throw new DatabaseError_1.DatabaseError("Failed to create patient");
        }
        return null;
    }
    async getPatientByid(id) {
        const { data, error } = await supabase_1.supabaseAdmin
            .from("patients")
            .select()
            .eq("id", id)
            .single();
        if (error) {
            throw new DatabaseError_1.DatabaseError(error);
        }
        if (!data) {
            throw new DatabaseError_1.DatabaseError("Failed to get patient");
        }
        return new Patient_1.Patient({
            id: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            phoneNumber: data.phone_number,
            birthDate: data.birth_date,
            gender: data.gender,
            address: data.address,
            profession: data.profession,
            childrenNumber: data.children_number,
            familySituation: data.family_situation,
            insuranceNumber: data.insurance_number,
            emergencyContactName: data.emergency_contact_name,
            emergencyContactPhone: data.emergency_contact_phone,
            medicalFileId: data.medical_file_id,
        });
    }
    async deletePatientByid(id) {
        const { error } = await supabase_1.supabaseAdmin
            .from("patients")
            .delete()
            .eq("id", id);
        if (error) {
            throw new DatabaseError_1.DatabaseError(error);
        }
    }
    async getAllPatients() {
        const { data, error } = await supabase_1.supabaseAdmin.from("patients").select();
        if (error) {
            throw new DatabaseError_1.DatabaseError(error);
        }
        if (!data) {
            throw new DatabaseError_1.DatabaseError("Failed to get patients");
        }
        return data.map((patient) => {
            return new Patient_1.Patient({
                id: patient.id,
                firstName: patient.first_name,
                lastName: patient.last_name,
                email: patient.email,
                phoneNumber: patient.phone_number,
                birthDate: patient.birth_date,
                gender: patient.gender,
                address: patient.address,
                profession: patient.profession,
                childrenNumber: patient.children_number,
                familySituation: patient.family_situation,
                insuranceNumber: patient.insurance_number,
                emergencyContactName: patient.emergency_contact_name,
                emergencyContactPhone: patient.emergency_contact_phone,
                medicalFileId: patient.medical_file_id,
            });
        });
    }
    async getPatientsCount(view) {
        try {
            if (!view || view === 'all') {
                const { count, error } = await supabase_1.supabaseAdmin.from('patients').select('*', { count: 'exact', head: true });
                if (error)
                    throw error;
                return count || 0;
            }
            const now = new Date();
            let from = null;
            let to = null;
            switch (view) {
                case 'year':
                    from = (0, date_fns_1.startOfYear)(now);
                    to = (0, date_fns_1.endOfYear)(now);
                    break;
                case 'month':
                    from = (0, date_fns_1.startOfMonth)(now);
                    to = (0, date_fns_1.endOfMonth)(now);
                    break;
                case 'week':
                    from = (0, date_fns_1.startOfWeek)(now, { weekStartsOn: 1 });
                    to = (0, date_fns_1.endOfWeek)(now, { weekStartsOn: 1 });
                    break;
                case 'day':
                    from = (0, date_fns_1.startOfDay)(now);
                    to = (0, date_fns_1.endOfDay)(now);
                    break;
            }
            let query = supabase_1.supabaseAdmin.from('patients').select('*', { count: 'exact', head: true });
            if (from && to) {
                query = query.gte('created_at', from.toISOString()).lte('created_at', to.toISOString());
            }
            const { count, error } = await query;
            if (error)
                throw error;
            return count || 0;
        }
        catch (err) {
            throw new DatabaseError_1.DatabaseError(err);
        }
    }
    async getPatientsCreated(view) {
        try {
            const now = new Date();
            let from = null;
            let to = null;
            if (view && view !== 'all') {
                switch (view) {
                    case 'year':
                        from = (0, date_fns_1.startOfYear)(now);
                        to = (0, date_fns_1.endOfYear)(now);
                        break;
                    case 'month':
                        from = (0, date_fns_1.startOfMonth)(now);
                        to = (0, date_fns_1.endOfMonth)(now);
                        break;
                    case 'week':
                        from = (0, date_fns_1.startOfWeek)(now, { weekStartsOn: 1 });
                        to = (0, date_fns_1.endOfWeek)(now, { weekStartsOn: 1 });
                        break;
                    case 'day':
                        from = (0, date_fns_1.startOfDay)(now);
                        to = (0, date_fns_1.endOfDay)(now);
                        break;
                }
            }
            let query = supabase_1.supabaseAdmin.from('patients').select('created_at');
            if (from && to) {
                query = query.gte('created_at', from.toISOString()).lte('created_at', to.toISOString());
            }
            const { data, error } = await query;
            if (error)
                throw error;
            if (!data)
                return [];
            return data.map((r) => ({ createdAt: r.created_at }));
        }
        catch (err) {
            throw new DatabaseError_1.DatabaseError(err);
        }
    }
    async updatePatient(patient) {
        const { data, error } = await supabase_1.supabaseAdmin
            .from("patients")
            .update({
            first_name: patient.getFirstName(),
            last_name: patient.getLastName(),
            email: patient.getEmail(),
            phone_number: patient.getPhoneNumber(),
            birth_date: patient.getBirthDate(),
            gender: patient.getGender(),
            address: patient.getAddress(),
            profession: patient.getProfession(),
            children_number: patient.getChildrenNumber(),
            family_situation: patient.getFamilySituation(),
            insurance_number: patient.getInsuranceNumber(),
            emergency_contact_name: patient.getEmergencyContactName(),
            emergency_contact_phone: patient.getEmergencyContactPhone(),
            medical_file_id: patient.getMedicalFileId(),
        })
            .eq("id", patient.getId())
            .select()
            .single();
        if (error) {
            throw new DatabaseError_1.DatabaseError(error);
        }
        if (!data) {
            throw new DatabaseError_1.DatabaseError("Failed to update patient");
        }
        return null;
    }
}
exports.PatientRepository = PatientRepository;
