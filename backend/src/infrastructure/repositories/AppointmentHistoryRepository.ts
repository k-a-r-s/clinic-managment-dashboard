import { supabase } from '../database/supabase';
import { IAppointmentHistoryRepository } from '../../domain/repositories/IAppointmentHistoryRepository';
import { AppointmentHistory } from '../../domain/entities/AppointmentHistory';
import { DatabaseError } from '../errors/DatabaseError';

export class AppointmentHistoryRepository implements IAppointmentHistoryRepository {
    async getHistoryByAppointmentId(appointmentId: string): Promise<AppointmentHistory | null> {
        try {
            const { data, error } = await supabase
                .from('appointment_results')
                .select('*')
                .eq('appointment_id', appointmentId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null;
                }
                throw new DatabaseError(`Failed to fetch appointment history: ${error.message}`);
            }

            if (!data) return null;

            return new AppointmentHistory(
                data.id,
                data.appointment_id,
                data.appointment_data,
                new Date(data.created_at),
                new Date(data.updated_at)
            );
        } catch (error) {
            throw new DatabaseError(`Failed to fetch appointment history: ${error}`);
        }
    }

    async addAppointmentHistory(
        appointmentId: string,
        appointmentData: any
    ): Promise<AppointmentHistory> {
        try {
            const { data, error } = await supabase
                .from('appointment_results')
                .insert([
                    {
                        appointment_id: appointmentId,
                        appointment_data: appointmentData
                    }
                ])
                .select();

            if (error || !data || data.length === 0) {
                throw new DatabaseError(`Failed to add appointment history: ${error?.message}`);
            }

            const record = data[0];
            return new AppointmentHistory(
                record.id,
                record.appointment_id,
                record.appointment_data,
                new Date(record.created_at),
                new Date(record.updated_at)
            );
        } catch (error) {
            throw new DatabaseError(`Failed to add appointment history: ${error}`);
        }
    }

    async getHistoryByHistoryId(historyId: string): Promise<AppointmentHistory | null> {
        try {
            const { data, error } = await supabase
                .from('appointment_results')
                .select('*')
                .eq('id', historyId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null;
                }
                throw new DatabaseError(`Failed to fetch appointment history: ${error.message}`);
            }

            if (!data) return null;

            return new AppointmentHistory(
                data.id,
                data.appointment_id,
                data.appointment_data,
                new Date(data.created_at),
                new Date(data.updated_at)
            );
        } catch (error) {
            throw new DatabaseError(`Failed to fetch appointment history: ${error}`);
        }
    }

    async updateAppointmentHistory(
        appointmentId: string,
        appointmentData: any
    ): Promise<AppointmentHistory> {
        try {
            const { data, error } = await supabase
                .from('appointment_results')
                .update({
                    appointment_data: appointmentData,
                    updated_at: new Date()
                })
                .eq('appointment_id', appointmentId)
                .select();

            if (error || !data || data.length === 0) {
                throw new DatabaseError(`Failed to update appointment history: ${error?.message}`);
            }

            const record = data[0];
            return new AppointmentHistory(
                record.id,
                record.appointment_id,
                record.appointment_data,
                new Date(record.created_at),
                new Date(record.updated_at)
            );
        } catch (error) {
            throw new DatabaseError(`Failed to update appointment history: ${error}`);
        }
    }

    async deleteAppointmentHistory(appointmentId: string): Promise<void> {
        try {
            const { error } = await supabase
                .from('appointment_results')
                .delete()
                .eq('appointment_id', appointmentId);

            if (error) {
                throw new DatabaseError(`Failed to delete appointment history: ${error.message}`);
            }
        } catch (error) {
            throw new DatabaseError(`Failed to delete appointment history: ${error}`);
        }
    }
    async getHistoriesByPatientId(patientId: string): Promise<AppointmentHistory[]> {
        try {
            // First, get all appointment IDs for the patient
            const { data: appointments, error: appointmentError } = await supabase
                .from('appointments')
                .select('id')
                .eq('patient_id', patientId);

            if (appointmentError) {
                throw new DatabaseError(`Failed to fetch patient appointments: ${appointmentError.message}`);
            }

            if (!appointments || appointments.length === 0) {
                return [];
            }

            // Extract appointment IDs
            const appointmentIds = appointments.map(apt => apt.id);

            // Now fetch appointment results for these appointment IDs
            const { data: results, error: resultsError } = await supabase
                .from('appointment_results')
                .select('*')
                .in('appointment_id', appointmentIds);

            if (resultsError) {
                throw new DatabaseError(`Failed to fetch appointment results: ${resultsError.message}`);
            }

            if (!results) return [];

            return results.map(
                (record) =>
                    new AppointmentHistory(
                        record.id,
                        record.appointment_id,
                        record.appointment_data,
                        new Date(record.created_at),
                        new Date(record.updated_at)
                    )
            );
        } catch (error) {
            throw new DatabaseError(`Failed to fetch appointment histories: ${error}`);
        }
    }
}
