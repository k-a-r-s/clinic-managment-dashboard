import { Appointement } from "../../domain/entities/Appointement";
import { IAppointementsRepository } from "../../domain/repositories/IAppointementRepository";
import { supabaseAdmin } from "../database/supabase";
import { DatabaseError } from "../errors/DatabaseError";
import { GetAppointmentByIdResponseDto } from "../../application/dto/responses/appointments/getAppointment";
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

    async getAppointmentById(appointmentId: string): Promise<GetAppointmentByIdResponseDto | null> {
        const { data, error } = await supabaseAdmin
            .from("appointments")
            .select("*,patients!inner(id,first_name, last_name), doctors!inner(id,profiles!inner(first_name, last_name))")
            .eq("id", appointmentId)
            .single();

        if (error) {
            throw new DatabaseError(`Error fetching appointment: ${error.message}`);
        }
        if (!data) return null;

        const result: GetAppointmentByIdResponseDto = {
            id: data.id,
            patient: data.patients ? { id: data.patients.id, firstName: data.patients.first_name, lastName: data.patients.last_name } : null,
            doctor: data.doctors ? { id: data.doctor_id, firstName: data.doctors.profiles.first_name, lastName: data.doctors.profiles.last_name } : null,
            roomId: data.room_id ?? null,
            createdByReceptionistId: data.created_by_receptionist_id ?? null,
            createdByDoctorId: data.created_by_doctor_id ?? null,
            appointmentDate: new Date(data.appointment_date),
            estimatedDurationInMinutes: data.estimated_duration ?? null,
            status: data.status
        };

        return result;
    }

    async getAppointmentsByPatientId(
        patientId: string,
        view: "year" | "month" | "week" | "day" | "all" = "month"
    ): Promise<any[]> {

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
            .select("*,patients!inner(first_name,last_name), doctors!inner(id,profiles!inner(first_name,last_name))")
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
        return data.map((item: any) => ({
            id: item.id,
            patient: item.patients ? { id: item.patients.id, firstName: item.patients.first_name, lastName: item.patients.last_name } : null,
            doctor: item.doctors ? { id: item.doctor_id, firstName: item.doctors.profiles.first_name, lastName: item.doctors.profiles.last_name } : null,
            roomId: item.room_id ?? null,
            createdByReceptionistId: item.created_by_receptionist_id ?? null,
            createdByDoctorId: item.created_by_doctor_id ?? null,
            appointmentDate: new Date(item.appointment_date),
            estimatedDurationInMinutes: item.estimated_duration ?? null,
            status: item.status,
        }));
    };

    async getAppointementsByDoctorId(doctorId: string, view: "year" | "month" | "week" | "day" | "all" = "month"): Promise<any[]> {
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
            .select("*,patients!inner(first_name,last_name), doctors!inner(id,profiles!inner(first_name,last_name))")
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
        return data.map((item: any) => ({
            id: item.id,
            patient: item.patients ? { id: item.patients.id, firstName: item.patients.first_name, lastName: item.patients.last_name } : null,
            doctor: item.doctors ? { id: item.doctor_id, firstName: item.doctors.profiles.first_name, lastName: item.doctors.profiles.last_name } : null,
            roomId: item.room_id ?? null,
            createdByReceptionistId: item.created_by_receptionist_id ?? null,
            createdByDoctorId: item.created_by_doctor_id ?? null,
            appointmentDate: new Date(item.appointment_date),
            estimatedDurationInMinutes: item.estimated_duration ?? null,
            status: item.status,
        }));
    }

    async getAppointementsByRoomId(roomId: string, view: "year" | "month" | "week" | "day" | "all" = "month"): Promise<any[]> {
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
            .eq("room_id", roomId);

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
    ): Promise<any[]> {
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

        let query = supabaseAdmin.from("appointments").select("*,patients!inner(first_name, last_name), doctors!inner(id,profiles!inner(first_name, last_name))");
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

        // Return objects matching GetAppointmentByIdResponseDto shape so list response
        // matches the single-appointment response format used by GET /appointments/:id
        return data.map((item: any) => ({
            id: item.id,
            patient: item.patients ? { id: item.patients.id, firstName: item.patients.first_name, lastName: item.patients.last_name } : null,
            doctor: item.doctors ? { id: item.doctor_id, firstName: item.doctors.profiles.first_name, lastName: item.doctors.profiles.last_name } : null,
            roomId: item.room_id ?? null,
            createdByReceptionistId: item.created_by_receptionist_id ?? null,
            createdByDoctorId: item.created_by_doctor_id ?? null,
            appointmentDate: new Date(item.appointment_date),
            estimatedDurationInMinutes: item.estimated_duration ?? null,
            status: item.status,
        }));
    };

    async updateAppointementStatus(appointementId: string, status: string): Promise<null> {
        const { error } = await supabaseAdmin.from('appointments').update({ status: status }).eq('id', appointementId);
        if (error) {
            throw new DatabaseError(`Error updating appointement status: ${error.message}`);
        }
        return Promise.resolve(null);
    }
}