"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentHistoryRepository = void 0;
const supabase_1 = require("../database/supabase");
const AppointmentHistory_1 = require("../../domain/entities/AppointmentHistory");
const DatabaseError_1 = require("../errors/DatabaseError");
class AppointmentHistoryRepository {
    async getHistoryByAppointmentId(appointmentId) {
        try {
            const { data, error } = await supabase_1.supabase
                .from('appointment_results')
                .select('*')
                .eq('appointment_id', appointmentId)
                .single();
            if (error) {
                if (error.code === 'PGRST116') {
                    return null;
                }
                throw new DatabaseError_1.DatabaseError(`Failed to fetch appointment history: ${error.message}`);
            }
            if (!data)
                return null;
            return new AppointmentHistory_1.AppointmentHistory(data.id, data.appointment_id, data.appointment_data, new Date(data.created_at), new Date(data.updated_at));
        }
        catch (error) {
            throw new DatabaseError_1.DatabaseError(`Failed to fetch appointment history: ${error}`);
        }
    }
    async addAppointmentHistory(appointmentId, appointmentData) {
        try {
            const { data, error } = await supabase_1.supabase
                .from('appointment_results')
                .insert([
                {
                    appointment_id: appointmentId,
                    appointment_data: appointmentData
                }
            ])
                .select();
            if (error || !data || data.length === 0) {
                throw new DatabaseError_1.DatabaseError(`Failed to add appointment history: ${error?.message}`);
            }
            const record = data[0];
            return new AppointmentHistory_1.AppointmentHistory(record.id, record.appointment_id, record.appointment_data, new Date(record.created_at), new Date(record.updated_at));
        }
        catch (error) {
            throw new DatabaseError_1.DatabaseError(`Failed to add appointment history: ${error}`);
        }
    }
    async getHistoryByHistoryId(historyId) {
        try {
            const { data, error } = await supabase_1.supabase
                .from('appointment_results')
                .select('*')
                .eq('id', historyId)
                .single();
            if (error) {
                if (error.code === 'PGRST116') {
                    return null;
                }
                throw new DatabaseError_1.DatabaseError(`Failed to fetch appointment history: ${error.message}`);
            }
            if (!data)
                return null;
            return new AppointmentHistory_1.AppointmentHistory(data.id, data.appointment_id, data.appointment_data, new Date(data.created_at), new Date(data.updated_at));
        }
        catch (error) {
            throw new DatabaseError_1.DatabaseError(`Failed to fetch appointment history: ${error}`);
        }
    }
    async updateAppointmentHistory(appointmentId, appointmentData) {
        try {
            const { data, error } = await supabase_1.supabase
                .from('appointment_results')
                .update({
                appointment_data: appointmentData,
                updated_at: new Date()
            })
                .eq('appointment_id', appointmentId)
                .select();
            if (error || !data || data.length === 0) {
                throw new DatabaseError_1.DatabaseError(`Failed to update appointment history: ${error?.message}`);
            }
            const record = data[0];
            return new AppointmentHistory_1.AppointmentHistory(record.id, record.appointment_id, record.appointment_data, new Date(record.created_at), new Date(record.updated_at));
        }
        catch (error) {
            throw new DatabaseError_1.DatabaseError(`Failed to update appointment history: ${error}`);
        }
    }
    async deleteAppointmentHistory(appointmentId) {
        try {
            const { error } = await supabase_1.supabase
                .from('appointment_results')
                .delete()
                .eq('appointment_id', appointmentId);
            if (error) {
                throw new DatabaseError_1.DatabaseError(`Failed to delete appointment history: ${error.message}`);
            }
        }
        catch (error) {
            throw new DatabaseError_1.DatabaseError(`Failed to delete appointment history: ${error}`);
        }
    }
    async getHistoriesByPatientId(patientId) {
        try {
            // First, get all appointment IDs for the patient
            const { data: appointments, error: appointmentError } = await supabase_1.supabase
                .from('appointments')
                .select('id')
                .eq('patient_id', patientId);
            if (appointmentError) {
                throw new DatabaseError_1.DatabaseError(`Failed to fetch patient appointments: ${appointmentError.message}`);
            }
            if (!appointments || appointments.length === 0) {
                return [];
            }
            // Extract appointment IDs
            const appointmentIds = appointments.map(apt => apt.id);
            // Now fetch appointment results for these appointment IDs
            const { data: results, error: resultsError } = await supabase_1.supabase
                .from('appointment_results')
                .select('*')
                .in('appointment_id', appointmentIds);
            if (resultsError) {
                throw new DatabaseError_1.DatabaseError(`Failed to fetch appointment results: ${resultsError.message}`);
            }
            if (!results)
                return [];
            return results.map((record) => new AppointmentHistory_1.AppointmentHistory(record.id, record.appointment_id, record.appointment_data, new Date(record.created_at), new Date(record.updated_at)));
        }
        catch (error) {
            throw new DatabaseError_1.DatabaseError(`Failed to fetch appointment histories: ${error}`);
        }
    }
}
exports.AppointmentHistoryRepository = AppointmentHistoryRepository;
