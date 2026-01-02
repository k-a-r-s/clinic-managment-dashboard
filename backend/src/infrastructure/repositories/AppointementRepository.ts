import { Appointement } from "../../domain/entities/Appointement";
import { IAppointementsRepository } from "../../domain/repositories/IAppointementRepository";
import { supabaseAdmin } from "../database/supabase";
import { DatabaseError } from "../errors/DatabaseError";
import { GetAppointmentByIdResponseDto } from "../../application/dto/responses/appointments/getAppointment";
import { UpdateAppointmentDto } from "../../application/dto/requests/updateAppointmentDto";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import { Logger } from "../../shared/utils/logger";

export class AppointementRepository implements IAppointementsRepository {
  async addAppointement(appointementData: Appointement): Promise<null> {
    const { error } = await supabaseAdmin.from("appointments").insert({
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
      throw new DatabaseError(`Error adding appointement: ${error.message}`);
    }
    return null;
  }

  async deleteAppointement(appointementId: string): Promise<null> {
    const { error } = await supabaseAdmin
      .from("appointments")
      .delete()
      .eq("id", appointementId);
    if (error) {
      throw new DatabaseError(`Error deleting appointement: ${error.message}`);
    }
    return Promise.resolve(null);
  }

  async getAppointmentById(
    appointmentId: string
  ): Promise<GetAppointmentByIdResponseDto | null> {
    // Get appointment without JOINs
    const { data: appointment, error } = await supabaseAdmin
      .from("appointments")
      .select("*")
      .eq("id", appointmentId)
      .single();

    if (error) {
      throw new DatabaseError(`Error fetching appointment: ${error.message}`);
    }
    if (!appointment) {
      return null;
    }

    // Fetch patient details separately
    let patient = null;
    if (appointment.patient_id) {
      const { data: patientData } = await supabaseAdmin
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

    // Fetch doctor details separately
    let doctor = null;
    if (appointment.doctor_id) {
      const { data: doctorData } = await supabaseAdmin
        .from("doctors")
        .select("id, profiles(first_name, last_name)")
        .eq("id", appointment.doctor_id)
        .single();

      if (doctorData && doctorData.profiles) {
        doctor = {
          id: appointment.doctor_id,
          firstName: doctorData.profiles.first_name,
          lastName: doctorData.profiles.last_name,
        };
      }
    }

    // Fetch room details separately
    let room = null;
    if (appointment.room_id) {
      const { data: roomData } = await supabaseAdmin
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

    const result: GetAppointmentByIdResponseDto = {
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
      .select(
        "*,patients!inner(first_name,last_name), doctors!inner(id,profiles!inner(first_name,last_name))"
      )
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

  async getAppointementsByDoctorId(
    doctorId: string,
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
      .select(
        "*,patients!inner(first_name,last_name), doctors!inner(id,profiles!inner(first_name,last_name))"
      )
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

  async getAppointementsByRoomId(
    roomId: string,
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
    return data.map(
      (item) =>
        new Appointement(
          item.id,
          item.patient_id,
          item.doctor_id,
          item.room_id,
          item.created_by_receptionist_id,
          item.created_by_doctor_id,
          new Date(item.appointment_date),
          item.estimated_duration,
          item.status
        )
    );
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

    // Get appointments without JOINs to avoid filtering out records with missing patient/doctor
    let query = supabaseAdmin.from("appointments").select("*");

    if (from && to) {
      query = query
        .gte("appointment_date", from.toISOString())
        .lte("appointment_date", to.toISOString());
    }

    const { data: appointments, error } = await query;

    if (error) {
      throw new DatabaseError(`Error fetching appointments: ${error.message}`);
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
        const { data: patientData } = await supabaseAdmin
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
        const { data: doctorData } = await supabaseAdmin
          .from("doctors")
          .select("id, profiles(first_name, last_name)")
          .eq("id", appointment.doctor_id)
          .single();

        if (doctorData && doctorData.profiles) {
          doctor = {
            id: appointment.doctor_id,
            firstName: doctorData.profiles.first_name,
            lastName: doctorData.profiles.last_name,
          };
        }
      }

      // Fetch room details
      let room = null;
      if (appointment.room_id) {
        const { data: roomData } = await supabaseAdmin
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
        const fullName =
          `${patient.firstName} ${patient.lastName}`.toLowerCase();
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

  async updateAppointementStatus(
    appointementId: string,
    status: string
  ): Promise<null> {
    const { error } = await supabaseAdmin
      .from("appointments")
      .update({ status: status })
      .eq("id", appointementId);
    if (error) {
      throw new DatabaseError(
        `Error updating appointement status: ${error.message}`
      );
    }
    return Promise.resolve(null);
  }

  async updateAppointment(
    appointmentId: string,
    updateData: UpdateAppointmentDto
  ): Promise<null> {
    Logger.info("UpdateAppointment - Received data:", updateData);

    const updatePayload: any = {};

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

    Logger.info("UpdateAppointment - Payload to database:", updatePayload);

    const { data, error } = await supabaseAdmin
      .from("appointments")
      .update(updatePayload)
      .eq("id", appointmentId)
      .select()
      .single();

    if (error) {
      Logger.error("UpdateAppointment - Database error:", error);
      throw new DatabaseError(`Error updating appointment: ${error.message}`);
    }

    Logger.info("UpdateAppointment - Success, updated data:", data);
    return null;
  }
}
