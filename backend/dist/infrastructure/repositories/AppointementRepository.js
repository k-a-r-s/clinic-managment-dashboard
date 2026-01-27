"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointementRepository = void 0;
const Appointement_1 = require("../../domain/entities/Appointement");
const supabase_1 = require("../database/supabase");
const DatabaseError_1 = require("../errors/DatabaseError");
const date_fns_1 = require("date-fns");
const logger_1 = require("../../shared/utils/logger");
class AppointementRepository {
    async addAppointement(appointementData) {
        const { error } = await supabase_1.supabaseAdmin.from("appointments").insert({
            id: appointementData.id,
            patient_id: appointementData.patientId,
            doctor_id: appointementData.doctorId,
            room_id: appointementData.roomId,
            created_by_receptionist_id: appointementData.createdByReceptionId,
            created_by_doctor_id: appointementData.createdByDoctorId,
            appointment_date: appointementData.appointmentDate,
            estimated_duration: appointementData.estimatedDurationInMinutes,
            status: String(appointementData.status).toUpperCase(),
        });
        if (error) {
            throw new DatabaseError_1.DatabaseError(`Error adding appointement: ${error.message}`);
        }
        return null;
    }
    async deleteAppointement(appointementId) {
        const { error } = await supabase_1.supabaseAdmin
            .from("appointments")
            .delete()
            .eq("id", appointementId);
        if (error) {
            throw new DatabaseError_1.DatabaseError(`Error deleting appointement: ${error.message}`);
        }
        return Promise.resolve(null);
    }
    async getAppointmentById(appointmentId) {
        const { data, error } = await supabase_1.supabaseAdmin
            .from("appointments")
            .select("*,patients!inner(id,first_name, last_name), doctors!inner(id,profiles!inner(first_name, last_name))")
            .eq("id", appointmentId)
            .single();
        if (error) {
            throw new DatabaseError_1.DatabaseError(`Error fetching appointment: ${error.message}`);
        }
        if (!data)
            return null;
        // Fetch room details separately if linked
        let room = null;
        if (data.room_id) {
            const { data: roomData } = await supabase_1.supabaseAdmin
                .from("rooms")
                .select("id, room_number")
                .eq("id", data.room_id)
                .single();
            if (roomData) {
                room = { id: roomData.id, roomNumber: roomData.room_number };
            }
        }
        const result = {
            id: data.id,
            patient: data.patients
                ? {
                    id: data.patients.id,
                    firstName: data.patients.first_name,
                    lastName: data.patients.last_name,
                }
                : null,
            doctor: data.doctors
                ? {
                    id: data.doctor_id,
                    firstName: data.doctors.profiles.first_name,
                    lastName: data.doctors.profiles.last_name,
                }
                : null,
            roomId: data.room_id ?? null,
            room: room,
            createdByReceptionistId: data.created_by_receptionist_id ?? null,
            createdByDoctorId: data.created_by_doctor_id ?? null,
            appointmentDate: new Date(data.appointment_date),
            estimatedDurationInMinutes: data.estimated_duration ?? null,
            status: data.status,
        };
        return result;
    }
    async getAppointmentsByPatientId(patientId, view = "month") {
        const now = new Date();
        let from = null;
        let to = null;
        if (view !== "all") {
            switch (view) {
                case "year":
                    from = (0, date_fns_1.startOfYear)(now);
                    to = (0, date_fns_1.endOfYear)(now);
                    break;
                case "month":
                    from = (0, date_fns_1.startOfMonth)(now);
                    to = (0, date_fns_1.endOfMonth)(now);
                    break;
                case "week":
                    from = (0, date_fns_1.startOfWeek)(now, { weekStartsOn: 1 }); // Monday start
                    to = (0, date_fns_1.endOfWeek)(now, { weekStartsOn: 1 });
                    break;
                case "day":
                    from = (0, date_fns_1.startOfDay)(now);
                    to = (0, date_fns_1.endOfDay)(now);
                    break;
            }
        }
        let query = supabase_1.supabaseAdmin
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
            throw new DatabaseError_1.DatabaseError(`Error fetching appointments: ${error.message}`);
        }
        if (!data) {
            return [];
        }
        return data.map((item) => ({
            id: item.id,
            patient: item.patients
                ? {
                    id: item.patients.id,
                    firstName: item.patients.first_name,
                    lastName: item.patients.last_name,
                }
                : null,
            doctor: item.doctors
                ? {
                    id: item.doctor_id,
                    firstName: item.doctors.profiles.first_name,
                    lastName: item.doctors.profiles.last_name,
                }
                : null,
            roomId: item.room_id ?? null,
            createdByReceptionistId: item.created_by_receptionist_id ?? null,
            createdByDoctorId: item.created_by_doctor_id ?? null,
            appointmentDate: new Date(item.appointment_date),
            estimatedDurationInMinutes: item.estimated_duration ?? null,
            status: item.status,
        }));
    }
    async getAppointementsByDoctorId(doctorId, view = "month") {
        const now = new Date();
        let from = null;
        let to = null;
        if (view !== "all") {
            switch (view) {
                case "year":
                    from = (0, date_fns_1.startOfYear)(now);
                    to = (0, date_fns_1.endOfYear)(now);
                    break;
                case "month":
                    from = (0, date_fns_1.startOfMonth)(now);
                    to = (0, date_fns_1.endOfMonth)(now);
                    break;
                case "week":
                    from = (0, date_fns_1.startOfWeek)(now, { weekStartsOn: 1 }); // Monday start
                    to = (0, date_fns_1.endOfWeek)(now, { weekStartsOn: 1 });
                    break;
                case "day":
                    from = (0, date_fns_1.startOfDay)(now);
                    to = (0, date_fns_1.endOfDay)(now);
                    break;
            }
        }
        let query = supabase_1.supabaseAdmin
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
            throw new DatabaseError_1.DatabaseError(`Error fetching appointments: ${error.message}`);
        }
        if (!data) {
            return [];
        }
        return data.map((item) => ({
            id: item.id,
            patient: item.patients
                ? {
                    id: item.patients.id,
                    firstName: item.patients.first_name,
                    lastName: item.patients.last_name,
                }
                : null,
            doctor: item.doctors
                ? {
                    id: item.doctor_id,
                    firstName: item.doctors.profiles.first_name,
                    lastName: item.doctors.profiles.last_name,
                }
                : null,
            roomId: item.room_id ?? null,
            createdByReceptionistId: item.created_by_receptionist_id ?? null,
            createdByDoctorId: item.created_by_doctor_id ?? null,
            appointmentDate: new Date(item.appointment_date),
            estimatedDurationInMinutes: item.estimated_duration ?? null,
            status: item.status,
        }));
    }
    async getAppointementsByRoomId(roomId, view = "month") {
        const now = new Date();
        let from = null;
        let to = null;
        if (view !== "all") {
            switch (view) {
                case "year":
                    from = (0, date_fns_1.startOfYear)(now);
                    to = (0, date_fns_1.endOfYear)(now);
                    break;
                case "month":
                    from = (0, date_fns_1.startOfMonth)(now);
                    to = (0, date_fns_1.endOfMonth)(now);
                    break;
                case "week":
                    from = (0, date_fns_1.startOfWeek)(now, { weekStartsOn: 1 }); // Monday start
                    to = (0, date_fns_1.endOfWeek)(now, { weekStartsOn: 1 });
                    break;
                case "day":
                    from = (0, date_fns_1.startOfDay)(now);
                    to = (0, date_fns_1.endOfDay)(now);
                    break;
            }
        }
        let query = supabase_1.supabaseAdmin
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
            throw new DatabaseError_1.DatabaseError(`Error fetching appointments: ${error.message}`);
        }
        if (!data) {
            return [];
        }
        return data.map((item) => new Appointement_1.Appointement(item.id, item.patient_id, item.doctor_id, item.room_id, item.created_by_receptionist_id, item.created_by_doctor_id, new Date(item.appointment_date), item.estimated_duration, item.status));
    }
    async getAppointements(view = "month", filters) {
        const now = new Date();
        let from = null;
        let to = null;
        if (view !== "all") {
            switch (view) {
                case "year":
                    from = (0, date_fns_1.startOfYear)(now);
                    to = (0, date_fns_1.endOfYear)(now);
                    break;
                case "month":
                    from = (0, date_fns_1.startOfMonth)(now);
                    to = (0, date_fns_1.endOfMonth)(now);
                    break;
                case "week":
                    from = (0, date_fns_1.startOfWeek)(now, { weekStartsOn: 1 }); // Monday start
                    to = (0, date_fns_1.endOfWeek)(now, { weekStartsOn: 1 });
                    break;
                case "day":
                    from = (0, date_fns_1.startOfDay)(now);
                    to = (0, date_fns_1.endOfDay)(now);
                    break;
            }
        }
        // Get appointments without JOINs to avoid filtering out records with missing patient/doctor
        let query = supabase_1.supabaseAdmin.from("appointments").select("*");
        if (from && to) {
            query = query
                .gte("appointment_date", from.toISOString())
                .lte("appointment_date", to.toISOString());
        }
        const { data: appointments, error } = await query;
        if (error) {
            throw new DatabaseError_1.DatabaseError(`Error fetching appointments: ${error.message}`);
        }
        if (!appointments || appointments.length === 0) {
            return [];
        }
        // Fetch patient and doctor details separately
        const results = [];
        for (const appointment of appointments) {
            // Fetch patient details
            let patient = null;
            if (appointment.patient_id) {
                const { data: patientData } = await supabase_1.supabaseAdmin
                    .from("patients")
                    .select("id, first_name, last_name")
                    .eq("id", appointment.patient_id)
                    .single();
                if (patientData) {
                    patient = {
                        id: patientData.id,
                        firstName: patientData.first_name,
                        lastName: patientData.last_name,
                    };
                }
            }
            // Fetch doctor details
            let doctor = null;
            if (appointment.doctor_id) {
                const { data: doctorData } = await supabase_1.supabaseAdmin
                    .from("doctors")
                    .select("id, profiles(first_name, last_name)")
                    .eq("id", appointment.doctor_id)
                    .single();
                if (doctorData && doctorData.profiles) {
                    const profile = Array.isArray(doctorData.profiles)
                        ? doctorData.profiles[0]
                        : doctorData.profiles;
                    if (profile) {
                        doctor = {
                            id: appointment.doctor_id,
                            firstName: profile.first_name,
                            lastName: profile.last_name,
                        };
                    }
                }
            }
            // Fetch room details
            let room = null;
            if (appointment.room_id) {
                const { data: roomData } = await supabase_1.supabaseAdmin
                    .from("rooms")
                    .select("id, room_number")
                    .eq("id", appointment.room_id)
                    .single();
                if (roomData) {
                    room = {
                        id: roomData.id,
                        roomNumber: roomData.room_number,
                    };
                }
            }
            // Apply name filters
            if (filters?.patientName && patient) {
                const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
                if (!fullName.includes(filters.patientName.toLowerCase())) {
                    continue;
                }
            }
            if (filters?.doctorName && doctor) {
                const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
                if (!fullName.includes(filters.doctorName.toLowerCase())) {
                    continue;
                }
            }
            results.push({
                id: appointment.id,
                patient,
                doctor,
                room,
                roomId: appointment.room_id ?? null,
                createdByReceptionistId: appointment.created_by_receptionist_id ?? null,
                createdByDoctorId: appointment.created_by_doctor_id ?? null,
                appointmentDate: new Date(appointment.appointment_date),
                estimatedDurationInMinutes: appointment.estimated_duration ?? null,
                status: appointment.status,
            });
        }
        return results;
    }
    async updateAppointementStatus(appointementId, status) {
        const { error } = await supabase_1.supabaseAdmin
            .from("appointments")
            .update({ status: status })
            .eq("id", appointementId);
        if (error) {
            throw new DatabaseError_1.DatabaseError(`Error updating appointement status: ${error.message}`);
        }
        return Promise.resolve(null);
    }
    async updateAppointment(appointmentId, updateData) {
        logger_1.Logger.info("UpdateAppointment - Received data:", updateData);
        const updatePayload = {};
        if (updateData.patientId !== undefined) {
            updatePayload.patient_id = updateData.patientId;
        }
        if (updateData.doctorId !== undefined) {
            updatePayload.doctor_id = updateData.doctorId;
        }
        if (updateData.roomId !== undefined) {
            updatePayload.room_id = updateData.roomId;
        }
        if (updateData.appointmentDate !== undefined) {
            updatePayload.appointment_date = updateData.appointmentDate;
        }
        if (updateData.estimatedDurationInMinutes !== undefined) {
            updatePayload.estimated_duration = updateData.estimatedDurationInMinutes;
        }
        if (updateData.status !== undefined) {
            updatePayload.status = updateData.status;
        }
        updatePayload.updated_at = new Date().toISOString();
        logger_1.Logger.info("UpdateAppointment - Payload to database:", updatePayload);
        const { data, error } = await supabase_1.supabaseAdmin
            .from("appointments")
            .update(updatePayload)
            .eq("id", appointmentId)
            .select()
            .single();
        if (error) {
            logger_1.Logger.error("UpdateAppointment - Database error:", error);
            throw new DatabaseError_1.DatabaseError(`Error updating appointment: ${error.message}`);
        }
        logger_1.Logger.info("UpdateAppointment - Success, updated data:", data);
        return null;
    }
}
exports.AppointementRepository = AppointementRepository;
