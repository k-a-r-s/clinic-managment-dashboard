import { Appointement } from "../../domain/entities/Appointement";
import { IAppointementsRepository } from "../../domain/repositories/IAppointementRepository";
import { supabaseAdmin } from "../database/supabase";
import { DatabaseError } from "../errors/DatabaseError";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

export class AppointementRepository implements IAppointementsRepository {
    async addAppointement(appointementData: Appointement): Promise<null> {
        const { error } = await supabaseAdmin.from('appointments').insert({
            id: appointementData.id,
            patient_id: appointementData.patientId,
            doctor_id: appointementData.doctorId,
            room_id: appointementData.roomId,
            created_by_receptionist_id: appointementData.createdByReceptionId,
            created_by_doctor_id: appointementData.createdByDoctorId,
            appointment_date: appointementData.appointmentDate,
            estimated_duration: appointementData.estimatedDurationInMinutes,
            status: appointementData.status
        });
        if (error) {
            throw new DatabaseError(`Error adding appointement: ${error.message}`);
        }
        return null;
    };

    async deleteAppointement(appointementId: string): Promise<null> {
        const { error } = await supabaseAdmin.from('appointments').delete().eq('id', appointementId);
        if (error) {
            throw new DatabaseError(`Error deleting appointement: ${error.message}`);
        }
        return Promise.resolve(null);
    };

    async getAppointmentById(appointmentId: string): Promise<Appointement | null> {
        const { data, error } = await supabaseAdmin
            .from("appointments")
            .select("*")
            .eq("id", appointmentId)
            .single();

        if (error) {
            throw new DatabaseError(`Error fetching appointment: ${error.message}`);
        }
        if (!data) return null;

        return new Appointement(
            data.id,
            data.patient_id,
            data.doctor_id,
            data.room_id,
            data.created_by_receptionist_id,
            data.created_by_doctor_id,
            new Date(data.appointment_date),
            data.estimated_duration,
            data.status
        );
    }

    async getAppointmentsByPatientId(
        patientId: string,
        view: "year" | "month" | "week" | "day" | "all" = "month"
    ): Promise<Appointement[]> {

        const now = new Date();
        let from: Date | null = null;
        let to: Date | null = null;

        if (view !== "all") {
            switch (view) {
                case "year":
                    from = startOfYear(now);
                    to = endOfYear(now);
                    break;

                case "month":
                    from = startOfMonth(now);
                    to = endOfMonth(now);
                    break;

                case "week":
                    from = startOfWeek(now, { weekStartsOn: 1 }); // Monday start
                    to = endOfWeek(now, { weekStartsOn: 1 });
                    break;

                case "day":
                    from = startOfDay(now);
                    to = endOfDay(now);
                    break;
            }
        }

        let query = supabaseAdmin
            .from("appointments")
            .select("*")
            .eq("patient_id", patientId);

        if (from && to) {
            query = query
                .gte("appointment_date", from.toISOString())
                .lte("appointment_date", to.toISOString());
        }

        const { data, error } = await query;
        if (error) {
            throw new DatabaseError(`Error fetching appointments: ${error.message}`);
        }
        if (!data) {
            return [];
        }
        return data.map((item) => new Appointement(
            item.id,
            item.patient_id,
            item.doctor_id,
            item.room_id,
            item.created_by_receptionist_id,
            item.created_by_doctor_id,
            new Date(item.appointment_date),
            item.estimated_duration,
            item.status
        ));
    };

    async getAppointementsByDoctorId(doctorId: string, view: "year" | "month" | "week" | "day" | "all" = "month"): Promise<Appointement[]> {
        const now = new Date();
        let from: Date | null = null;
        let to: Date | null = null;

        if (view !== "all") {
            switch (view) {
                case "year":
                    from = startOfYear(now);
                    to = endOfYear(now);
                    break;

                case "month":
                    from = startOfMonth(now);
                    to = endOfMonth(now);
                    break;

                case "week":
                    from = startOfWeek(now, { weekStartsOn: 1 }); // Monday start
                    to = endOfWeek(now, { weekStartsOn: 1 });
                    break;

                case "day":
                    from = startOfDay(now);
                    to = endOfDay(now);
                    break;
            }
        }

        let query = supabaseAdmin
            .from("appointments")
            .select("*")
            .eq("doctor_id", doctorId);

        if (from && to) {
            query = query
                .gte("appointment_date", from.toISOString())
                .lte("appointment_date", to.toISOString());
        }

        const { data, error } = await query;

        if (error) {
            throw new DatabaseError(`Error fetching appointments: ${error.message}`);
        }
        if (!data) {
            return [];
        }
        return data.map((item) => new Appointement(
            item.id,
            item.patient_id,
            item.doctor_id,
            item.room_id,
            item.created_by_receptionist_id,
            item.created_by_doctor_id,
            new Date(item.appointment_date),
            item.estimated_duration,
            item.status
        ));
    }

    async getAppointements(
        view: "year" | "month" | "week" | "day" | "all" = "month",
        filters?: { patientName?: string; doctorName?: string }
    ): Promise<Appointement[]> {
        const now = new Date();
        let from: Date | null = null;
        let to: Date | null = null;

        if (view !== "all") {
            switch (view) {
                case "year":
                    from = startOfYear(now);
                    to = endOfYear(now);
                    break;

                case "month":
                    from = startOfMonth(now);
                    to = endOfMonth(now);
                    break;

                case "week":
                    from = startOfWeek(now, { weekStartsOn: 1 }); // Monday start
                    to = endOfWeek(now, { weekStartsOn: 1 });
                    break;

                case "day":
                    from = startOfDay(now);
                    to = endOfDay(now);
                    break;
            }
        }

        let query = supabaseAdmin.from("appointments").select("*, patients!inner(first_name, last_name), doctors!inner(first_name, last_name)");

        if (filters?.patientName) {
            query = query.ilike('patients.first_name', `%${filters.patientName}%`);
        }

        if (filters?.doctorName) {
            query = query.ilike('doctors.first_name', `%${filters.doctorName}%`);
        }

        if (from && to) {
            query = query
                .gte("appointment_date", from.toISOString())
                .lte("appointment_date", to.toISOString());
        }

        const { data, error } = await query;
        if (error) {
            throw new DatabaseError(`Error fetching appointments: ${error.message}`);
        }
        if (!data) {
            return [];
        }
        return data.map((item) => new Appointement(
            item.id,
            item.patient_id,
            item.doctor_id,
            item.room_id,
            item.created_by_receptionist_id,
            item.created_by_doctor_id,
            new Date(item.appointment_date),
            item.estimated_duration,
            item.status
        ));
    };

    async updateAppointementStatus(appointementId: string, status: string): Promise<null> {
        const { error } = await supabaseAdmin.from('appointments').update({ status: status }).eq('id', appointementId);
        if (error) {
            throw new DatabaseError(`Error updating appointement status: ${error.message}`);
        }
        return Promise.resolve(null);
    }
}