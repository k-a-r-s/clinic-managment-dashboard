import { Appointement } from "../../domain/entities/Appointement";
import { IAppointementsRepository } from "../../domain/repositories/IAppointementRepository";
import { supabaseAdmin } from "../database/supabase";
import { DatabaseError } from "../errors/DatabaseError";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
export class AppointementRepository implements IAppointementsRepository {
    async addAppointement(appointementData: Appointement): Promise<null> {
        const { error } = await supabaseAdmin.from('appointements').insert(appointementData.toJson());
        if (error) {
            throw new DatabaseError(`Error adding appointement: ${error.message}`);
        }
        return null;
    };
    async deleteAppointement(appointementId: string): Promise<null> {
        const { error } = await supabaseAdmin.from('appointements').delete().eq('id', appointementId);
        if (error) {
            throw new DatabaseError(`Error deleting appointement: ${error.message}`);
        }
        return Promise.resolve(null);
    };
    async getAppointmentsByPatientId(
        patientId: string,
        view: "year" | "month" | "week" | "day"
    ): Promise<Appointement[]> {

        const now = new Date();
        let from: Date;
        let to: Date;

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

        const { data, error } = await supabaseAdmin
            .from("appointements")
            .select("*")
            .eq("patient_id", patientId)
            .gte("appointement_date", from.toISOString())
            .lte("appointement_date", to.toISOString());

        if (error) {
            throw new DatabaseError(`Error fetching appointments: ${error.message}`);
        }
        if (!data) {
            throw new Error("not found");
        }
        return data.map((item) => new Appointement(
            item.id,
            item.patient_id,
            item.doctor_id,
            item.room_id,
            item.created_by_reception_id,
            item.created_by_doctor_id,
            new Date(item.appointement_date),
            item.estimated_duration_in_minutes,
            item.status
        ));
    };
    async getAppointementsByDoctorId(doctorId: string, view: "year" | "month" | "week" | "day"): Promise<Appointement[]> {
        const now = new Date();
        let from: Date;
        let to: Date;

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

        const { data, error } = await supabaseAdmin
            .from("appointements")
            .select("*")
            .eq("doctor_id", doctorId)
            .gte("appointement_date", from.toISOString())
            .lte("appointement_date", to.toISOString());

        if (error) {
            throw new DatabaseError(`Error fetching appointments: ${error.message}`);
        }
        if (!data) {
            throw new Error("not found");
        }
        return data.map((item) => new Appointement(
            item.id,
            item.patient_id,
            item.doctor_id,
            item.room_id,
            item.created_by_reception_id,
            item.created_by_doctor_id,
            new Date(item.appointement_date),
            item.estimated_duration_in_minutes,
            item.status
        ));
    }

    async getAppointements(view: "year" | "month" | "week" | "day"): Promise<Appointement[]> {
        const now = new Date();
        let from: Date;
        let to: Date;

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

        const { data, error } = await supabaseAdmin
            .from("appointements")
            .select("*")
            .gte("appointement_date", from.toISOString())
            .lte("appointement_date", to.toISOString());
        if (error) {
            throw new DatabaseError(`Error fetching appointments: ${error.message}`);
        }
        if (!data) {
            throw new Error("not found");
        }
        return data.map((item) => new Appointement(
            item.id,
            item.patient_id,
            item.doctor_id,
            item.room_id,
            item.created_by_reception_id,
            item.created_by_doctor_id,
            new Date(item.appointement_date),
            item.estimated_duration_in_minutes,
            item.status
        ));
    };
    async updateAppointementStatus(appointementId: string, status: string): Promise<null> {
        const { error } = await supabaseAdmin.from('appointements').update({ status: status }).eq('id', appointementId);
        if (error) {
            throw new DatabaseError(`Error updating appointement status: ${error.message}`);
        }
        return Promise.resolve(null);
    }
}